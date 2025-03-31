import datetime
from sqlalchemy import or_
from flask_cors import CORS
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt
import os
import uuid
import sys

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@localhost:5432/Tourism_Database'
app.config['JWT_SECRET_KEY'] = 'SuperSecretKey123!'  # Change this to match the secret used by .NET if needed
app.config['JWT_ALGORITHM'] = 'HS256'  # Ensure this matches your .NET server
app.config['JWT_IDENTITY_CLAIM'] = 'sub'


db = SQLAlchemy(app)
jwt = JWTManager(app)

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
@app.route('/attractions/search/<searchquery>', methods=['GET'])
def search_attractions(searchquery):
    # Perform a case-insensitive search across relevant fields
    attractions = Attractions.query.filter(
        or_(
            Attractions.name.ilike(f'%{searchquery}%'),
            Attractions.location.ilike(f'%{searchquery}%'),
            Attractions.description.ilike(f'%{searchquery}%'),
            Attractions.category.ilike(f'%{searchquery}%')
        )
    ).all()

    # Convert the results to a list of dictionaries
    results = [attraction.to_dict() for attraction in attractions]

    return jsonify(results)
@app.route('/attractions', methods=['GET'])
def get_attractions():
    attractions = Attractions.query.all()
    return jsonify([attraction.to_dict() for attraction in attractions])

@app.route('/attractions/<uuid:id>', methods=['GET'])
def get_attraction(id):
    attraction = Attractions.query.get_or_404(id)
    return jsonify(attraction.to_dict())

@app.route('/attractions', methods=['POST'])
@jwt_required()
def create_attraction():
    print(request.headers,file=sys.stderr)
    data = request.get_json()
    new_attraction = Attractions(**data)
    db.session.add(new_attraction)
    db.session.commit()
    return jsonify(new_attraction.to_dict()), 201

@app.route('/attractions/<uuid:id>', methods=['PUT'])
@jwt_required()
def update_attraction(id):
    attraction = Attractions.query.get_or_404(id)
    data = request.get_json()
    for key, value in data.items():
        setattr(attraction, key, value)
    db.session.commit()
    return jsonify(attraction.to_dict())

@app.route('/attractions/<uuid:id>', methods=['DELETE'])
@jwt_required()
def delete_attraction(id):
    claims = get_jwt()  # Get JWT claims (includes role)

    # Check if user role is "Admin"
    if claims.get("role") != "Admin":
        return jsonify({"error": "Forbidden: Admin role required"}), 403

    attraction = Attractions.query.get_or_404(id)
    db.session.delete(attraction)
    db.session.commit()
    return '', 204

@app.route('/museum', methods=['GET'])
def get_museums():
    museums = Attractions.query.filter_by(category='museum').all() + Attractions.query.filter_by(category='Museum').all()
    return jsonify([museum.to_dict() for museum in museums])

@app.route('/locations', methods=['GET'])
def get_locations():
    locations = db.session.query(Attractions.location).distinct().all()
    return jsonify([loc[0] for loc in locations])

@app.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    claims = get_jwt()  # Get JWT claims (includes role)

    # Check if user role is "Admin"
    if claims.get("role") != "Admin":
        return jsonify({"error": "Forbidden: Admin role required"}), 403

    users = Users.query.all()
    return jsonify([user.to_dict() for user in users])

@app.route('/user/<uuid:id>', methods=['GET'])
def get_user(id):
    claims = get_jwt()  # Get JWT claims (includes role and sub)
    user_id_from_jwt = claims.get("sub")  # Get user ID from JWT
    user_role = claims.get("role")  # Get user role
    print('got the req', file=sys.stderr)
    # Allow access if the user is an admin or if the user ID matches the requested ID
    if user_role != "Admin" and str(user_id_from_jwt) != str(id):
        return jsonify({"error": "Forbidden: Access denied"}), 403

    # Query only the 'email' and 'username' columns
    user = db.session.execute(
        db.select(Users.email, Users.username).filter_by(id=id)
    ).scalars().first()

    if user:
        return jsonify({"email": user[0], "username": user[1]})
    else:
        return jsonify({"error": "User not found"}), 404
@app.route('/user/<uuid:id>', methods=['DELETE'])
@jwt_required()
def delete_user(id):
    claims = get_jwt()  # Get JWT claims (includes role)
    # Check if user role is "Admin"
    if claims.get("role") != "Admin":
        return jsonify({"error": "Forbidden: Admin role required"}), 403

    user = Users.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return '', 204


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if Users.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already exists"}), 400

    hashed_password = generate_password_hash(data["password_unhashed"], method="pbkdf2:sha256")

    new_user = Users(
        username=data["username"],
        email=data["email"],
        password_hash=hashed_password,
        role=data["role"]
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify(new_user.to_dict()), 201


# **User Login**
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = Users.query.filter_by(email=data["email"]).first()

    if user and check_password_hash(user.password_hash, data["password_unhashed"]):
        expires = datetime.timedelta(hours=1)
        access_token = create_access_token(
            identity=str(user.id),  # User ID as identity
            additional_claims={
                "email": user.email,  # Add email to the claims
                "role": user.role,  # Add role to the claims
                "username": user.username  # Add username to the claims
            },
            expires_delta=expires
        )
        return jsonify({"token": access_token}), 200

    return jsonify({"error": "Invalid email or password"}), 401
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
