from typing import Optional
from fastapi import HTTPException, status

from app.core.logging import get_logger
from app.repositories.careers_repository import CareersRepository
from app.schemas.careers import CareersSubmissionCreate, CareersSubmissionResponse
from app.services.email_service import EmailService

logger = get_logger(__name__)


class CareersService:

    def __init__(self, careers_repo: CareersRepository, email_service: EmailService):
        self.careers_repo = careers_repo
        self.email_service = email_service

    def submit_careers_form(self, form_data: CareersSubmissionCreate) -> CareersSubmissionResponse:
        email = form_data.email.lower()

        try:
            count = self.careers_repo.count_by_email_in_timeframe(email=email, minutes=60)
            if count >= 3:
                logger.warning(f"Rate limit hit | email={email} | count={count}")
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Too many submissions. Please try again later.",
                )

            submission = self.careers_repo.create(
                full_name=form_data.fullName,
                email=email,
                phone=form_data.phone,
                position=form_data.position,
                experience=form_data.experience,
                message=form_data.message,
                resume_url=form_data.resumeUrl,
            )

            submission_id = submission["id"]
            logger.info(
                f"Careers submission saved | id={submission_id} | email={email} | "
                f"position={form_data.position}"
            )

            email_sent = self.email_service.send_careers_notification(
                full_name=form_data.fullName,
                email=email,
                phone=form_data.phone,
                position=form_data.position,
                experience=form_data.experience,
                message=form_data.message,
                resume_url=form_data.resumeUrl,
                resume_filename=form_data.resumeFilename,
            )

            if not email_sent:
                logger.warning(f"Email notification failed | submission_id={submission_id}")

            return CareersSubmissionResponse(**submission)

        except HTTPException:
            raise
        except Exception as exc:
            logger.error(f"Careers submission failed | email={email} | error={exc}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Unable to process your request. Please try again later.",
            ) from exc
