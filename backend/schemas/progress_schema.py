from pydantic import BaseModel
from datetime import datetime


class ProgressCreate(BaseModel):
    weight: float
    calories_burned: float
    workout_completed: int


class ProgressResponse(BaseModel):
    id: int
    user_id: int
    weight: float
    calories_burned: float
    workout_completed: int
    created_at: datetime

    class Config:
        from_attributes = True