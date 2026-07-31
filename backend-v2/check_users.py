import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def check_users():
    conn = psycopg2.connect(os.getenv("DATABASE_URL"))
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, role, created_by FROM users;")
    rows = cursor.fetchall()
    for row in rows:
        print(row)
    conn.close()

if __name__ == "__main__":
    check_users()
