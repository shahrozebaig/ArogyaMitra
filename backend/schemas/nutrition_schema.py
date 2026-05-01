from pydantic import BaseModel
class NutritionGenerateRequest(BaseModel):
    calories: int
    diet_type: str
    allergies: str | None = None
class NutritionResponse(BaseModel):
    id: int
    user_id: int
    calories: int
    diet_type: str
    plan_json: str
    class Config:
        from_attributes = True