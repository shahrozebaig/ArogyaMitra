from pydantic import BaseModel
from datetime import datetime
class ProgressCreate(BaseModel):
    weight: float
    calories_burned: float
    workout_completed: int
    healthy_meals_count: int | None = 0
class ProgressResponse(BaseModel):
    id: int
    user_id: int
    weight: float
    calories_burned: float
    workout_completed: int
    healthy_meals_count: int
    created_at: datetime
    class Config:
        from_attributes = True