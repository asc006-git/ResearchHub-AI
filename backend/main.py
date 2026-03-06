from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import insert, select
import feedparser #edit
import requests #edit

from backend.database import database, engine, Base
from backend import models
from backend.routers.auth import router as auth_router
from backend.routers.chat import router as chat_router
from backend.models import Paper
from backend.schemas import PaperCreate, PaperResponse
from backend.security import get_current_user

# Initialize the application
app = FastAPI(title="ResearchHub AI API", version="1.0.0")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event
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


# Include only auth router
app.include_router(auth_router)
app.include_router(chat_router)


@app.get("/")
def read_root():
    return {"message": "Welcome to ResearchHub AI API"}


@app.get("/papers/search")
async def search_papers(query: str, current_user=Depends(get_current_user)):

    url = "https://export.arxiv.org/api/query"

    params = {
        "search_query": f"all:{query}",
        "start": 0,
        "max_results": 5
    }

    headers = {
        "User-Agent": "ResearchHub-AI"
    }

    response = requests.get(url, params=params, headers=headers)

    feed = feedparser.parse(response.text)

    papers = []

    for entry in feed.entries:

        papers.append({
            "title": entry.title,
            "authors": ", ".join(author.name for author in entry.authors),
            "abstract": entry.summary.replace("\n", " "),
            "published_date": entry.published
        })

    print("Entries found:", len(papers))

    return {"papers": papers}


# -----------------------------
# PAPER IMPORT ENDPOINT
# -----------------------------
@app.post("/papers/import", response_model=PaperResponse)
async def import_paper(
    paper: PaperCreate,
    current_user=Depends(get_current_user)
):
    query = insert(Paper).values(
        title=paper.title,
        authors=paper.authors,
        abstract=paper.abstract,
        published_date=paper.published_date,
        owner_id=current_user.id
    )

    paper_id = await database.execute(query)

    select_query = select(Paper).where(Paper.id == paper_id)
    saved_paper = await database.fetch_one(select_query)

    return saved_paper