from pydantic import BaseModel, EmailStr
from typing import Optional


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    is_admin: bool = False


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    is_active: bool
    is_admin: bool

    class Config:
        orm_mode = True


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
    published_date: str


class PaperResponse(BaseModel):
    id: int
    title: str
    authors: str
    abstract: str
    published_date: str

    class Config:
        orm_mode = True

# -----------------------
# Workspace Schemas
# -----------------------

class WorkspaceCreate(BaseModel):
    name: str


class WorkspaceResponse(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True


# -----------------------
# Chat Schema
# -----------------------

class ChatMessage(BaseModel):
    content: str