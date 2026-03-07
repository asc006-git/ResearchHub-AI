from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, DateTime, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)

    # Security Questions for Forgot Password
    security_question = Column(Text, nullable=True)
    security_answer_hash = Column(Text, nullable=True)

    # Profile
    full_name = Column(String, nullable=True)
    institution = Column(String, nullable=True)
    research_field = Column(String, nullable=True)
    
    # AI Settings
    llm_model = Column(String, default="llama-3.3-70b-versatile")
    temperature = Column(Float, default=0.7)
    max_tokens = Column(Integer, default=1024)
    
    # Privacy & Account
    enable_history = Column(Boolean, default=True)
    enable_analytics = Column(Boolean, default=True)

    # Relationships
    papers = relationship("Paper", back_populates="owner")
    workspaces = relationship("Workspace", back_populates="owner")
    activities = relationship("ActivityLog", back_populates="user")


class Paper(Base):
    __tablename__ = "papers"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    authors = Column(String)
    abstract = Column(Text)
    year = Column(Integer)
    source_url = Column(String)
    published_date = Column(String)
    imported_at = Column(DateTime(timezone=True), server_default=func.now())

    owner_id = Column(Integer, ForeignKey("users.id"))
    workspace_id = Column(Integer, ForeignKey("workspaces.id"), nullable=True)

    owner = relationship("User", back_populates="papers")
    workspace = relationship("Workspace", back_populates="papers")


class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="workspaces")
    papers = relationship("Paper", back_populates="workspace", cascade="all, delete-orphan")
    conversations = relationship("Conversation", back_populates="workspace", cascade="all, delete-orphan")
    notes = relationship("ResearchNote", back_populates="workspace", cascade="all, delete-orphan")


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    user_message = Column(Text, nullable=False)
    ai_response = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    workspace_id = Column(Integer, ForeignKey("workspaces.id"))

    workspace = relationship("Workspace", back_populates="conversations")


class ResearchNote(Base):
    __tablename__ = "research_notes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    is_ai_generated = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    workspace_id = Column(Integer, ForeignKey("workspaces.id"))
    workspace = relationship("Workspace", back_populates="notes")


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    action = Column(String, nullable=False)  # e.g., "PAPER_IMPORTED", "WORKSPACE_CREATED"
    details = Column(String)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="activities")