from fastapi import APIRouter, Depends
from database import get_db
from schemas.chat_schema import ChatRequest, ChatResponse, ChatSession, ChatSessionList
from services.groq_service import generate_response
from utils.prompt_templates import chat_prompt
from services.workout_service import generate_workout
from services.nutrition_service import generate_nutrition
from utils.jwt_handler import get_current_user_id
from typing import List
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
@router.get("/sessions", response_model=ChatSessionList)
async def get_sessions(db = Depends(get_db), user_id: str = Depends(get_current_user_id)):
    user_data = await db.users.find_one({"_id": user_id})
    if not user_data:
        from bson import ObjectId
        try:
            user_data = await db.users.find_one({"_id": ObjectId(user_id)})
        except:
            pass
    sessions = user_data.get("chat_sessions", []) if user_data else []
    return {"sessions": sessions}
@router.post("/sessions/sync")
async def sync_sessions(data: ChatSessionList, db = Depends(get_db), user_id: str = Depends(get_current_user_id)):
    query = {"_id": user_id}
    from bson import ObjectId
    try:
        query = {"$or": [{"_id": user_id}, {"_id": ObjectId(user_id)}]}
    except:
        pass
    await db.users.update_one(query, {"$set": {"chat_sessions": [s.dict() for s in data.sessions]}})
    return {"status": "success"}