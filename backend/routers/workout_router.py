from fastapi import APIRouter, Depends
from database import get_db
from schemas.workout_schema import WorkoutGenerateRequest, WorkoutResponse
from services.workout_service import generate_workout
import datetime
from utils.jwt_handler import get_current_user_id
router = APIRouter()
@router.get("/current", response_model=WorkoutResponse | None)
async def get_current_workout(db = Depends(get_db), user_id: str = Depends(get_current_user_id)):
    today = datetime.date.today().isoformat()
    workout = await db.workouts.find_one({"user_id": user_id}, sort=[("_id", -1)])
    is_valid = False
    if workout and workout.get("created_at"):
        try:
            created_date = datetime.date.fromisoformat(workout.get("created_at"))
            today_date = datetime.date.today()
            if (today_date - created_date).days < 7:
                is_valid = True
        except:
            pass
    if not workout or not is_valid:
        health = await db.health_profiles.find_one({"user_id": user_id}, sort=[("_id", -1)])
        if health:
            payload = {
                "goal": health.get("fitness_goal"),
                "location": health.get("workout_location"),
                "duration": 30,
                "fitness_level": health.get("fitness_level"),
                "current_day": datetime.datetime.now().strftime("%A")
            }
            workout = await generate_workout(db, user_id, payload)
    if workout:
        workout["id"] = str(workout.pop("_id")) if "_id" in workout else workout.get("id")
    return workout
@router.get("/plan", response_model=WorkoutResponse | None)
async def get_workout_plan_alias(db = Depends(get_db), user_id: str = Depends(get_current_user_id)):
    return await get_current_workout(db, user_id=user_id)
@router.post("/generate", response_model=WorkoutResponse)
async def generate(data: WorkoutGenerateRequest, db = Depends(get_db), user_id: str = Depends(get_current_user_id)):
    payload = data.dict()
    payload["current_day"] = datetime.datetime.now().strftime("%A")
    workout = await generate_workout(db, user_id, payload)
    return workout