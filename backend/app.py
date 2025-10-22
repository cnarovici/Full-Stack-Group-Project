from flask import Flask
from flask_cors import CORS
from models import db
from routes import api
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///career_fair.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here')

# Initialize extensions
db.init_app(app)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# Register blueprints
app.register_blueprint(api, url_prefix='/api')

# Initialize database
with app.app_context():
    # ✅ CHANGED: Only create tables if they don't exist, DON'T drop them
    db.create_all()
    print("✅ Database ready!")
    
    # Import here to avoid circular imports
    from trie import build_event_trie, build_company_trie
    build_event_trie()
    build_company_trie()
    print("✅ Search indexes initialized!")

if __name__ == '__main__':
    app.run(debug=True, port=5000)