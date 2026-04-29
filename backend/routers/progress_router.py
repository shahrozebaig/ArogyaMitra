from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from schemas.progress_schema import ProgressCreate, ProgressResponse
from services.progress_service import create_progress, get_progress_stats

router = APIRouter()


@router.post("/update", response_model=ProgressResponse)
def update_progress(data: ProgressCreate, db: Session = Depends(get_db)):
    user_id = 1

    progress = create_progress(
        db,
        user_id,
        data.dict()
    )

    return progress


@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    user_id = 1

    records = get_progress_stats(db, user_id)

    return records