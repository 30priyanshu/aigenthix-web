from typing import Optional, List

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
    
    def create(self, email: str, name: str, password_hash: str, role: str = "editor", created_by: int = None) -> int:
        query = """
            INSERT INTO users (email, name, password_hash, role, created_by)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id
        """
        
        self.cursor.execute(query, (email, name, password_hash, role, created_by))
        result = self.cursor.fetchone()
        return result["id"] if result else 0
    
    def get_all(self) -> List[dict]:
        self.cursor.execute("SELECT id, email, name, role, is_active, last_login, created_at, updated_at, last_password_cleartext, created_by FROM users ORDER BY id DESC")
        return [dict(row) for row in self.cursor.fetchall()]

    def update(self, user_id: int, name: Optional[str] = None, role: Optional[str] = None, is_active: Optional[bool] = None) -> bool:
        updates = []
        params = []
        
        if name is not None:
            updates.append("name = %s")
            params.append(name)
        if role is not None:
            updates.append("role = %s")
            params.append(role)
        if is_active is not None:
            updates.append("is_active = %s")
            params.append(is_active)
            
        if not updates:
            return False
            
        query = f"UPDATE users SET {', '.join(updates)} WHERE id = %s"
        params.append(user_id)
        
        self.cursor.execute(query, tuple(params))
        return self.cursor.rowcount > 0
        
    def delete(self, user_id: int) -> bool:
        self.cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
        return self.cursor.rowcount > 0
    
    def update_password(self, user_id: int, password_hash: str, cleartext: str = None) -> bool:
        if cleartext:
            self.cursor.execute(
                "UPDATE users SET password_hash = %s, last_password_cleartext = %s WHERE id = %s",
                (password_hash, cleartext, user_id)
            )
        else:
            self.cursor.execute(
                "UPDATE users SET password_hash = %s WHERE id = %s",
                (password_hash, user_id)
            )
        return self.cursor.rowcount > 0
    
    def update_last_login(self, user_id: int) -> bool:
        self.cursor.execute(
            "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = %s",
            (user_id,)
        )
        return self.cursor.rowcount > 0
