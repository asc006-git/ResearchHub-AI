from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import insert, select, update
from database import database
from models import Paper, ActivityLog
from schemas import PaperCreate, PaperResponse
from security import get_current_user
from services.paper_search import search_papers
from typing import List

router = APIRouter(prefix="/papers", tags=["Papers"])

async def log_activity(user_id: int, action: str, details: str = None):
    query = insert(ActivityLog).values(
        user_id=user_id,
        action=action,
        details=details
    )
    await database.execute(query)

@router.get("/search")
async def get_searched_papers(query: str, current_user=Depends(get_current_user)):
    if not query:
        return {"papers": []}
    
    papers = await search_papers(query)
    return {"papers": papers}

@router.post("/import", response_model=PaperResponse)
async def import_paper(
    paper: PaperCreate,
    current_user=Depends(get_current_user)
):
    query = insert(Paper).values(
        title=paper.title,
        authors=paper.authors,
        abstract=paper.abstract,
        year=paper.year,
        source_url=paper.source_url,
        published_date=paper.published_date,
        owner_id=current_user.id,
        workspace_id=paper.workspace_id
    )

    paper_id = await database.execute(query)
    
    await log_activity(
        current_user.id, 
        "PAPER_IMPORTED", 
        f"Imported paper '{paper.title}'" + (f" to workspace {paper.workspace_id}" if paper.workspace_id else "")
    )

    select_query = select(Paper).where(Paper.id == paper_id)
    saved_paper = await database.fetch_one(select_query)

    return saved_paper

@router.get("/{id}", response_model=PaperResponse)
async def get_paper(id: int, current_user=Depends(get_current_user)):
    query = select(Paper).where(
        Paper.id == id,
        Paper.owner_id == current_user.id
    )
    paper = await database.fetch_one(query)
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    return paper

@router.delete("/{id}")
async def delete_paper(id: int, current_user=Depends(get_current_user)):
    # Verify ownership
    query = select(Paper).where(
        Paper.id == id,
        Paper.owner_id == current_user.id
    )
    paper = await database.fetch_one(query)
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    
    delete_query = Paper.__table__.delete().where(Paper.id == id)
    await database.execute(delete_query)
    
    await log_activity(current_user.id, "PAPER_DELETED", f"Deleted paper: {paper['title']}")
    
    return {"message": "Paper deleted successfully"}
