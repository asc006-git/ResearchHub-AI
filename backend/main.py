from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import insert, select


from database import database, engine, Base
import models
from routers.auth import router as auth_router
from routers.chat import router as chat_router
from routers.workspace import router as workspace_router
from routers.papers import router as papers_router
from routers.users import router as users_router
from routers.research import router as research_router
from routers.literature import router as literature_router
from security import get_current_user

# Initialize the application
app = FastAPI(title="ResearchHub AI API", version="1.0.0")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ... (startup/shutdown events)

@app.on_event("startup")
async def startup():
    try:
        await database.connect()
    except Exception as e:
        print(f"Warning: Failed to connect to db on startup: {e}")

    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"Warning: Failed to create database tables: {e}")


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()


# Include routers
app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(workspace_router)
app.include_router(papers_router)
app.include_router(users_router)
app.include_router(research_router)
app.include_router(literature_router)


@app.get("/")
def read_root():
    return {"message": "Welcome to ResearchHub AI API"}
