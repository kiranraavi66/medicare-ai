from fastapi import APIRouter
from app.schemas.schemas import SymptomCheckRequest, SymptomCheckResponse

router = APIRouter(prefix="/symptoms", tags=["Symptom Checker"])

@router.post("/check", response_model=SymptomCheckResponse)
def check_symptoms(req: SymptomCheckRequest):
    symptoms_lower = [s.lower() for s in req.symptoms]
    combined_text = " ".join(symptoms_lower)
    
    risk_level = "Low"
    possible_conditions = []
    recommended_actions = []
    specialist_rec = "General Physician / Family Doctor"
    urgency = "Routine Medical Consultation (3-5 days)"
    tests = ["Complete Blood Count (CBC)", "Basic Metabolic Panel"]

    # 1. Cardiac / High-Risk Chest Pain Emergency
    if any(w in combined_text for w in ["chest pain", "chest pressure", "cardiac"]):
        risk_level = "High"
        urgency = "🚨 IMMEDIATE EMERGENCY (0 - 1 Hour)"
        specialist_rec = "Cardiologist & Emergency Room Physicians"
        possible_conditions = [
            "Acute Coronary Syndrome / Myocardial Infarction (Heart Attack)",
            "Unstable Angina Pectoris",
            "Acute Pericarditis / Myocarditis",
            "Severe Musculoskeletal Chest Wall Strain / GERD Reflux"
        ]
        recommended_actions = [
            "🚨 Call 911 or local emergency services immediately. Do NOT drive yourself to the hospital.",
            "Rest in a comfortable semi-seated position to decrease heart workload.",
            "Chew one 300mg un-coated aspirin slowly if advised by emergency dispatchers and not allergic.",
            "Have someone stay with you until paramedics arrive."
        ]
        tests = ["12-Lead ECG / EKG", "Serum Troponin I & T Enzymes", "Chest X-Ray", "Echocardiogram"]

    # 2. Respiratory Distress Emergency
    elif any(w in query_item for query_item in symptoms_lower for w in ["shortness of breath", "difficulty breathing"]):
        risk_level = "High" if req.severity == "Severe" or "chest pain" in combined_text else "Moderate"
        urgency = "🚨 Immediate Care (Within 1-2 Hours)" if risk_level == "High" else "Same-Day Clinical Visit (24 Hours)"
        specialist_rec = "Pulmonologist / Respiratory Specialist"
        possible_conditions = [
            "Acute Asthma Exacerbation / Bronchospasm",
            "Viral or Bacterial Pneumonia / Acute Bronchitis",
            "Pulmonary Embolism / Allergic Airway Reaction"
        ]
        recommended_actions = [
            "Sit upright and practice slow pursed-lip breathing.",
            "Use prescribed rescue inhaler (Albuterol/Salbutamol) if diagnosed with asthma.",
            "Seek urgent medical evaluation if breathlessness worsens or cyanosis (bluish lips) occurs."
        ]
        tests = ["Pulse Oximetry (SpO2)", "Chest X-Ray (PA View)", "Arterial Blood Gas (ABG)", "Spirometry"]

    # 3. Severe Neurological / Meningeal / Head Trauma
    elif "headache" in combined_text and ("stiff neck" in combined_text or req.severity == "Severe" or "dizziness" in combined_text):
        risk_level = "High" if "stiff neck" in combined_text or req.severity == "Severe" else "Moderate"
        urgency = "Urgent ER Visit (Within 2 Hours)" if risk_level == "High" else "Within 24 Hours"
        specialist_rec = "Neurologist"
        possible_conditions = [
            "Severe Migraine Episode with Aura",
            "Acute Sinusitis with Pressure",
            "Meningeal Irritation / Intracranial Pressure",
            "Tension Headache Secondary to Dehydration/Stress"
        ]
        recommended_actions = [
            "Rest in a quiet, dark room away from bright screens.",
            "Hydrate immediately with 500ml water or electrolyte solution.",
            "Avoid bright light and loud noise. Seek ER care if sudden 'thunderclap' headache occurs."
        ]
        tests = ["Non-Contrast Head CT / MRI", "Sinus CT Scan", "Neurological Reflex Assessment"]

    # 4. Gastrointestinal / Abdominal Emergency
    elif "abdominal pain" in combined_text or "nausea" in combined_text:
        risk_level = "High" if req.severity == "Severe" else "Moderate"
        urgency = "Urgent Evaluation (24 Hours)" if risk_level == "High" else "Within 48 Hours"
        specialist_rec = "Gastroenterologist"
        possible_conditions = [
            "Acute Gastritis / GERD Acid Reflux",
            "Viral Gastroenteritis / Food Poisoning",
            "Biliary Colic / Gallbladder Inflammation",
            "Appendicitis (if pain localized to lower right abdomen)"
        ]
        recommended_actions = [
            "Sip Oral Rehydration Salts (ORS) continuously in small sips.",
            "Stick to bland foods (BRAT diet: Bananas, Rice, Applesauce, Toast).",
            "Avoid spicy, greasy foods, caffeine, and dairy.",
            "Consult a doctor immediately if vomiting blood or passing black tarry stools."
        ]
        tests = ["Abdominal Ultrasound", "Complete Blood Count (CBC)", "Liver Function Test (LFT)", "Stool Culture"]

    # 5. Fever & Infectious Diseases
    elif "fever" in combined_text:
        risk_level = "High" if req.severity == "Severe" or req.duration in ["1-2 weeks", "More than 2 weeks"] else "Moderate"
        urgency = "Within 24-48 Hours"
        specialist_rec = "General Physician / Infectious Disease Specialist"
        possible_conditions = [
            "Acute Viral Pyrexia / Upper Respiratory Infection",
            "Bacterial Infection (Streptococcal Throat, Urinary Tract Infection)",
            "Vector-Borne Infection (Dengue, Malaria, Typhoid - pending region)"
        ]
        recommended_actions = [
            "Take Paracetamol (500mg-650mg) every 6 hours for temperature reduction.",
            "Maintain high fluid intake (2.5L-3L daily) to prevent dehydration.",
            "Apply tepid sponging to forehead and neck.",
            "Seek doctor evaluation if fever lasts longer than 3 days or exceeds 103°F."
        ]
        tests = ["Complete Blood Count (CBC with Platelets)", "Dengue NS1 / Widal Test", "Urine Routine", "C-Reactive Protein (CRP)"]

    # 6. Musculoskeletal / Joint Pain
    elif "joint pain" in combined_text or "fatigue" in combined_text:
        risk_level = "Moderate" if req.duration in ["1-2 weeks", "More than 2 weeks"] else "Low"
        urgency = "Within 3-5 Days"
        specialist_rec = "Rheumatologist / Orthopedic Specialist"
        possible_conditions = [
            "Osteoarthritis / Inflammatory Joint Strain",
            "Post-Viral Arthralgia & Fatigue Syndrome",
            "Vitamin D or B12 Deficiency",
            "Mild Musculoskeletal Strain"
        ]
        recommended_actions = [
            "Apply hot or cold compresses to painful joints for 15 minutes.",
            "Gentle stretching and rest; avoid high-impact physical stress.",
            "Consider OTC anti-inflammatory gel or Paracetamol after meals."
        ]
        tests = ["Serum Vitamin D3 & B12", "Uric Acid Level", "ESR & Rheumatoid Factor (RF)"]

    # 7. Low-Risk Default
    else:
        risk_level = "Low"
        urgency = "Routine Self-Care / Consultation in 3-5 Days"
        specialist_rec = "General Practitioner / Primary Care Physician"
        possible_conditions = [
            "Mild Upper Respiratory Viral Cold",
            "Transient Fatigue / Sleep Deprivation",
            "Mild Allergic Sensitivity"
        ]
        recommended_actions = [
            "Ensure 7-8 hours of sound sleep and stay well hydrated.",
            "Consume balanced nutrient-dense meals.",
            "Monitor symptoms over the next 48 hours; consult a doctor if symptoms worsen."
        ]
        tests = ["Routine Wellness Blood Panel", "Blood Pressure Check"]

    disclaimer = "⚠️ IMPORTANT CLINICAL DISCLAIMER: This symptom triage evaluation is generated by an automated clinical algorithm for educational guidance only. It is NOT a clinical diagnosis. Always consult a qualified medical doctor."

    return {
        "risk_level": risk_level,
        "possible_conditions": possible_conditions,
        "recommended_actions": recommended_actions,
        "specialist_recommendation": specialist_rec,
        "urgency_timeframe": urgency,
        "suggested_tests": tests,
        "disclaimer": disclaimer
    }
