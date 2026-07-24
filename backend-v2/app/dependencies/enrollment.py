from fastapi import Depends

from app.core.database import get_db
from app.repositories.enrollment_repository import EnrollmentRepository
from app.services.email_service import EmailService
from app.services.enrollment_service import EnrollmentService

_email_service = EmailService()


def get_enrollment_service(cursor=Depends(get_db)) -> EnrollmentService:
    return EnrollmentService(
        enrollment_repo=EnrollmentRepository(cursor),
        email_service=_email_service,
    )
