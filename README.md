# 🩺 MediCare AI — AI-Powered Healthcare Assistant & Web Platform

> **Full-Stack AI Healthcare Application**  
> An intelligent, full-stack medical information web application integrating **React**, **FastAPI**, **Google Gemini AI**, **JWT Authentication**, **Medical Lab Report Summarization**, **Symptom Risk Triage**, **Hospital Geolocation**, and **Medicine Schedule Reminders**.

---

## 🌟 Key Project Highlights & Resume Points

- **AI Medical Assistant**: Engineered a real-time conversational AI medical assistant leveraging **Google Gemini 1.5 Flash** with an intelligent medical rule engine fallback, Web Speech API (Voice-to-Text), and Speech Synthesis (Text-to-Speech audio response).
- **Medical Lab Report Summarizer**: Built an automated document processing pipeline (PDF/Image text extraction) that translates complex laboratory terminology into clear, layman-understandable findings with actionable medical insights.
- **Interactive Symptom Risk Triage**: Implemented an automated symptom risk score calculator (Low, Moderate, High) prioritizing patient safety with medical disclaimer compliance.
- **Hospital & Emergency Locator**: Integrated interactive **Leaflet / OpenStreetMap** geolocation services to map 24/7 trauma emergency rooms, clinics, and pharmacies based on real-time device GPS coordinates.
- **Medicine Schedule Manager**: Created a dosage scheduler with browser audio notifications to reduce missed prescription medication rates.
- **Security & Admin Control Panel**: Designed a Role-Based Access Control (RBAC) architecture secured via OAuth2 Bearer JWT tokens and password hashing (Bcrypt).

---

## 🏗️ System Architecture

```
                               ┌─────────────────────────────┐
                               │   React 18 SPA (Vite)       │
                               │  - Modern Glassmorphism UI  │
                               │  - Web Speech & Leaflet Map │
                               └──────────────┬──────────────┘
                                              │ REST API (JSON / JWT)
                                              ▼
                               ┌─────────────────────────────┐
                               │     FastAPI Backend         │
                               │  - Authentication & RBAC    │
                               │  - Chat, Symptoms & Reports │
                               └──────┬────────────────▲─────┘
                                      │                │
            ┌─────────────────────────┴────┐     ┌─────┴──────────────────────┐
            ▼                              ▼     │                            │
 ┌──────────────────────┐    ┌─────────────────┐ │  ┌──────────────────────┐  │
 │  SQLite / PostgreSQL │    │ Google Gemini   │ │  │ Medical Lab Parser   │  │
 │  (SQLAlchemy ORM)    │    │ 1.5 Flash API   │ │  │ (PyPDF / Text OCR)   │  │
 └──────────────────────┘    └─────────────────┘ │  └──────────────────────┘  │
                                                 └────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router v6, Axios, Lucide Icons, Leaflet Maps, Web Speech API |
| **Backend** | Python 3.11, FastAPI, Pydantic v2, SQLAlchemy ORM, PyJWT, Passlib (Bcrypt) |
| **AI & ML** | Google Gemini 1.5 Flash API + Intelligent Healthcare Fallback Rule Engine |
| **Database** | SQLite (Local Development) / PostgreSQL 15 (Docker Production) |
| **DevOps & Containers** | Docker, Docker-Compose, Nginx |

---

## 🚀 Getting Started

### Method 1: Local Development Setup (Recommended)

#### 1. Backend Setup (FastAPI)
```bash
# Navigate to backend directory
cd backend

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI development server
uvicorn app.main:app --reload --port 8000
```
> Backend runs at: **`http://localhost:8000`**  
> Interactive Swagger API Documentation: **`http://localhost:8000/docs`**

#### 2. Frontend Setup (React + Vite)
```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install Node modules
npm install

# Start Vite dev server
npm run dev
```
> Frontend application runs at: **`http://localhost:5173`**

---

### Method 2: Docker Compose Setup

Run the entire multi-container stack (PostgreSQL + FastAPI + React + Nginx) with a single command:

```bash
docker-compose up --build
```
> Frontend available at: **`http://localhost:3000`**  
> Backend available at: **`http://localhost:8000`**

---

## 🔑 Demo Account Credentials

| User Type | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@medicare.ai` | `adminpassword123` | Full Admin Control Panel & User Management |
| **Patient Demo** | `patient@medicare.ai` | `password123` | Patient Dashboard, AI Chat, Reports & Reminders |

*(Note: You can also register a new custom account anytime on the Registration page.)*

---

## 📋 API Endpoints Summary

- **Auth**: `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `GET /api/v1/auth/me`
- **AI Chat**: `POST /api/v1/chat/send`, `GET /api/v1/chat/history`, `DELETE /api/v1/chat/history`
- **Reports**: `POST /api/v1/reports/upload`, `GET /api/v1/reports/`, `DELETE /api/v1/reports/{id}`
- **Symptoms**: `POST /api/v1/symptoms/check`
- **Medicines**: `GET /api/v1/medicines/`, `GET /api/v1/medicines/{id}`
- **Hospitals**: `GET /api/v1/hospitals/nearby`
- **Reminders**: `POST /api/v1/reminders/`, `GET /api/v1/reminders/`, `PUT /api/v1/reminders/{id}/toggle`
- **Admin**: `GET /api/v1/admin/stats`, `GET /api/v1/admin/users`, `PUT /api/v1/admin/users/{id}/toggle`

---

## 📄 License & Disclaimer

This project is created for educational and academic presentation purposes. Medical information supplied by the AI assistant or symptom checker does not constitute certified clinical medical advice.
