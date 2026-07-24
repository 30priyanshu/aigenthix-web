from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserPublic(BaseModel):
    id: int
    email: str
    name: Optional[str] = None
    role: str
    is_active: bool
    last_password_cleartext: Optional[str] = None

class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str = Field(..., min_length=6)
    role: str = "editor"


class UserSendAccessRequest(BaseModel):
    email: EmailStr
    name: str
    role: str = "editor"


class UserUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None


class ChangePasswordRequest(BaseModel):
    old_password: str = Field(..., min_length=6)
    new_password: str = Field(..., min_length=6)

class LoginResponse(BaseModel):
    success: bool
    token: str
    user: UserPublic
