from fastapi import Depends

from app.core.database import get_db
from app.repositories.careers_repository import CareersRepository
from app.services.careers_service import CareersService
from app.services.email_service import EmailService

_email_service = EmailService()


def get_careers_service(cursor=Depends(get_db)) -> CareersService:
    return CareersService(
        careers_repo=CareersRepository(cursor),
        email_service=_email_service,
    )
