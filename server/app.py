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

@app.route('/users/<id>', methods=['GET'])
@token_required
def get_user(current_user, id):
    user = User.query.get_or_404(id)
    return user_schema.jsonify(user)

@app.route('/users/<id>', methods=['PUT'])
@token_required
def update_user(current_user, id):
    user = User.query.get_or_404(id)
    data = request.get_json()
    user.username = data['username']
    user.email = data['email']
    if 'password' in data:
        user.password = generate_password_hash(data['password'], method='sha256')
    db.session.commit()
    return user_schema.jsonify(user)

@app.route('/users/<id>', methods=['DELETE'])
@token_required
def delete_user(current_user, id):
    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted'})

# CRUD operations for Reservation
@app.route('/reservations', methods=['POST'])
@token_required
def add_reservation(current_user):
    data = request.get_json()
    new_reservation = Reservation(
        event_id=data['event_id'],
        user_id=current_user.id,
        status=data['status']
    )
    db.session.add(new_reservation)
    db.session.commit()
    return reservation_schema.jsonify(new_reservation)

@app.route('/reservations', methods=['GET'])
@token_required
def get_reservations(current_user):
    all_reservations = Reservation.query.all()
    return reservations_schema.jsonify(all_reservations)

@app.route('/reservations/<id>', methods=['GET'])
@token_required
def get_reservation(current_user, id):
    reservation = Reservation.query.get_or_404(id)
    return reservation_schema.jsonify(reservation)

@app.route('/reservations/<id>', methods=['PUT'])
@token_required
def update_reservation(current_user, id):
    reservation = Reservation.query.get_or_404(id)
    data = request.get_json()
    reservation.event_id = data['event_id']
    reservation.user_id = data['user_id']
    reservation.status = data['status']
    db.session.commit()
    return reservation_schema.jsonify(reservation)

@app.route('/reservations/<id>', methods=['DELETE'])
@token_required
def delete_reservation(current_user, id):
    reservation = Reservation.query.get_or_404(id)
    db.session.delete(reservation)
    db.session.commit()
    return jsonify({'message': 'Reservation deleted'})

# CRUD operations for Event
@app.route('/events', methods=['POST', 'OPTIONS'])
@token_required
def add_event(current_user):
    if request.method == 'OPTIONS':
        return Response(status=204)
    try:
        data = request.get_json()
        new_event = Event(
            title=data['title'],
            description=data['description'],
            date=data['date'],
            location=data['location'],
            medium=data['medium'],
            start_date=data['startDate'],
            end_date=data['endDate'],
            start_time=data['startTime'],
            end_time=data['endTime'],
            max_participants=data['maxParticipants'],
            category=data['category'],
            accept_reservation=data['acceptReservation'],
            image_url=data['imageUrl'],
            user_id=current_user.id
        )
        db.session.add(new_event)
        db.session.commit()
        return event_schema.jsonify(new_event), 201
    except Exception as e:
        print(f"Error adding event: {str(e)}")
        return jsonify({'message': 'Error adding event'}), 500



@app.route('/events', methods=['GET'])
@token_required
def get_events(current_user):
    all_events = Event.query.all()
    return events_schema.jsonify(all_events)

@app.route('/events/<id>', methods=['GET'])
@token_required
def get_event(current_user, id):
    event = Event.query.get_or_404(id)
    return event_schema.jsonify(event)

@app.route('/events/<id>', methods=['PUT'])
@token_required
def update_event(current_user, id):
    event = Event.query.get_or_404(id)
    data = request.get_json()
    event.title = data['title']
    event.description = data['description']
    event.date = data['date']
    event.location = data['location']
    event.medium = data['medium']
    event.start_date = data['startDate']
    event.end_date = data['endDate']
    event.start_time = data['startTime']
    event.end_time = data['endTime']
    event.max_participants = data['maxParticipants']
    event.category = data['category']
    event.accept_reservation = data['acceptReservation']
    event.image_url = data['imageUrl']
    event.user_id = current_user.id
    db.session.commit()
    return event_schema.jsonify(event)

@app.route('/events/<id>', methods=['DELETE'])
@token_required
def delete_event(current_user, id):
    event = Event.query.get_or_404(id)
    db.session.delete(event)
    db.session.commit()
    return jsonify({'message': 'Event deleted'})

# CRUD operations for Contact
@app.route('/contact', methods=['POST'])
def add_contact():
    data = request.get_json()
    new_contact = Contact(
        name=data['name'],
        email=data['email'],
        message=data['message']
    )
    db.session.add(new_contact)
    db.session.commit()
    return contact_schema.jsonify(new_contact)

@app.route('/contact', methods=['GET'])
@token_required
def get_contacts(current_user):
    all_contacts = Contact.query.all()
    return contacts_schema.jsonify(all_contacts)

@app.route('/contact/<id>', methods=['GET'])
@token_required
def get_contact(current_user, id):
    contact = Contact.query.get_or_404(id)
    return contact_schema.jsonify(contact)

@app.route('/contact/<id>', methods=['PUT'])
@token_required
def update_contact(current_user, id):
    contact = Contact.query.get_or_404(id)
    data = request.get_json()
    contact.name = data['name']
    contact.email = data['email']
    contact.message = data['message']
    db.session.commit()
    return contact_schema.jsonify(contact)

@app.route('/contact/<id>', methods=['DELETE'])
@token_required
def delete_contact(current_user, id):
    contact = Contact.query.get_or_404(id)
    db.session.delete(contact)
    db.session.commit()
    return jsonify({'message': 'Contact deleted'})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
