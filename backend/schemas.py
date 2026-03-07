from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    security_question: str
    security_answer: str
    is_admin: bool = False


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    is_active: bool
    is_admin: bool
    security_question: Optional[str] = None
    
    # Profile
    full_name: Optional[str] = None
    institution: Optional[str] = None
    research_field: Optional[str] = None
    # AI Settings
    llm_model: Optional[str] = "llama3-70b"
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 1024

# Privacy
    enable_history: Optional[bool] = True
    enable_analytics: Optional[bool] = True

    class Config:
        from_attributes = True

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    institution: Optional[str] = None
    research_field: Optional[str] = None

class UserSettingsUpdate(BaseModel):
    llm_model: Optional[str] = None
    temperature: Optional[float] = None
    max_tokens: Optional[int] = None
    enable_history: Optional[bool] = None
    enable_analytics: Optional[bool] = None


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# -----------------------
# Paper Schemas
# -----------------------

class PaperCreate(BaseModel):
    title: str
    authors: str
    abstract: str
    published_date: Optional[str] = None
    year: Optional[int] = None
    source_url: str
    workspace_id: Optional[int] = None


class PaperResponse(BaseModel):
    id: int
    title: str
    authors: str
    abstract: str
    published_date: Optional[str] = None
    year: Optional[int] = None
    source_url: Optional[str] = None
    workspace_id: Optional[int] = None
    imported_at: datetime


    class Config:
        from_attributes = True


# -----------------------
# Workspace Schemas
# -----------------------

class WorkspaceCreate(BaseModel):
    name: str
    description: Optional[str] = None

class WorkspaceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class WorkspaceResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# -----------------------
# Activity Log Schemas
# -----------------------

class ActivityLogResponse(BaseModel):
    id: int
    action: str
    details: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True


# -----------------------
# Milestone 5: Research Features
# -----------------------

class ResearchNoteCreate(BaseModel):
    title: str
    content: str
    is_ai_generated: bool = False

class ResearchNoteResponse(BaseModel):
    id: int
    title: str
    content: str
    is_ai_generated: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    workspace_id: int

    class Config:
        from_attributes = True

class SummaryRequest(BaseModel):
    paper_id: int

class TimelineEvent(BaseModel):
    date: str
    title: str
    description: str
    type: str # e.g., "PAPER_PUBLISHED", "PAPER_IMPORTED", "NOTE_CREATED"

class TimelineResponse(BaseModel):
    events: List[TimelineEvent]


# -----------------------
# Chat Schema
# -----------------------

class ChatMessage(BaseModel):
    content: str
    workspace_id: Optional[int] = None

# -----------------------
# Auth / Password Reset
# -----------------------

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class SecurityQuestionResponse(BaseModel):
    security_question: str

class VerifySecurityAnswerRequest(BaseModel):
    email: EmailStr
    answer: str

class VerifySecurityAnswerResponse(BaseModel):
    verified: bool

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    security_answer: str  # Included for extra security during reset
    new_password: str
