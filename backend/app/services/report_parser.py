import io
import logging
from pypdf import PdfReader

logger = logging.getLogger(__name__)

def extract_text_from_file(file_bytes: bytes, filename: str) -> str:
    """Extract raw text from PDF or text files."""
    filename_lower = filename.lower()
    
    if filename_lower.endswith(".pdf"):
        try:
            pdf_file = io.BytesIO(file_bytes)
            reader = PdfReader(pdf_file)
            extracted_text = ""
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    extracted_text += text + "\n"
            return extracted_text if extracted_text.strip() else "PDF contains scanned images or unextractable text."
        except Exception as e:
            logger.error(f"Error parsing PDF file {filename}: {e}")
            return f"Error reading PDF file: {str(e)}"
    else:
        # Fallback text reading for txt or simulated OCR
        try:
            return file_bytes.decode("utf-8", errors="ignore")
        except Exception as e:
            return "Unable to decode text file contents."
