from flask import Flask
from flask_cors import CORS
from models import db
from routes import api
from trie import build_event_trie, build_company_trie
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///career_fair.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here')

# Initialize extensions
db.init_app(app)
CORS(app)

# Register blueprints
app.register_blueprint(api, url_prefix='/api')

# Initialize database and tries
with app.app_context():
    db.create_all()
    build_event_trie()
    build_company_trie()
    print("Database and search indexes initialized!")

if __name__ == '__main__':
    app.run(debug=True, port=5000)