import base64
import json
import mimetypes
import os
from pathlib import Path

from openai import OpenAI

from ..schemas import NutritionBreakdown


def _mock_from_filename(filename: str) -> NutritionBreakdown:
    name = Path(filename).stem.lower()
    presets = {
        "salad": NutritionBreakdown(
            food="Chicken Salad Bowl",
            quantity="1 bowl",
            calories=420,
            carbs=18,
            protein=34,
            fats=22,
        ),
        "pizza": NutritionBreakdown(
            food="Veggie Pizza",
            quantity="2 slices",
            calories=520,
            carbs=54,
            protein=18,
            fats=24,
        ),
        "paneer": NutritionBreakdown(
            food="Paneer Butter Masala",
            quantity="1 serving",
            calories=350,
            carbs=20,
            protein=12,
            fats=25,
        ),
        "breakfast": NutritionBreakdown(
            food="Oats, Berries and Yogurt",
            quantity="1 breakfast bowl",
            calories=310,
            carbs=42,
            protein=16,
            fats=9,
        ),
    }
    for key, value in presets.items():
        if key in name:
            return value
    return NutritionBreakdown(
        food="Mixed Meal",
        quantity="1 plate",
        calories=480,
        carbs=38,
        protein=24,
        fats=22,
    )


def _openai_enabled() -> bool:
    return bool(os.getenv("OPENAI_API_KEY"))


def _to_data_url(file_path: str) -> str:
    mime_type = mimetypes.guess_type(file_path)[0] or "image/jpeg"
    encoded = base64.b64encode(Path(file_path).read_bytes()).decode("utf-8")
    return f"data:{mime_type};base64,{encoded}"


def analyze_meal_image(file_path: str, filename: str) -> NutritionBreakdown:
    if not _openai_enabled():
        return _mock_from_filename(filename)

    client = OpenAI()
    prompt = (
        "Analyze the food in this image. Estimate the primary meal, quantity, calories, "
        "carbs, protein, and fats. Respond as strict JSON with keys: "
        "food, quantity, calories, carbs, protein, fats."
    )

    response = client.responses.create(
        model=os.getenv("OPENAI_VISION_MODEL", "gpt-4.1-mini"),
        input=[
            {
                "role": "user",
                "content": [
                    {"type": "input_text", "text": prompt},
                    {"type": "input_image", "image_url": _to_data_url(file_path)},
                ],
            }
        ],
    )

    try:
        parsed = json.loads(response.output_text)
        return NutritionBreakdown(**parsed)
    except json.JSONDecodeError:
        return _mock_from_filename(filename)
