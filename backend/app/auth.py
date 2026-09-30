import os

from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, Request, status
from jose import JWTError, jwt

from sqlalchemy.orm import Session

from passlib.context import CryptContext

from .database import get_db
from .models import User


SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY",
    "CHANGE_THIS_IN_PRODUCTION"
)

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 3

REFRESH_TOKEN_EXPIRE_DAYS = 7


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def hash_password(password: str) -> str:

    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:

    return pwd_context.verify(
        plain_password,
        hashed_password
    )


def create_access_token(
    user_id: int
) -> str:

    expire = (
        datetime.now(timezone.utc)
        + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    payload = {
        "sub": str(user_id),
        "type": "access",
        "exp": expire
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def create_refresh_token(
    user_id: int
) -> str:

    expire = (
        datetime.now(timezone.utc)
        + timedelta(
            days=REFRESH_TOKEN_EXPIRE_DAYS
        )
    )

    payload = {
        "sub": str(user_id),
        "type": "refresh",
        "exp": expire
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def get_current_user(
    request: Request,
    db: Session = Depends(get_db)
) -> User:

    token = request.cookies.get(
        "access_token"
    )

    if not token:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("sub")
        token_type = payload.get("type")

        if (
            not user_id
            or token_type != "access"
        ):
            raise HTTPException(
                status_code=401,
                detail="Invalid access token"
            )

    except JWTError:

        raise HTTPException(
            status_code=401,
            detail="Invalid or expired access token"
        )

    user = db.query(User).filter(
        User.id == int(user_id)
    ).first()

    if not user or not user.is_active:

        raise HTTPException(
            status_code=401,
            detail="User not found or inactive"
        )

    return user