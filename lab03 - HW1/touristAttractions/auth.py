import jwt
from functools import wraps
from flask import request, jsonify

from datetime import datetime, timedelta

# Secret Key for signing JWT (should be kept the same across both files)
SECRET_KEY = 'superSecretaCheiaAsta2003'


# Decorator for protecting routes with token validation
def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None

        # Check if token is passed in the Authorization header
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]  # Remove "Bearer "

        if not token:
            return jsonify({"message": "Token is missing!"}), 403

        try:
            # Decode the token
            decoded_token = jwt.decode(
                token, SECRET_KEY, algorithms=["HS256"], issuer="YourApp", audience="YourAppUsers"
            )
            # Add the decoded user information to the request
            request.user = decoded_token
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired!"}), 403
        except jwt.InvalidIssuerError:
            return jsonify({"message": "Invalid issuer!"}), 403
        except jwt.InvalidAudienceError:
            return jsonify({"message": "Invalid audience!"}), 403
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token!"}), 403

        return f(*args, **kwargs)

    return decorated_function


# Decorator for protecting routes requiring admin role
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Ensure the token is available and decode it
        print(request.user)
        if not hasattr(request, 'user') or 'role' not in request.user:
            return jsonify({"message": "Admin access required!"}), 403

        # Get the user role from the decoded token and check if it's 'admin'
        user_role = request.user['role']
        if user_role != 'admin':
            return jsonify({"message": "Admin access required!"}), 403

        return f(*args, **kwargs)

    return decorated_function