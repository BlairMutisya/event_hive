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

@app.route('/')
def index():
    return '<h1>Project Server</h1>'


if __name__ == '__main__':
    app.run(port=5555, debug=True)

