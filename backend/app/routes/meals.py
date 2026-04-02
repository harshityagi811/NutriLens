from collections import defaultdict
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional
from uuid import uuid4

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile
from sqlalchemy.orm import Session

from .. import models, schemas
from ..auth import get_current_user
from ..config import get_upload_dir
from ..database import get_db
from ..services.nutrition_ai import analyze_meal_image

router = APIRouter(tags=["meals"])

UPLOAD_DIR = get_upload_dir()


def _start_of_day(target: datetime) -> datetime:
    return target.replace(hour=0, minute=0, second=0, microsecond=0)


def _serialize_trend(points: dict, date_format: str):
    trend = []
    for key in sorted(points.keys()):
        item = points[key]
        trend.append(
            schemas.TrendPoint(
                label=key.strftime(date_format),
                calories=round(item["calories"], 1),
                carbs=round(item["carbs"], 1),
                protein=round(item["protein"], 1),
                fats=round(item["fats"], 1),
            )
        )
    return trend


@router.post("/upload-meal", response_model=schemas.MealResponse, status_code=201)
async def upload_meal(
    image: UploadFile = File(...),
    consumed_at: Optional[str] = Form(None),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image uploads are allowed")

    suffix = Path(image.filename or "meal.jpg").suffix or ".jpg"
    filename = f"{uuid4().hex}{suffix}"
    stored_path = UPLOAD_DIR / filename
    stored_path.write_bytes(await image.read())

    nutrition = analyze_meal_image(str(stored_path), image.filename or filename)
    created_at = datetime.fromisoformat(consumed_at) if consumed_at else datetime.utcnow()

    meal = models.Meal(
        user_id=current_user.id,
        food_name=nutrition.food,
        quantity=nutrition.quantity,
        calories=nutrition.calories,
        carbs=nutrition.carbs,
        protein=nutrition.protein,
        fats=nutrition.fats,
        image_path=f"/uploads/{filename}",
        created_at=created_at,
    )
    db.add(meal)
    db.commit()
    db.refresh(meal)
    return meal


@router.get("/meals", response_model=schemas.MealListResponse)
def get_meals(
    period: str = Query("day", pattern="^(day|week|month|all)$"),
    date: Optional[str] = None,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    target_date = datetime.fromisoformat(date) if date else datetime.utcnow()
    query = db.query(models.Meal).filter(models.Meal.user_id == current_user.id)

    if period == "day":
        start = _start_of_day(target_date)
        end = start + timedelta(days=1)
        query = query.filter(models.Meal.created_at >= start, models.Meal.created_at < end)
    elif period == "week":
        start = _start_of_day(target_date - timedelta(days=target_date.weekday()))
        end = start + timedelta(days=7)
        query = query.filter(models.Meal.created_at >= start, models.Meal.created_at < end)
    elif period == "month":
        start = _start_of_day(target_date.replace(day=1))
        next_month = (start.replace(day=28) + timedelta(days=4)).replace(day=1)
        query = query.filter(
            models.Meal.created_at >= start, models.Meal.created_at < next_month
        )

    meals = query.order_by(models.Meal.created_at.desc()).all()
    return {"meals": meals}


@router.get("/stats", response_model=schemas.StatsResponse)
def get_stats(
    current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)
):
    now = datetime.utcnow()
    today_start = _start_of_day(now)
    week_start = today_start - timedelta(days=6)
    month_start = today_start - timedelta(days=29)

    all_meals = (
        db.query(models.Meal)
        .filter(models.Meal.user_id == current_user.id)
        .order_by(models.Meal.created_at.asc())
        .all()
    )

    today_meals = [meal for meal in all_meals if meal.created_at >= today_start]
    week_meals = [meal for meal in all_meals if meal.created_at >= week_start]
    month_meals = [meal for meal in all_meals if meal.created_at >= month_start]

    summary_values = {
        "calories": sum(m.calories for m in today_meals),
        "carbs": sum(m.carbs for m in today_meals),
        "protein": sum(m.protein for m in today_meals),
        "fats": sum(m.fats for m in today_meals),
    }
    progress = (
        min(summary_values["calories"] / current_user.daily_calorie_goal, 1)
        if current_user.daily_calorie_goal
        else 0
    )

    notifications = []
    if summary_values["calories"] > current_user.daily_calorie_goal:
        notifications.append("You exceeded your daily calorie goal.")
    elif summary_values["calories"] >= current_user.daily_calorie_goal * 0.85:
        notifications.append("You are close to your calorie goal for today.")
    else:
        notifications.append("You are on track. Log your next meal to keep the streak going.")

    daily_points = defaultdict(lambda: {"calories": 0, "carbs": 0, "protein": 0, "fats": 0})
    weekly_points = defaultdict(lambda: {"calories": 0, "carbs": 0, "protein": 0, "fats": 0})
    monthly_points = defaultdict(lambda: {"calories": 0, "carbs": 0, "protein": 0, "fats": 0})

    for meal in week_meals:
        key = _start_of_day(meal.created_at)
        daily_points[key]["calories"] += meal.calories
        daily_points[key]["carbs"] += meal.carbs
        daily_points[key]["protein"] += meal.protein
        daily_points[key]["fats"] += meal.fats

    for meal in month_meals:
        key = _start_of_day(meal.created_at)
        weekly_points[key]["calories"] += meal.calories
        weekly_points[key]["carbs"] += meal.carbs
        weekly_points[key]["protein"] += meal.protein
        weekly_points[key]["fats"] += meal.fats

    for meal in all_meals:
        key = meal.created_at.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        monthly_points[key]["calories"] += meal.calories
        monthly_points[key]["carbs"] += meal.carbs
        monthly_points[key]["protein"] += meal.protein
        monthly_points[key]["fats"] += meal.fats

    return schemas.StatsResponse(
        summary=schemas.DailySummary(
            calories=round(summary_values["calories"], 1),
            carbs=round(summary_values["carbs"], 1),
            protein=round(summary_values["protein"], 1),
            fats=round(summary_values["fats"], 1),
            goal=current_user.daily_calorie_goal,
            goal_progress=round(progress, 2),
            remaining_calories=round(
                current_user.daily_calorie_goal - summary_values["calories"], 1
            ),
            exceeded=summary_values["calories"] > current_user.daily_calorie_goal,
        ),
        macro_distribution=[
            {"name": "Carbs", "value": round(summary_values["carbs"], 1)},
            {"name": "Protein", "value": round(summary_values["protein"], 1)},
            {"name": "Fats", "value": round(summary_values["fats"], 1)},
        ],
        daily_calorie_bars=_serialize_trend(daily_points, "%a"),
        weekly_trend=_serialize_trend(weekly_points, "%d %b"),
        monthly_trend=_serialize_trend(monthly_points, "%b %Y"),
        notifications=notifications,
    )
