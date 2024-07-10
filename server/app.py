#!/usr/bin/env python3

# Standard library imports

from flask import Flask, request, jsonify, Response
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity
import random


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # Apply CORS to your Flask app

# Configurations
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'fdvayudfaihfuhaeuifh' + str(random.randint(1, 1000000000000))  # Replace with a strong secret key
app.config['SECRET_KEY'] = 'GHCYFYTFTYFGHVYJG' + str(random.randint(1, 1000000000000))
# Views go here!
# Initialize the database
db = SQLAlchemy(app)
ma = Marshmallow(app)
migrate = Migrate(app, db)  # Set up Flask-Migrate
jwt = JWTManager(app)  # Initialize JWT Manager
# Define the User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    events = db.relationship('Event', backref='organizer', lazy=True)
    reservations = db.relationship('Reservation', backref='user', lazy=True)

# Define the Event model
class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    date = db.Column(db.Date, nullable=False)
    location = db.Column(db.String(100), nullable=False)
    medium = db.Column(db.String(50), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    max_participants = db.Column(db.Integer, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    accept_reservation = db.Column(db.Boolean, nullable=False)
    image_url = db.Column(db.String(200), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    reservations = db.relationship('Reservation', backref='event', lazy=True)

# Define the Reservation model
class Reservation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(50), nullable=False)

# Define the Contact model
class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    message = db.Column(db.String(500), nullable=False)

# Define the schemas
class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
class EventSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Event

class ReservationSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Reservation

class ContactSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Contact

user_schema = UserSchema()
users_schema = UserSchema(many=True)
event_schema = EventSchema()
events_schema = EventSchema(many=True)
reservation_schema = ReservationSchema()
reservations_schema = ReservationSchema(many=True)
contact_schema = ContactSchema()
contacts_schema = ContactSchema(many=True)

# Token required decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('x-access-tokens')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 403

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.filter_by(id=data['id']).first()
        except:
            return jsonify({'message': 'Token is invalid!'}), 403

        return f(current_user, *args, **kwargs)
    return decorated

# Root route
@app.route('/')
def index():
    return Response('Welcome to Event Hive API', mimetype='text/plain')

# User registration
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='sha256')
    new_user = User(username=data['username'], email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'Registered successfully'})

# User login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()

    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401

    token = create_access_token(identity=user.id, expires_delta=datetime.timedelta(hours=24))
    return jsonify({'token': token})

# Handle preflight requests
@app.before_request
def handle_preflight():
    if request.method == 'OPTIONS':
        return Response(status=204)
    
# CRUD operations for User
@app.route('/users', methods=['GET'])
@token_required
def get_users(current_user):
    all_users = User.query.all()
    return users_schema.jsonify(all_users)



if __name__ == '__main__':
    app.run(port=5555, debug=True)

