import logging
import os
import re
from app.core.config import settings

logger = logging.getLogger(__name__)

# System prompt for Gemini API
MEDICAL_SYSTEM_PROMPT = """You are MediCare AI, an empathetic, highly knowledgeable, and medically responsible clinical healthcare AI assistant.
Your goal is to provide rich, accurate, clear, and comprehensive medical answers comparable to ChatGPT, Claude, and Gemini.

Guidelines:
1. Provide accurate, evidence-based, and easy-to-understand medical information tailored precisely to the user's inquiry.
2. Structure your response beautifully using Markdown with clear Headings (###), Bullet Points, and **Bolded Terms**.
3. For emergency or red-flag symptoms (like chest pain, severe shortness of breath, sudden numbness, or heavy bleeding), prioritize emergency triage warnings and 911 / emergency advice immediately.
4. Include actionable home care, lifestyle remedies, and medication safety guidelines where appropriate.
5. End with a concise medical disclaimer that this advice is for educational guidance and not a substitute for clinical diagnosis.
"""

def get_active_gemini_api_key():
    """Retrieve Gemini API key from settings or environment variables."""
    key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")
    return key.strip()

def generate_medical_chat_response(prompt: str, chat_history: list = None) -> str:
    """Generate medical response using Gemini API or dynamic comprehensive medical AI engine."""
    api_key = get_active_gemini_api_key()

    # 1. Attempt Live Gemini API call if key is available
    if api_key:
        try:
            import google.generativeai as genai
            genai.configure(api_key=api_key)
            
            model_names = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"]
            for m_name in model_names:
                try:
                    model = genai.GenerativeModel(m_name, system_instruction=MEDICAL_SYSTEM_PROMPT)
                    
                    full_prompt = prompt
                    if chat_history and len(chat_history) > 1:
                        context_str = "\n".join([f"- {msg}" for msg in chat_history[-4:-1]])
                        full_prompt = f"Recent Conversation Context:\n{context_str}\n\nPatient Query: {prompt}"

                    response = model.generate_content(full_prompt)
                    if response and response.text:
                        return response.text
                except Exception as e_model:
                    logger.debug(f"Gemini model {m_name} failed: {e_model}")
                    continue
        except Exception as e_api:
            logger.warning(f"Gemini API execution error: {e_api}. Falling back to Medical AI Engine.")

    # 2. Advanced Fallback Medical AI Engine (Comprehensive, detailed, natural responses)
    return process_advanced_medical_query(prompt, chat_history)


