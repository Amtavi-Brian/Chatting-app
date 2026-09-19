from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.schemas.user import UserCreate, normalize_phone_number


def register_user(db: Session, user_in: UserCreate) -> User:
    user = User(
        phone_number=user_in.phone_number,
        username=user_in.username,
        email=user_in.email,
        hashed_password=hash_password(user_in.password),
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this phone number, username, or email already exists.",
        ) from exc
    db.refresh(user)
    return user


def authenticate_user(db: Session, phone_number: str, password: str) -> User | None:
    try:
        normalized = normalize_phone_number(phone_number)
    except ValueError:
        return None
    user = db.query(User).filter(User.phone_number == normalized).first()
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user


def create_token_for_user(user: User) -> str:
    return create_access_token(subject=str(user.id))
