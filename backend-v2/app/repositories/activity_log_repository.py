from typing import List
from app.core.logging import get_logger

logger = get_logger(__name__)

class ActivityLogRepository:
    def __init__(self, cursor):
        self.cursor = cursor
        
    def log_activity(self, user_id: int, user_name: str, action: str, entity_type: str, entity_id: int, entity_title: str, message: str = "") -> int:
        query = """
            INSERT INTO activity_logs (user_id, user_name, action, entity_type, entity_id, entity_title, message)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """
        try:
            self.cursor.execute(query, (user_id, user_name, action, entity_type, entity_id, entity_title, message))
            result = self.cursor.fetchone()
            return result["id"] if result else 0
        except Exception as e:
            logger.error(f"Failed to log activity: {e}")
            return 0
            
    def get_recent_activities(self, user_id: int, limit: int = 20) -> List[dict]:
        self.cursor.execute(
            """
            SELECT *, 
                   (%s = ANY(COALESCE(read_by, '{}'))) as is_read 
            FROM activity_logs 
            ORDER BY created_at DESC 
            LIMIT %s
            """,
            (user_id, limit)
        )
        return [dict(row) for row in self.cursor.fetchall()]
        
    def mark_as_read(self, log_id: int, user_id: int) -> bool:
        self.cursor.execute(
            """
            UPDATE activity_logs 
            SET read_by = array_append(COALESCE(read_by, '{}'), %s) 
            WHERE id = %s AND NOT (%s = ANY(COALESCE(read_by, '{}')))
            """,
            (user_id, log_id, user_id)
        )
        return self.cursor.rowcount > 0
        
    def mark_all_as_read(self, user_id: int) -> bool:
        self.cursor.execute(
            """
            UPDATE activity_logs 
            SET read_by = array_append(COALESCE(read_by, '{}'), %s) 
            WHERE NOT (%s = ANY(COALESCE(read_by, '{}')))
            """,
            (user_id, user_id)
        )
        return self.cursor.rowcount > 0
