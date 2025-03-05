import json
import uuid
from db_connect import get_db_connection
from http.server import BaseHTTPRequestHandler, HTTPServer



# HTTP Request Handler
class RequestHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-type', 'application/json')
        self.end_headers()

    def do_GET(self):
        if self.path == "/attractions":
            self.get_all_attractions()
        elif self.path.startswith("/attractions/"):
            attraction_id = self.path.split("/")[-1]
            self.get_attraction_by_id(attraction_id)
        elif self.path == "/locations":
            self.get_all_locations()
        elif self.path == "/museum":
            self.get_museums()
        elif self.path.startswith("/users"):
            self.get_users()
        elif self.path.startswith("/user/"):
            user_id = self.path.split("/")[-1]
            self.get_user_by_id(user_id)
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Not found"}).encode())

    def get_all_attractions(self):
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM attractions")
        rows = cur.fetchall()
        conn.close()
        attractions = [{"id": row[0], "name": row[1], "location": row[2], "description": row[3],
                        "category": row[4], "rating": str(row[5]), "opening_hours": row[6], "entry_fee": row[7]}
                       for row in rows]

        self._set_headers()
        self.wfile.write(json.dumps(attractions).encode())
    def get_users(self):
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM users")
        rows = cur.fetchall()
        conn.close()
        users = [{"id": row[0], "username": row[1], "password": row[2]}
                       for row in rows]

        self._set_headers()
        self.wfile.write(json.dumps(users).encode())

    def get_attraction_by_id(self, attraction_id):
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM attractions WHERE id = %s", (attraction_id,))
        row = cur.fetchone()
        conn.close()

        if row:
            attraction = {"id": row[0], "name": row[1], "location": row[2], "description": row[3],
                          "category": row[4], "rating": row[5], "opening_hours": row[6], "entry_fee": row[7]}
            self._set_headers()
            self.wfile.write(json.dumps(attraction).encode())
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Attraction not found"}).encode())

    def get_all_locations(self):
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT DISTINCT location FROM attractions")
        rows = cur.fetchall()
        conn.close()

        locations = [row[0] for row in rows]
        self._set_headers()
        self.wfile.write(json.dumps(locations).encode())

    def get_user_by_id(self, user_id):
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT id, username FROM users WHERE id = %s", (user_id,))
        row = cur.fetchone()
        conn.close()

        if row:
            user = {"id": row[0], "username": row[1]}
            self._set_headers()
            self.wfile.write(json.dumps(user).encode())
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "User not found"}).encode())

    def create_user(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)

        user_id = str(uuid.uuid4())  # Generate UUID for user ID

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO users (id, username, password) 
            VALUES (%s, %s, %s) RETURNING id
        """, (user_id, data["username"], data["password"]))

        conn.commit()
        conn.close()

        self._set_headers(201)
        self.wfile.write(json.dumps({"message": "User created", "id": user_id}).encode())
    def attractions_getter_from_db(self):

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM attractions")
        rows = cur.fetchall()
        conn.close()
        return rows
    def get_museums(self):
        rows = self.attractions_getter_from_db()
        museums = [{"id": row[0], "name": row[1], "location": row[2], "description": row[3],
                    "category": row[4], "rating": str(row[5]), "opening_hours": row[6], "entry_fee": row[7]}
                   for row in rows if str(row[4]).lower() == 'museum']

        self._set_headers()
        self.wfile.write(json.dumps(museums).encode())

    def do_POST(self):
        if self.path == "/attractions":
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data)

            id = str(uuid.uuid4())
            conn = get_db_connection()
            cur = conn.cursor()
            cur.execute("""
                INSERT INTO attractions (id, name, location, description, category, rating, opening_hours, entry_fee) 
                VALUES (%s,%s, %s, %s, %s, %s, %s, %s) RETURNING id
            """, (id, data["name"], data["location"], data["description"], data["category"], data["rating"],
                  data["opening_hours"], data["entry_fee"]))
            attraction_id = cur.fetchone()[0]
            conn.commit()
            conn.close()

            self._set_headers(201)
            self.wfile.write(json.dumps({"message": "Attraction added", "id": attraction_id}).encode())
        elif self.path.startswith("/user"):
            self.create_user()
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Not found"}).encode())

    def delete_user(self, user_id):
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM users WHERE id = %s RETURNING id", (user_id,))
        deleted_user = cur.fetchone()
        conn.commit()
        conn.close()

        if deleted_user:
            self._set_headers(200)
            self.wfile.write(json.dumps({"message": "User deleted", "id": user_id}).encode())
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "User not found"}).encode())

    def delete_attraction(self, attraction_id):
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM attractions WHERE id = %s RETURNING id", (attraction_id,))
        deleted_attraction = cur.fetchone()
        conn.commit()
        conn.close()

        if deleted_attraction:
            self._set_headers(200)
            self.wfile.write(json.dumps({"message": "Attraction deleted", "id": attraction_id}).encode())
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Attraction not found"}).encode())

    def do_DELETE(self):
        if self.path.startswith("/attractions/"):
            attraction_id = self.path.split("/")[-1]
            self.delete_attraction(attraction_id)
        elif self.path.startswith("/user/"):
            user_id = self.path.split("/")[-1]
            self.delete_user(user_id)
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Not found"}).encode())

    def update_user(self, user_id):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            UPDATE users 
            SET username = %s, password = %s 
            WHERE id = %s RETURNING id
        """, (data["username"], data["password"], user_id))

        updated_user = cur.fetchone()
        conn.commit()
        conn.close()

        if updated_user:
            self._set_headers(200)
            self.wfile.write(json.dumps({"message": "User updated", "id": user_id}).encode())
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "User not found"}).encode())

    def update_attraction(self, attraction_id):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            UPDATE attractions 
            SET name = %s, location = %s, description = %s, category = %s, 
                rating = %s, opening_hours = %s, entry_fee = %s 
            WHERE id = %s RETURNING id
        """, (data["name"], data["location"], data["description"], data["category"],
              data["rating"], data["opening_hours"], data["entry_fee"], attraction_id))

        updated_attraction = cur.fetchone()
        conn.commit()
        conn.close()

        if updated_attraction:
            self._set_headers(200)
            self.wfile.write(json.dumps({"message": "Attraction updated", "id": attraction_id}).encode())
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Attraction not found"}).encode())
    def do_PUT(self):
        if self.path.startswith("/attractions/"):
            attraction_id = self.path.split("/")[-1]
            self.update_attraction(attraction_id)
        elif self.path.startswith("/user/"):
            user_id = self.path.split("/")[-1]
            self.update_user(user_id)
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Not found"}).encode())


# Run server
def run(server_class=HTTPServer, handler_class=RequestHandler, port=8083):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f'Server running on port {port}...')
    httpd.serve_forever()


if __name__ == "__main__":
    run()