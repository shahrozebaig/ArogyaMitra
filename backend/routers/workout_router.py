from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas.workout_schema import WorkoutGenerateRequest, WorkoutResponse
from services.workout_service import generate_workout
router = APIRouter()
from models.workout_model import WorkoutPlan
@router.get("/current", response_model=WorkoutResponse | None)
def get_current_workout(db: Session = Depends(get_db)):
    user_id = 1
    workout = db.query(WorkoutPlan).filter(WorkoutPlan.user_id == user_id).order_by(WorkoutPlan.id.desc()).first()
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