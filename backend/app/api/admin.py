from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import User, ChatMessage, MedicalReport, Reminder
from app.schemas.schemas import UserOut
from app.api.auth import get_current_admin

router = APIRouter(prefix="/admin", tags=["Admin Control Panel"])

@router.get("/stats")
def get_system_stats(admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    total_chats = db.query(ChatMessage).count()
    total_reports = db.query(MedicalReport).count()
    total_reminders = db.query(Reminder).count()

    return {
        "total_users": total_users,
        "total_chats": total_chats,
        "total_reports": total_reports,
        "total_reminders": total_reminders,
        "system_status": "Healthy / Operational",
        "ai_engine": "Google Gemini 1.5 Flash + Medical Rule Engine Fallback"
    }

@router.get("/users", response_model=List[UserOut])
def list_all_users(admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.created_at.desc()).all()
    return users

@router.put("/users/{user_id}/toggle")
def toggle_user_active(user_id: int, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.role == "admin":
        raise HTTPException(status_code=400, detail="Cannot deactivate admin user")
    
    user.is_active = not user.is_active
    db.commit()
    return {"message": f"User status updated to {'Active' if user.is_active else 'Inactive'}"}
