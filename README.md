# EventHive
<img width="960" alt="image" src="https://github.com/BlairMutisya/event_hive/assets/122833274/f7aba14d-fc80-4bef-9b25-004ad86a13e4">



## Overview

**EventHive** is a web-based event management platform designed to streamline the process of organizing, managing, and attending events. Leveraging the power of a Flask API backend and a React frontend, EventHive offers a seamless user experience for event creators and attendees alike. It caters to diverse needs from corporate meetings and community gatherings to social events and personal celebrations, making event management effortless and efficient.

EventHive is a versatile platform that allows users to:

- **Create and Manage Events:** Event organizers can easily create events with detailed descriptions, schedules, and locations. They can also manage attendee lists and track RSVPs in real-time.

- **Discover and Join Events:** Users can search for events based on various criteria such as location, date, and interest, and RSVP directly through the platform.

- **Streamline Communication:** Facilitates efficient communication between event organizers and attendees through integrated messaging and updates.

- **User-Friendly Interface:** The platform features a modern, responsive design with intuitive navigation, making it accessible on all devices.

## Key Features and MVPs
User Registration and Authentication:

- **Allow users to create accounts and log in securely.**
-Ensure that user data is protected through secure password storage.
Event Creation and Management:

- **Enable users to create and update event details including title, description, date, time, and location.**
-Provide a user-friendly form with validation for accurate event creation.
-Implement CRUD operations for event management.

**Search and Filter Events:**

-Develop a search functionality allowing users to find events by various criteria (date, location, title).
-Include advanced filtering options like searching by area, event ID, and date range.
**RSVP System with Additional Attributes:**

- Facilitate a many-to-many relationship where users can RSVP to events.
- Allow users to specify their RSVP status (e.g., Attending, Maybe, Not Attending).
- Enable event organizers to view and manage RSVPs.
- 
**Event Listing and Details Page:**

- Display a list of events with essential details.
- Provide detailed pages for each event, including a description, location, date/time, and list of attendees.

**Responsive Design:**
- Ensure the platform is fully responsive and accessible on mobile and desktop devices.

**Integration with React Router and Formik:**
- Use React Router for client-side routing to provide a single-page application experience.
- Implement forms and validation using Formik to enhance data entry accuracy.

**Technical Stack**
- **Frontend:** ReactJS, Tailwind CSS/CSS
- **Backend:** Flask, SQLAlchemy
- **Database:** SQLite (for development), PostgreSQL (for production)
- **Other Technologies:** React Router, Formik, Flask-CORS, Flask-Migrate, Flask Bcrypt

## Project Setup
### Directory Structure

```console
$ tree -L 2
$ # the -L 
.
├── CONTRIBUTING.md
├── LICENSE.md
├── Pipfile
├── README.md
├── client
│   ├── README.md
│   ├── package.json
│   ├── public
│   └── src
└── server
    ├── app.py
    ├── config.py
    ├── models.py
    └── seed.py
```

**`server/`**
The **`server/`** directory contains all of your backend code.

- **`app.py`** is your Flask application.
- **`models.py`** contains your SQLAlchemy models.
- **`seed.py`** is used to seed your database with initial data.
- **`config.py`** contains your configuration settings.

## Setting Up the Server

1. Navigate to the **`server`** directory:

```console
cd server
```
2. Install the dependencies:

```console
pipenv install
pipenv shell
```
3. Run the Flask API:

```console
python app.py
```
4. Create the **`instance`** and **`migrations`** folders and the database **`app.db`** file:

```console
flask db init
flask db upgrade head
```
**`client/`**
The **`client/`** directory contains all of your frontend code.

**Setting Up the Client
1. Install the dependencies:
```console
npm install --prefix client
```
2. Run the React app:
```console
npm start --prefix client
```
##Database Management
###Creating the Database
1. Navigate to the **`server`** directory:

```console
cd server
```
2. Initialize and upgrade the database:
```console
flask db init
flask db upgrade head
```
3. Create a revision:
```console
flask db revision --autogenerate -m "Initial migration"
```
4. Upgrade the database:
```console
flask db upgrade head
```
###Seeding the Database
1. Run the seed script:
```console
python seed.py
```
### Contributing

Contributions are welcome! To contribute:

1. Fork this repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature/your-feature-name`).
6. Create a new Pull Request.

