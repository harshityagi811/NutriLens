from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .database import Base, engine
from .routes import auth, bmi, meals

Base.metadata.create_all(bind=engine)

app = FastAPI(title="NutriVision API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)

app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

app.include_router(auth.router)
app.include_router(meals.router)
app.include_router(bmi.router)


@app.get("/")
def root():
    return {
        "message": "NutriVision API is running",
        "docs": "/docs",
        "features": ["auth", "meal-analysis", "history", "stats", "bmi"],
    }
