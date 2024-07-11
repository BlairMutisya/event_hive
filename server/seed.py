from config import db, app
from models import User, Event

def seed_data():
    # Create sample users
    user1 = User(username='john_doe', email='john@example.com')
    user1.set_password('password')
    user2 = User(username='jane_doe', email='jane@example.com')
    user2.set_password('password')

    # Add users to the session
    db.session.add(user1)
    db.session.add(user2)
    db.session.commit()

    # Create sample events
    event1 = Event(title='Flask Workshop', description='Learn Flask basics', user_id=user1.id)
    event2 = Event(title='React Meetup', description='React community meetup', user_id=user2.id)

    # Add events to the session
    db.session.add(event1)
    db.session.add(event2)
    db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create tables if they don't exist
        seed_data()  # Seed the database
