from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    daily_calorie_goal: int = 2200


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    daily_calorie_goal: int
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class BMIRequest(BaseModel):
    height_cm: float
    weight_kg: float


class BMIResponse(BaseModel):
    bmi: float
    category: str
    healthy_range: str


class NutritionBreakdown(BaseModel):
    food: str
    quantity: str
    calories: float
    carbs: float
    protein: float
    fats: float


class MealResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    food_name: str
    quantity: str
    calories: float
    carbs: float
    protein: float
    fats: float
    image_path: Optional[str] = None
    created_at: datetime


class MealListResponse(BaseModel):
    meals: List[MealResponse]


class DailySummary(BaseModel):
    calories: float
    carbs: float
    protein: float
    fats: float
    goal: int
    goal_progress: float
    remaining_calories: float
    exceeded: bool


class TrendPoint(BaseModel):
    label: str
    calories: float
    carbs: float
    protein: float
    fats: float


class StatsResponse(BaseModel):
    summary: DailySummary
    macro_distribution: List[dict]
    daily_calorie_bars: List[TrendPoint]
    weekly_trend: List[TrendPoint]
    monthly_trend: List[TrendPoint]
    notifications: List[str]
