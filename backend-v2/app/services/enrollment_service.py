from typing import List

from fastapi import HTTPException, status

from app.core.logging import get_logger
from app.repositories.enrollment_repository import EnrollmentRepository
from app.schemas.enrollment import EnrollmentSubmissionCreate, EnrollmentSubmissionResponse
from app.services.email_service import EmailService

logger = get_logger(__name__)


class EnrollmentService:

    def __init__(self, enrollment_repo: EnrollmentRepository, email_service: EmailService):
        self.enrollment_repo = enrollment_repo
        self.email_service = email_service

    def submit_enrollment_form(self, form_data: EnrollmentSubmissionCreate) -> EnrollmentSubmissionResponse:
        email = form_data.email.lower()

        try:
            count = self.enrollment_repo.count_by_email_in_timeframe(email=email, minutes=60)
            if count >= 3:
                logger.warning(f"Enrollment rate limit hit | email={email} | count={count}")
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Too many submissions. Please try again later.",
                )

            submission = self.enrollment_repo.create(
                first_name=form_data.firstName,
                last_name=form_data.lastName,
                email=email,
                phone_number=form_data.phoneNumber,
                program_slug=form_data.programSlug,
                program_title=form_data.programTitle,
                request_type=form_data.requestType,
                message=form_data.message,
                terms_accepted=form_data.termsAccepted,
            )

            submission_id = submission["id"]
            logger.info(
                f"Enrollment saved | id={submission_id} | email={email} | "
                f"program={form_data.programSlug} | request_type={form_data.requestType}"
            )

            email_sent = self.email_service.send_enrollment_notification(
                first_name=form_data.firstName,
                last_name=form_data.lastName,
                email=email,
                phone_number=form_data.phoneNumber,
                program_title=form_data.programTitle,
                request_type=form_data.requestType,
                message=form_data.message,
            )

            if not email_sent:
                logger.warning(f"Enrollment email notification failed | submission_id={submission_id}")

            return EnrollmentSubmissionResponse(**submission)

        except HTTPException:
            raise
        except Exception as exc:
            logger.error(f"Enrollment submission failed | email={email} | error={exc}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Unable to process your request. Please try again later.",
            ) from exc

    def get_recent_submissions(self, limit: int = 50) -> List[EnrollmentSubmissionResponse]:
        return [EnrollmentSubmissionResponse(**s) for s in self.enrollment_repo.get_recent(limit)]
