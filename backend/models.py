from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

# ============= PREDEFINED TAGS/SKILLS =============
PREDEFINED_SKILLS = [
    'Python', 'JavaScript', 'Java', 'C++', 'C#', 'Ruby', 'Go', 'Swift', 'Kotlin',
    'TypeScript', 'React', 'Angular', 'Vue.js', 'Node.js', 'Django', 'Flask',
    'Spring Boot', 'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Git',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Machine Learning', 'AI',
    'Data Science', 'Data Analysis', 'Deep Learning', 'TensorFlow', 'PyTorch',
    'Computer Vision', 'NLP', 'Blockchain', 'Web3', 'Cybersecurity', 'DevOps',
    'CI/CD', 'Agile', 'Scrum', 'REST APIs', 'GraphQL', 'Microservices',
    'Mobile Development', 'iOS', 'Android', 'Flutter', 'React Native',
    'UI/UX Design', 'Figma', 'Adobe XD', 'Product Management', 'Project Management'
]

JOB_PREFERENCES = [
    'Software Engineering', 'Data Science', 'Machine Learning', 'Web Development',
    'Mobile Development', 'DevOps', 'Cybersecurity', 'Cloud Computing',
    'AI Research', 'Backend Development', 'Frontend Development', 'Full Stack',
    'Data Engineering', 'Product Management', 'UI/UX Design', 'Quality Assurance',
    'Database Administration', 'Network Engineering', 'Systems Architecture',
    'Game Development', 'Embedded Systems', 'Blockchain Development',
    'Financial Technology', 'Health Technology', 'E-commerce', 'EdTech',
    'Research & Development', 'Technical Writing', 'Sales Engineering'
]

# ============= USER MODEL =============
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
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


# ============= STUDENT PROFILE =============
class StudentProfile(db.Model):
    __tablename__ = 'student_profiles'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    full_name = db.Column(db.String(100))
    school = db.Column(db.String(100))
    major = db.Column(db.String(100))
    resume_url = db.Column(db.String(500))
    job_preferences = db.Column(db.Text)  # Comma-separated tags
    
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


# ============= STUDENT SKILLS =============
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


# ============= EMPLOYER PROFILE =============
class EmployerProfile(db.Model):
    __tablename__ = 'employer_profiles'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    company_name = db.Column(db.String(100))
    industry = db.Column(db.String(100))
    description = db.Column(db.Text)
    website = db.Column(db.String(200))
    location = db.Column(db.String(200))
    
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
            'location': self.location
        }


# ============= EVENT MODEL =============
class Event(db.Model):
    __tablename__ = 'events'
    
    id = db.Column(db.Integer, primary_key=True)
    employer_id = db.Column(db.Integer, db.ForeignKey('employer_profiles.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    event_type = db.Column(db.String(50))  # 'Virtual', 'In-Person', 'Hybrid'
    location = db.Column(db.String(200))
    event_date = db.Column(db.DateTime, nullable=False)
    tags = db.Column(db.Text)  # Comma-separated tags
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    rsvps = db.relationship('EventRSVP', backref='event', cascade='all, delete-orphan')
    
    def to_dict(self, include_employer=True):
        data = {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'event_type': self.event_type,
            'location': self.location,
            'event_date': self.event_date.isoformat(),
            'tags': self.tags.split(',') if self.tags else [],
            'created_at': self.created_at.isoformat()
        }
        
        if include_employer:
            data['employer'] = self.employer.to_dict()
        
        return data


# ============= EVENT RSVP =============
class EventRSVP(db.Model):
    __tablename__ = 'event_rsvps'
    
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('student_profiles.id'), nullable=False)
    rsvp_date = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'event_id': self.event_id,
            'student_id': self.student_id,
            'rsvp_date': self.rsvp_date.isoformat()
        }