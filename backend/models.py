from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    user_type = db.Column(db.String(20), nullable=False)  # 'student' or 'employer'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    student_profile = db.relationship('StudentProfile', backref='user', uselist=False, cascade='all, delete-orphan')
    employer_profile = db.relationship('EmployerProfile', backref='user', uselist=False, cascade='all, delete-orphan')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'user_type': self.user_type,
            'created_at': self.created_at.isoformat()
        }


class StudentProfile(db.Model):
    __tablename__ = 'student_profiles'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    school = db.Column(db.String(200))
    major = db.Column(db.String(100))
    resume_url = db.Column(db.String(500))
    job_preferences = db.Column(db.Text)  # Comma-separated or JSON string
    
    # Relationships
    skills = db.relationship('StudentSkill', backref='student', cascade='all, delete-orphan')
    rsvps = db.relationship('EventRSVP', backref='student', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'full_name': self.full_name,
            'school': self.school,
            'major': self.major,
            'resume_url': self.resume_url,
            'job_preferences': self.job_preferences.split(',') if self.job_preferences else [],
            'skills': [skill.skill_name for skill in self.skills]
        }


class EmployerProfile(db.Model):
    __tablename__ = 'employer_profiles'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    company_name = db.Column(db.String(200), nullable=False)
    industry = db.Column(db.String(100))
    description = db.Column(db.Text)
    website = db.Column(db.String(500))
    logo_url = db.Column(db.String(500))
    
    # Relationships
    events = db.relationship('Event', backref='employer', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'company_name': self.company_name,
            'industry': self.industry,
            'description': self.description,
            'website': self.website,
            'logo_url': self.logo_url
        }


class StudentSkill(db.Model):
    __tablename__ = 'student_skills'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student_profiles.id'), nullable=False)
    skill_name = db.Column(db.String(100), nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'skill_name': self.skill_name
        }


class Event(db.Model):
    __tablename__ = 'events'
    
    id = db.Column(db.Integer, primary_key=True)
    employer_id = db.Column(db.Integer, db.ForeignKey('employer_profiles.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    event_type = db.Column(db.String(50))  # 'Virtual', 'In-Person', etc.
    location = db.Column(db.String(200))
    event_date = db.Column(db.DateTime, nullable=False)
    start_time = db.Column(db.Time)
    end_time = db.Column(db.Time)
    tags = db.Column(db.Text)  # Comma-separated tags
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    rsvps = db.relationship('EventRSVP', backref='event', cascade='all, delete-orphan')
    
    def to_dict(self, include_employer=True):
        data = {
            'id': self.id,
            'employer_id': self.employer_id,
            'title': self.title,
            'description': self.description,
            'event_type': self.event_type,
            'location': self.location,
            'event_date': self.event_date.isoformat(),
            'start_time': self.start_time.isoformat() if self.start_time else None,
            'end_time': self.end_time.isoformat() if self.end_time else None,
            'tags': self.tags.split(',') if self.tags else [],
            'rsvp_count': len(self.rsvps),
            'created_at': self.created_at.isoformat()
        }
        
        if include_employer and self.employer:
            data['employer'] = {
                'company_name': self.employer.company_name,
                'logo_url': self.employer.logo_url
            }
        
        return data


class EventRSVP(db.Model):
    __tablename__ = 'event_rsvps'
    
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('student_profiles.id'), nullable=False)
    rsvp_date = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Unique constraint to prevent duplicate RSVPs
    __table_args__ = (db.UniqueConstraint('event_id', 'student_id', name='unique_event_student'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'event_id': self.event_id,
            'student_id': self.student_id,
            'rsvp_date': self.rsvp_date.isoformat()
        }