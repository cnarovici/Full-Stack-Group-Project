from flask import Flask
from flask_cors import CORS
from models import db
from routes import api
import os

app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///career_fair.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here')

# Initialize database
db.init_app(app)

# ✅ SIMPLE CORS - This handles OPTIONS automatically
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

# Register blueprints
app.register_blueprint(api, url_prefix='/api')

# Initialize database and tries
with app.app_context():
    db.create_all()
    print("✅ Database ready!")
    
    # Import here to avoid circular imports
    from trie import build_event_trie, build_company_trie
    build_event_trie()
    build_company_trie()
    print("✅ Search indexes initialized!")

with app.app_context():
    print("\n" + "="*60)
    print("📋 REGISTERED API ROUTES:")
    print("="*60)
    for rule in app.url_map.iter_rules():
        if '/api/' in rule.rule:
            methods = ', '.join([m for m in rule.methods if m not in ['HEAD', 'OPTIONS']])
            print(f"  {rule.rule:<40} [{methods}]")
    print("="*60 + "\n")
    
if __name__ == '__main__':
    app.run(debug=True, port=5001, host='0.0.0.0')