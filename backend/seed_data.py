from datetime import datetime, timedelta

from app.auth import get_password_hash
from app.database import SessionLocal
from app.models import Meal, User


def seed():
    db = SessionLocal()
    try:
        if db.query(User).filter(User.email == "demo@nutrivision.app").first():
            print("Demo data already exists.")
            return

        user = User(
            email="demo@nutrivision.app",
            hashed_password=get_password_hash("demo1234"),
            daily_calorie_goal=2300,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        samples = [
            ("Oats and Yogurt Bowl", "1 bowl", 310, 42, 16, 9, 0),
            ("Grilled Chicken Salad", "1 plate", 420, 18, 34, 22, 0),
            ("Paneer Butter Masala", "1 serving", 350, 20, 12, 25, -1),
            ("Veggie Pizza", "2 slices", 520, 54, 18, 24, -2),
            ("Protein Smoothie", "1 glass", 260, 24, 20, 8, -4),
            ("Quinoa Bowl", "1 bowl", 390, 46, 14, 16, -6),
        ]

        meals = []
        for food, quantity, calories, carbs, protein, fats, days_back in samples:
            meals.append(
                Meal(
                    user_id=user.id,
                    food_name=food,
                    quantity=quantity,
                    calories=calories,
                    carbs=carbs,
                    protein=protein,
                    fats=fats,
                    image_path=None,
                    created_at=datetime.utcnow() + timedelta(days=days_back, hours=days_back + 10),
                )
            )
        db.add_all(meals)
        db.commit()
        print("Seeded demo user: demo@nutrivision.app / demo1234")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
