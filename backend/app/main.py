from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import get_cors_origins, get_upload_dir
from .database import Base, engine
from .routes import auth, bmi, meals

Base.metadata.create_all(bind=engine)

app = FastAPI(title="NutriVision API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

uploads_dir = get_upload_dir()

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
