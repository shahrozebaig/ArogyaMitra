from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from schemas.nutrition_schema import NutritionGenerateRequest, NutritionResponse
from services.nutrition_service import generate_nutrition

router = APIRouter()


@router.post("/generate", response_model=NutritionResponse)
def generate(data: NutritionGenerateRequest, db: Session = Depends(get_db)):
    user_id = 1

    nutrition = generate_nutrition(
        db,
        user_id,
        data.dict()
    )

    return nutrition