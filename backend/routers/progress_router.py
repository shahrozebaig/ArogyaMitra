from fastapi import APIRouter, Depends
from database import get_db
from schemas.progress_schema import ProgressCreate, ProgressResponse
from services.progress_service import create_progress, get_progress_stats
from utils.jwt_handler import get_current_user_id
router = APIRouter()
@router.post("/update", response_model=ProgressResponse)
async def update_progress(data: ProgressCreate, db = Depends(get_db), user_id: str = Depends(get_current_user_id)):
    progress = await create_progress(
        db,
        user_id,
        data.dict()
    )
    return progress
@router.get("/stats")
async def get_stats(db = Depends(get_db), user_id: str = Depends(get_current_user_id)):
    records = await get_progress_stats(db, user_id)
    return records