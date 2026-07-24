from fastapi import APIRouter, Depends, Request

from app.core.config import settings
from app.dependencies.enrollment import get_enrollment_service
from app.middleware.rate_limit import limiter
from app.schemas.enrollment import EnrollmentSubmissionCreate
from app.schemas.responses import SuccessResponse
from app.services.enrollment_service import EnrollmentService

router = APIRouter(prefix="/api/enrollments", tags=["enrollments"])


@router.post("", response_model=SuccessResponse)
@limiter.limit(f"{settings.CONTACT_RATE_LIMIT_PER_MINUTE}/minute")
async def submit_enrollment(
    request: Request,
    form_data: EnrollmentSubmissionCreate,
    enrollment_service: EnrollmentService = Depends(get_enrollment_service),
):
    enrollment_service.submit_enrollment_form(form_data)
    return SuccessResponse(message="Enrollment submitted successfully")
