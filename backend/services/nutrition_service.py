import datetime
from services.groq_service import generate_response
from utils.prompt_templates import nutrition_prompt
import json
async def generate_nutrition(db, user_id: str, data: dict):
    prompt = nutrition_prompt(data)
    ai_response = generate_response(prompt)
    clean_json = ai_response.strip()
    if "```json" in clean_json:
        clean_json = clean_json.split("```json")[1].split("```")[0].strip()
    elif "```" in clean_json:
        clean_json = clean_json.split("```")[1].split("```")[0].strip()
    try:
        plan = json.loads(clean_json)
    except Exception as e:
        print(f"AI JSON Parse Error: {e}")
        plan = {
            "today": [{"type": "Breakfast", "time": "8:00 AM", "name": "Poha with Nuts", "calories": 300, "protein": 10, "carbs": 50, "fat": 8, "ingredients": ["Poha", "Peanuts"], "image": "🥣"}],
            "week": [{"day": "Monday", "meals": ["Poha", "Dal Tadka", "Roti"], "today": True}],
            "shoppingList": []
        }
    nutrition_doc = {
        "user_id": user_id,
        "calories": data.get("calories", 2000),
        "diet_type": data.get("diet_type", "Vegetarian"),
        "plan_json": json.dumps(plan),
        "created_at": datetime.date.today().isoformat()
    }
    result = await db.nutrition.insert_one(nutrition_doc)
    nutrition_doc["id"] = str(result.inserted_id)
    if "_id" in nutrition_doc: nutrition_doc.pop("_id")
    return nutrition_doc