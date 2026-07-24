"""
Authentication API routes.
"""
from fastapi import APIRouter, Depends, HTTPException, Request, status

from app.core.database import get_db
from app.repositories.user_repository import UserRepository
from app.services.auth_service import AuthService
from app.schemas.auth import LoginRequest, LoginResponse
from app.middleware.rate_limit import limiter
from app.core.config import settings

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
@limiter.limit(f"{settings.AUTH_RATE_LIMIT_PER_MINUTE}/minute")
def login(
    request: Request,
    login_data: LoginRequest,
    cursor = Depends(get_db)
):
    """
    Authenticate user and return JWT token.
    Rate limited to prevent brute force attacks.
    """
    user_repo = UserRepository(cursor)
    auth_service = AuthService(user_repo)
    
    return auth_service.authenticate_user(login_data)


from app.middleware.auth import get_current_user
from app.schemas.auth import ChangePasswordRequest
from app.schemas.responses import SuccessResponse
from app.core.security import security_service

@router.post("/change-password", response_model=SuccessResponse[dict])
def change_password(
    request_data: ChangePasswordRequest,
    current_user: dict = Depends(get_current_user),
    cursor = Depends(get_db)
):
    user_repo = UserRepository(cursor)
    user_id = int(current_user["sub"])
    
    user = user_repo.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
    # Verify old password
    if not security_service.verify_password(request_data.old_password, user["password_hash"]):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect old password")
        
    # Hash and save new password
    new_hash = security_service.hash_password(request_data.new_password)
    user_repo.update_password(user_id, new_hash, request_data.new_password)
    
    return SuccessResponse(data={"id": user_id}, message="Password updated successfully")
