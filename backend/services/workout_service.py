import datetime
from services.groq_service import generate_response
from services.youtube_service import get_exercise_video
from utils.prompt_templates import workout_prompt
import json
async def generate_workout(db, user_id: str, data: dict):
    prompt = workout_prompt(data)
    ai_response = generate_response(prompt)
    clean_json = ai_response.strip()
    if clean_json.startswith("```json"):
        clean_json = clean_json.split("```json")[1].split("```")[0].strip()
    elif clean_json.startswith("```"):
        clean_json = clean_json.split("```")[1].split("```")[0].strip()
    try:
        plan = json.loads(clean_json)
    except:
        plan = {"raw": ai_response}
    if isinstance(plan, dict) and "today" in plan:
        for exercise in plan["today"].get("exercises", []):
            video = get_exercise_video(exercise.get("name", "exercise"))
            exercise["video"] = video
    workout_doc = {
        "user_id": user_id,
        "title": "7 Day Workout Plan",
        "goal": data.get("goal"),
        "duration": data.get("duration"),
        "plan_json": json.dumps(plan),
        "created_at": datetime.date.today().isoformat()
    }
    result = await db.workouts.insert_one(workout_doc)
    workout_doc["id"] = str(result.inserted_id)
    if "_id" in workout_doc: workout_doc.pop("_id")
    return workout_doc