from typing import Optional
from datetime import datetime
import re
from pydantic import BaseModel, EmailStr, Field, field_validator


def sanitize_html(text: str) -> str:
    return re.sub(r'<[^>]+>', '', text)


class CareersSubmissionBase(BaseModel):
    fullName: str = Field(..., min_length=1, max_length=200)
    email: EmailStr = Field(...)
    phone: Optional[str] = Field(None, max_length=20)
    position: str = Field(..., min_length=1, max_length=200)
    experience: Optional[str] = Field(None, max_length=100)
    message: Optional[str] = Field(None, max_length=1000)

    @field_validator("fullName", "position", mode="before")
    @classmethod
    def strip_and_validate(cls, v: str) -> str:
        if not isinstance(v, str):
            raise ValueError("Must be a string")
        stripped = v.strip()
        if not stripped:
            raise ValueError("Field cannot be empty")
        return stripped

    @field_validator("experience", "message", mode="before")
    @classmethod
    def sanitize_optional(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        if not isinstance(v, str):
            raise ValueError("Must be a string")
        clean = sanitize_html(v)
        stripped = clean.strip()
        return stripped if stripped else None

    @field_validator("phone", mode="before")
    @classmethod
    def validate_phone(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        stripped = v.strip()
        if not stripped:
            return None
        if not re.match(r"^\+?[0-9\s\-()]{7,20}$", stripped):
            raise ValueError("Invalid phone number format")
        return stripped


class CareersSubmissionCreate(CareersSubmissionBase):
    resumeUrl: Optional[str] = Field(None, max_length=1000)
    resumeFilename: Optional[str] = Field(None, max_length=255)


class CareersSubmissionResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: Optional[str]
    position: str
    experience: Optional[str]
    message: Optional[str]
    resume_url: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
