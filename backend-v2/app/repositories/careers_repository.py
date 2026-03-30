from typing import Optional, List

from app.core.logging import get_logger

logger = get_logger(__name__)


class CareersRepository:

    def __init__(self, cursor):
        self.cursor = cursor

    def create(
        self,
        full_name: str,
        email: str,
        position: str,
        phone: Optional[str] = None,
        experience: Optional[str] = None,
        message: Optional[str] = None,
        resume_url: Optional[str] = None,
    ) -> dict:
        self.cursor.execute(
            """
            INSERT INTO careers_submissions (
                full_name, email, phone, position,
                experience, message, resume_url
            ) VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING *
            """,
            (full_name, email, phone, position, experience, message, resume_url),
        )
        result = self.cursor.fetchone()
        if not result:
            raise RuntimeError(f"DB insert returned no row | email={email}")
        return dict(result)

    def get_by_id(self, submission_id: int) -> Optional[dict]:
        self.cursor.execute(
            "SELECT * FROM careers_submissions WHERE id = %s",
            (submission_id,),
        )
        result = self.cursor.fetchone()
        return dict(result) if result else None

    def get_recent(self, limit: int = 50) -> List[dict]:
        self.cursor.execute(
            "SELECT * FROM careers_submissions ORDER BY created_at DESC LIMIT %s",
            (limit,),
        )
        rows = self.cursor.fetchall()
        return [dict(row) for row in rows] if rows else []

    def count_by_email_in_timeframe(self, email: str, minutes: int = 60) -> int:
        self.cursor.execute(
            """
            SELECT COUNT(*) as count FROM careers_submissions
            WHERE email = %s AND created_at > NOW() - make_interval(mins => %s)
            """,
            (email, minutes),
        )
        result = self.cursor.fetchone()
        return result["count"] if result else 0
