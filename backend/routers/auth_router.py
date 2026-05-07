from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas.user_schema import UserRegister, UserLogin, UserResponse
from services.auth_service import register_user, login_user
router = APIRouter()
@router.post("/register", response_model=UserResponse)
def register(data: UserRegister, db: Session = Depends(get_db)):
    user = register_user(db, data.name, data.email, data.password)
    if not user:
        raise HTTPException(status_code=400, detail="User already exists")
    return user
@router.post("/login")
def login(data: UserLogin, db: Session = Depends(get_db)):
    result = login_user(db, data.email, data.password)
    if not result:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {
        "user": result["user"],
        "token": result["token"]
    }
@router.delete("/delete")
def delete_account(db: Session = Depends(get_db)):
    user_id = 1 
    from models.workout_model import WorkoutPlan
    from models.nutrition_model import NutritionPlan
    from models.progress_model import ProgressRecord
    from models.health_model import HealthProfile
    from models.user_model import User
    db.query(WorkoutPlan).filter(WorkoutPlan.user_id == user_id).delete()
    db.query(NutritionPlan).filter(NutritionPlan.user_id == user_id).delete()
    db.query(ProgressRecord).filter(ProgressRecord.user_id == user_id).delete()
    db.query(HealthProfile).filter(HealthProfile.user_id == user_id).delete()
    db.query(User).filter(User.id == user_id).delete()
    db.commit()
    return {"status": "success", "message": "Account deleted permanently"}