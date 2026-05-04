from pydantic import BaseModel
class WorkoutGenerateRequest(BaseModel):
    goal: str
    location: str
    duration: int
    fitness_level: str
    medical_conditions: str | None = None
class WorkoutResponse(BaseModel):
    id: int
    user_id: int
    title: str
    goal: str
    duration: int
    plan_json: str
    class Config:
        from_attributes = True