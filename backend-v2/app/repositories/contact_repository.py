from typing import Optional, List

from app.core.logging import get_logger

logger = get_logger(__name__)


class ContactRepository:

    def __init__(self, cursor):
        self.cursor = cursor

    def create(
        self,
        first_name: str,
        last_name: str,
        email: str,
        company_name: str,
        job_title: str,
        country: str,
        comments: str,
        phone_number: Optional[str] = None,
    ) -> dict:
        self.cursor.execute(
            """
            INSERT INTO contact_submissions (
                first_name, last_name, email, company_name,
                job_title, phone_number, country, comments
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING *
            """,
            (first_name, last_name, email, company_name, job_title, phone_number, country, comments),
        )
        result = self.cursor.fetchone()
        if not result:
            raise RuntimeError(f"DB insert returned no row | email={email}")
        return dict(result)

    def get_by_id(self, submission_id: int) -> Optional[dict]:
        self.cursor.execute(
            "SELECT * FROM contact_submissions WHERE id = %s",
            (submission_id,),
        )
        result = self.cursor.fetchone()
        return dict(result) if result else None

    def get_recent(self, limit: int = 50) -> List[dict]:
        self.cursor.execute(
            "SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT %s",
            (limit,),
        )
        rows = self.cursor.fetchall()
        return [dict(row) for row in rows] if rows else []

    def count_by_email_in_timeframe(self, email: str, minutes: int = 60) -> int:
        self.cursor.execute(
            """
            SELECT COUNT(*) as count FROM contact_submissions
            WHERE email = %s AND created_at > NOW() - INTERVAL '%s minutes'
            """,
            (email, minutes),
        )
        result = self.cursor.fetchone()
        return result["count"] if result else 0
