from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, insert, delete, update
from database import database
from models import Paper, Workspace, ResearchNote
from schemas import ResearchNoteCreate, ResearchNoteResponse, TimelineResponse, TimelineEvent
from security import get_current_user
from utils.research_assistant import ResearchAssistant
from typing import List
import json

router = APIRouter(prefix="/research", tags=["Research"])
assistant = ResearchAssistant()

# -----------------------------
# AI SUMMARIZATION
# -----------------------------
@router.post("/summarize/{paper_id}")
async def summarize_paper(
    paper_id: int,
    current_user=Depends(get_current_user)
):
    query = select(Paper).where(Paper.id == paper_id, Paper.owner_id == current_user.id)
    paper = await database.fetch_one(query)
    
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
        
    summary = assistant.generate_paper_summary(dict(paper))
    return {"id": paper_id, "summary": summary}

# -----------------------------
# RESEARCH TIMELINE
# -----------------------------
@router.post("/timeline/{workspace_id}")
async def generate_timeline(
    workspace_id: int,
    current_user=Depends(get_current_user)
):
    # Verify workspace
    ws_query = select(Workspace).where(Workspace.id == workspace_id, Workspace.owner_id == current_user.id)
    workspace = await database.fetch_one(ws_query)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
        
    # Fetch papers
    papers_query = select(Paper).where(Paper.workspace_id == workspace_id).order_by(Paper.year.asc())
    papers = await database.fetch_all(papers_query)
    
    timeline_text = assistant.generate_research_timeline(papers)
    
    # Optional: Parse structured events from AI text if needed
    # For now, we wrap it in a simple response
    return {"workspace_id": workspace_id, "timeline": timeline_text}

# -----------------------------
# SHARED RESEARCH NOTES
# -----------------------------
@router.get("/notes/{workspace_id}", response_model=List[ResearchNoteResponse])
async def get_notes(
    workspace_id: int,
    current_user=Depends(get_current_user)
):
    # Verify ownership via workspace join
    query = select(ResearchNote).join(Workspace).where(
        Workspace.id == workspace_id,
        Workspace.owner_id == current_user.id
    )
    return await database.fetch_all(query)

@router.post("/notes/{workspace_id}", response_model=ResearchNoteResponse)
async def create_note(
    workspace_id: int,
    note: ResearchNoteCreate,
    current_user=Depends(get_current_user)
):
    # Verify ownership
    ws_query = select(Workspace).where(Workspace.id == workspace_id, Workspace.owner_id == current_user.id)
    workspace = await database.fetch_one(ws_query)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
        
    query = insert(ResearchNote).values(
        title=note.title,
        content=note.content,
        is_ai_generated=note.is_ai_generated,
        workspace_id=workspace_id
    )
    note_id = await database.execute(query)
    
    select_query = select(ResearchNote).where(ResearchNote.id == note_id)
    return await database.fetch_one(select_query)

@router.delete("/notes/{note_id}")
async def delete_note(
    note_id: int,
    current_user=Depends(get_current_user)
):
    # Verify ownership
    query = select(ResearchNote).join(Workspace).where(
        ResearchNote.id == note_id,
        Workspace.owner_id == current_user.id
    )
    note = await database.fetch_one(query)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
        
    del_query = delete(ResearchNote).where(ResearchNote.id == note_id)
    await database.execute(del_query)
    return {"message": "Note deleted"}
