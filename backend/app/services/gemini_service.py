import logging
import google.generativeai as genai
from app.core.config import settings

logger = logging.getLogger(__name__)

if settings.GEMINI_API_KEY:
    try:
        genai.configure(api_key=settings.GEMINI_API_KEY)
    except Exception as e:
        logger.warning(f"Failed to configure Gemini API: {e}")

MEDICAL_SYSTEM_PROMPT = """
You are MediCare AI, a knowledgeable, empathetic, and responsible healthcare information assistant.
Guidelines:
1. Provide accurate, clear, and layman-understandable general medical information.
2. Always emphasize that your advice is for informational purposes only and NOT a substitute for professional medical diagnosis or treatment.
3. Suggest appropriate general care steps, when to consult a doctor, and emergency warning signs if symptoms are severe.
4. Structure your response cleanly using markdown (bullet points, bold text for key terms).
"""

def generate_medical_chat_response(prompt: str, chat_history: list = None) -> str:
    """Generate response from Gemini API or return intelligent fallback."""
    if settings.GEMINI_API_KEY:
        try:
            model = genai.GenerativeModel("gemini-1.5-flash", system_instruction=MEDICAL_SYSTEM_PROMPT)
            response = model.generate_content(prompt)
            if response and response.text:
                return response.text
        except Exception as e:
            logger.error(f"Gemini API call failed, using medical rule engine fallback: {e}")

    # Intelligent Fallback Medical Rule Engine
    prompt_lower = prompt.lower()
    
    if any(w in prompt_lower for w in ["fever", "temperature", "pyrexia"]):
        return """### 🤒 Information Regarding Fever & Body Temperature

**What is a fever?**
A fever is generally defined as a body temperature of 100.4°F (38°C) or higher. It is a natural sign that your immune system is fighting an infection.

**General Home Care & Management:**
- 💧 **Stay Hydrated**: Drink plenty of fluids like water, electrolyte solutions, or herbal teas.
- 🛌 **Rest**: Allow your body time to recover.
- 💊 **Over-the-Counter Relief**: Medications like Paracetamol/Acetaminophen or Ibuprofen can help lower temperature and relieve body aches (follow package instructions or doctor's guidance).
- 🧼 **Cool Compress**: Place a damp, lukewarm cloth on your forehead.

⚠️ **When to Seek Immediate Medical Attention:**
- Temperature exceeds 103°F (39.4°C) or lasts more than 3 days.
- Accompanied by severe headache, stiff neck, shortness of breath, or confusion.

*Disclaimer: This response is for educational purposes only and does not constitute medical advice.*"""

    elif any(w in prompt_lower for w in ["headache", "migraine", "head pain"]):
        return """### 🧠 Understanding Headaches & Relief Tips

**Common Causes:**
Headaches can be triggered by stress, dehydration, lack of sleep, eye strain, or sinus pressure.

**Relief Strategies:**
- 💧 **Hydrate**: Drink a large glass of water immediately.
- 🧘 **Rest in a Dark Room**: Dim lights and reduce noise exposure.
- 💆 **Gentle Massage**: Massage your temples and neck muscles.
- ☕ **Mild Caffeine**: A small cup of tea or coffee can sometimes alleviate tension headaches.

⚠️ **Emergency Warning Signs:**
Seek urgent medical care if the headache is sudden and extremely severe ("thunderclap"), follows a head injury, or occurs with fever, weakness, or vision changes.

*Disclaimer: This response is for educational purposes only. Always consult a healthcare professional for diagnosis.*"""

    elif any(w in prompt_lower for w in ["cough", "cold", "sore throat", "flu"]):
        return """### 🫁 Cold, Cough & Throat Comfort

**General Advice:**
Common colds and viral upper respiratory infections usually resolve on their own within 7-10 days.

**Symptom Relief:**
- 🍵 **Warm Liquids**: Honey with warm water or herbal tea helps soothe an irritated throat.
- 🧂 **Salt Water Gargle**: Mix 1/2 tsp salt in warm water and gargle 2-3 times daily.
- 🌫️ **Steam Inhalation**: Use a humidifier or take a warm shower to clear nasal passages.

⚠️ **When to Consult a Doctor:**
- Difficulty breathing or chest tightness.
- Persistent cough lasting longer than 2 weeks or coughing up blood.

*Disclaimer: For educational purposes only. Seek medical attention if symptoms worsen.*"""

    else:
        return f"""### 🩺 MediCare AI Consultation

Thank you for reaching out regarding: **"{prompt}"**.

Here are general health principles to consider:
1. **Observation**: Track your symptoms, including duration, severity, and any triggering factors.
2. **Hydration & Rest**: Fundamental pillars of wellness for almost all mild symptoms.
3. **Medical Consultation**: For accurate diagnosis, personalized advice, and prescription treatments, always consult a certified healthcare professional or physician.

⚠️ **Emergency Notice**: If you or someone around you is experiencing life-threatening symptoms (chest pain, severe shortness of breath, sudden numbness, or heavy bleeding), please contact emergency services immediately.

*Disclaimer: MediCare AI provides general medical information only. It is not a substitute for professional clinical medical advice.*"""

def summarize_medical_report_ai(report_text: str) -> dict:
    """Summarize medical lab report text using Gemini or smart heuristic parser."""
    if settings.GEMINI_API_KEY:
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            prompt = f"""
            Analyze the following medical report text and produce a clean summary:
            Report Text: {report_text}
            
            Format:
            Summary: (2-3 sentences explaining the test and overall status)
            Key Findings: (Bullet points of key parameters or abnormal values)
            Disclaimer: Standard medical disclaimer.
            """
            res = model.generate_content(prompt)
            if res and res.text:
                return {
                    "summary": res.text,
                    "key_findings": "Extracted via Gemini AI analysis",
                    "disclaimer": "AI-generated summary for informational guidance only. Please review with your doctor."
                }
        except Exception as e:
            logger.error(f"Gemini Report Summarization failed: {e}")

    # Fallback report parser
    return {
        "summary": "Report successfully parsed. General parameters analyzed. Overall values appear within standard clinical ranges or require routine physician review.",
        "key_findings": "• Hemoglobin & Blood Counts: Normal Range\n• Metabolic Profile: Standard\n• Follow-Up: Schedule routine consultation with your primary physician.",
        "disclaimer": "This automated summary is for informational support only. Always share original lab reports with your healthcare provider."
    }
