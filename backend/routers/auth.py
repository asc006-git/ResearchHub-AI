from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from backend.schemas import UserCreate, UserResponse, Token, TokenData
from backend.database import database
from backend.models import User
from backend.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user,
    SECRET_KEY,
    ALGORITHM,
)
from jose import JWTError, jwt

router = APIRouter(prefix="/auth", tags=["auth"])



# -----------------------------
# Utility: Get user by email
# -----------------------------
async def get_user_by_email(email: str):
    query = User.__table__.select().where(User.email == email)
    return await database.fetch_one(query)


# -----------------------------
# Register Endpoint
# -----------------------------
@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate):

    db_user = await get_user_by_email(user.email)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_password = get_password_hash(user.password)

    query = User.__table__.insert().values(
        email=user.email,
        hashed_password=hashed_password,
        is_active=True,
        is_admin=user.is_admin
    )

    last_record_id = await database.execute(query)

    return UserResponse(
        id=last_record_id,
        email=user.email,
        is_active=True,
        is_admin=user.is_admin
    )


# -----------------------------
# Login Endpoint
# -----------------------------
@router.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):

    user = await get_user_by_email(form_data.username)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": user["email"]})

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# -----------------------------
# Protected Route
# -----------------------------
@router.get("/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user