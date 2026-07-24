from datetime import datetime
from typing import Literal, Optional
import re

from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator


def sanitize_html(text: str) -> str:
    return re.sub(r"<[^>]+>", "", text)


class EnrollmentSubmissionBase(BaseModel):
    firstName: str = Field(..., min_length=1, max_length=100)
    lastName: str = Field(..., min_length=1, max_length=100)
    email: EmailStr = Field(...)
    phoneNumber: Optional[str] = Field(None, max_length=20)
    programSlug: str = Field(..., min_length=1, max_length=120)
    programTitle: str = Field(..., min_length=1, max_length=200)
    requestType: Literal["enroll", "download"]
    message: str = Field(..., min_length=1, max_length=1000)
    termsAccepted: bool = Field(...)

    @field_validator("firstName", "lastName", "programSlug", "programTitle", mode="before")
    @classmethod
    def strip_and_validate(cls, v: str) -> str:
        if not isinstance(v, str):
            raise ValueError("Must be a string")
        stripped = v.strip()
        if not stripped:
            raise ValueError("Field cannot be empty")
        return stripped

    @field_validator("programSlug", mode="after")
    @classmethod
    def validate_program_slug(cls, v: str) -> str:
        if not re.match(r"^[a-z0-9-]{1,120}$", v):
            raise ValueError("Invalid program slug")
        return v

    @field_validator("message", mode="before")
    @classmethod
    def sanitize_message(cls, v: str) -> str:
        if not isinstance(v, str):
            raise ValueError("Must be a string")
        clean = sanitize_html(v)
        stripped = clean.strip()
        if not stripped:
            raise ValueError("Field cannot be empty")
        return stripped

    @field_validator("phoneNumber", mode="before")
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

    @model_validator(mode="after")
    def validate_terms(self) -> "EnrollmentSubmissionBase":
        if self.termsAccepted is not True:
            raise ValueError("Terms must be accepted")
        return self


class EnrollmentSubmissionCreate(EnrollmentSubmissionBase):
    pass


class EnrollmentSubmissionResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    phone_number: Optional[str]
    program_slug: str
    program_title: str
    request_type: str
    message: str
    terms_accepted: bool
    created_at: datetime

    class Config:
        from_attributes = True
