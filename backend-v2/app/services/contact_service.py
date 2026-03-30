from typing import Optional, List
from fastapi import HTTPException, status

from app.core.logging import get_logger
from app.repositories.contact_repository import ContactRepository
from app.schemas.contact import ContactSubmissionCreate, ContactSubmissionResponse
from app.services.email_service import EmailService

logger = get_logger(__name__)


class ContactService:

    def __init__(self, contact_repo: ContactRepository, email_service: EmailService):
        self.contact_repo = contact_repo
        self.email_service = email_service

    def submit_contact_form(self, form_data: ContactSubmissionCreate) -> ContactSubmissionResponse:
        email = form_data.companyEmail.lower()

        try:
            count = self.contact_repo.count_by_email_in_timeframe(email=email, minutes=60)
            if count >= 3:
                logger.warning(f"Rate limit hit | email={email} | count={count}")
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Too many submissions. Please try again later.",
                )

            submission = self.contact_repo.create(
                first_name=form_data.firstName,
                last_name=form_data.lastName,
                email=email,
                company_name=form_data.companyName,
                job_title=form_data.jobTitle,
                country=form_data.country,
                comments=form_data.comments,
                phone_number=form_data.phoneNumber,
            )

            submission_id = submission["id"]
            logger.info(
                f"Contact saved | id={submission_id} | email={email} | "
                f"company={form_data.companyName} | country={form_data.country}"
            )

            email_sent = self.email_service.send_contact_notification(
                first_name=form_data.firstName,
                last_name=form_data.lastName,
                email=email,
                company_name=form_data.companyName,
                job_title=form_data.jobTitle,
                country=form_data.country,
                comments=form_data.comments,
                phone_number=form_data.phoneNumber,
            )

            if not email_sent:
                logger.warning(f"Email notification failed | submission_id={submission_id}")

            return ContactSubmissionResponse(**submission)

        except HTTPException:
            raise
        except Exception as exc:
            logger.error(f"Contact submission failed | email={email} | error={exc}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Unable to process your request. Please try again later.",
            ) from exc

    def get_submission_by_id(self, submission_id: int) -> Optional[ContactSubmissionResponse]:
        submission = self.contact_repo.get_by_id(submission_id)
        return ContactSubmissionResponse(**submission) if submission else None

    def get_recent_submissions(self, limit: int = 50) -> List[ContactSubmissionResponse]:
        return [ContactSubmissionResponse(**s) for s in self.contact_repo.get_recent(limit)]
