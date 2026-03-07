from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import update, select, insert, func
from database import database
from models import User, ActivityLog, Workspace, Paper, Conversation
from schemas import UserProfileUpdate, UserSettingsUpdate, UserResponse, ActivityLogResponse
from security import get_current_user
from typing import List

router = APIRouter(prefix="/users", tags=["Users"])


async def log_activity(user_id: int, action: str, details: str = None):
    query = insert(ActivityLog).values(
        user_id=user_id,
        action=action,
        details=details
    )
    await database.execute(query)


@router.get("/me", response_model=UserResponse)
async def get_my_profile(current_user=Depends(get_current_user)):
    select_query = select(User).where(User.id == current_user.id)
    user = await database.fetch_one(select_query)
    return user


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    profile_data: UserProfileUpdate,
    current_user=Depends(get_current_user)
):
    update_data = profile_data.dict(exclude_unset=True)

    if not update_data:
        raise HTTPException(status_code=400, detail="No data provided to update")

    query = update(User).where(User.id == current_user.id).values(**update_data)
    await database.execute(query)

    await log_activity(current_user.id, "PROFILE_UPDATED", "Updated user profile")

    select_query = select(User).where(User.id == current_user.id)
    updated_user = await database.fetch_one(select_query)

    return updated_user


@router.put("/settings", response_model=UserResponse)
async def update_settings(
    settings_data: UserSettingsUpdate,
    current_user=Depends(get_current_user)
):
    update_data = settings_data.dict(exclude_unset=True)

    if not update_data:
        raise HTTPException(status_code=400, detail="No data provided to update")

    query = update(User).where(User.id == current_user.id).values(**update_data)
    await database.execute(query)

    await log_activity(current_user.id, "SETTINGS_UPDATED", "Updated AI or privacy settings")

    select_query = select(User).where(User.id == current_user.id)
    updated_user = await database.fetch_one(select_query)

    return updated_user


@router.get("/activity", response_model=List[ActivityLogResponse])
async def get_user_activity(current_user=Depends(get_current_user)):
    """Fetch the activity log for the current user (used by History page)."""
    query = (
        select(ActivityLog)
        .where(ActivityLog.user_id == current_user.id)
        .order_by(ActivityLog.timestamp.desc())
        .limit(50)
    )
    return await database.fetch_all(query)


@router.get("/stats")
async def get_user_stats(current_user=Depends(get_current_user)):
    """Return aggregate stats for dashboard analytics."""
    ws_query = select(func.count(Workspace.id)).where(Workspace.owner_id == current_user.id)
    ws_count = await database.execute(ws_query)

    paper_query = select(func.count(Paper.id)).where(Paper.owner_id == current_user.id)
    paper_count = await database.execute(paper_query)

    conv_query = select(func.count(Conversation.id)).select_from(
        Conversation.__table__.join(Workspace.__table__, Conversation.workspace_id == Workspace.id)
    ).where(Workspace.owner_id == current_user.id)
    conv_count = await database.execute(conv_query)

    return {
        "active_workspaces": ws_count or 0,
        "total_papers": paper_count or 0,
        "total_conversations": conv_count or 0,
    }
@router.delete("/me")
async def delete_my_account(current_user=Depends(get_current_user)):
    """Permanently delete user account and all associated data."""
    user_id = current_user.id
    
    # In a real app with many foreign keys, we'd ensure cascading deletes are set up at DB level.
    # Here we do manual cleanup for safety given the existing database setup.
    
    # 1. Delete Papers
    await database.execute(Paper.__table__.delete().where(Paper.owner_id == user_id))
    
    # 2. Delete Conversations (linked to workspaces)
    workspaces_query = select(Workspace.id).where(Workspace.owner_id == user_id)
    workspaces = await database.fetch_all(workspaces_query)
    ws_ids = [ws['id'] for ws in workspaces]
    
    if ws_ids:
        await database.execute(Conversation.__table__.delete().where(Conversation.workspace_id.in_(ws_ids)))
    
    # 3. Delete Research Notes
    if ws_ids:
        await database.execute(insert(ActivityLog).values(user_id=user_id, action="CLEANUP", details="Deleting research notes"))
        from models import ResearchNote
        await database.execute(ResearchNote.__table__.delete().where(ResearchNote.workspace_id.in_(ws_ids)))

    # 4. Delete Workspaces
    await database.execute(Workspace.__table__.delete().where(Workspace.owner_id == user_id))
    
    # 5. Delete Activity Logs
    await database.execute(ActivityLog.__table__.delete().where(ActivityLog.user_id == user_id))
    
    # 6. Finally delete the User
    await database.execute(User.__table__.delete().where(User.id == user_id))
    
    return {"message": "Account deleted successfully"}
