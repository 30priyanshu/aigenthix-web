from typing import List, Optional


class EnrollmentRepository:

    def __init__(self, cursor):
        self.cursor = cursor

    def create(
        self,
        *,
        first_name: str,
        last_name: str,
        email: str,
        phone_number: Optional[str],
        program_slug: str,
        program_title: str,
        request_type: str,
        message: str,
        terms_accepted: bool,
    ) -> dict:
        self.cursor.execute(
            """
            INSERT INTO enrollment_submissions (
                first_name, last_name, email, phone_number,
                program_slug, program_title, request_type, message, terms_accepted
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING *
            """,
            (
                first_name,
                last_name,
                email,
                phone_number,
                program_slug,
                program_title,
                request_type,
                message,
                terms_accepted,
            ),
        )
        result = self.cursor.fetchone()
        if not result:
            raise RuntimeError(f"DB insert returned no row | email={email}")
        return dict(result)

    def get_recent(self, limit: int = 50) -> List[dict]:
        self.cursor.execute(
            "SELECT * FROM enrollment_submissions ORDER BY created_at DESC LIMIT %s",
            (limit,),
        )
        rows = self.cursor.fetchall()
        return [dict(row) for row in rows] if rows else []

    def count_by_email_in_timeframe(self, email: str, minutes: int = 60) -> int:
        self.cursor.execute(
            """
            SELECT COUNT(*) as count FROM enrollment_submissions
            WHERE email = %s AND created_at > NOW() - INTERVAL '%s minutes'
            """,
            (email, minutes),
        )
        result = self.cursor.fetchone()
        return result["count"] if result else 0
