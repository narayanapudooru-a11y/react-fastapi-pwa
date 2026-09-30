from fastapi import APIRouter, Depends, HTTPException, Response

from sqlalchemy.orm import Session

from ..auth import (
    create_access_token,
    create_refresh_token,
    verify_password,
    get_current_user
)

from ..database import get_db

from ..models import User

from ..schemas import (
    LoginRequest,
    UserResponse
)

from jose import JWTError, jwt

from ..auth import (
    SECRET_KEY,
    ALGORITHM
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/login")
def login(
    login_data: LoginRequest,
    response: Response,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.username == login_data.username
    ).first()

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    if not verify_password(
        login_data.password,
        user.password_hash
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    if not user.is_active:

        raise HTTPException(
            status_code=403,
            detail="User is inactive"
        )

    access_token = create_access_token(
        user.id
    )

    refresh_token = create_refresh_token(
        user.id
    )

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,       # True in HTTPS production
        samesite="lax",
        max_age=15 * 60,
        path="/"
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,       # True in HTTPS production
        samesite="lax",
        max_age=7 * 24 * 60 * 60,
        path="/api/auth"
    )

    return {
        "message": "Login successful"
    }


@router.post("/refresh")
def refresh_token(
    response: Response,
    request_user=Depends(get_current_user)
):

    access_token = create_access_token(
        request_user.id
    )

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=15 * 60,
        path="/"
    )

    return {
        "message": "Token refreshed"
    }


@router.post("/logout")
def logout(response: Response):

    response.delete_cookie(
        key="access_token",
        path="/"
    )

    response.delete_cookie(
        key="refresh_token",
        path="/api/auth"
    )

    return {
        "message": "Logout successful"
    }


@router.get(
    "/me",
    response_model=UserResponse
)
def get_me(
    current_user: User = Depends(
        get_current_user
    )
):

    return current_user