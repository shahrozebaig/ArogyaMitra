from sqlalchemy.orm import Session
from models.progress_model import ProgressRecord
from sqlalchemy.sql import func
def create_progress(db: Session, user_id: int, data: dict):
    status = data.get("status", "Completed")
    workout_id = data.get("workout_id")
    if status == "In Progress" and workout_id:
        existing = db.query(ProgressRecord).filter(
            ProgressRecord.user_id == user_id,
            ProgressRecord.workout_id == workout_id,
            ProgressRecord.status == "In Progress"
        ).order_by(ProgressRecord.created_at.desc()).first()
        if existing:
            existing.calories_burned = data.get("calories_burned", existing.calories_burned)
            existing.weight = data.get("weight", existing.weight)
            existing.workout_completed = data.get("workout_completed", existing.workout_completed)
            db.commit()
            db.refresh(existing)
            return existing
    progress = ProgressRecord(
        user_id=user_id,
        weight=data.get("weight"),
        calories_burned=data.get("calories_burned"),
        workout_completed=data.get("workout_completed"),
        healthy_meals_count=data.get("healthy_meals_count", 0),
        status=status,
        workout_id=workout_id
    )
    db.add(progress)
    db.commit()
    db.refresh(progress)
    return progress
def get_progress_stats(db: Session, user_id: int):
    records = db.query(ProgressRecord).filter(
        ProgressRecord.user_id == user_id
    ).order_by(ProgressRecord.created_at.asc()).all()
    return records