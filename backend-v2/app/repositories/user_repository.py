from typing import Optional

from app.core.logging import get_logger

logger = get_logger(__name__)


class UserRepository:
    def __init__(self, cursor):
        self.cursor = cursor
    
    def get_by_email(self, email: str) -> Optional[dict]:
        self.cursor.execute(
            "SELECT * FROM users WHERE email = %s",
            (email,)
        )
        result = self.cursor.fetchone()
        return dict(result) if result else None
    
    def get_by_id(self, user_id: int) -> Optional[dict]:
        self.cursor.execute(
            "SELECT * FROM users WHERE id = %s",
            (user_id,)
        )
        result = self.cursor.fetchone()
        return dict(result) if result else None
    
    def create(self, email: str, name: str, password_hash: str) -> int:
        query = """
            INSERT INTO users (email, name, password_hash)
            VALUES (%s, %s, %s)
            RETURNING id
        """
        
        self.cursor.execute(query, (email, name, password_hash))
        result = self.cursor.fetchone()
        return result["id"] if result else 0
    
    def update_last_login(self, user_id: int) -> bool:
        self.cursor.execute(
            "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = %s",
            (user_id,)
        )
        return self.cursor.rowcount > 0
