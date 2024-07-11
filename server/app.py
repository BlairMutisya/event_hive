import random
from flask import Flask, request, Response
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask_login import current_user, login_required
from flask import jsonify

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

# Root route
@app.route('/')
def index():
    return Response('Welcome to Event Hive API', mimetype='text/plain')

# User registration
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
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

    token = create_access_token(identity=user.id, expires_delta=timedelta(hours=24))  # Correct usage of timedelta
    return jsonify({'token': token})

# Route for handling contact form submission
@app.route('/contact', methods=['POST'])
def contact():
    try:
        # Get data from request
        data = request.get_json()

        # Create new Contact instance
        new_contact = Contact(
            name=data['name'],
            email=data['email'],
            subject=data['subject'],
            message=data['message']
        )

        # Add new contact to the database
        db.session.add(new_contact)
        db.session.commit()

        # Return success response
        return jsonify({'message': 'Contact form submitted successfully'}), 201

    except Exception as e:
        # Rollback transaction on error
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# Handle preflight requests
@app.before_request
def handle_preflight():
    if request.method == 'OPTIONS':
        return Response(status=204)

# CRUD operations for User
@app.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    all_users = User.query.all()
    return users_schema.jsonify(all_users)

@app.route('/users/<int:id>', methods=['GET'])
@jwt_required()
def get_user(id):
    user = User.query.get_or_404(id)
    return user_schema.jsonify(user)

@app.route('/users/<int:id>', methods=['PUT'])
@jwt_required()
def update_user(id):
    user = User.query.get_or_404(id)
    data = request.get_json()
    user.username = data['username']
    user.email = data['email']
    if 'password' in data:
        user.password = generate_password_hash(data['password'], method='sha256')
    db.session.commit()
    return user_schema.jsonify(user)

@app.route('/users/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_user(id):
    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted'})

# CRUD operations for Reservation
@app.route('/reservations', methods=['POST'])
@jwt_required()
def add_reservation():
    data = request.get_json()
    new_reservation = Reservation(
        event_id=data['event_id'],
        user_id=get_jwt_identity(),
        status=data['status']
    )
    db.session.add(new_reservation)
    db.session.commit()
    return reservation_schema.jsonify(new_reservation)

@app.route('/reservations', methods=['GET'])
@jwt_required()
def get_reservations():
    all_reservations = Reservation.query.all()
    return reservations_schema.jsonify(all_reservations)

@app.route('/reservations/<int:id>', methods=['GET'])
@jwt_required()
def get_reservation(id):
    reservation = Reservation.query.get_or_404(id)
    return reservation_schema.jsonify(reservation)

@app.route('/reservations/<int:id>', methods=['PUT'])
@jwt_required()
def update_reservation(id):
    reservation = Reservation.query.get_or_404(id)
    data = request.get_json()
    reservation.event_id = data['event_id']
    reservation.user_id = data['user_id']
    reservation.status = data['status']
    db.session.commit()
    return reservation_schema.jsonify(reservation)

@app.route('/reservations/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_reservation(id):
    reservation = Reservation.query.get_or_404(id)
    db.session.delete(reservation)
    db.session.commit()
    return jsonify({'message': 'Reservation deleted'})

# CRUD operations for Event
@app.route('/events', methods=['POST'])
def add_event():
    try:
        data = request.get_json()

        # Validate required fields are present
        required_fields = ['title', 'description', 'date', 'location', 'medium', 'startDate', 'endDate', 'startTime', 'endTime', 'maxParticipants', 'category', 'acceptReservation', 'imageURL']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 422

        # Parse date and time strings into Python datetime objects
        date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        start_date = datetime.strptime(data['startDate'], '%Y-%m-%d').date()
        end_date = datetime.strptime(data['endDate'], '%Y-%m-%d').date()
        start_time = datetime.strptime(data['startTime'], '%H:%M').time()
        end_time = datetime.strptime(data['endTime'], '%H:%M').time()

        new_event = Event(
            title=data['title'],
            description=data['description'],
            date=date,
            location=data['location'],
            medium=data['medium'],
            start_date=start_date,
            end_date=end_date,
            start_time=start_time,
            end_time=end_time,
            max_participants=data['maxParticipants'],
            category=data['category'],
            accept_reservation=data['acceptReservation'],
            image_url=data['imageURL'],
            user_id=data['user_id']  # Assuming 'user_id' is provided in the request data
        )
        db.session.add(new_event)
        db.session.commit()

        # Serialize the new_event object using EventSchema
        serialized_event = event_schema.dump(new_event)
        return jsonify(serialized_event), 201  # Return serialized event with HTTP status code 201
    except KeyError as e:
        db.session.rollback()
        return jsonify({"error": f"KeyError: Missing required field - {str(e)}"}), 422
    except Exception as e:
        db.session.rollback()
        print(f"Error creating event: {e}")
        return jsonify({"error": "Failed to create event"}), 500

@app.route('/events', methods=['GET'])
def get_events():
    all_events = Event.query.all()
    serialized_events = events_schema.dump(all_events)
    return jsonify(serialized_events)

@app.route('/events/<int:id>', methods=['GET'])
def get_event(id):
    event = Event.query.get_or_404(id)
    return jsonify(event_schema.dump(event))

@app.route('/events/<int:id>', methods=['PUT'])
def update_event(id):
    event = Event.query.get_or_404(id)
    data = request.get_json()
    
    # Update event fields
    event.title = data['title']
    event.description = data['description']
    event.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
    event.location = data['location']
    event.medium = data['medium']
    event.category = data['category']
    
    db.session.commit()

    # Return JSON response using jsonify function
    return jsonify(event_schema.dump(event))

@app.route('/events/<int:id>', methods=['DELETE'])
def delete_event(id):
    event = Event.query.get_or_404(id)
    db.session.delete(event)
    db.session.commit()
    return jsonify({'message': 'Event deleted'})

# Error handling
@app.errorhandler(404)
def page_not_found(e):
    return jsonify({"error": "Not Found"}), 404

@app.errorhandler(500)
def internal_server_error(e):
    return jsonify({"error": "Internal Server Error"}), 500

if __name__ == '__main__':
    app.run(debug=True)
