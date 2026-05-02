from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas.nutrition_schema import NutritionGenerateRequest, NutritionResponse
from services.nutrition_service import generate_nutrition
router = APIRouter()
from models.nutrition_model import NutritionPlan
from models.health_model import HealthProfile
import datetime
@router.get("/current", response_model=NutritionResponse | None)
def get_current_nutrition(db: Session = Depends(get_db)):
    user_id = 1
    today = datetime.date.today().isoformat()
    nutrition = db.query(NutritionPlan).filter(NutritionPlan.user_id == user_id).order_by(NutritionPlan.id.desc()).first()
    if not nutrition or nutrition.created_at != today:
        health = db.query(HealthProfile).filter(HealthProfile.user_id == user_id).order_by(HealthProfile.id.desc()).first()
        if health:
            calories = 1600 if health.fitness_goal == "Weight Loss" else 2800 if health.fitness_goal == "Muscle Gain" else 2100
            payload = {
                "calories": calories,
                "diet_type": health.dietary_preference or "Vegetarian",
                "allergies": health.allergies or "None",
                "current_day": datetime.datetime.now().strftime("%A")
            }
            nutrition = generate_nutrition(db, user_id, payload)
    return nutrition
@router.post("/generate", response_model=NutritionResponse)
def generate(data: NutritionGenerateRequest, db: Session = Depends(get_db)):
    user_id = 1
    import datetime
    payload = data.dict()
    payload["current_day"] = datetime.datetime.now().strftime("%A")
    nutrition = generate_nutrition(
        db,
        user_id,
        payload
    )
    return nutrition
@router.post("/update")
def update_nutrition_plan(data: dict, db: Session = Depends(get_db)):
    user_id = 1
    import json
    nutrition = db.query(NutritionPlan).filter(NutritionPlan.user_id == user_id).order_by(NutritionPlan.id.desc()).first()
    if nutrition:
        nutrition.plan_json = json.dumps(data.get("plan_json"))
        db.commit()
    return {"status": "success"}