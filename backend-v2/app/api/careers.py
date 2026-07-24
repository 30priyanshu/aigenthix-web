import os

from fastapi import APIRouter, Request, Depends, Form, File, UploadFile, HTTPException, status
from typing import Optional

from app.core.config import settings
from app.middleware.rate_limit import limiter
from app.core.logging import get_logger
from app.schemas.responses import SuccessResponse
from app.schemas.careers import CareersSubmissionCreate
from app.services.careers_service import CareersService
from app.services.upload_service import upload_service
from app.dependencies.careers import get_careers_service

router = APIRouter(prefix="/api/careers", tags=["careers"])
logger = get_logger(__name__)


@router.post("", response_model=SuccessResponse)
@limiter.limit(f"{settings.CONTACT_RATE_LIMIT_PER_MINUTE}/minute")
async def submit_careers(
    request: Request,
    fullName: str = Form(...),
    email: str = Form(...),
    phone: Optional[str] = Form(None),
    position: str = Form(...),
    experience: Optional[str] = Form(None),
    message: Optional[str] = Form(None),
    resume: Optional[UploadFile] = File(None),
    careers_service: CareersService = Depends(get_careers_service),
):
    resume_url = None
    resume_filename = None

    if resume and resume.filename:
        resume_filename = os.path.basename(resume.filename).replace("..", "").replace("/", "").replace("\\", "")

        try:
            resume_url = await upload_service.upload_document(resume)
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Resume upload failed | email={email} | error={e}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to upload resume. Please try again.",
            ) from e

    form_data = CareersSubmissionCreate(
        fullName=fullName,
        email=email,
        phone=phone,
        position=position,
        experience=experience,
        message=message,
        resumeUrl=resume_url,
        resumeFilename=resume_filename,
    )

    careers_service.submit_careers_form(form_data)
    return SuccessResponse(message="Career application submitted successfully")
