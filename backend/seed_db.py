import sys
import os

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal, engine, Base
from app.models.models import User, Medicine, ChatMessage, MedicalReport, Reminder
from app.core.security import get_password_hash
from app.api.medicines import DEFAULT_MEDICINES

def seed_database():
    print("=" * 60)
    print("🌱 MEDICARE AI MASTER DATABASE SEEDER")
    print("=" * 60)
    
    # 1. Create all tables
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 2. Seed Admin User
        admin = db.query(User).filter(User.email == "admin@medicare.ai").first()
        if not admin:
            admin = User(
                email="admin@medicare.ai",
                full_name="MediCare System Admin",
                hashed_password=get_password_hash("adminpassword123"),
                role="admin",
                is_active=True
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)
            print("✅ Seeded Admin User: admin@medicare.ai")
        else:
            print("ℹ️ Admin User already exists.")

        # 3. Seed Demo Patient User
        patient = db.query(User).filter(User.email == "patient@medicare.ai").first()
        if not patient:
            patient = User(
                email="patient@medicare.ai",
                full_name="Alex Morgan",
                hashed_password=get_password_hash("password123"),
                role="user",
                is_active=True
            )
            db.add(patient)
            db.commit()
            db.refresh(patient)
            print("✅ Seeded Patient Demo User: patient@medicare.ai")
        else:
            print("ℹ️ Patient Demo User already exists.")

        # 4. Seed Medicines
        existing_meds = {m.name for m in db.query(Medicine.name).all()}
        seeded_count = 0
        for med in DEFAULT_MEDICINES:
            if med["name"] not in existing_meds:
                db_med = Medicine(**med)
                db.add(db_med)
                seeded_count += 1
        db.commit()
        print(f"✅ Seeded {seeded_count} new medicines (Total Medicines: {db.query(Medicine).count()})")

        # 5. Seed Patient Reminders
        rem_count = db.query(Reminder).filter(Reminder.user_id == patient.id).count()
        if rem_count == 0:
            sample_reminders = [
                Reminder(
                    user_id=patient.id,
                    medicine_name="Metformin Hydrochloride",
                    dosage="500 mg",
                    time_of_day="08:00 AM",
                    frequency="Daily",
                    notes="Take immediately after breakfast with water",
                    is_active=True
                ),
                Reminder(
                    user_id=patient.id,
                    medicine_name="Omeprazole",
                    dosage="20 mg",
                    time_of_day="07:30 AM",
                    frequency="Daily",
                    notes="Take 30 minutes before morning breakfast",
                    is_active=True
                ),
                Reminder(
                    user_id=patient.id,
                    medicine_name="Atorvastatin Calcium",
                    dosage="20 mg",
                    time_of_day="09:00 PM",
                    frequency="Daily",
                    notes="Bedtime cholesterol management",
                    is_active=True
                ),
                Reminder(
                    user_id=patient.id,
                    medicine_name="Vitamin D3 (Cholecalciferol)",
                    dosage="60,000 IU",
                    time_of_day="09:00 AM",
                    frequency="Weekly (Sunday)",
                    notes="Take with milk or fatty meal",
                    is_active=True
                )
            ]
            for r in sample_reminders:
                db.add(r)
            db.commit()
            print("✅ Seeded 4 Sample Medicine Reminders for Patient Demo")
        else:
            print("ℹ️ Patient Reminders already exist.")

        # 6. Seed Patient Medical Reports
        rep_count = db.query(MedicalReport).filter(MedicalReport.user_id == patient.id).count()
        if rep_count == 0:
            sample_reports = [
                MedicalReport(
                    user_id=patient.id,
                    filename="Complete_Blood_Count_CBC_Report.pdf",
                    file_type="pdf",
                    summary="Full hematology screening analyzed. Hemoglobin, White Blood Cells, and Platelet levels are within standard clinical reference ranges.",
                    key_findings="• Hemoglobin: 14.2 g/dL (Normal Range: 13.5 - 17.5 g/dL)\n• Total Leucocyte Count (WBC): 6,800 /mcL (Normal Range: 4,500 - 11,000 /mcL)\n• Platelet Count: 250,000 /mcL (Normal Range: 150,000 - 450,000 /mcL)\n• RBC Count: 4.8 million/mcL (Normal Range)",
                    disclaimer="AI-generated medical report summary for patient guidance. Please review with your primary care physician."
                ),
                MedicalReport(
                    user_id=patient.id,
                    filename="Comprehensive_Lipid_Profile_Report.pdf",
                    file_type="pdf",
                    summary="Lipid metabolic screening analyzed. Serum cholesterol and triglyceride parameters indicate optimal cardiac health.",
                    key_findings="• Total Cholesterol: 185 mg/dL (Optimal: < 200 mg/dL)\n• HDL (Good) Cholesterol: 52 mg/dL (Optimal: > 40 mg/dL)\n• LDL (Bad) Cholesterol: 105 mg/dL (Optimal: < 100 mg/dL)\n• Triglycerides: 140 mg/dL (Normal: < 150 mg/dL)",
                    disclaimer="AI-generated report summary. Share original lab document with your endocrinologist or cardiologist."
                )
            ]
            for rep in sample_reports:
                db.add(rep)
            db.commit()
            print("✅ Seeded 2 Sample Medical Reports for Patient Demo")
        else:
            print("ℹ️ Patient Reports already exist.")

        # 7. Seed Sample AI Chat History
        chat_count = db.query(ChatMessage).filter(ChatMessage.user_id == patient.id).count()
        if chat_count == 0:
            sample_chats = [
                ChatMessage(
                    user_id=patient.id,
                    sender="user",
                    content="What should I do for a mild fever?"
                ),
                ChatMessage(
                    user_id=patient.id,
                    sender="assistant",
                    content="### 🤒 Fever & Body Temperature Management\n\n**Medical Overview:**\nA fever (100.4°F / 38°C or higher) indicates your immune system is actively fighting off infection.\n\n**Actionable Home Care:**\n- 💧 **Hydrate**: Drink plenty of water and ORS electrolyte solution.\n- 🛌 **Rest**: Allow your body time to recover.\n- 💊 **Paracetamol**: Take 500mg-650mg every 6 hours as needed for temperature control.\n- 🧼 **Tepid Sponging**: Apply lukewarm damp cloth to forehead.\n\n⚠️ Consult a doctor if fever lasts > 3 days or exceeds 103°F."
                )
            ]
            for c in sample_chats:
                db.add(c)
            db.commit()
            print("✅ Seeded Sample AI Chat Messages for Patient Demo")
        else:
            print("ℹ️ Patient Chat Messages already exist.")

        print("=" * 60)
        print("🚀 DATABASE SEEDING COMPLETED SUCCESSFULLY!")
        print("=" * 60)

    except Exception as e:
        db.rollback()
        print(f"❌ Error during database seeding: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
