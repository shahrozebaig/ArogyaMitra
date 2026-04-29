from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from schemas.workout_schema import WorkoutGenerateRequest, WorkoutResponse
from services.workout_service import generate_workout

router = APIRouter()


@router.post("/generate", response_model=WorkoutResponse)
def generate(data: WorkoutGenerateRequest, db: Session = Depends(get_db)):
    user_id = 1

    workout = generate_workout(
        db,
        user_id,
        data.dict()
    )

    return workout