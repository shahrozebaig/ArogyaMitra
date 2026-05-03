from pydantic import BaseModel
class HealthCreate(BaseModel):
    age: int | None = 0
    height: float | None = 0.0
    weight: float | None = 0.0
    gender: str | None = "Male"
    fitness_goal: str | None = "Stay Fit"
    fitness_level: str | None = "Beginner"
    workout_location: str | None = "Home"
    workout_time: str | None = "Morning"
    dietary_preference: str | None = "Vegetarian"
    allergies: str | None = None
    medical_conditions: str | None = None

class HealthResponse(BaseModel):
    id: int
    user_id: int
    age: int | None = 0
    height: float | None = 0.0
    weight: float | None = 0.0
    gender: str | None = "Male"
    fitness_goal: str | None = "Stay Fit"
    fitness_level: str | None = "Beginner"
    workout_location: str | None = "Home"
    workout_time: str | None = "Morning"
    dietary_preference: str | None = "Vegetarian"
    allergies: str | None = None
    medical_conditions: str | None = None
    class Config:
        from_attributes = True