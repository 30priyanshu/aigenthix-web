import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("No DATABASE_URL found.")
    exit(1)

# fix postgres:// to postgresql://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

try:
    conn = psycopg2.connect(DATABASE_URL)
    conn.autocommit = True
    cursor = conn.cursor()

    # Add missing columns
    columns = {
        "author_title": "VARCHAR(200)",
        "meta_title": "VARCHAR(200)",
        "meta_description": "TEXT",
        "meta_keywords": "VARCHAR(500)"
    }

    for col_name, col_type in columns.items():
        try:
            cursor.execute(f"ALTER TABLE blogs ADD COLUMN {col_name} {col_type};")
            print(f"Added column {col_name}")
        except psycopg2.Error as e:
            print(f"Column {col_name} might already exist or error: {e}")

    cursor.close()
    conn.close()
    print("Database migration completed successfully.")
except Exception as e:
    print(f"Migration failed: {e}")
