from app import app
from models import db, User, Event, EmployerProfile
from datetime import datetime, timedelta

def add_sample_events():
    with app.app_context():
        # Check if employer exists, if not create one
        employer = EmployerProfile.query.first()
        
        if not employer:
            print("No employer found. Creating sample employer...")
            
            # Create a test user
            user = User(
                email='sample@company.com',
                user_type='employer'
            )
            user.set_password('password123')
            db.session.add(user)
            db.session.flush()
            
            # Create employer profile
            employer = EmployerProfile(
                user_id=user.id,
                company_name='Sample Tech Company',
                industry='Technology',
                description='Leading tech company for testing',
                website='https://sample.com',
                location='Chicago, IL'
            )
            db.session.add(employer)
            db.session.commit()
            print("✅ Sample employer created!")
        
        # Sample events
        sample_events = [
            {
                'title': 'Tech Career Fair 2025',
                'description': 'Annual tech career fair with top companies',
                'event_type': 'In-Person',
                'location': 'Chicago, IL',
                'event_date': datetime.now() + timedelta(days=30),
                'tags': 'Software Engineering,Technology,Career Fair'
            },
            {
                'title': 'AI & Machine Learning Summit',
                'description': 'Learn about the latest in AI and ML',
                'event_type': 'Virtual',
                'location': 'Online',
                'event_date': datetime.now() + timedelta(days=45),
                'tags': 'AI,Machine Learning,Data Science'
            },
            {
                'title': 'Software Engineering Workshop',
                'description': 'Hands-on coding workshop for students',
                'event_type': 'In-Person',
                'location': 'UIC Campus',
                'event_date': datetime.now() + timedelta(days=15),
                'tags': 'Software Engineering,Workshop,Coding'
            },
            {
                'title': 'Tech Networking Night',
                'description': 'Network with professionals in tech',
                'event_type': 'In-Person',
                'location': 'Downtown Chicago',
                'event_date': datetime.now() + timedelta(days=20),
                'tags': 'Networking,Technology,Career'
            },
            {
                'title': 'Data Science Conference',
                'description': 'Annual data science conference with industry leaders',
                'event_type': 'Virtual',
                'location': 'Online',
                'event_date': datetime.now() + timedelta(days=50),
                'tags': 'Data Science,Analytics,Machine Learning'
            },
            {
                'title': 'Startup Showcase Event',
                'description': 'Meet innovative startups and explore opportunities',
                'event_type': 'In-Person',
                'location': 'Innovation Hub, Chicago',
                'event_date': datetime.now() + timedelta(days=35),
                'tags': 'Startups,Innovation,Networking'
            }
        ]
        
        for event_data in sample_events:
            # Check if event already exists
            existing = Event.query.filter_by(title=event_data['title']).first()
            if not existing:
                event = Event(
                    employer_id=employer.id,
                    **event_data
                )
                db.session.add(event)
        
        db.session.commit()
        
        # ✅ REBUILD THE TRIES AFTER ADDING EVENTS
        print("🔄 Rebuilding search indexes...")
        from trie import build_event_trie, build_company_trie
        build_event_trie()
        build_company_trie()
        
        print(f"✅ Sample events added successfully!")
        print(f"✅ Total events in database: {Event.query.count()}")
        print(f"✅ Search indexes rebuilt!")

if __name__ == '__main__':
    add_sample_events()