from app.core.database import database

def update_admins():
    conn = database.get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET role = 'super_admin' WHERE role = 'admin' OR role = 'editor' OR role IS NULL")
    conn.commit()
    print(f"Updated {cursor.rowcount} users to super_admin.")
    cursor.close()
    database.return_connection(conn)

if __name__ == "__main__":
    update_admins()
