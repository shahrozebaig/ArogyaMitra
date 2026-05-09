from fastapi import APIRouter, Depends, HTTPException
from database import get_db
from schemas.user_schema import UserRegister, UserLogin, UserResponse, ProfileImageUpdate
from services.auth_service import register_user, login_user
from utils.jwt_handler import get_current_user_id
from bson import ObjectId
router = APIRouter()
@router.post("/register", response_model=UserResponse)
async def register(data: UserRegister, db = Depends(get_db)):
    user = await register_user(db, data.name, data.email, data.password)
    if not user:
        raise HTTPException(status_code=400, detail="User already exists")
    return user
@router.post("/login")
async def login(data: UserLogin, db = Depends(get_db)):
    result = await login_user(db, data.email, data.password)
    return {
        "user": result["user"],
        "token": result["token"]
    }
@router.delete("/delete")
async def delete_account(user_id: str, db = Depends(get_db)):
    await db.workouts.delete_many({"user_id": user_id})
    await db.nutrition.delete_many({"user_id": user_id})
    await db.progress.delete_many({"user_id": user_id})
    await db.health_profiles.delete_many({"user_id": user_id})
    query = {"$or": [{"_id": user_id}]}
    try:
        query["$or"].append({"_id": ObjectId(user_id)})
    except:
        pass
    await db.users.delete_one(query)
    return {"status": "success", "message": "Account deleted permanently"}

@router.post("/update-profile-image")
async def update_profile_image(data: ProfileImageUpdate, db = Depends(get_db), user_id: str = Depends(get_current_user_id)):
    query = {"_id": user_id}
    try:
        query = {"_id": ObjectId(user_id)}
    except:
        pass
    
    await db.users.update_one(query, {"$set": {"profile_image": data.profile_image}})
    return {"status": "success", "profile_image": data.profile_image}