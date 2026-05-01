from sqlalchemy.orm import Session
from models.progress_model import ProgressRecord
def create_progress(db: Session, user_id: int, data: dict):
    progress = ProgressRecord(
        user_id=user_id,
        weight=data.get("weight"),
        calories_burned=data.get("calories_burned"),
        workout_completed=data.get("workout_completed"),
        healthy_meals_count=data.get("healthy_meals_count", 0)
    )
    db.add(progress)
    db.commit()
    db.refresh(progress)
    return progress
def get_progress_stats(db: Session, user_id: int):
    records = db.query(ProgressRecord).filter(
        ProgressRecord.user_id == user_id
    ).all()
    return records