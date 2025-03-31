import datetime
from sqlalchemy import or_
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt
import os
import uuid
import sys


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@localhost:5432/Tourism_Database'

db = SQLAlchemy(app)

class Reviews(db.Model):
    __tablename__ = 'reviews'
    id = db.Column(db.Uuid, primary_key=True, default=uuid.uuid4)
    user_id = db.Column(db.Uuid, db.ForeignKey('users.id'), nullable=False)
    attraction_id = db.Column(db.Uuid, db.ForeignKey('attractions.id'), nullable=False)
    review_score = db.Column(db.Float, nullable=False)
    review_text = db.Column(db.Text, nullable=True)

    user = db.relationship('Users', backref=db.backref('reviews', lazy=True))
    attraction = db.relationship('Attractions', backref=db.backref('reviews', lazy=True))

    def to_dict(self):
        return {
            'id': str(self.id),
            'user_id': str(self.user_id),
            'attraction_id': str(self.attraction_id),
            'review_score': self.review_score,
            'review_text': self.review_text
        }


class UserData(db.Model):
    __tablename__ = 'userdata'
    user_id = db.Column(db.Uuid, db.ForeignKey('users.id'), primary_key=True)
    photo_url = db.Column(db.String(255))
    review_history = db.Column(db.ARRAY(db.Uuid), default=[])  # An array of review IDs

    user = db.relationship('Users', backref=db.backref('userdata', uselist=False))

    def to_dict(self):
        return {
            'user_id': str(self.user_id),
            'photo_url': self.photo_url,
            'review_history': [str(review_id) for review_id in self.review_history]
        }


class Attractions(db.Model):
    __tablename__ = 'attractions'
    id = db.Column(db.Uuid, primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(100))
    rating = db.Column(db.Float)
    opening_hours = db.Column(db.String(255))
    entry_fee = db.Column(db.String(50))

    def to_dict(self):
        return {c.name: str(getattr(self, c.name)) if isinstance(getattr(self, c.name), uuid.UUID) else getattr(self, c.name) for c in self.__table__.columns}

class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Uuid, primary_key=True, default=uuid.uuid4)
    username = db.Column(db.String(255), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50))

    def to_dict(self):
        return {c.name: str(getattr(self, c.name)) if isinstance(getattr(self, c.name), uuid.UUID) else getattr(self, c.name) for c in self.__table__.columns}

# POST /review - Add a new review
@app.route('/review', methods=['POST'])
@jwt_required()
def create_review():
    data = request.get_json()
    user_id = get_jwt().get("sub")  # Get the current user's ID from the JWT

    # Ensure the user exists
    user = Users.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    attraction = Attractions.query.get(data["attraction_id"])
    if not attraction:
        return jsonify({"error": "Attraction not found"}), 404

    # Create new review
    new_review = Reviews(
        user_id=user_id,
        attraction_id=data["attraction_id"],
        review_score=data["review_score"],
        review_text=data.get("review_text", "")
    )

    # Add review to the database
    db.session.add(new_review)
    db.session.commit()

    # Update the user's review history
    user_data = UserData.query.get(user_id)
    if user_data:
        user_data.review_history.append(new_review.id)
    else:
        user_data = UserData(user_id=user_id, review_history=[new_review.id])
        db.session.add(user_data)

    db.session.commit()

    return jsonify(new_review.to_dict()), 201


# GET /reviews-for-attraction - Get all reviews for a specific attraction
@app.route('/reviews-for-attraction/<uuid:attraction_id>', methods=['GET'])
def get_reviews_for_attraction(attraction_id):
    reviews = Reviews.query.filter_by(attraction_id=attraction_id).all()
    return jsonify([review.to_dict() for review in reviews])


# GET /reviews-made-by-user - Get all reviews made by a specific user
@app.route('/reviews-made-by-user/<uuid:user_id>', methods=['GET'])
def get_reviews_made_by_user(user_id):
    reviews = Reviews.query.filter_by(user_id=user_id).all()
    return jsonify([review.to_dict() for review in reviews])


# GET /userdata - Get user data (photo URL and review history)
@app.route('/userdata/<uuid:user_id>', methods=['GET'])
@jwt_required()
def get_user_data(user_id):
    claims = get_jwt()
    current_user_id = claims.get("sub")

    # Allow access to data for the current user or an admin
    if current_user_id != str(user_id) and claims.get("role") != "Admin":
        return jsonify({"error": "Forbidden: Access denied"}), 403

    user_data = UserData.query.get(user_id)
    if not user_data:
        return jsonify({"error": "User data not found"}), 404

    return jsonify(user_data.to_dict())


# POST /userdata - Add or update user data (photo URL, review history)
@app.route('/userdata', methods=['POST'])
@jwt_required()
def create_user_data():
    data = request.get_json()
    user_id = get_jwt().get("sub")

    # Ensure the user exists
    user = Users.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Create or update user data
    user_data = UserData.query.get(user_id)
    if user_data:
        user_data.photo_url = data.get('photo_url', user_data.photo_url)
        user_data.review_history = data.get('review_history', user_data.review_history)
    else:
        user_data = UserData(
            user_id=user_id,
            photo_url=data.get('photo_url', ''),
            review_history=data.get('review_history', [])
        )
        db.session.add(user_data)

    db.session.commit()

    return jsonify(user_data.to_dict()), 201


# PUT /userdata - Update existing user data (photo URL, review history)
@app.route('/userdata/<uuid:user_id>', methods=['PUT'])
@jwt_required()
def update_user_data(user_id):
    data = request.get_json()
    user = Users.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    user_data = UserData.query.get(user_id)
    if not user_data:
        return jsonify({"error": "User data not found"}), 404

    # Update the fields
    user_data.photo_url = data.get('photo_url', user_data.photo_url)
    user_data.review_history = data.get('review_history', user_data.review_history)

    db.session.commit()

    return jsonify(user_data.to_dict())


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

