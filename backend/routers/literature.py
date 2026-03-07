from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from database import database
from models import Paper, Workspace
from security import get_current_user
from utils.research_assistant import ResearchAssistant
from typing import Dict

router = APIRouter(prefix="/research", tags=["Research"])
assistant = ResearchAssistant()

@router.post("/literature-review/{workspace_id}")
async def generate_literature_review(
    workspace_id: int,
    current_user=Depends(get_current_user)
) -> Dict[str, str]:
    # 1. Verify workspace belongs to authenticated user
    ws_query = select(Workspace).where(
        Workspace.id == workspace_id, 
        Workspace.owner_id == current_user.id
    )
    workspace = await database.fetch_one(ws_query)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found or unauthorized")
        
    # 2. Fetch all papers from that workspace
    papers_query = select(Paper).where(Paper.workspace_id == workspace_id)
    papers = await database.fetch_all(papers_query)
    
    if not papers:
        raise HTTPException(status_code=400, detail="No papers in this workspace to review")

    # 3. Extract metadata and create context
    context = assistant.create_research_context(papers, "Generate a literature review")
    
    # 4. Prompt for Literature Review
    prompt = (
        "Generate a structured academic literature review using the following research papers.\n\n"
        "Structure the output with headings:\n"
        "1. Introduction\n"
        "2. Key Studies\n"
        "3. Methodologies Used\n"
        "4. Comparative Insights\n"
        "5. Conclusion\n\n"
        "Use bullet points and proper academic formatting."
    )
    
    review = assistant.generate_research_response(context, prompt)
    
    return {"review": review}

@router.post("/gaps/{workspace_id}")
async def detect_research_gaps(
    workspace_id: int,
    current_user=Depends(get_current_user)
) -> Dict[str, str]:
    # 1. Verify workspace ownership
    ws_query = select(Workspace).where(
        Workspace.id == workspace_id, 
        Workspace.owner_id == current_user.id
    )
    workspace = await database.fetch_one(ws_query)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found or unauthorized")
        
    # 2. Fetch workspace papers
    papers_query = select(Paper).where(Paper.workspace_id == workspace_id)
    papers = await database.fetch_all(papers_query)
    
    if not papers:
        raise HTTPException(status_code=400, detail="No papers in this workspace to analyze")

    # 3. Create context from abstracts
    context = assistant.create_research_context(papers, "Detect research gaps")
    
    # 4. Prompt for Gap Detection
    prompt = (
        "Based on the following research papers identify potential research gaps.\n\n"
        "Provide:\n"
        "• Unexplored research areas\n"
        "• Conflicting findings between studies\n"
        "• Potential future research directions"
    )
    
    gaps = assistant.generate_research_response(context, prompt)
    
    return {"gaps": gaps}
