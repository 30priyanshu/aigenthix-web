from app.core.database import database

def migrate():
    print("Running migration for Fact-Checker fields...")
    try:
        conn = database.get_connection()
        cursor = conn.cursor()
        
        # Add fact checker columns
        cursor.execute("ALTER TABLE blogs ADD COLUMN IF NOT EXISTS fact_checker_name VARCHAR(200);")
        cursor.execute("ALTER TABLE blogs ADD COLUMN IF NOT EXISTS fact_checker_bio TEXT;")
        cursor.execute("ALTER TABLE blogs ADD COLUMN IF NOT EXISTS fact_checker_avatar_url TEXT;")
        
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
