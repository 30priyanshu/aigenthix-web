from app.core.database import database
from psycopg2 import extras
from app.repositories.blog_repository import BlogRepository
from app.schemas.blog import BlogPublic

try:
    conn = database.get_connection()
    repo = BlogRepository(conn.cursor(cursor_factory=extras.RealDictCursor))
    blog_dict = repo.get_by_slug("hello")
    if blog_dict:
        blog = BlogPublic(**blog_dict)
        print("Success:", blog.title)
    else:
        print("Blog not found")
except Exception as e:
    import traceback
    traceback.print_exc()
finally:
    database.return_connection(conn)
