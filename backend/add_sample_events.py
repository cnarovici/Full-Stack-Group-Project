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
        
        # Sample events - MORE EVENTS for better demo
        sample_events = [
            # "TECH" Search Results (8 events - shows 4 in dropdown, all 8 in search page)
            {
                'title': 'Tech Career Fair 2025',
                'description': 'Annual tech career fair with top companies from Silicon Valley',
                'event_type': 'In-Person',
                'location': 'Chicago Convention Center',
                'event_date': datetime.now() + timedelta(days=30),
                'tags': 'Software Engineering,Technology,Career Fair'
            },
            {
                'title': 'Tech Networking Night',
                'description': 'Network with professionals in tech and discover new opportunities',
                'event_type': 'In-Person',
                'location': 'Downtown Chicago',
                'event_date': datetime.now() + timedelta(days=20),
                'tags': 'Networking,Technology,Career'
            },
            {
                'title': 'Tech Startup Showcase',
                'description': 'Meet innovative tech startups and explore job opportunities',
                'event_type': 'Hybrid',
                'location': 'Innovation Hub, Chicago',
                'event_date': datetime.now() + timedelta(days=35),
                'tags': 'Startups,Technology,Innovation'
            },
            {
                'title': 'Tech Leadership Summit',
                'description': 'Learn from tech leaders about career growth and leadership',
                'event_type': 'Virtual',
                'location': 'Online',
                'event_date': datetime.now() + timedelta(days=40),
                'tags': 'Leadership,Technology,Professional Development'
            },
            {
                'title': 'Tech Women Empowerment Conference',
                'description': 'Empowering women in technology with mentorship and networking',
                'event_type': 'In-Person',
                'location': 'UIC Campus',
                'event_date': datetime.now() + timedelta(days=25),
                'tags': 'Women in Tech,Technology,Diversity'
            },
            {
                'title': 'Emerging Tech Expo 2025',
                'description': 'Explore emerging technologies like AI, blockchain, and quantum computing',
                'event_type': 'In-Person',
                'location': 'McCormick Place, Chicago',
                'event_date': datetime.now() + timedelta(days=50),
                'tags': 'Technology,Innovation,AI,Blockchain'
            },
            {
                'title': 'FinTech Career Fair',
                'description': 'Financial technology companies looking for top talent',
                'event_type': 'In-Person',
                'location': 'Chicago Financial District',
                'event_date': datetime.now() + timedelta(days=45),
                'tags': 'FinTech,Technology,Finance,Career Fair'
            },
            {
                'title': 'HealthTech Innovation Summit',
                'description': 'Healthcare meets technology - discover career opportunities',
                'event_type': 'Hybrid',
                'location': 'Medical District, Chicago',
                'event_date': datetime.now() + timedelta(days=55),
                'tags': 'HealthTech,Technology,Healthcare,Innovation'
            },
            
            # "SOFTWARE" Search Results (7 events - shows 4 in dropdown, all 7 in search page)
            {
                'title': 'Software Engineering Workshop',
                'description': 'Hands-on coding workshop for aspiring software engineers',
                'event_type': 'In-Person',
                'location': 'UIC Campus',
                'event_date': datetime.now() + timedelta(days=15),
                'tags': 'Software Engineering,Workshop,Coding'
            },
            {
                'title': 'Software Development Career Fair',
                'description': 'Meet top software companies hiring developers',
                'event_type': 'In-Person',
                'location': 'Chicago Tech Hub',
                'event_date': datetime.now() + timedelta(days=28),
                'tags': 'Software Engineering,Career Fair,Development'
            },
            {
                'title': 'Software Testing & QA Bootcamp',
                'description': 'Learn software testing best practices and meet QA teams',
                'event_type': 'Virtual',
                'location': 'Online',
                'event_date': datetime.now() + timedelta(days=22),
                'tags': 'Software Testing,QA,Quality Assurance'
            },
            {
                'title': 'Agile Software Development Symposium',
                'description': 'Explore agile methodologies and meet software teams',
                'event_type': 'Hybrid',
                'location': 'Chicago',
                'event_date': datetime.now() + timedelta(days=38),
                'tags': 'Software Engineering,Agile,Development'
            },
            {
                'title': 'Cloud Software Architecture Conference',
                'description': 'Learn about cloud-native software architecture and microservices',
                'event_type': 'In-Person',
                'location': 'Downtown Chicago',
                'event_date': datetime.now() + timedelta(days=42),
                'tags': 'Software Engineering,Cloud,Architecture'
            },
            {
                'title': 'Open Source Software Meetup',
                'description': 'Connect with open source contributors and software developers',
                'event_type': 'In-Person',
                'location': 'Chicago Tech Lounge',
                'event_date': datetime.now() + timedelta(days=18),
                'tags': 'Software Engineering,Open Source,Development'
            },
            {
                'title': 'Software Security & Cybersecurity Summit',
                'description': 'Software security best practices and cybersecurity careers',
                'event_type': 'Virtual',
                'location': 'Online',
                'event_date': datetime.now() + timedelta(days=48),
                'tags': 'Software Engineering,Security,Cybersecurity'
            },
            
            # Additional diverse events
            {
                'title': 'AI & Machine Learning Summit',
                'description': 'Learn about the latest in AI and ML from industry experts',
                'event_type': 'Virtual',
                'location': 'Online',
                'event_date': datetime.now() + timedelta(days=45),
                'tags': 'AI,Machine Learning,Data Science'
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
                'title': 'UX/UI Design Showcase',
                'description': 'Showcase your design portfolio and meet design teams',
                'event_type': 'In-Person',
                'location': 'Chicago Design Center',
                'event_date': datetime.now() + timedelta(days=33),
                'tags': 'Design,UX,UI,Product Design'
            },
            {
                'title': 'Product Management Workshop',
                'description': 'Learn product management skills from experienced PMs',
                'event_type': 'Hybrid',
                'location': 'Chicago',
                'event_date': datetime.now() + timedelta(days=27),
                'tags': 'Product Management,Workshop,Career'
            },
            {
                'title': 'DevOps & Cloud Engineering Fair',
                'description': 'Meet DevOps teams and learn about cloud infrastructure',
                'event_type': 'In-Person',
                'location': 'Tech Campus Chicago',
                'event_date': datetime.now() + timedelta(days=37),
                'tags': 'DevOps,Cloud,Engineering,Infrastructure'
            },
            {
                'title': 'Mobile App Development Hackathon',
                'description': '24-hour hackathon for mobile app developers',
                'event_type': 'In-Person',
                'location': 'UIC Engineering Building',
                'event_date': datetime.now() + timedelta(days=21),
                'tags': 'Mobile Development,Hackathon,iOS,Android'
            },
            {
                'title': 'Blockchain & Cryptocurrency Expo',
                'description': 'Explore blockchain technology and crypto career opportunities',
                'event_type': 'Virtual',
                'location': 'Online',
                'event_date': datetime.now() + timedelta(days=60),
                'tags': 'Blockchain,Cryptocurrency,Web3'
            },
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
        
        # Show summary
        print(f"✅ Sample events added successfully!")
        print(f"✅ Total events in database: {Event.query.count()}")
        print(f"✅ Search indexes rebuilt!")
        
        # Show search demos
        print("\n" + "="*50)
        print("DEMO: Search functionality")
        print("="*50)
        
        from trie import event_trie
        
        # Demo 1: "tech" search
        tech_ids = event_trie.starts_with('tech')
        print(f"\n🔍 Searching 'tech': Found {len(tech_ids)} events")
        print(f"   Dashboard will show: 4 events (autocomplete dropdown)")
        print(f"   Search page will show: All {len(tech_ids)} events")
        
        # Demo 2: "software" search
        software_ids = event_trie.starts_with('software')
        print(f"\n🔍 Searching 'software': Found {len(software_ids)} events")
        print(f"   Dashboard will show: 4 events (autocomplete dropdown)")
        print(f"   Search page will show: All {len(software_ids)} events")

if __name__ == '__main__':
    add_sample_events()