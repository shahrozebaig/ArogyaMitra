from sqlalchemy.orm import Session
from models.workout_model import WorkoutPlan
from services.groq_service import generate_response
from services.youtube_service import get_exercise_video
from utils.prompt_templates import workout_prompt
import json
def generate_workout(db: Session, user_id: int, data: dict):
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
    workout = WorkoutPlan(
        user_id=user_id,
        title="7 Day Workout Plan",
        goal=data.get("goal"),
        duration=data.get("duration"),
        plan_json=json.dumps(plan)
    )
    db.add(workout)
    db.commit()
    db.refresh(workout)
    return workout