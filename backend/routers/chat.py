from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, insert
from database import database
from models import Workspace, Paper, Conversation
from schemas import ChatMessage
from security import get_current_user
from utils.research_assistant import ResearchAssistant

router = APIRouter(prefix="/chat", tags=["Chat"])

assistant = ResearchAssistant()


@router.post("/{workspace_id}")
async def chat_with_workspace(
    workspace_id: int,
    message: ChatMessage,
    current_user=Depends(get_current_user),
):
    # Verify workspace belongs to user
    workspace_query = select(Workspace).where(
        Workspace.id == workspace_id,
        Workspace.owner_id == current_user.id,
    )
    workspace = await database.fetch_one(workspace_query)

    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")

    # Fetch papers specifically for this workspace
    papers_query = select(Paper).where(
        Paper.workspace_id == workspace_id,
        Paper.owner_id == current_user.id,
    )
    papers = await database.fetch_all(papers_query)

    # Build structured research context using ResearchAssistant
    context = assistant.create_research_context(list(papers), message.content)

    # Load last 5 conversation turns for multi-turn memory
    history_query = (
        select(Conversation)
        .where(Conversation.workspace_id == workspace_id)
        .order_by(Conversation.created_at.desc())
        .limit(5)
    )
    recent_convs = await database.fetch_all(history_query)

    # Reverse to chronological order and build message list
    history = []
    for conv in reversed(recent_convs):
        history.append({"role": "user", "content": conv.user_message})
        history.append({"role": "assistant", "content": conv.ai_response})

    # Generate response with conversation history
    ai_text = assistant.generate_response_with_history(
        context=context,
        query=message.content,
        history=history,
    )

    # Store conversation in database
    conversation_query = insert(Conversation).values(
        user_message=message.content,
        ai_response=ai_text,
        workspace_id=workspace_id,
    )
    await database.execute(conversation_query)

    return {"response": ai_text}


@router.get("/{workspace_id}")
async def get_workspace(
    workspace_id: int,
    current_user=Depends(get_current_user),
):
    query = select(Workspace).where(
        Workspace.id == workspace_id,
        Workspace.owner_id == current_user.id,
    )
    workspace = await database.fetch_one(query)

    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")

    papers_query = select(Paper).where(
        Paper.workspace_id == workspace_id,
        Paper.owner_id == current_user.id,
    )
    papers = await database.fetch_all(papers_query)

    return {
        "id": str(workspace.id),
        "name": workspace.name,
        "papers": papers,
    }
