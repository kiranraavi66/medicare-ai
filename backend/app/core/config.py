import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "MediCare AI Assistant"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretjwtkeyforbtechprojectchangeinproduction")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./sql_app.db")
    
    # Gemini AI API Key
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Seed Admin
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "admin@medicare.ai")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "adminpassword123")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True
    )

settings = Settings()

