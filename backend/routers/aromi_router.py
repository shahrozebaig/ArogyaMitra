from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas.chat_schema import ChatRequest, ChatResponse
from services.groq_service import generate_response
from utils.prompt_templates import chat_prompt
router = APIRouter()
from services.workout_service import generate_workout
from services.nutrition_service import generate_nutrition
@router.post("/chat", response_model=ChatResponse)
def chat(data: ChatRequest, db: Session = Depends(get_db)):
    user_id = 1
    msg = data.message.lower()
    if "create" in msg or "generate" in msg or "plan" in msg:
        generate_workout(db, user_id, {
            "goal": "Balanced", 
            "fitness_level": "Intermediate",
            "location": "Home",
            "duration": 30
        })
        generate_nutrition(db, user_id, {
            "calories": 2000,
            "diet_type": "Vegetarian",
            "allergies": "None"
        })
        reply = "I've analyzed your request and generated a new personalized workout and nutrition plan for you! You can view them in the dashboard. Is there anything specific you'd like to adjust?"
    else:
        prompt = chat_prompt(data.message, data.context)
        reply = generate_response(prompt)
    return {"reply": reply}