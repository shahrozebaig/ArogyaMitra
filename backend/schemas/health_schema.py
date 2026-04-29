from pydantic import BaseModel


class HealthCreate(BaseModel):
    age: int
    height: int
    weight: int
    fitness_goal: str
    fitness_level: str
    workout_location: str
    workout_time: str
    allergies: str | None = None
    medical_conditions: str | None = None


class HealthResponse(BaseModel):
    id: int
    user_id: int
    age: int
    height: int
    weight: int
    fitness_goal: str
    fitness_level: str
    workout_location: str
    workout_time: str
    allergies: str | None = None
    medical_conditions: str | None = None

    class Config:
        from_attributes = True