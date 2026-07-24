from app.core.database import database

def fix():
    print("Fixing DB...")
    try:
        conn = database.get_connection()
        cursor = conn.cursor()
        
        # Blogs
        cursor.execute("ALTER TABLE blogs ALTER COLUMN featured_image_url TYPE TEXT;")
        cursor.execute("ALTER TABLE blogs ALTER COLUMN author_avatar_url TYPE TEXT;")
        
        # Products
        cursor.execute("ALTER TABLE products ALTER COLUMN image_url TYPE TEXT;")
        
        # Services
        cursor.execute("ALTER TABLE services ALTER COLUMN icon_url TYPE TEXT;")
        
        # Industries
        cursor.execute("ALTER TABLE industries ALTER COLUMN image_url TYPE TEXT;")
        
        conn.commit()
        print("Done!")
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
    fix()
