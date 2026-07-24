"""
Authentication middleware and dependencies for FastAPI.
"""
from typing import Optional, List
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.security import security_service
from app.core.logging import get_logger

logger = get_logger(__name__)

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """
    Verify JWT token and return current user payload.
    Use as dependency in protected routes.
    
    Args:
        credentials: Bearer token from Authorization header
        
    Returns:
        Token payload with user info
        
    Raises:
        HTTPException: If token is invalid
    """
    token = credentials.credentials
    payload = security_service.decode_access_token(token)
    
    if not payload.get("sub"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    return payload


async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(
        HTTPBearer(auto_error=False)
    )
) -> Optional[dict]:
    """
    Optional authentication - returns None if no token provided.
    
    Args:
        credentials: Optional Bearer token
        
    Returns:
        Token payload or None
    """
    if not credentials:
        return None
    
    try:
        return await get_current_user(credentials)
    except HTTPException:
        return None


class RequireRole:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles
        
    def __call__(self, user: dict = Depends(get_current_user)) -> dict:
        user_role = user.get("role", "editor")
        if user_role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted. Requires one of: {', '.join(self.allowed_roles)}"
            )
        return user
