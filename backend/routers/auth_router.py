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