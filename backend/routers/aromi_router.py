from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from schemas.chat_schema import ChatRequest, ChatResponse
from services.groq_service import generate_response
from utils.prompt_templates import chat_prompt

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
def chat(data: ChatRequest, db: Session = Depends(get_db)):
    prompt = chat_prompt(data.message)

    reply = generate_response(prompt)

    return {"reply": reply}