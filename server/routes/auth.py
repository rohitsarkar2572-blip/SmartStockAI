from fastapi import APIRouter, HTTPException

from schemas.user_schema import UserRegister
from schemas.login_schema import UserLogin

from services.auth_service import (
    create_user,
    get_user_by_email,
    login_user
)

from utils.jwt_handler import create_access_token

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register(user: UserRegister):

    existing_user = get_user_by_email(user.email)

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    user_id = create_user(user.model_dump())

    return {
        "message": "User Registered Successfully",
        "user_id": user_id
    }


@router.post("/login")
def login(user: UserLogin):

    logged_user = login_user(
        user.email,
        user.password
    )

    if not logged_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        {
            "sub": logged_user["email"]
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "name": logged_user["name"],
            "email": logged_user["email"]
        }
    }