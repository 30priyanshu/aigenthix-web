import psycopg2
import json
from psycopg2.extras import RealDictCursor
from app.core.database import database
from app.repositories.blog_repository import BlogRepository

def test():
    conn = database.get_connection()
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT * FROM blogs WHERE id=10")
        blog = cur.fetchone()
        
        repo = BlogRepository()
        repo.cursor = cur
        
        parsed_blog = repo._parse_json_fields(dict(blog))
        print("Fact checker ids:", parsed_blog.get("fact_checker_ids"))
        print("Fact checkers data:", parsed_blog.get("fact_checkers_data"))
    except Exception as e:
        print("Error:", e)
    finally:
        database.return_connection(conn)

if __name__ == "__main__":
    test()
