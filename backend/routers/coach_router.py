from fastapi import APIRouter, Depends
from database import get_db
from schemas.chat_schema import ChatRequest, ChatResponse
from services.groq_service import generate_response
from utils.prompt_templates import chat_prompt
from services.workout_service import generate_workout
from services.nutrition_service import generate_nutrition
from utils.jwt_handler import get_current_user_id
router = APIRouter()
@router.post("/chat", response_model=ChatResponse)
async def chat(data: ChatRequest, db = Depends(get_db), user_id: str = Depends(get_current_user_id)):
    msg = data.message.lower()
    if "create" in msg or "generate" in msg or "plan" in msg:
        await generate_workout(db, user_id, {
            "goal": "Balanced", 
            "fitness_level": "Intermediate",
            "location": "Home",
            "duration": 30
        })
        await generate_nutrition(db, user_id, {
            "calories": 2000,
            "diet_type": "Vegetarian",
            "allergies": "None"
        })
        reply = "I've analyzed your request and generated a new personalized workout and nutrition plan for you! You can view them in the dashboard. Is there anything specific you'd like to adjust?"
    else:
        prompt = chat_prompt(data.message, data.context)
        reply = generate_response(prompt)
    return {"reply": reply}