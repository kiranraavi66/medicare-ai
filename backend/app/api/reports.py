from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import User, MedicalReport
from app.schemas.schemas import MedicalReportOut
from app.api.auth import get_current_user
from app.services.report_parser import extract_text_from_file
from app.services.gemini_service import summarize_medical_report_ai

router = APIRouter(prefix="/reports", tags=["Medical Reports Analyzer"])

@router.post("/upload", response_model=MedicalReportOut)
async def upload_medical_report(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    filename = file.filename
    ext = filename.split(".")[-1].lower() if "." in filename else ""
    if ext not in ["pdf", "txt", "png", "jpg", "jpeg"]:
        raise HTTPException(status_code=400, detail="Supported formats: PDF, TXT, PNG, JPG")
    
    file_bytes = await file.read()
    
    # 1. Extract text from report file
    raw_text = extract_text_from_file(file_bytes, filename)
    
    # 2. Summarize report via AI / heuristics
    summary_data = summarize_medical_report_ai(raw_text)
    
    # 3. Store in DB
    report_record = MedicalReport(
        user_id=current_user.id,
        filename=filename,
        file_type=ext,
        summary=summary_data["summary"],
        key_findings=summary_data.get("key_findings", ""),
        disclaimer=summary_data["disclaimer"]
    )
    db.add(report_record)
    db.commit()
    db.refresh(report_record)
    
    return report_record

@router.get("/", response_model=List[MedicalReportOut])
def get_user_reports(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    reports = db.query(MedicalReport).filter(MedicalReport.user_id == current_user.id).order_by(MedicalReport.created_at.desc()).all()
    return reports

@router.delete("/{report_id}")
def delete_report(report_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    report = db.query(MedicalReport).filter(MedicalReport.id == report_id, MedicalReport.user_id == current_user.id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    db.delete(report)
    db.commit()
    return {"message": "Report deleted successfully"}
