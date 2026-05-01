from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.health_model import HealthProfile
from schemas.health_schema import HealthCreate, HealthResponse
router = APIRouter()
@router.post("/assessment", response_model=HealthResponse)
def create_health(data: HealthCreate, db: Session = Depends(get_db)):
    user_id = 1
    health = HealthProfile(
        user_id=user_id,
        **data.dict()
    )
    db.add(health)
    db.commit()
    db.refresh(health)
    return health
@router.get("/profile", response_model=HealthResponse | None)
def get_health_profile(db: Session = Depends(get_db)):
    user_id = 1
    health = db.query(HealthProfile).filter(HealthProfile.user_id == user_id).order_by(HealthProfile.id.desc()).first()
    return health
@router.post("/profile/update", response_model=HealthResponse | None)
def update_health_profile(data: HealthCreate, db: Session = Depends(get_db)):
    user_id = 1
    health = db.query(HealthProfile).filter(HealthProfile.user_id == user_id).order_by(HealthProfile.id.desc()).first()
    if health:
        for key, value in data.dict().items():
            setattr(health, key, value)
        db.commit()
        db.refresh(health)
    return health
@router.post("/reset")
def reset_account(db: Session = Depends(get_db)):
    user_id = 1
    from models.workout_model import WorkoutPlan
    from models.nutrition_model import NutritionPlan
    from models.progress_model import ProgressRecord
    db.query(WorkoutPlan).filter(WorkoutPlan.user_id == user_id).delete()
    db.query(NutritionPlan).filter(NutritionPlan.user_id == user_id).delete()
    db.query(ProgressRecord).filter(ProgressRecord.user_id == user_id).delete()
    db.query(HealthProfile).filter(HealthProfile.user_id == user_id).delete()
    db.commit()
    return {"status": "success"}