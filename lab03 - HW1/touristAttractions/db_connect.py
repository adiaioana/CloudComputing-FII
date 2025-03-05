import psycopg2
# Database connection
DB_PARAMS = {
    "dbname": "Tourism_Database",
    "user": "postgres",
    "password": "postgres",
    "host": "localhost",
    "port": "5432"
}


def get_db_connection():
    return psycopg2.connect(**DB_PARAMS)
