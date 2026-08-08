import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.models.models import User
from app.core.security import get_password_hash

# Import Routers
from app.api.auth import router as auth_router
from app.api.chat import router as chat_router
from app.api.reports import router as reports_router
from app.api.symptoms import router as symptoms_router
from app.api.medicines import router as medicines_router
from app.api.hospitals import router as hospitals_router
from app.api.reminders import router as reminders_router
from app.api.admin import router as admin_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create database tables
Base.metadata.create_all(bind=engine)

def seed_admin_user():
    db = SessionLocal()
    try:
        admin_user = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
        if not admin_user:
            admin_user = User(
                email=settings.ADMIN_EMAIL,
                full_name="MediCare System Admin",
                hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
                role="admin",
                is_active=True
            )
            db.add(admin_user)
            db.commit()
            logger.info("Admin user seeded successfully.")
    except Exception as e:
        logger.error(f"Error seeding admin user: {e}")
    finally:
        db.close()

seed_admin_user()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="MediCare AI Assistant REST API"
)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root Endpoint
@app.get("/")
def root():
    return {
        "message": "Welcome to MediCare AI Assistant Backend API",
        "status": "online",
        "docs": "/docs",
        "api_v1": "/api/v1"
    }

# Health Check Endpoint
@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "version": "1.0.0"
    }

# Register Routers under both /api/v1 AND root for dual compatibility
api_v1 = settings.API_V1_STR

# 1. Mount with /api/v1 prefix
app.include_router(auth_router, prefix=api_v1)
app.include_router(chat_router, prefix=api_v1)
app.include_router(reports_router, prefix=api_v1)
app.include_router(symptoms_router, prefix=api_v1)
app.include_router(medicines_router, prefix=api_v1)
app.include_router(hospitals_router, prefix=api_v1)
app.include_router(reminders_router, prefix=api_v1)
app.include_router(admin_router, prefix=api_v1)

# 2. Dual-mount at root so calls with or without /api/v1 work 100%
app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(reports_router)
app.include_router(symptoms_router)
app.include_router(medicines_router)
app.include_router(hospitals_router)
app.include_router(reminders_router)
app.include_router(admin_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
