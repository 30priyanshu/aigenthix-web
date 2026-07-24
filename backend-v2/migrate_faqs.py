from app.core.database import database

def migrate():
    print("Running migration for FAQs field...")
    try:
        conn = database.get_connection()
        cursor = conn.cursor()
        
        # Add faqs column
        cursor.execute("""
            ALTER TABLE blogs 
            ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]'::jsonb;
        """)
        
        conn.commit()
        print("Migration done successfully!")
        
    except Exception as e:
        print(f"Migration failed: {e}")
        if conn:
            conn.rollback()
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            database.return_connection(conn)

if __name__ == "__main__":
    migrate()
