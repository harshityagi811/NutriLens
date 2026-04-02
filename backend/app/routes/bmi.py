from fastapi import APIRouter

from ..schemas import BMIRequest, BMIResponse

router = APIRouter(tags=["bmi"])


def _category_for_bmi(value: float) -> str:
    if value < 18.5:
        return "Underweight"
    if value < 25:
        return "Normal"
    if value < 30:
        return "Overweight"
    return "Obese"


@router.post("/bmi", response_model=BMIResponse)
def calculate_bmi(payload: BMIRequest):
    height_m = payload.height_cm / 100
    bmi = payload.weight_kg / (height_m**2)
    return BMIResponse(
        bmi=round(bmi, 1),
        category=_category_for_bmi(bmi),
        healthy_range="18.5 - 24.9",
    )
