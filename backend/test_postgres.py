import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.models.models import Base
from seed_db import seed_database

def test_and_seed_postgres(pg_url: str):
    print("=" * 60)
    print("🐘 POSTGRESQL CONNECTIVITY & SEED TEST")
    print("=" * 60)
    print(f"Target URL: {pg_url[:30]}...")

    try:
        engine = create_engine(pg_url, pool_pre_ping=True)
        conn = engine.connect()
        print("✅ Successfully connected to PostgreSQL Server!")
        conn.close()

        # Create all tables on PostgreSQL
        print("🔨 Creating tables on PostgreSQL...")
        Base.metadata.create_all(bind=engine)
        print("✅ All tables created on PostgreSQL successfully!")

        return True
    except Exception as e:
        print(f"❌ PostgreSQL Connection Failed: {e}")
        return False

if __name__ == "__main__":
    url = sys.argv[1] if len(sys.argv) > 1 else os.getenv("DATABASE_URL")
    if url and "postgresql" in url:
        test_and_seed_postgres(url)
    else:
        print("Please provide a valid postgresql:// URL")
