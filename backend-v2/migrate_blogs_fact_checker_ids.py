import psycopg2
from app.core.database import database

def migrate():
    print("Running migration to add fact_checker_ids field...")
    try:
        conn = database.get_connection()
        cursor = conn.cursor()
        
        # Add fact_checker_ids column (JSONB)
        cursor.execute("ALTER TABLE blogs ADD COLUMN IF NOT EXISTS fact_checker_ids JSONB DEFAULT '[]'::jsonb;")
        
        conn.commit()
        print("Migration done!")
    except Exception as e:
        print(f"Error: {e}")
        if 'conn' in locals():
            conn.rollback()
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            database.return_connection(conn)

if __name__ == "__main__":
    migrate()
