from fastapi import Depends

from app.core.database import get_db
from app.repositories.contact_repository import ContactRepository
from app.services.contact_service import ContactService
from app.services.email_service import EmailService

_email_service = EmailService()


def get_contact_service(cursor=Depends(get_db)) -> ContactService:
    return ContactService(
        contact_repo=ContactRepository(cursor),
        email_service=_email_service,
    )
