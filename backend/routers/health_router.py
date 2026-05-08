from fastapi import APIRouter, Depends
from database import get_db
from schemas.health_schema import HealthCreate, HealthResponse
from utils.jwt_handler import get_current_user_id
router = APIRouter()
@router.post("/assessment", response_model=HealthResponse)
async def create_health(data: HealthCreate, db = Depends(get_db), user_id: str = Depends(get_current_user_id)):
    health_data = data.dict()
    health_data["user_id"] = user_id
    result = await db.health_profiles.insert_one(health_data)
    health_data["id"] = str(result.inserted_id)
    if "_id" in health_data: health_data.pop("_id")
    return health_data
@router.get("/profile", response_model=HealthResponse | None)
async def get_health_profile(db = Depends(get_db), user_id: str = Depends(get_current_user_id)):
    health = await db.health_profiles.find_one({"user_id": user_id}, sort=[("_id", -1)])
    if health:
        health["id"] = str(health.pop("_id"))
    return health
@router.post("/profile/update", response_model=HealthResponse | None)
async def update_health_profile(data: HealthCreate, db = Depends(get_db), user_id: str = Depends(get_current_user_id)):
    health_data = data.dict()
    result = await db.health_profiles.find_one_and_update(
        {"user_id": user_id},
        {"$set": health_data},
        sort=[("_id", -1)],
        return_document=True
    )
    if result:
        result["id"] = str(result.pop("_id"))
    return result
@router.post("/reset")
async def reset_account(db = Depends(get_db)):
    user_id = "1"
    await db.workouts.delete_many({"user_id": user_id})
    await db.nutrition.delete_many({"user_id": user_id})
    await db.progress.delete_many({"user_id": user_id})
    await db.health_profiles.delete_many({"user_id": user_id})
    return {"status": "success"}