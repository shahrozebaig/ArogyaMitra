from sqlalchemy.orm import Session
from models.nutrition_model import NutritionPlan
from services.groq_service import generate_response
from services.spoonacular_service import get_meal_plan
from utils.prompt_templates import nutrition_prompt
import json


def generate_nutrition(db: Session, user_id: int, data: dict):
    prompt = nutrition_prompt(data)

    ai_response = generate_response(prompt)

    try:
        plan = json.loads(ai_response)
    except:
        plan = {"raw": ai_response}

    spoonacular_data = get_meal_plan(
        calories=data.get("calories"),
        diet_type=data.get("diet_type")
    )

    final_plan = {
        "ai_plan": plan,
        "spoonacular": spoonacular_data
    }

    nutrition = NutritionPlan(
        user_id=user_id,
        calories=data.get("calories"),
        diet_type=data.get("diet_type"),
        plan_json=json.dumps(final_plan)
    )

    db.add(nutrition)
    db.commit()
    db.refresh(nutrition)

    return nutrition