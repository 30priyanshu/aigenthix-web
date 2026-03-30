from typing import Optional
import hashlib
from fastapi import HTTPException, status

from app.core.security import security_service
from app.core.logging import get_logger
from app.repositories.user_repository import UserRepository
from app.schemas.auth import LoginRequest, LoginResponse, UserPublic

logger = get_logger(__name__)


def mask_pii(email: str) -> str:
    return hashlib.sha256(email.encode()).hexdigest()[:16]


class AuthService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo
    
    def authenticate_user(self, login_data: LoginRequest) -> LoginResponse:
        user = self.user_repo.get_by_email(login_data.email)
        
        if not user:
            logger.warning(f"Login attempt for non-existent user | hash={mask_pii(login_data.email)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        password_hash = user.get("password_hash") or user.get("password", "")
        
        if not security_service.verify_password(login_data.password, password_hash):
            logger.warning(f"Failed login attempt | hash={mask_pii(login_data.email)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        token = security_service.create_access_token({
            "sub": str(user["id"]),
            "email": user["email"]
        })
        
        logger.info(f"Successful login | hash={mask_pii(login_data.email)}")
        
        return LoginResponse(
            success=True,
            token=token,
            user=UserPublic(
                id=user["id"],
                email=user["email"],
                name=user["name"]
            )
        )
    
    def verify_token(self, token: str) -> dict:
        return security_service.decode_access_token(token)
