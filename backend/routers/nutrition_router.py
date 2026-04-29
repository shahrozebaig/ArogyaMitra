from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from schemas.nutrition_schema import NutritionGenerateRequest, NutritionResponse
from services.nutrition_service import generate_nutrition

router = APIRouter()


from models.nutrition_model import NutritionPlan

@router.get("/current", response_model=NutritionResponse)
def get_current_nutrition(db: Session = Depends(get_db)):
    user_id = 1
    nutrition = db.query(NutritionPlan).filter(NutritionPlan.user_id == user_id).order_by(NutritionPlan.id.desc()).first()
    return nutrition

@router.post("/generate", response_model=NutritionResponse)
def generate(data: NutritionGenerateRequest, db: Session = Depends(get_db)):

    user_id = 1

    nutrition = generate_nutrition(
        db,
        user_id,
        data.dict()
    )

    return nutrition