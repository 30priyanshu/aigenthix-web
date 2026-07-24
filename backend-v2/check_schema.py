from app.core.database import database

conn = database.get_connection()
cursor = conn.cursor()
cursor.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'blogs';")
columns = [row[0] for row in cursor.fetchall()]
print("Columns:", columns)
database.return_connection(conn)
