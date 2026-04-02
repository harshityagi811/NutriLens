from datetime import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    daily_calorie_goal = Column(Integer, default=2200)
    created_at = Column(DateTime, default=datetime.utcnow)

    meals = relationship("Meal", back_populates="user", cascade="all, delete-orphan")


class Meal(Base):
    __tablename__ = "meals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    food_name = Column(String, nullable=False)
    quantity = Column(String, nullable=False)
    calories = Column(Float, default=0)
    carbs = Column(Float, default=0)
    protein = Column(Float, default=0)
    fats = Column(Float, default=0)
    image_path = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    user = relationship("User", back_populates="meals")
