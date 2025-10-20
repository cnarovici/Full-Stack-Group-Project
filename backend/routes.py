from flask import Blueprint, request, jsonify
from models import db, User, StudentProfile, EmployerProfile, Event, EventRSVP, StudentSkill
from trie import event_trie, company_trie, build_event_trie, build_company_trie
from functools import wraps
import jwt
from datetime import datetime, timedelta
import os

api = Blueprint('api', __name__)

# JWT secret key (use environment variable in production)
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-here')


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
            
            if not current_user:
                return jsonify({'message': 'Invalid token'}), 401
                
        except Exception as e:
            return jsonify({'message': 'Token is invalid', 'error': str(e)}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated


# ============= AUTHENTICATION ROUTES =============

@api.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['email', 'password', 'user_type']
    if not all(field in data for field in required_fields):
        return jsonify({'message': 'Missing required fields'}), 400
    
    if data['user_type'] not in ['student', 'employer']:
        return jsonify({'message': 'Invalid user type'}), 400
    
    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'User already exists'}), 409
    
    # Create user
    user = User(
        email=data['email'],
        user_type=data['user_type']
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.flush()  # Get user.id
    
    # Create profile based on user type
    if data['user_type'] == 'student':
        profile = StudentProfile(
            user_id=user.id,
            full_name=data.get('full_name', ''),
            school=data.get('school', ''),
            major=data.get('major', ''),
            job_preferences=','.join(data.get('job_preferences', []))
        )
        
        db.session.add(profile)
        db.session.flush()  # ✅ CRITICAL: Get profile.id before adding skills
        
        # Add skills
        skills = data.get('skills', [])
        for skill_name in skills:
            if skill_name:  # Only add non-empty skills
                skill = StudentSkill(student_id=profile.id, skill_name=skill_name)
                db.session.add(skill)
            
    else:  # employer
        profile = EmployerProfile(
            user_id=user.id,
            company_name=data.get('company_name', ''),
            industry=data.get('industry', ''),
            description=data.get('description', ''),
            website=data.get('website', '')
        )
        db.session.add(profile)
    
    db.session.commit()
    
    # Rebuild tries if employer (for company search)
    if data['user_type'] == 'employer':
        build_company_trie()
    
    # Generate token
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.utcnow() + timedelta(days=30)
    }, SECRET_KEY, algorithm='HS256')
    
    # Ensure token is string (for newer PyJWT versions)
    if isinstance(token, bytes):
        token = token.decode('utf-8')
    
    return jsonify({
        'message': 'User created successfully',
        'token': token,
        'user': user.to_dict()
    }), 201


@api.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Email and password required'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401
    
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.utcnow() + timedelta(days=30)
    }, SECRET_KEY, algorithm='HS256')
    
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': user.to_dict()
    }), 200


# ============= PROFILE ROUTES =============

@api.route('/profile/student/<int:student_id>', methods=['GET'])
def get_student_profile(student_id):
    profile = StudentProfile.query.get(student_id)
    
    if not profile:
        return jsonify({'message': 'Profile not found'}), 404
    
    return jsonify(profile.to_dict()), 200


@api.route('/profile/student', methods=['GET', 'PUT'])
@token_required
def manage_student_profile(current_user):
    if current_user.user_type != 'student':
        return jsonify({'message': 'Unauthorized'}), 403
    
    profile = current_user.student_profile
    
    if request.method == 'GET':
        return jsonify(profile.to_dict()), 200
    
    # PUT - Update profile
    data = request.get_json()
    
    if 'full_name' in data:
        profile.full_name = data['full_name']
    if 'school' in data:
        profile.school = data['school']
    if 'major' in data:
        profile.major = data['major']
    if 'resume_url' in data:
        profile.resume_url = data['resume_url']
    if 'job_preferences' in data:
        profile.job_preferences = ','.join(data['job_preferences'])
    
    # Update skills
    if 'skills' in data:
        # Remove old skills
        StudentSkill.query.filter_by(student_id=profile.id).delete()
        
        # Add new skills
        for skill_name in data['skills']:
            skill = StudentSkill(student_id=profile.id, skill_name=skill_name)
            db.session.add(skill)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Profile updated successfully',
        'profile': profile.to_dict()
    }), 200


@api.route('/profile/employer/<int:employer_id>', methods=['GET'])
def get_employer_profile(employer_id):
    profile = EmployerProfile.query.get(employer_id)
    
    if not profile:
        return jsonify({'message': 'Profile not found'}), 404
    
    # Include events
    profile_data = profile.to_dict()
    profile_data['events'] = [event.to_dict(include_employer=False) for event in profile.events]
    
    return jsonify(profile_data), 200