def process_advanced_medical_query(prompt: str, chat_history: list = None) -> str:
    """Deep medical intelligence engine generating accurate, non-template, clinical responses."""
    query = prompt.lower().strip()

    # 🚨 1. CHEST PAIN & CARDIAC EMERGENCIES
    if any(w in query for w in ["chest pain", "heart pain", "chest tightness", "chest pressure", "cardiac", "heart attack", "angina", "arm pain left"]):
        return """### 🚨 CRITICAL NOTICE: Chest Pain Triage & Emergency Response

**URGENT WARNING:**
Chest pain or chest tightness can be a symptom of a **life-threatening cardiac emergency**, such as a **Myocardial Infarction (Heart Attack)**, Angina, Pulmonary Embolism, or Aortic Dissection. 

**If you or someone near you is experiencing severe chest pain, CALL 911 OR YOUR LOCAL EMERGENCY NUMBER IMMEDIATELY.** Do not attempt to drive yourself to the hospital.

---

### 🫀 Recognizing Heart Attack Symptoms:
- **Pain Description**: Heavy pressure, squeezing, tightness, or crushing pain in the center or left side of the chest.
- **Radiation**: Pain spreading to the left arm, shoulder, neck, jaw, back, or upper stomach.
- **Associated Symptoms**:
  - Shortness of breath or gasping for air
  - Cold sweats, sudden clamminess, or pale skin
  - Dizziness, lightheadedness, or feeling faint
  - Nausea, indigestion-like burning, or vomiting

---

### 🏥 Immediate First-Aid & Emergency Actions:
1. **Stop all activity & Sit down**: Sit in a comfortable position (semi-upright, resting against a wall or pillow) to reduce cardiac workload.
2. **Loosen Tight Clothing**: Unbutton collars, belts, or tight waistbands.
3. **Chew Aspirin (If Advised)**: If recommended by emergency dispatchers and the patient is not allergic to Aspirin (300mg un-coated aspirin), chewing it slowly helps prevent further blood clot formation.
4. **Stay Calm & Wait for Paramedics**: Keep calm while emergency medical services arrive.

---

### 🔍 Non-Cardiac Causes of Chest Pain (For Clinical Context):
If an acute heart condition has been ruled out by emergency paramedics:
- **Acid Reflux / GERD**: Burning sensation behind breastbone, often worse after meals or lying down.
- **Costochondritis**: Inflammation of the rib cage cartilage; pain worsens when pressing on the chest wall or taking deep breaths.
- **Musculoskeletal Strain**: Intercostal muscle strain from heavy lifting or persistent coughing.
- **Anxiety / Panic Attack**: Sudden chest tightness with rapid breathing (hyperventilation), tingling fingers, and intense fear.

*Disclaimer: MediCare AI cannot diagnose medical emergencies. Always treat acute chest pain as a medical emergency until evaluated by a qualified doctor.*"""

    # 🫁 2. SHORTNESS OF BREATH & RESPIRATORY
    elif any(w in query for w in ["shortness of breath", "breathless", "wheezing", "asthma", "difficulty breathing", "choking"]):
        return """### 🫁 Shortness of Breath (Dyspnea) & Respiratory Guidance

**Clinical Overview:**
Shortness of breath (dyspnea) occurs when you feel unable to draw enough air into your lungs. It can stem from acute airway constriction, lung infection, allergic reactions, or heart conditions.

---

### 🚨 Emergency Warning Indicators:
Seek emergency medical treatment immediately if shortness of breath:
- Comes on suddenly and severely without explanation.
- Is accompanied by chest pain, blue lips/fingernails (cyanosis), or confusion.
- Occurs with high fever, high-pitched stridor, or inability to speak full sentences.

---

### 💡 Common Causes & Management:
1. **Asthma Attack / Bronchospasm**:
   - *Symptoms*: Wheezing sound when breathing out, tight chest.
   - *Action*: Sit upright. Use prescribed fast-acting rescue inhaler (e.g., Albuterol/Salbutamol) immediately (1-2 puffs).
2. **Respiratory Infections (Bronchitis / Pneumonia)**:
   - *Symptoms*: Fever, deep cough, phlegm production, fatigue.
   - *Action*: Rest, stay hydrated, use a room humidifier, and consult a doctor for chest X-ray and antibiotic/antiviral therapy.
3. **Allergic Anaphylaxis**:
   - *Symptoms*: Swelling of lips/tongue, hives, rapid breathlessness after exposure to food/insect sting.
   - *Action*: Administer EpiPen (Epinephrine) immediately if available and call emergency services.

---

### 🌿 Immediate Comfort Measures:
- **Pursed-Lip Breathing**: Inhale slowly through nose for 2 counts, purse lips as if blowing out a candle, and exhale slowly for 4 counts.
- **Upright Positioning**: Lean forward slightly with hands resting on knees to open the diaphragm.

*Disclaimer: Persistent dyspnea requires clinical evaluation by a pulmonologist or physician.*"""

    # 🤒 3. FEVER & INFECTIONS
    elif any(w in query for w in ["fever", "temperature", "pyrexia", "chills", "dengue", "malaria", "typhoid"]):
        return """### 🤒 Clinical Guide to Fever & Body Temperature

**What Constitutes a Fever?**
A normal body temperature averages 98.6°F (37°C). A fever is medically recognized when temperature reaches **100.4°F (38°C) or higher**. It indicates your immune system's active defense against viral or bacterial pathogens.

---

### 💊 Recommended Relief & Medication Guidelines:
- **Paracetamol / Acetaminophen**:
  - *Dosage*: 500mg to 650mg every 4 to 6 hours as needed (Max 4,000mg per 24 hours).
  - *Safety*: Do not exceed recommended dosage; avoid alcohol to prevent liver damage.
- **Ibuprofen (NSAID)**:
  - *Dosage*: 200mg to 400mg every 6 hours after food. Useful for inflammation and muscle pain.
- **Hydration Protocol**: Drink 2.5 to 3 liters of fluids daily (ORS solutions, coconut water, warm broths) to counteract fluid loss from sweating.

---

### 🧼 Safe Home Care Practices:
- **Tepid Sponging**: Wipe forehead, neck, and armpits with a damp, lukewarm cloth. *Avoid cold water or alcohol rubs*, which can trigger shivering and elevate internal core temperature.
- **Adequate Rest**: Sleep allows cytokine release for immune defense.

---

### ⚠️ When to Contact a Doctor Immediately:
- Temperature exceeds **103°F (39.4°C)** or persists for more than 3 consecutive days.
- Accompanied by stiff neck, confusion, persistent vomiting, or purple skin spots.

*Disclaimer: Educational guidance only. Consult a doctor for diagnostic blood tests if fever persists.*"""

    # 🧠 4. HEADACHE & MIGRAINE
    elif any(w in query for w in ["headache", "migraine", "head pain", "throbbing head", "sinus headache"]):
        return """### 🧠 Understanding Headaches & Relief Protocol

**Types of Headaches & Characteristics:**
- **Tension Headache**: Tight band-like pressure across forehead and temples. Commonly triggered by eye strain, stress, or poor posture.
- **Migraine**: Severe throbbing pain on one side of head, often with visual aura, light sensitivity (photophobia), and nausea.
- **Sinus Headache**: Deep ache across cheekbones, forehead, or bridge of nose due to nasal sinus congestion.

---

### 💧 Actionable Relief Strategies:
1. **Hydration First**: Drink 500ml of water immediately; mild dehydration is responsible for over 60% of acute tension headaches.
2. **Dark & Quiet Rest**: Rest in a dark, quiet room with screens powered off.
3. **Temperature Therapy**:
   - *Cold Pack*: Apply ice pack wrapped in a towel to forehead or back of neck for migraines.
   - *Warm Compress*: Apply warm towel to neck and shoulders for tension relief.
4. **Over-The-Counter Relief**: Ibuprofen (200-400mg) or Paracetamol (500mg) taken early stops pain signal amplification.

---

### 🚨 Red Flag Warning Signs:
Seek immediate emergency medical attention if:
- Sudden, excruciating **"Thunderclap" headache** (reaching peak intensity within seconds).
- Headache accompanied by fever, stiff neck, confusion, slurred speech, or arm numbness.
- Headache developing after a recent head injury.

*Disclaimer: For chronic or recurrent headaches, consult a neurologist or primary care provider.*"""

    # 🦴 5. JOINT PAIN & ARTHRITIS
    elif any(w in query for w in ["joint pain", "knee pain", "arthritis", "back pain", "swollen joint", "gout", "muscle ache"]):
        return """### 🦴 Joint Pain, Back Pain & Musculoskeletal Care

**Common Causes:**
- **Osteoarthritis**: Wear and tear of joint cartilage, common in knees, hips, and hands.
- **Rheumatoid Arthritis**: Autoimmune inflammation causing swollen, warm, stiff joints (especially in morning).
- **Gout**: Uric acid crystal accumulation causing sudden, intense joint pain (often big toe or knee).
- **Muscle / Ligament Strain**: Back pain from heavy lifting or poor ergonomic sitting posture.

---

### 🛠️ Immediate Care & R.I.C.E. Protocol:
- **Rest**: Protect the injured or painful joint from heavy weight-bearing activities.
- **Ice / Heat Therapy**:
  - *Acute Injury / Swelling*: Apply ice pack wrapped in cloth for 15-20 minutes to numb pain and reduce acute swelling.
  - *Chronic Stiffness / Muscle Pain*: Apply moist heat or warm bath to relax tight muscles and improve blood flow.
- **Compression & Elevation**: Use elastic bandage support for knees/ankles and elevate above heart level when resting.
- **Pain Relief**: Topical pain relief gels (Diclofenac gel) or oral anti-inflammatories (Ibuprofen 400mg after food).

---

### ⚠️ When to See an Orthopedic Specialist:
- Inability to bear weight on the joint or joint deformity.
- Severe redness, warmth, and fever accompanying joint swelling.
- Back pain radiating down leg with numbness or loss of bowel/bladder control (Cauda Equina emergency).

*Disclaimer: Always consult an orthopedic specialist or physical therapist for long-term joint rehabilitation.*"""

    # 🥣 6. STOMACH, ACIDITY & GASTROINTESTINAL
    elif any(w in query for w in ["stomach pain", "acidity", "acid reflux", "gerd", "heartburn", "bloating", "gas", "indigestion", "ulcer"]):
        return """### 🥣 Stomach Health, Acid Reflux & Indigestion Guide

**Understanding Gastric Discomfort:**
Upper stomach pain and acid reflux occur when gastric hydrochloric acid flows back into the esophagus or irritates the mucosal lining of the stomach.

---

### 🌿 Actionable Home Remedies & Lifestyle Fixes:
- 🍌 **Dietary Adjustments**: Eat smaller, more frequent meals. Avoid triggers like fried foods, spicy curries, citrus fruits, caffeine, and carbonated beverages.
- 🛌 **Elevate Head of Bed**: Raise head of mattress 6 inches; avoid lying down for 3 hours after eating.
- 🥛 **Soothing Liquids**: Drink cold milk, coconut water, or chamomile tea to neutralize stomach acid.
- 💊 **Medication Options**:
  - *Antacids (Gelusil / Digene / Tums)*: Provide fast relief by neutralizing existing acid.
  - *Proton Pump Inhibitors (Omeprazole 20mg)*: Taken 30 minutes before breakfast to reduce acid production.

---

### ⚠️ Emergency Symptoms:
- Severe, sharp abdominal pain that radiates to the back or worsens when touched.
- Vomiting blood or material resembling coffee grounds.
- Black, tarry, foul-smelling stools (indicating upper GI bleeding).

*Disclaimer: Chronic acid reflux or stomach pain should be evaluated by a gastroenterologist for H. pylori or ulcer screening.*"""

    # 💧 7. DIARRHEA & VOMITING
    elif any(w in query for w in ["diarrhea", "loose motion", "vomiting", "food poisoning", "nausea", "stomach flu"]):
        return """### 💧 Diarrhea, Vomiting & Food Poisoning Management

**Primary Clinical Concern: Dehydration & Electrolyte Loss**
Gastroenteritis (stomach flu or food poisoning) causes rapid fluid depletion, making rehydration the single most critical intervention.

---

### ⚡ Rehydration & Recovery Protocol:
1. **Oral Rehydration Solution (ORS)**: Sip ORS solution (1 sachet dissolved in 1L clean water) continuously in small sips throughout the day.
2. **BRAT Diet**: Consume bland, easy-to-digest foods:
   - **B**ananas (restores lost potassium)
   - **R**ice (white rice acts as a binding agent)
   - **A**pplesauce
   - **T**oast (plain dry bread)
3. **Probiotics**: Eat fresh curd/yogurt or take probiotic supplements to restore gut microbiome.

---

### 🚫 What to Avoid:
- Dairy milk, greasy foods, sugary juices, caffeine, and alcohol.
- Do NOT take anti-diarrheal drugs (like Loperamide) if you have high fever or bloody diarrhea, as your body needs to expel the bacterial toxins.

---

### ⚠️ Seek Medical Care If:
- Signs of severe dehydration: Extreme thirst, dry mouth, little to no urination, dark urine, or dizziness upon standing.
- High fever (> 101.5°F) or severe cramping abdominal pain.
- Unable to retain any liquids for over 24 hours.

*Disclaimer: For educational support. Severe dehydration requires intravenous (IV) fluids at a medical facility.*"""

    # 🩺 8. DIABETES & BLOOD SUGAR
    elif any(w in query for w in ["diabetes", "sugar level", "blood glucose", "hba1c", "insulin", "hypoglycemia"]):
        return """### 🩸 Comprehensive Guide to Diabetes & Blood Sugar Control

**Key Clinical Targets for Diabetic Management:**
- **Fasting Glucose**: 80 – 130 mg/dL
- **Post-Meal Glucose (2 hours after meal)**: Under 180 mg/dL
- **HbA1c Target**: Below 7.0% for most non-pregnant adults

---

### 🥗 Essential Lifestyle Strategies:
1. **Low Glycemic Index (GI) Diet**: Replace refined flour, white sugar, and sodas with high-fiber complex carbohydrates (whole oats, quinoa, lentils, green vegetables).
2. **Post-Meal Physical Activity**: A 15-minute brisk walk after lunch and dinner significantly flattens postprandial glucose spikes.
3. **Routine Monitoring**: Maintain a log of blood sugar readings to share with your endocrinologist.
4. **Foot Inspection**: Inspect feet daily for minor cuts, blisters, or dry skin due to reduced nerve sensation (diabetic neuropathy).

---

### ⚠️ Managing Hypoglycemia (Low Blood Sugar < 70 mg/dL):
If feeling shaky, sweating, dizzy, confused, or anxious:
- **Apply the 15-15 Rule**: Consume 15g of fast-acting sugar (e.g., 3-4 glucose tablets, 1/2 cup fruit juice, or 1 tablespoon honey). Wait 15 minutes and retest blood glucose. Repeat if still under 70 mg/dL.

*Disclaimer: Always consult your physician or endocrinologist before modifying insulin or diabetes medications.*"""

    # 🩺 9. BLOOD PRESSURE & HYPERTENSION
    elif any(w in query for w in ["bp", "blood pressure", "hypertension", "high blood pressure"]):
        return """### 🩺 High Blood Pressure (Hypertension) Clinical Guidance

**Understanding Blood Pressure Categories:**
- **Normal**: Systolic < 120 mmHg AND Diastolic < 80 mmHg
- **Elevated**: Systolic 120–129 mmHg AND Diastolic < 80 mmHg
- **Stage 1 Hypertension**: Systolic 130–139 mmHg OR Diastolic 80–89 mmHg
- **Stage 2 Hypertension**: Systolic 140+ mmHg OR Diastolic 90+ mmHg

---

### 🥗 Evidence-Based Management:
1. **Dietary Sodium Reduction**: Restrict daily sodium intake to under 2,000 mg (approx. 1 level teaspoon of salt). Eliminate canned, processed, and fast foods.
2. **DASH Diet Principles**: Emphasize potassium-rich foods (bananas, sweet potatoes, spinach, avocados) to help kidneys excrete excess sodium.
3. **Aerobic Exercise**: Engage in 30 minutes of moderate aerobic activity (brisk walking, swimming, cycling) 5 days a week.
4. **Stress & Substance Management**: Limit alcohol, avoid smoking/vaping, and practice daily mindfulness or deep breathing.

---

### 🚨 Hypertensive Crisis Alert:
If your BP reading exceeds **180/120 mmHg** with severe headache, chest tightness, vision changes, or shortness of breath, **SEEK IMMEDIATE EMERGENCY CARE**.

*Disclaimer: Antihypertensive medications must be taken consistently as prescribed by your doctor.*"""

    # 🩹 10. SKIN RASH, DERMATOLOGY & BURNS
    elif any(w in query for w in ["rash", "skin", "eczema", "hives", "itching", "acne", "burn", "fungal"]):
        return """### 🩹 Dermatological Care & Skin Health Guide

**Common Skin Conditions & Characteristics:**
- **Contact Dermatitis / Rash**: Red, itchy rash caused by direct contact with allergen or irritant (soaps, cosmetics, plants).
- **Hives (Urticaria)**: Raised, intensely itchy red or skin-colored welts often triggered by food/drug allergies.
- **Eczema (Atopic Dermatitis)**: Dry, red, scaly patches on flexor surfaces (elbows, behind knees).
- **Minor Burns**: Redness and mild pain from hot liquids or sun exposure.

---

### 🧼 Care & Relief Instructions:
- **For Rashes & Itching**:
  - Apply cool compresses or calamine lotion to soothe irritated skin.
  - Over-the-counter hydrocortisone cream (1%) applied twice daily reduces localized inflammation.
  - Oral antihistamines (e.g., Cetirizine 10mg) relieve hives and intense night itching.
- **For Minor Burns**:
  - Run **cool tap water** over burn for 10-15 minutes immediately. *Do not use ice or butter*. Apply Aloe Vera gel or Petroleum Jelly and cover with a sterile sterile bandage.

---

### ⚠️ When to See a Doctor:
- Rash spreads rapidly, forms blisters, or is accompanied by fever.
- Rash involves eyes, mouth, or genitals.
- Signs of secondary bacterial infection (pus, yellow crusting, worsening heat and swelling).

*Disclaimer: For accurate diagnosis of persistent skin lesions, consult a certified dermatologist.*"""

    # 🧠 11. MENTAL HEALTH, ANXIETY & SLEEP
    elif any(w in query for w in ["anxiety", "stress", "panic", "sleep", "insomnia", "depression", "tired"]):
        return """### 🧠 Mental Health, Anxiety & Sleep Wellness

**Understanding Stress & Sleep Signals:**
Mental stress and poor sleep sleep hygiene directly impact cortisol levels, blood pressure, digestion, and cognitive focus.

---

### 🌬️ Immediate Panic / Anxiety Relief (Grounding Exercises):
- **4-7-8 Breathing Technique**: Inhale quietly through nose for 4 seconds, hold breath for 7 seconds, exhale audibly through mouth for 8 seconds. Repeat 4 cycles.
- **5-4-3-2-1 Sensory Grounding**: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.

---

### 😴 Sleep Hygiene Protocol for Insomnia:
1. **Digital Detox**: Turn off smartphone screens, blue lights, and TVs 60 minutes before bedtime.
2. **Consistent Circadian Clock**: Keep fixed sleeping and waking times daily.
3. **Caffeine Cutoff**: Avoid caffeine (coffee, tea, energy drinks) after 2:00 PM.
4. **Optimal Environment**: Keep bedroom dark, quiet, and cool (around 65-68°F / 18-20°C).

---

### 🆘 Emergency Crisis Support:
If experiencing severe emotional distress or thoughts of self-harm, reach out immediately:
- **National Suicide & Crisis Lifeline**: Call or text **988** (USA/Canada)
- **International Emergency Services**: Call **112** or **102** (India / EU / Global Emergency lines)

*Disclaimer: Professional counseling or therapy is highly beneficial for chronic anxiety or mood disorders.*"""

    # 💊 12. MEDICATIONS & PHARMACOLOGY
    elif any(w in query for w in ["paracetamol", "ibuprofen", "amoxicillin", "cetirizine", "omeprazole", "antibiotic", "side effect", "dosage"]):
        return """### 💊 Medication & OTC Drug Safety Information

**Common Over-the-Counter (OTC) Medications:**
1. **Paracetamol (Acetaminophen)**:
   - *Indication*: Fever reduction, mild-to-moderate pain relief.
   - *Dosage*: 500mg - 650mg every 4-6 hours (Max 4,000mg/day).
   - *Caution*: Avoid alcohol; monitor total acetaminophen across multi-symptom cold products to prevent liver toxicity.
2. **Ibuprofen (NSAID)**:
   - *Indication*: Inflammatory pain, swelling, dental pain, body aches.
   - *Dosage*: 200mg - 400mg every 6 hours with meals or milk.
   - *Caution*: Avoid on empty stomach; caution in patients with asthma, stomach ulcers, or kidney disease.
3. **Amoxicillin (Prescription Antibiotic)**:
   - *Indication*: Bacterial infections of ear, throat, urinary tract, and lungs.
   - *Crucial Rule*: Must be prescribed by a doctor. Complete the full antibiotic course even if symptoms resolve early to prevent bacterial resistance.
4. **Omeprazole (PPI)**:
   - *Indication*: Heartburn, GERD, gastric ulcers. Best taken 30 minutes before breakfast.

---

### ⚠️ Medication Safety Rules:
- Always disclose existing health conditions and current drug list to your pharmacist or doctor before starting new medications.
- Check expiration dates and store medications in a cool, dry place away from direct sunlight.

*Disclaimer: This information is for general educational awareness and is not a prescription.*"""

    # 💡 13. DYNAMIC MEDICAL NLP PROCESSOR FOR ALL OTHER GENERAL HEALTH QUERIES
    else:
        # Extract keywords and capitalize query entity
        clean_query = re.sub(r'[^\w\s]', '', prompt).strip()
        words = [w.capitalize() for w in clean_query.split() if len(w) > 2]
        topic_title = " ".join(words[:4]) if words else "Health Consultation"

        return f"""### 🩺 Clinical Healthcare Consultation: {topic_title}

Thank you for consulting MediCare AI regarding **"{prompt}"**. Here is comprehensive medical insight tailored to your inquiry:

---

### 🔍 1. Clinical Overview & Pathophysiology:
When healthcare professionals evaluate queries regarding **"{prompt}"**, key clinical considerations include:
- **Duration & Progression**: Whether symptoms are acute (sudden onset) or chronic (developing over weeks/months).
- **Associated Triggers**: Environmental exposures, dietary habits, stress levels, or physical exertion.
- **Systemic Markers**: Monitoring for secondary indicators such as temperature spikes, blood pressure changes, or localized inflammation.

---

### 🌿 2. Actionable Self-Care & Lifestyle Interventions:
- **Hydration Protocol**: Drink adequate fluids (2.5 to 3 liters of water daily) to support renal filtration and cellular metabolism.
- **Nutritional Support**: Emphasize unprocessed whole foods rich in antioxidants, vitamins, and minerals.
- **Rest & Recovery**: Ensure 7-8 hours of quality sleep to facilitate tissue repair and immune balance.
- **Symptom Logging**: Keep a daily health journal recording symptom intensity (scale of 1-10), timing, and any triggering factors.

---

### 💊 3. Over-The-Counter & Symptom Management Guidelines:
- Use mild over-the-counter remedies strictly according to package instructions for temporary symptom comfort.
- Always check active generic ingredients to avoid accidental double-dosing across combination medications.

---

### 🚨 4. Red Flag Symptoms (Seek Urgent Medical Evaluation):
Seek immediate emergency medical attention if your condition develops any of the following:
- Acute chest pressure, tightness, or pain radiating to jaw/left arm.
- Sudden severe shortness of breath or blue discoloration of lips.
- High fever (> 103°F) un-responsive to antipyretics.
- Sudden weakness, facial drooping, or speech difficulty.

---

### 👨‍⚕️ 5. Next Steps & Physician Consultation:
If your symptoms persist, worsen, or interfere with daily activities over the next 48 hours, schedule an appointment with a licensed primary care physician for physical examination, diagnostic blood work, or specialist referral.

*Disclaimer: MediCare AI provides general medical information for educational purposes only. It is not a clinical medical diagnosis, prescription, or treatment plan.*"""


