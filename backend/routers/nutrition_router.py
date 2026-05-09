from fastapi import APIRouter, Depends
from database import get_db
from schemas.nutrition_schema import NutritionGenerateRequest, NutritionResponse
from services.nutrition_service import generate_nutrition
import datetime
import json
from utils.jwt_handler import get_current_user_id
router = APIRouter()
@router.get("/current", response_model=NutritionResponse | None)
async def get_current_nutrition(db = Depends(get_db), user_id: str = Depends(get_current_user_id)):
    today = datetime.date.today().isoformat()
    nutrition = await db.nutrition.find_one({"user_id": user_id}, sort=[("_id", -1)])
    is_valid = False
    if nutrition and nutrition.get("created_at"):
        try:
            created_date = datetime.date.fromisoformat(nutrition.get("created_at"))
            today_date = datetime.date.today()
            if (today_date - created_date).days < 7:
                is_valid = True
        except:
            pass
    if not nutrition or not is_valid:
        health = await db.health_profiles.find_one({"user_id": user_id}, sort=[("_id", -1)])
        if health:
            payload = {
                "age": health.get("age"),
                "height": health.get("height"),
                "weight": health.get("weight"),
                "fitness_goal": health.get("fitness_goal"),
                "fitness_level": health.get("fitness_level"),
                "diet_type": health.get("dietary_preference") or "Vegetarian",
                "calories": 2000,
                "allergies": health.get("allergies") or "None",
                "current_day": datetime.datetime.now().strftime("%A")
            }
            nutrition = await generate_nutrition(db, user_id, payload)
    if nutrition:
        nutrition["id"] = str(nutrition.pop("_id")) if "_id" in nutrition else nutrition.get("id")
    return nutrition
@router.post("/generate", response_model=NutritionResponse)
async def generate(data: NutritionGenerateRequest, db = Depends(get_db), user_id: str = Depends(get_current_user_id)):
    payload = data.dict()
    payload["current_day"] = datetime.datetime.now().strftime("%A")
    nutrition = await generate_nutrition(db, user_id, payload)
    return nutrition
@router.post("/update")
async def update_nutrition_plan(data: dict, db = Depends(get_db), user_id: str = Depends(get_current_user_id)):
    await db.nutrition.find_one_and_update(
        {"user_id": user_id},
        {"$set": {"plan_json": json.dumps(data.get("plan_json"))}},
        sort=[("_id", -1)]
    )
    return {"status": "success"}