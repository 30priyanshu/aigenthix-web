"""
Authentication API routes.
"""
from fastapi import APIRouter, Depends, HTTPException, Request

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

