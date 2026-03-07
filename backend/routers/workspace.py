from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, insert, delete, update, func
from database import database
from models import Workspace, Paper, ActivityLog, Conversation
from schemas import WorkspaceCreate, WorkspaceUpdate, WorkspaceResponse, ActivityLogResponse
from security import get_current_user
from typing import List

router = APIRouter(prefix="/workspaces", tags=["Workspaces"])

async def log_activity(user_id: int, action: str, details: str = None):
    query = insert(ActivityLog).values(
        user_id=user_id,
        action=action,
        details=details
    )
    await database.execute(query)

@router.post("/", response_model=WorkspaceResponse)
async def create_workspace(
    workspace: WorkspaceCreate,
    current_user=Depends(get_current_user)
):
    query = insert(Workspace).values(
        name=workspace.name,
        description=workspace.description,
        owner_id=current_user.id
    )
    workspace_id = await database.execute(query)
    
    await log_activity(current_user.id, "WORKSPACE_CREATED", f"Created workspace: {workspace.name}")
    
    # Fetch and return the new workspace
    select_query = select(Workspace).where(Workspace.id == workspace_id)
    new_workspace = await database.fetch_one(select_query)
    return new_workspace

@router.get("/", response_model=List[WorkspaceResponse])
async def list_workspaces(current_user=Depends(get_current_user)):
    query = select(Workspace).where(Workspace.owner_id == current_user.id)
    return await database.fetch_all(query)

@router.get("/{workspace_id}")
async def get_workspace_details(
    workspace_id: int,
    current_user=Depends(get_current_user)
):
    query = select(Workspace).where(
        Workspace.id == workspace_id,
        Workspace.owner_id == current_user.id
    )
    workspace = await database.fetch_one(query)
    
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
        
    papers_query = select(Paper).where(Paper.workspace_id == workspace_id)
    papers = await database.fetch_all(papers_query)
    
    return {
        "id": workspace.id,
        "name": workspace.name,
        "description": workspace.description,
        "created_at": workspace.created_at,
        "papers": papers
    }

@router.delete("/{workspace_id}")
async def delete_workspace(
    workspace_id: int,
    current_user=Depends(get_current_user)
):
    # Verify ownership
    query = select(Workspace).where(
        Workspace.id == workspace_id,
        Workspace.owner_id == current_user.id
    )
    workspace = await database.fetch_one(query)
    
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    # Manual cleanup of associated data (to be safe with raw SQL/databases execution)
    await database.execute(delete(Paper).where(Paper.workspace_id == workspace_id))
    await database.execute(delete(Conversation).where(Conversation.workspace_id == workspace_id))
    # Note: ResearchNote might be in models or handled by cascade
    from models import ResearchNote
    await database.execute(delete(ResearchNote).where(ResearchNote.workspace_id == workspace_id))

    delete_query = delete(Workspace).where(Workspace.id == workspace_id)
    await database.execute(delete_query)
    
    await log_activity(current_user.id, "WORKSPACE_DELETED", f"Deleted workspace: {workspace.name}")
    
    return {"message": "Workspace deleted successfully"}

@router.put("/{workspace_id}", response_model=WorkspaceResponse)
async def update_workspace(
    workspace_id: int,
    workspace_data: WorkspaceUpdate,
    current_user=Depends(get_current_user)
):
    query = select(Workspace).where(
        Workspace.id == workspace_id,
        Workspace.owner_id == current_user.id
    )
    workspace = await database.fetch_one(query)
    
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")

    update_data = workspace_data.dict(exclude_unset=True)
    if update_data:
        update_query = update(Workspace).where(Workspace.id == workspace_id).values(**update_data)
        await database.execute(update_query)
        await log_activity(current_user.id, "WORKSPACE_UPDATED", f"Updated workspace: {update_data.get('name', workspace.name)}")
        
    updated_query = select(Workspace).where(Workspace.id == workspace_id)
    return await database.fetch_one(updated_query)

@router.get("/user/activity", response_model=List[ActivityLogResponse])
async def get_activity_logs(current_user=Depends(get_current_user)):
    query = select(ActivityLog).where(
        ActivityLog.user_id == current_user.id
    ).order_by(ActivityLog.timestamp.desc()).limit(20)
    
    return await database.fetch_all(query)

@router.get("/user/stats")
async def get_user_stats(current_user=Depends(get_current_user)):
    # Workspaces
    ws_query = select(func.count(Workspace.id)).where(Workspace.owner_id == current_user.id)
    ws_count = await database.execute(ws_query)
    
    # Papers
    paper_query = select(func.count(Paper.id)).where(Paper.owner_id == current_user.id)
    paper_count = await database.execute(paper_query)
    
    # Conversations
    # We join Conversation with Workspace to ensure the workspace belongs to the user
    conv_query = select(func.count(Conversation.id)).select_from(
        Conversation.__table__.join(Workspace.__table__, Conversation.workspace_id == Workspace.id)
    ).where(Workspace.owner_id == current_user.id)
    conv_count = await database.execute(conv_query)
    
    return {
        "active_workspaces": ws_count or 0,
        "total_papers": paper_count or 0,
        "total_conversations": conv_count or 0
    }