@api.route('/profile/employer', methods=['GET', 'PUT'])
@token_required
def manage_employer_profile(current_user):
    if current_user.user_type != 'employer':
        return jsonify({'message': 'Unauthorized'}), 403
    
    profile = current_user.employer_profile
    
    if request.method == 'GET':
        profile_data = profile.to_dict()
        profile_data['events'] = [event.to_dict(include_employer=False) for event in profile.events]
        return jsonify(profile_data), 200
    
    # PUT - Update profile
    data = request.get_json()
    
    if 'company_name' in data:
        profile.company_name = data['company_name']
    if 'industry' in data:
        profile.industry = data['industry']
    if 'description' in data:
        profile.description = data['description']
    if 'website' in data:
        profile.website = data['website']
    if 'logo_url' in data:
        profile.logo_url = data['logo_url']
    
    db.session.commit()
    
    # Rebuild company trie
    build_company_trie()
    
    return jsonify({
        'message': 'Profile updated successfully',
        'profile': profile.to_dict()
    }), 200


# ============= EVENT ROUTES =============

@api.route('/events', methods=['GET', 'POST'])
def manage_events():
    if request.method == 'GET':
        # Get all events or filter
        events = Event.query.order_by(Event.event_date.desc()).all()
        return jsonify([event.to_dict() for event in events]), 200
    
    # POST - Create new event (requires authentication)
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Authentication required'}), 401
    
    try:
        if token.startswith('Bearer '):
            token = token[7:]
        data_token = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        current_user = User.query.get(data_token['user_id'])
        
        if not current_user or current_user.user_type != 'employer':
            return jsonify({'message': 'Unauthorized'}), 403
            
    except:
        return jsonify({'message': 'Invalid token'}), 401
    
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['title', 'event_date']
    if not all(field in data for field in required_fields):
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Parse date
    try:
        event_date = datetime.fromisoformat(data['event_date'].replace('Z', '+00:00'))
    except:
        return jsonify({'message': 'Invalid date format'}), 400
    
    event = Event(
        employer_id=current_user.employer_profile.id,
        title=data['title'],
        description=data.get('description', ''),
        event_type=data.get('event_type', ''),
        location=data.get('location', ''),
        event_date=event_date,
        tags=','.join(data.get('tags', []))
    )
    
    db.session.add(event)
    db.session.commit()
    
    # Rebuild event trie
    build_event_trie()
    
    return jsonify({
        'message': 'Event created successfully',
        'event': event.to_dict()
    }), 201


@api.route('/events/<int:event_id>', methods=['GET', 'PUT', 'DELETE'])
def manage_single_event(event_id):
    event = Event.query.get(event_id)
    
    if not event:
        return jsonify({'message': 'Event not found'}), 404
    
    if request.method == 'GET':
        return jsonify(event.to_dict()), 200
    
    # PUT and DELETE require authentication
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Authentication required'}), 401
    
    try:
        if token.startswith('Bearer '):
            token = token[7:]
        data_token = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        current_user = User.query.get(data_token['user_id'])
        
        if not current_user or current_user.user_type != 'employer':
            return jsonify({'message': 'Unauthorized'}), 403
        
        if event.employer_id != current_user.employer_profile.id:
            return jsonify({'message': 'Not authorized to modify this event'}), 403
            
    except:
        return jsonify({'message': 'Invalid token'}), 401
    
    if request.method == 'PUT':
        data = request.get_json()
        
        if 'title' in data:
            event.title = data['title']
        if 'description' in data:
            event.description = data['description']
        if 'event_type' in data:
            event.event_type = data['event_type']
        if 'location' in data:
            event.location = data['location']
        if 'event_date' in data:
            try:
                event.event_date = datetime.fromisoformat(data['event_date'].replace('Z', '+00:00'))
            except:
                return jsonify({'message': 'Invalid date format'}), 400
        if 'tags' in data:
            event.tags = ','.join(data['tags'])
        
        db.session.commit()
        
        # Rebuild event trie
        build_event_trie()
        
        return jsonify({
            'message': 'Event updated successfully',
            'event': event.to_dict()
        }), 200
    
    # DELETE
    db.session.delete(event)
    db.session.commit()
    
    # Rebuild event trie
    build_event_trie()
    
    return jsonify({'message': 'Event deleted successfully'}), 200


# ============= RSVP ROUTES =============

