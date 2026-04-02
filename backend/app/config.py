import os
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent


def get_database_url() -> str:
    database_url = os.getenv("DATABASE_URL", "sqlite:///./nutrivision.db")
    if database_url.startswith("postgres://"):
        return database_url.replace("postgres://", "postgresql+psycopg://", 1)
    if database_url.startswith("postgresql://"):
        return database_url.replace("postgresql://", "postgresql+psycopg://", 1)
    return database_url


def get_upload_dir() -> Path:
    upload_dir = os.getenv("UPLOAD_DIR", str(BASE_DIR / "uploads"))
    path = Path(upload_dir)
    path.mkdir(parents=True, exist_ok=True)
    return path


def get_cors_origins() -> list[str]:
    raw = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
    return [item.strip() for item in raw.split(",") if item.strip()]
