from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from psycopg2.extensions import cursor as PgCursor

from app.core.database import get_db
from app.core.security import security_service
from app.middleware.auth import RequireRole
from app.repositories.user_repository import UserRepository
from app.schemas.auth import UserPublic, UserCreate, UserUpdate
from app.schemas.responses import SuccessResponse

router = APIRouter(prefix="/api/admin/users", tags=["users"])

# Only super admins can manage users
require_super_admin = RequireRole(["super_admin"])


@router.get("", response_model=SuccessResponse[List[UserPublic]])
def list_users(
    cursor: PgCursor = Depends(get_db),
    current_user: dict = Depends(require_super_admin)
):
    user_repo = UserRepository(cursor)
    users = user_repo.get_all()
    return SuccessResponse(data=users)


@router.post("", response_model=SuccessResponse[dict])
def create_user(
    user_data: UserCreate,
    cursor: PgCursor = Depends(get_db),
    current_user: dict = Depends(require_super_admin)
):
    user_repo = UserRepository(cursor)
    
    # Check if user already exists
    existing = user_repo.get_by_email(user_data.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
        
    password_hash = security_service.hash_password(user_data.password)
    user_id = user_repo.create(
        email=user_data.email,
        name=user_data.name,
        password_hash=password_hash,
        role=user_data.role
    )
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )
        
    return SuccessResponse(data={"id": user_id}, message="User created successfully")


import secrets
from app.schemas.auth import UserSendAccessRequest
from app.services.email_service import email_service

@router.post("/send-access", response_model=SuccessResponse[dict])
def send_access(
    request: UserSendAccessRequest,
    cursor: PgCursor = Depends(get_db),
    current_user: dict = Depends(require_super_admin)
):
    user_repo = UserRepository(cursor)
    
    # Check if user already exists
    if user_repo.get_by_email(request.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
        
    temp_password = secrets.token_urlsafe(10)
    password_hash = security_service.hash_password(temp_password)
    
    user_id = user_repo.create(
        email=request.email,
        name=request.name,
        password_hash=password_hash,
        role=request.role
    )
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )
        
    # Send email
    email_sent = email_service.send_access_email(
        email=request.email,
        name=request.name,
        role=request.role,
        temp_password=temp_password
    )
    
    msg = "Access granted and email sent successfully" if email_sent else "User created, but failed to send email. Check logs."
    return SuccessResponse(data={"id": user_id}, message=msg)


@router.put("/{user_id}", response_model=SuccessResponse[dict])
def update_user(
    user_id: int,
    user_data: UserUpdate,
    cursor: PgCursor = Depends(get_db),
    current_user: dict = Depends(require_super_admin)
):
    user_repo = UserRepository(cursor)
    
    # Check if user exists
    existing = user_repo.get_by_id(user_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    updated = user_repo.update(
        user_id=user_id,
        name=user_data.name,
        role=user_data.role,
        is_active=user_data.is_active
    )
    
    if not updated:
        # Might be no changes, but we consider it a success
        pass
        
    return SuccessResponse(data={"id": user_id}, message="User updated successfully")


@router.delete("/{user_id}", response_model=SuccessResponse[dict])
def delete_user(
    user_id: int,
    cursor: PgCursor = Depends(get_db),
    current_user: dict = Depends(require_super_admin)
):
    user_repo = UserRepository(cursor)
    
    # Cannot delete yourself
    if str(user_id) == str(current_user.get("sub")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account"
        )
        
    existing = user_repo.get_by_id(user_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    deleted = user_repo.delete(user_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete user"
        )
        
    return SuccessResponse(data={"id": user_id}, message="User deleted successfully")
