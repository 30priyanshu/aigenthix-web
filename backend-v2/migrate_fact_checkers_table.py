import psycopg2
from app.core.database import database

def migrate():
    print("Running migration to create fact_checkers table...")
    try:
        conn = database.get_connection()
        cursor = conn.cursor()
        
        query = """
        CREATE TABLE IF NOT EXISTS fact_checkers (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            bio TEXT,
            avatar_url TEXT,
            twitter VARCHAR(255),
            linkedin VARCHAR(255),
            facebook VARCHAR(255),
            instagram VARCHAR(255),
            github VARCHAR(255),
            website VARCHAR(255),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        """
        cursor.execute(query)
        
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
