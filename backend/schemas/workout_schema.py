from pydantic import BaseModel
class WorkoutGenerateRequest(BaseModel):
    goal: str
    location: str
    duration: int
    fitness_level: str
    medical_conditions: str | None = None
class WorkoutResponse(BaseModel):
    id: str
    user_id: str
    title: str
    goal: str
    duration: int
    plan_json: str
    class Config:
        from_attributes = True