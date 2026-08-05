from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import User, ChatMessage
from app.schemas.schemas import ChatRequest, ChatMessageOut
from app.api.auth import get_current_user
from app.services.gemini_service import generate_medical_chat_response

router = APIRouter(prefix="/chat", tags=["AI Chat Assistant"])

@router.post("/send", response_model=ChatMessageOut)
def send_chat_message(req: ChatRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    # Save user message
    user_msg = ChatMessage(user_id=current_user.id, sender="user", content=req.message)
    db.add(user_msg)
    db.commit()

    # Get recent conversation context
    history = db.query(ChatMessage).filter(ChatMessage.user_id == current_user.id).order_by(ChatMessage.created_at.desc()).limit(10).all()
    
    # Generate AI medical response
    ai_reply_text = generate_medical_chat_response(req.message, [h.content for h in reversed(history)])

    # Save assistant message
    ai_msg = ChatMessage(user_id=current_user.id, sender="assistant", content=ai_reply_text)
    db.add(ai_msg)
    db.commit()
    db.refresh(ai_msg)

    return ai_msg

@router.get("/history", response_model=List[ChatMessageOut])
def get_chat_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    messages = db.query(ChatMessage).filter(ChatMessage.user_id == current_user.id).order_by(ChatMessage.created_at.asc()).all()
    return messages

@router.delete("/history")
def clear_chat_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(ChatMessage).filter(ChatMessage.user_id == current_user.id).delete()
    db.commit()
    return {"message": "Chat history cleared successfully"}
