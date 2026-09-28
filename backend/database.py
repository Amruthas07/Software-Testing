"""
SQLAlchemy Database Session & Engine Configuration for MySQL
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Default MySQL connection string; override via MYSQL_URL environment variable
MYSQL_DATABASE_URL = os.getenv(
    "MYSQL_URL",
    "mysql+pymysql://root:password@localhost:3306/motopass_db"
)

# SQLite fallback for quick local testing without MySQL server running
SQLITE_FALLBACK_URL = "sqlite:///./motopass_local.db"

try:
    engine = create_engine(MYSQL_DATABASE_URL, pool_pre_ping=True)
except Exception:
    engine = create_engine(SQLITE_FALLBACK_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
