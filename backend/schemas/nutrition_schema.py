from pydantic import BaseModel
class NutritionGenerateRequest(BaseModel):
    age: int | None = 25
    height: int | None = 175
    weight: int | None = 70
    fitness_goal: str | None = "Stay Fit"
    fitness_level: str | None = "Beginner"
    diet_type: str
    calories: int | None = 2000
    allergies: str | None = None
    medical_conditions: str | None = None
class NutritionResponse(BaseModel):
    id: str
    user_id: str
    calories: int
    diet_type: str
    plan_json: str
    class Config:
        from_attributes = True