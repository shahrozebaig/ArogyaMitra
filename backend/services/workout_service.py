from sqlalchemy.orm import Session
from models.workout_model import WorkoutPlan
from services.groq_service import generate_response
from services.youtube_service import get_exercise_video
from utils.prompt_templates import workout_prompt
import json


def generate_workout(db: Session, user_id: int, data: dict):
    prompt = workout_prompt(data)

    ai_response = generate_response(prompt)

    try:
        plan = json.loads(ai_response)
    except:
        plan = {"raw": ai_response}

    if isinstance(plan, dict) and "days" in plan:
        for day in plan["days"]:
            for exercise in day.get("exercises", []):
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