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
        "uses": "Relief of mild-to-moderate fever, headaches, toothaches, joint pain, and cold body aches.",
        "side_effects": "Extremely rare at therapeutic doses. Excessive dosage (>4,000mg/day) causes acute liver injury.",
        "precautions": "Do not exceed 4,000 mg per 24 hours. Avoid alcohol consumption while taking.",
        "dosage_info": "Adults: 500 mg - 650 mg every 4 to 6 hours as needed. Max 4,000 mg daily."
    },
    {
        "name": "Ibuprofen",
        "generic_name": "Ibuprofen",
        "category": "NSAID (Anti-inflammatory)",
        "uses": "Reduces fever, treats inflammatory joint pain, swelling, toothaches, and menstrual cramps.",
        "side_effects": "Stomach irritation, heartburn, nausea. Risk of gastric ulcers or renal strain with long-term use.",
        "precautions": "Take with meals or milk. Caution in patients with asthma, peptic ulcers, or renal impairment.",
        "dosage_info": "Adults: 200 mg - 400 mg every 4-6 hours after meals."
    },
    {
        "name": "Naproxen",
        "generic_name": "Naproxen Sodium",
        "category": "NSAID (Anti-inflammatory)",
        "uses": "Provides 12-hour relief for chronic joint inflammation, tendonitis, bursitis, and severe backaches.",
        "side_effects": "Indigestion, stomach pain, dizziness, fluid retention.",
        "precautions": "Take with full glass of water after food. Monitor renal parameters in elderly patients.",
        "dosage_info": "Adults: 250 mg - 500 mg twice daily with food."
    },
    {
        "name": "Aspirin (Acetylsalicylic Acid)",
        "generic_name": "Acetylsalicylic Acid",
        "category": "Cardiovascular & Antiplatelet",
        "uses": "Blood-thinning therapy for heart attack prevention, ischemic stroke prevention, and acute angina.",
        "side_effects": "Gastric mucosal irritation, easy skin bruising, prolonged bleeding time.",
        "precautions": "Do not administer to children/teens with viral fever (Reye's syndrome risk). Take with food.",
        "dosage_info": "Low-dose cardiac protection: 75 mg - 81 mg once daily as prescribed."
    },
    {
        "name": "Atorvastatin",
        "generic_name": "Atorvastatin Calcium",
        "category": "Cardiovascular & Statin",
        "uses": "Lowers harmful LDL cholesterol and triglycerides, raises HDL cholesterol, and prevents stroke/MI.",
        "side_effects": "Mild muscle pain (myalgia), transient liver enzyme elevation, digestive gas.",
        "precautions": "Avoid large amounts of grapefruit juice. Report unexplained severe muscle tenderness immediately.",
        "dosage_info": "10 mg - 40 mg once daily taken at bedtime."
    },
    {
        "name": "Amlodipine",
        "generic_name": "Amlodipine Besylate",
        "category": "Antihypertensive (Calcium Channel Blocker)",
        "uses": "Treats high blood pressure (hypertension) and chronic stable angina chest pain.",
        "side_effects": "Ankle swelling (peripheral edema), facial flushing, dizziness, fatigue.",
        "precautions": "Monitor blood pressure regularly. Avoid standing up quickly from sitting position.",
        "dosage_info": "5 mg once daily, increased to 10 mg daily as prescribed by physician."
    },
    {
        "name": "Telmisartan",
        "generic_name": "Telmisartan",
        "category": "Antihypertensive (ARB)",
        "uses": "Long-acting blood pressure control, cardiovascular risk reduction, and diabetic kidney protection.",
        "side_effects": "Dizziness, sinus congestion, mild upper respiratory irritation.",
        "precautions": "Contraindicated in pregnancy. Regularly check serum potassium and renal function.",
        "dosage_info": "40 mg once daily in the morning."
    },
    {
        "name": "Metoprolol Succinate",
        "generic_name": "Metoprolol Succinate ER",
        "category": "Antihypertensive (Beta Blocker)",
        "uses": "Controls high blood pressure, angina chest pain, heart rate in tachycardia, and heart failure.",
        "side_effects": "Cold extremities, slow heart rate (bradycardia), fatigue, sleep disturbances.",
        "precautions": "Do not abruptly stop taking without physician guidance. Caution in severe asthma.",
        "dosage_info": "25 mg - 50 mg extended release once daily with or after a meal."
    },
    {
        "name": "Metformin",
        "generic_name": "Metformin Hydrochloride",
        "category": "Antidiabetic",
        "uses": "First-line oral treatment for Type 2 Diabetes to lower blood glucose and improve insulin sensitivity.",
        "side_effects": "Gastrointestinal upset, diarrhea, abdominal bloating, metallic taste.",
        "precautions": "Take with meals to minimize GI distress. Periodic renal function (eGFR) and Vitamin B12 monitoring required.",
        "dosage_info": "Adults: 500 mg - 850 mg twice daily with morning and evening meals."
    },
    {
        "name": "Glimepiride",
        "generic_name": "Glimepiride",
        "category": "Antidiabetic (Sulfonylurea)",
        "uses": "Stimulates pancreatic insulin secretion to control blood sugar in Type 2 Diabetes.",
        "side_effects": "Hypoglycemia (low blood sugar), mild weight gain, skin allergy.",
        "precautions": "Must be taken immediately before or with breakfast. Always carry fast-acting glucose tabs.",
        "dosage_info": "1 mg - 2 mg once daily with breakfast."
    },
    {
        "name": "Amoxicillin",
        "generic_name": "Amoxicillin",
        "category": "Antibiotic (Penicillin type)",
        "uses": "Treats bacterial infections of ear, nose, throat, respiratory tract, skin, and urinary system.",
        "side_effects": "Nausea, mild diarrhea, abdominal cramps, allergic skin rash.",
        "precautions": "Prescription required. Complete full prescribed antibiotic course. Verify penicillin allergy status.",
        "dosage_info": "Adults: 500 mg every 8 hours for 7-10 days as prescribed."
    },
    {
        "name": "Azithromycin",
        "generic_name": "Azithromycin",
        "category": "Antibiotic (Macrolide)",
        "uses": "Treats bacterial chest infections, sinusitis, tonsillitis, and skin infections.",
        "side_effects": "Loose stools, nausea, mild stomach pain.",
        "precautions": "Take 1 hour before or 2 hours after meals. Complete full 3 or 5 day course.",
        "dosage_info": "500 mg on Day 1, followed by 250 mg once daily on Days 2 to 5."
    },
    {
        "name": "Ciprofloxacin",
        "generic_name": "Ciprofloxacin Hydrochloride",
        "category": "Antibiotic (Fluoroquinolone)",
        "uses": "Treats complicated urinary tract infections (UTI), severe gastrointestinal infections, and joint infections.",
        "side_effects": "Nausea, headache, joint pain. Risk of tendonitis/tendon rupture.",
        "precautions": "Avoid taking with dairy products or antacids simultaneously. Stay well hydrated.",
        "dosage_info": "500 mg twice daily every 12 hours for 5-7 days."
    },
    {
        "name": "Omeprazole",
        "generic_name": "Omeprazole",
        "category": "Proton Pump Inhibitor (PPI)",
        "uses": "Treats acid reflux (GERD), heartburn, stomach ulcers, and erosive esophagitis.",
        "side_effects": "Headache, abdominal pain, flatulence, nausea.",
        "precautions": "Take 30-60 minutes before breakfast on an empty stomach.",
        "dosage_info": "20 mg once daily in the morning before food for 14-28 days."
    },
    {
        "name": "Pantoprazole",
        "generic_name": "Pantoprazole Sodium",
        "category": "Proton Pump Inhibitor (PPI)",
        "uses": "Relieves heartburn, acid regurgitation, gastritis, and peptic ulcer disease.",
        "side_effects": "Headache, mild diarrhea, abdominal discomfort.",
        "precautions": "Swallow tablet whole with water. Do not chew, crush, or split.",
        "dosage_info": "40 mg once daily before morning meal."
    },
    {
        "name": "Cetirizine",
        "generic_name": "Cetirizine Hydrochloride",
        "category": "Antihistamine",
        "uses": "Relief of seasonal allergy symptoms, runny nose, sneezing, itchy eyes, and hives.",
        "side_effects": "Mild drowsiness, dry mouth, fatigue.",
        "precautions": "May cause mild sedation. Exercise caution when driving.",
        "dosage_info": "Adults & Children over 12: 10 mg once daily in evening."
    },
    {
        "name": "Loratadine",
        "generic_name": "Loratadine",
        "category": "Antihistamine (Non-drowsy)",
        "uses": "24-hour non-sedating relief for allergic rhinitis, hay fever, and skin hives.",
        "side_effects": "Rare headache, dry mouth, tiredness.",
        "precautions": "Can be taken with or without food. Safe for daytime use.",
        "dosage_info": "10 mg once daily."
    },
    {
        "name": "Montelukast",
        "generic_name": "Montelukast Sodium",
        "category": "Respiratory & Leukotriene Receptor Antagonist",
        "uses": "Prevents asthma attacks, controls exercise-induced bronchospasm, and relieves allergic rhinitis.",
        "side_effects": "Headache, abdominal pain, upper respiratory infection.",
        "precautions": "Take once daily in evening. Not for acute emergency asthma attack relief.",
        "dosage_info": "10 mg once daily in the evening."
    },
    {
        "name": "Levothyroxine",
        "generic_name": "Levothyroxine Sodium",
        "category": "Thyroid Hormone Replacement",
        "uses": "Replaces deficient thyroid hormone in patients with Hypothyroidism.",
        "side_effects": "Palpitations, weight loss, heat intolerance if dosage is excessive.",
        "precautions": "Take on empty stomach with water 30-60 minutes before morning meal.",
        "dosage_info": "As prescribed based on serum TSH tests (e.g. 50 mcg - 100 mcg daily)."
    },
    {
        "name": "Vitamin D3 (Cholecalciferol)",
        "generic_name": "Cholecalciferol",
        "category": "Vitamin & Mineral Supplement",
        "uses": "Treats Vitamin D deficiency, maintains bone density, supports calcium absorption and immune health.",
        "side_effects": "Well tolerated at recommended doses. Nausea or hypercalcemia if megadosed excessively.",
        "precautions": "Take after a fat-containing meal for optimal absorption.",
        "dosage_info": "Maintenance: 1000 IU - 2000 IU daily; Deficiency: 60,000 IU weekly for 8 weeks."
    }
]

def seed_medicines_if_empty(db: Session):
    existing_names = {m.name for m in db.query(Medicine.name).all()}
    for med in DEFAULT_MEDICINES:
        if med["name"] not in existing_names:
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