@api.route('/events/<int:event_id>/rsvp', methods=['POST', 'DELETE'])
@token_required
def manage_rsvp(current_user, event_id):
    if current_user.user_type != 'student':
        return jsonify({'message': 'Only students can RSVP'}), 403
    
    event = Event.query.get(event_id)
    if not event:
        return jsonify({'message': 'Event not found'}), 404
    
    student_profile = current_user.student_profile
    
    if request.method == 'POST':
        # Check if already RSVP'd
        existing_rsvp = EventRSVP.query.filter_by(
            event_id=event_id,
            student_id=student_profile.id
        ).first()
        
        if existing_rsvp:
            return jsonify({'message': 'Already RSVP\'d to this event'}), 400
        
        rsvp = EventRSVP(
            event_id=event_id,
            student_id=student_profile.id
        )
        
        db.session.add(rsvp)
        db.session.commit()
        
        return jsonify({
            'message': 'RSVP successful',
            'rsvp': rsvp.to_dict()
        }), 201
    
    # DELETE - Cancel RSVP
    rsvp = EventRSVP.query.filter_by(
        event_id=event_id,
        student_id=student_profile.id
    ).first()
    
    if not rsvp:
        return jsonify({'message': 'RSVP not found'}), 404
    
    db.session.delete(rsvp)
    db.session.commit()
    
    return jsonify({'message': 'RSVP cancelled successfully'}), 200


@api.route('/my-rsvps', methods=['GET'])
@token_required
def get_my_rsvps(current_user):
    if current_user.user_type != 'student':
        return jsonify({'message': 'Only students have RSVPs'}), 403
    
    student_profile = current_user.student_profile
    rsvps = EventRSVP.query.filter_by(student_id=student_profile.id).all()
    
    events = []
    for rsvp in rsvps:
        event_data = rsvp.event.to_dict()
        event_data['rsvp_date'] = rsvp.rsvp_date.isoformat()
        events.append(event_data)
    
    return jsonify(events), 200


@api.route('/events/<int:event_id>/applicants', methods=['GET'])
@token_required
def get_event_applicants(current_user, event_id):
    if current_user.user_type != 'employer':
        return jsonify({'message': 'Only employers can view applicants'}), 403
    
    event = Event.query.get(event_id)
    if not event:
        return jsonify({'message': 'Event not found'}), 404
    
    if event.employer_id != current_user.employer_profile.id:
        return jsonify({'message': 'Not authorized to view applicants'}), 403
    
    applicants = []
    for rsvp in event.rsvps:
        student_data = rsvp.student.to_dict()
        student_data['rsvp_date'] = rsvp.rsvp_date.isoformat()
        applicants.append(student_data)
    
    return jsonify(applicants), 200


# ============= SEARCH ROUTES =============

@api.route('/search', methods=['GET'])
def search():
    query = request.args.get('q', '').strip()
    search_type = request.args.get('type', 'all')  # 'events', 'companies', 'all'
    
    if not query:
        return jsonify({'message': 'Search query required'}), 400
    
    results = {
        'events': [],
        'companies': []
    }
    
    # Search events using Trie
    if search_type in ['events', 'all']:
        event_ids = event_trie.starts_with(query)
        if event_ids:
            events = Event.query.filter(Event.id.in_(event_ids)).all()
            results['events'] = [event.to_dict() for event in events]
    
    # Search companies using Trie
    if search_type in ['companies', 'all']:
        company_ids = company_trie.starts_with(query)
        if company_ids:
            companies = EmployerProfile.query.filter(EmployerProfile.id.in_(company_ids)).all()
            results['companies'] = [company.to_dict() for company in companies]
    
    return jsonify(results), 200


@api.route('/search/autocomplete', methods=['GET'])
def autocomplete():
    query = request.args.get('q', '').strip()
    search_type = request.args.get('type', 'events')
    
    if not query:
        return jsonify([]), 200
    
    suggestions = []
    
    if search_type == 'events':
        event_ids = event_trie.starts_with(query)
        if event_ids:
            events = Event.query.filter(Event.id.in_(event_ids)).limit(10).all()
            suggestions = [{'id': e.id, 'title': e.title, 'type': 'event'} for e in events]
    
    elif search_type == 'companies':
        company_ids = company_trie.starts_with(query)
        if company_ids:
            companies = EmployerProfile.query.filter(EmployerProfile.id.in_(company_ids)).limit(10).all()
            suggestions = [{'id': c.id, 'name': c.company_name, 'type': 'company'} for c in companies]
    
    return jsonify(suggestions), 200