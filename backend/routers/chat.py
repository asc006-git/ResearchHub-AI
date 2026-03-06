from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, insert
from backend.database import database
from backend.models import Workspace, Paper, Conversation
from backend.schemas import ChatMessage
from backend.security import get_current_user
from backend.utils.groq_client import client, GROQ_MODEL_CONFIG

router = APIRouter(prefix="/chat", tags=["Chat"])


# -----------------------------
# CREATE WORKSPACE
# -----------------------------
@router.post("/workspace")
async def create_workspace(
    workspace_data: dict,
    current_user=Depends(get_current_user)
):
    query = insert(Workspace).values(
        name=workspace_data["name"],
        owner_id=current_user.id
    )

    workspace_id = await database.execute(query)

    return {"id": workspace_id, "name": workspace_data["name"]}


# -----------------------------
# CHAT WITH WORKSPACE PAPERS
# -----------------------------
@router.post("/{workspace_id}")
async def chat_with_workspace(
    workspace_id: int,
    message: ChatMessage,
    current_user=Depends(get_current_user)
):
    # Verify workspace belongs to user
    workspace_query = select(Workspace).where(
        Workspace.id == workspace_id,
        Workspace.owner_id == current_user.id
    )

    workspace = await database.fetch_one(workspace_query)

    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")

    # Fetch user's papers
    papers_query = select(Paper).where(
        Paper.owner_id == current_user.id
    )

    papers = await database.fetch_all(papers_query)

    # Build research context
    context = ""
    for paper in papers:
        context += f"\nTitle: {paper.title}\n"
        context += f"Abstract: {paper.abstract}\n"

    # Call Groq
    response = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": f"You are a research assistant. Use the following research context:\n{context}"
            },
            {
                "role": "user",
                "content": message.content
            }
        ],
        **GROQ_MODEL_CONFIG
    )

    ai_text = response.choices[0].message.content

    # Store conversation
    conversation_query = insert(Conversation).values(
        user_message=message.content,
        ai_response=ai_text,
        workspace_id=workspace_id
    )

    await database.execute(conversation_query)

    return {"response": ai_text}


#show workspaces
@router.get("/workspace")
async def get_workspaces(current_user=Depends(get_current_user)):

    query = select(Workspace).where(
        Workspace.owner_id == current_user.id
    )

    workspaces = await database.fetch_all(query)

    return workspaces

@router.get("/papers")
async def get_papers(current_user=Depends(get_current_user)):

    query = select(Paper).where(
        Paper.owner_id == current_user.id
    )

    papers = await database.fetch_all(query)

    return papers