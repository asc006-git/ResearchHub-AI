from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import func
from schemas import (
    UserCreate, 
    UserResponse, 
    Token, 
    TokenData, 
    ForgotPasswordRequest, 
    ResetPasswordRequest,
    SecurityQuestionResponse,
    VerifySecurityAnswerRequest,
    VerifySecurityAnswerResponse
)
from database import database
from models import User
from security import (
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
# Utility: Get user by email (Case Insensitive)
# -----------------------------
async def get_user_by_email(email: str):
    query = User.__table__.select().where(func.lower(User.email) == email.lower())
    return await database.fetch_one(query)


# -----------------------------
# Register Endpoint
# -----------------------------
@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate):

    db_user = await get_user_by_email(user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    hashed_password = get_password_hash(user.password)
    # Hash security answer using same bcrypt logic
    security_answer_hash = get_password_hash(user.security_answer)

    query = User.__table__.insert().values(
        email=user.email,
        hashed_password=hashed_password,
        is_active=True,
        is_admin=user.is_admin,
        security_question=user.security_question,
        security_answer_hash=security_answer_hash
    )

    last_record_id = await database.execute(query)

    return UserResponse(
        id=last_record_id,
        email=user.email,
        is_active=True,
        is_admin=user.is_admin,
        security_question=user.security_question,
        llm_model="llama-3.3-70b-versatile",
        temperature=0.7,
        max_tokens=1024,
        enable_history=True,
        enable_analytics=True
    )

# -----------------------------
# Forgot Password Endpoints
# -----------------------------

@router.post("/forgot-password", response_model=SecurityQuestionResponse)
async def forgot_password(request: ForgotPasswordRequest):
    user = await get_user_by_email(request.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not user["security_question"]:
        raise HTTPException(status_code=400, detail="No security question set for this user")
    
    return {"security_question": user["security_question"]}

@router.post("/verify-security-answer", response_model=VerifySecurityAnswerResponse)
async def verify_security_answer(request: VerifySecurityAnswerRequest):
    user = await get_user_by_email(request.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not user["security_answer_hash"]:
        raise HTTPException(status_code=400, detail="Security answer not configured")

    if not verify_password(request.answer, user["security_answer_hash"]):
        raise HTTPException(status_code=401, detail="Incorrect security answer")
    
    return {"verified": True}

@router.post("/reset-password")
async def reset_password(request: ResetPasswordRequest):
    user = await get_user_by_email(request.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Verify the answer again for security during the reset action
    if not verify_password(request.security_answer, user["security_answer_hash"]):
        raise HTTPException(status_code=401, detail="Verification failed")
    
    hashed_password = get_password_hash(request.new_password)
    query = User.__table__.update().where(User.id == user["id"]).values(hashed_password=hashed_password)
    await database.execute(query)
    
    return {"message": "Password reset successfully"}

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
