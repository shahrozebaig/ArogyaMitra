from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas.workout_schema import WorkoutGenerateRequest, WorkoutResponse
from services.workout_service import generate_workout
router = APIRouter()
from models.workout_model import WorkoutPlan
from models.health_model import HealthProfile
import datetime
@router.get("/current", response_model=WorkoutResponse | None)
def get_current_workout(db: Session = Depends(get_db)):
    user_id = 1
    today = datetime.date.today().isoformat()
    workout = db.query(WorkoutPlan).filter(WorkoutPlan.user_id == user_id).order_by(WorkoutPlan.id.desc()).first()
    if not workout or workout.created_at != today:
        health = db.query(HealthProfile).filter(HealthProfile.user_id == user_id).order_by(HealthProfile.id.desc()).first()
        if health:
            payload = {
                "goal": health.fitness_goal,
                "location": health.workout_location,
                "duration": 30,
                "fitness_level": health.fitness_level,
                "current_day": datetime.datetime.now().strftime("%A")
            }
            workout = generate_workout(db, user_id, payload)
    return workout
@router.get("/plan", response_model=WorkoutResponse | None)
def get_workout_plan_alias(db: Session = Depends(get_db)):
    return get_current_workout(db)
@router.post("/generate", response_model=WorkoutResponse)
def generate(data: WorkoutGenerateRequest, db: Session = Depends(get_db)):
    user_id = 1
    import datetime
    payload = data.dict()
    payload["current_day"] = datetime.datetime.now().strftime("%A")
    workout = generate_workout(
        db,
        user_id,
        payload
    )
    return workout