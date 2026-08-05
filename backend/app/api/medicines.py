from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Medicine
from app.schemas.schemas import MedicineOut

router = APIRouter(prefix="/medicines", tags=["Medicine Directory"])

DEFAULT_MEDICINES = [
    {
        "name": "Paracetamol (Acetaminophen)",
        "generic_name": "Acetaminophen",
        "category": "Analgesics & Antipyretics",
        "uses": "Temporary relief of mild to moderate fever, headaches, body aches, and toothaches.",
        "side_effects": "Rare at recommended doses. Excessive dosage may cause severe liver damage.",
        "precautions": "Do not exceed 4,000 mg per 24 hours. Avoid alcohol consumption while taking.",
        "dosage_info": "Adults: 500 mg - 1000 mg every 4-6 hours as needed. Max 4000 mg daily."
    },
    {
        "name": "Ibuprofen",
        "generic_name": "Ibuprofen",
        "category": "NSAID (Anti-inflammatory)",
        "uses": "Reduces fever, treats inflammatory pain, joint pain, dental pain, and menstrual cramps.",
        "side_effects": "Stomach upset, heartburn, nausea, risk of gastric ulcers with prolonged use.",
        "precautions": "Take with food or milk. Caution for patients with history of kidney issues or ulcers.",
        "dosage_info": "Adults: 200 mg - 400 mg every 4-6 hours after meals."
    },
    {
        "name": "Amoxicillin",
        "generic_name": "Amoxicillin",
        "category": "Antibiotic (Penicillin type)",
        "uses": "Treats bacterial infections such as ear, nose, throat, skin, and urinary tract infections.",
        "side_effects": "Nausea, mild diarrhea, abdominal cramps, skin rash.",
        "precautions": "Prescription only. Complete the full course even if feeling better. Check for penicillin allergies.",
        "dosage_info": "As prescribed by physician (e.g. 500 mg every 8 hours for 7-10 days)."
    },
    {
        "name": "Cetirizine",
        "generic_name": "Cetirizine Hydrochloride",
        "category": "Antihistamine",
        "uses": "Relief of allergy symptoms such as sneezing, runny nose, watery eyes, and itching hives.",
        "side_effects": "Mild drowsiness, dry mouth, tiredness.",
        "precautions": "May cause drowsiness. Use caution when operating heavy machinery.",
        "dosage_info": "Adults & Children over 12: 10 mg once daily."
    },
    {
        "name": "Omeprazole",
        "generic_name": "Omeprazole",
        "category": "Proton Pump Inhibitor (PPI)",
        "uses": "Treats acid reflux (GERD), heartburn, and stomach ulcers by reducing stomach acid.",
        "side_effects": "Headache, abdominal pain, gas, nausea.",
        "precautions": "Best taken 30-60 minutes before breakfast.",
        "dosage_info": "20 mg once daily in the morning before food for 14 days."
    },
    {
        "name": "Metformin",
        "generic_name": "Metformin Hydrochloride",
        "category": "Antidiabetic",
        "uses": "First-line medication for the treatment of Type 2 Diabetes to manage blood glucose levels.",
        "side_effects": "Gastrointestinal upset, diarrhea, nausea, metallic taste.",
        "precautions": "Take with meals to reduce stomach upset. Regular renal function monitoring required.",
        "dosage_info": "As prescribed by endocrinologist (e.g. 500 mg twice daily with meals)."
    }
]

def seed_medicines_if_empty(db: Session):
    count = db.query(Medicine).count()
    if count == 0:
        for med in DEFAULT_MEDICINES:
            db_med = Medicine(**med)
            db.add(db_med)
        db.commit()

@router.get("/", response_model=List[MedicineOut])
def search_medicines(
    q: Optional[str] = Query(None, description="Search term for name or usage"),
    category: Optional[str] = Query(None, description="Filter by category"),
    db: Session = Depends(get_db)
):
    seed_medicines_if_empty(db)
    query = db.query(Medicine)
    
    if q:
        search_term = f"%{q.lower()}%"
        query = query.filter(
            (Medicine.name.ilike(search_term)) |
            (Medicine.generic_name.ilike(search_term)) |
            (Medicine.uses.ilike(search_term))
        )
    if category and category != "all":
        query = query.filter(Medicine.category.ilike(f"%{category}%"))
    
    return query.all()

@router.get("/{med_id}", response_model=MedicineOut)
def get_medicine_by_id(med_id: int, db: Session = Depends(get_db)):
    med = db.query(Medicine).filter(Medicine.id == med_id).first()
    if not med:
        raise HTTPException(status_code=404, detail="Medicine not found")
    return med
