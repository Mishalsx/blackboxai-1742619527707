from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from flask_login import LoginManager, UserMixin, login_user, login_required
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)
app.secret_key = os.getenv('SECRET_KEY', 'default-secret-key')

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)

# Mock database for features (in production, use a real database)
features_state = {
    'aiInteraction': True,
    'aiMusicEnhancement': True,
    'aiRecommendations': True,
    'liveStreaming': True,
    'virtualConcerts': True,
    'metaverse': False,
    'multiLanguage': True,
    'advancedAnalytics': True,
    'customUI': True,
    'inStreamAds': False,
    'bannerAds': True,
    'sponsoredContent': True,
    'pushNotifications': True,
    'emailNotifications': True,
    'inAppAlerts': True,
    'twoFactorAuth': True,
    'contentProtection': True,
    'drm': True
}

# Mock User class
class User(UserMixin):
    def __init__(self, user_id):
        self.id = user_id

@login_manager.user_loader
def load_user(user_id):
    return User(user_id)

# Serve static files
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_file(path):
    return send_from_directory('.', path)

# API Routes
@app.route('/api/features', methods=['GET'])
@login_required
def get_features():
    return jsonify(features_state)

@app.route('/api/features/toggle', methods=['POST'])
@login_required
def toggle_feature():
    data = request.get_json()
    feature = data.get('feature')
    enabled = data.get('enabled')
    
    if feature not in features_state:
        return jsonify({'error': 'Feature not found'}), 404
    
    features_state[feature] = enabled
    return jsonify({'success': True, 'feature': feature, 'enabled': enabled})

# Authentication routes
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    # In production, verify credentials against database
    if data.get('email') == 'admin@mazufa.com' and data.get('password') == 'admin123':
        user = User('admin')
        login_user(user)
        return jsonify({'success': True})
    return jsonify({'error': 'Invalid credentials'}), 401

# Error handlers
@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({'error': 'Server error'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)