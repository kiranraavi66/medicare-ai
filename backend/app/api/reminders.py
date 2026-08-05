from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import User, Reminder
from app.schemas.schemas import ReminderCreate, ReminderOut
from app.api.auth import get_current_user

router = APIRouter(prefix="/reminders", tags=["Medicine Reminders"])

@router.post("/", response_model=ReminderOut)
def create_reminder(
    reminder_in: ReminderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    rem = Reminder(
        user_id=current_user.id,
        medicine_name=reminder_in.medicine_name,
        dosage=reminder_in.dosage,
        time_of_day=reminder_in.time_of_day,
        frequency=reminder_in.frequency or "Daily",
        notes=reminder_in.notes
    )
    db.add(rem)
    db.commit()
    db.refresh(rem)
    return rem

@router.get("/", response_model=List[ReminderOut])
def get_user_reminders(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Reminder).filter(Reminder.user_id == current_user.id).order_by(Reminder.created_at.desc()).all()

@router.put("/{reminder_id}/toggle", response_model=ReminderOut)
def toggle_reminder_status(reminder_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rem = db.query(Reminder).filter(Reminder.id == reminder_id, Reminder.user_id == current_user.id).first()
    if not rem:
        raise HTTPException(status_code=404, detail="Reminder not found")
    rem.is_active = not rem.is_active
    db.commit()
    db.refresh(rem)
    return rem

@router.delete("/{reminder_id}")
def delete_reminder(reminder_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rem = db.query(Reminder).filter(Reminder.id == reminder_id, Reminder.user_id == current_user.id).first()
    if not rem:
        raise HTTPException(status_code=404, detail="Reminder not found")
    db.delete(rem)
    db.commit()
    return {"message": "Reminder deleted successfully"}