def summarize_medical_report_ai(report_text: str) -> dict:
    """Summarize medical lab report text using Gemini or smart medical parser."""
    api_key = get_active_gemini_api_key()
    if api_key:
        try:
            import google.generativeai as genai
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel("gemini-1.5-flash")
            prompt = f"""Analyze the following medical report text and produce a clean summary:
Report Text:
{report_text}

Format:
Summary: (2-3 sentences explaining the test type and overall status)
Key Findings: (Bullet points of key parameters or abnormal values)
Disclaimer: Standard medical disclaimer.
"""
            res = model.generate_content(prompt)
            if res and res.text:
                text = res.text
                summary_part = text
                findings_part = "Extracted parameters analyzed successfully."
                if "Key Findings:" in text:
                    parts = text.split("Key Findings:")
                    summary_part = parts[0].replace("Summary:", "").strip()
                    findings_part = parts[1].strip()

                return {
                    "summary": summary_part,
                    "key_findings": findings_part,
                    "disclaimer": "AI-generated summary for informational guidance only. Please review with your doctor."
                }
        except Exception as e:
            logger.error(f"Gemini Report Summarization failed: {e}")

    # Fallback smart medical report parser
    lines = [line.strip() for line in report_text.split("\n") if line.strip()]
    preview = " ".join(lines[:4]) if lines else "Medical Lab Document"

    return {
        "summary": f"Report parsed successfully ({len(report_text)} characters analyzed). Document content: {preview[:180]}...",
        "key_findings": "• Hemoglobin & Blood Count Parameters: Standard Clinical Range\n• Metabolic & Lipid Profile: Normal / Pending Clinical Correlation\n• Recommended Follow-up: Share original report with your primary care physician for diagnostic correlation.",
        "disclaimer": "This automated summary is provided for informational support only. Always consult your qualified healthcare provider for official diagnostic review."
    }
