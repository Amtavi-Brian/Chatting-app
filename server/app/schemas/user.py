import re
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, field_validator

# With a leading "+" the number must follow E.164 (country code never starts
# with 0). Without "+", it's treated as a national number, which commonly
# starts with a trunk-prefix "0" (e.g. "0712345678", "07123456789").
PHONE_REGEX = re.compile(r"^(\+[1-9]\d{7,14}|[0-9]\d{7,14})$")


def normalize_phone_number(value: str) -> str:
    cleaned = re.sub(r"[\s\-().]", "", value or "")
    if not PHONE_REGEX.match(cleaned):
        raise ValueError(
            "Enter a valid phone number, e.g. +15551234567 or 0712345678 "
            "(8-15 digits, optional leading +)."
        )
    return cleaned


class UserBase(BaseModel):
    phone_number: str
    username: str | None = None
    email: EmailStr | None = None

    @field_validator("phone_number")
    @classmethod
    def validate_phone_number(cls, value: str) -> str:
        return normalize_phone_number(value)


class UserCreate(UserBase):
    password: str


class UserRead(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    is_active: bool
    is_online: bool
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: str | None = None
