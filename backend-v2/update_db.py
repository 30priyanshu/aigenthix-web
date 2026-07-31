import sys
sys.path.append('c:\\Users\\HP\\Projects\\Aigenthix_Website_design-main\\backend-v2')
from app.core.database import database

conn = database.get_connection()
cursor = conn.cursor()
cursor.execute("ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS read_by INTEGER[] DEFAULT '{}'")
conn.commit()
cursor.close()
database.return_connection(conn)
print('Success')
