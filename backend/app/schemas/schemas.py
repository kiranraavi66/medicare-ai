import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr

# Auth Schemas
class UserRegister(BaseModel):
    email: EmailStr
    full_name: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    email: str
    full_name: str
    role: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: str
    is_active: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# Chat Schemas
class ChatRequest(BaseModel):
    message: str

class ChatMessageOut(BaseModel):
    id: int
    sender: str
    content: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# Report Schemas
class MedicalReportOut(BaseModel):
    id: int
    filename: str
    file_type: str
    summary: str
    key_findings: Optional[str]
    disclaimer: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# Symptom Checker Schema
class SymptomCheckRequest(BaseModel):
    age: int
    gender: str
    symptoms: List[str]
    duration: str
    severity: str # "Mild", "Moderate", "Severe"

class SymptomCheckResponse(BaseModel):
    risk_level: str # "Low", "Moderate", "High"
    possible_conditions: List[str]
    recommended_actions: List[str]
    disclaimer: str

# Reminder Schemas
class ReminderCreate(BaseModel):
    medicine_name: str
    dosage: str
    time_of_day: str
    frequency: Optional[str] = "Daily"
    notes: Optional[str] = None

class ReminderOut(BaseModel):
    id: int
    medicine_name: str
    dosage: str
    time_of_day: str
    frequency: str
    notes: Optional[str]
    is_active: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# Medicine Schemas
class MedicineOut(BaseModel):
    id: int
    name: str
    generic_name: str
    category: str
    uses: str
    side_effects: str
    precautions: str
    dosage_info: str

    class Config:
        from_attributes = True

# Hospital Locator Schema
class HospitalSearchRequest(BaseModel):
    latitude: float
    longitude: float
    radius_km: Optional[float] = 10.0
    category: Optional[str] = "all" # "emergency", "clinic", "pharmacy", "general"

class HospitalInfo(BaseModel):
    id: str
    name: str
    type: str
    address: str
    phone: str
    distance_km: float
    latitude: float
    longitude: float
    open_24_7: bool
