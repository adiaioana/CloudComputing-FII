import json
import uuid
from flask import Flask, request, jsonify
from auth import admin_required, token_required  # Import decorators
from db_connect import get_db_connection
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins
app.config['SECRET_KEY'] = 'superSecretaCheiaAsta2003'  # Set your secret key for JWT

# Get all attractions
@app.route('/attractions', methods=['GET'])
def get_all_attractions():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM attractions")
    rows = cur.fetchall()
    conn.close()

    attractions = [{"id": row[0], "name": row[1], "location": row[2], "description": row[3],
                    "category": row[4], "rating": str(row[5]), "opening_hours": row[6], "entry_fee": row[7]}
                   for row in rows]

    return jsonify(attractions)


# Get an attraction by ID
@app.route('/attractions/<attraction_id>', methods=['GET'])
def get_attraction_by_id(attraction_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM attractions WHERE id = %s", (attraction_id,))
    row = cur.fetchone()
    conn.close()

    if row:
        attraction = {"id": row[0], "name": row[1], "location": row[2], "description": row[3],
                      "category": row[4], "rating": row[5], "opening_hours": row[6], "entry_fee": row[7]}
        return jsonify(attraction)
    else:
        return jsonify({"error": "Attraction not found"}), 404


# Get museums
@app.route('/museum', methods=['GET'])
def get_museums():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM attractions WHERE category = 'museum'")
    rows = cur.fetchall()
    conn.close()

    museums = [{"id": row[0], "name": row[1], "location": row[2], "description": row[3],
                "category": row[4], "rating": str(row[5]), "opening_hours": row[6], "entry_fee": row[7]}
               for row in rows]

    return jsonify(museums)


# Add an attraction (admin only)
@app.route('/attractions', methods=['POST'])
#@token_required
#@admin_required  # Ensure admin role is required
def add_attraction():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    id = str(uuid.uuid4())
    conn = get_db_connection()
    cur = conn.cursor()
    print(data)
    '''
    cur.execute("""INSERT INTO attractions (id, name, location, description, category, rating, opening_hours, entry_fee)
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id""",
                (id, data["name"], data["location"], data["description"], data["category"],
                 data["rating"], data["opening_hours"], data["entryFee"]))'''
    attraction_id = cur.fetchone()[0]
    conn.commit()
    conn.close()

    return jsonify({"message": "Attraction added", "id": attraction_id}), 201


# Delete an attraction (admin only)
@app.route('/attractions/<attraction_id>', methods=['DELETE'])
@token_required
@admin_required
def delete_attraction(attraction_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM attractions WHERE id = %s RETURNING id", (attraction_id,))
    deleted_attraction = cur.fetchone()
    conn.commit()
    conn.close()

    if deleted_attraction:
        return jsonify({"message": "Attraction deleted", "id": attraction_id}), 200
    else:
        return jsonify({"error": "Attraction not found"}), 404


# Update an attraction (admin only)
@app.route('/attractions/<attraction_id>', methods=['PUT'])
#@token_required
#@admin_required
def update_attraction(attraction_id):
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    conn = get_db_connection()
    cur = conn.cursor()
    print(data)
    cur.execute("""UPDATE attractions
                   SET name = %s, location = %s, description = %s, category = %s,
                       rating = %s, opening_hours = %s, entry_fee = %s
                   WHERE id = %s RETURNING id""",
                (data["name"], data["location"], data["description"], data["category"],
                 data["rating"], data["opening_hours"], data["entryFee"], attraction_id))
    updated_attraction = cur.fetchone()
    conn.commit()
    conn.close()

    if updated_attraction:
        return jsonify({"message": "Attraction updated", "id": attraction_id}), 200
    else:
        return jsonify({"error": "Attraction not found"}), 404


# Run Flask app
if __name__ == '__main__':
    app.run(debug=True, port=8083)
