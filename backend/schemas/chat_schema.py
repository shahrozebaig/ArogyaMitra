from pydantic import BaseModel
from typing import List
class ChatRequest(BaseModel):
    message: str
    context: str | None = "Fitness"
class ChatResponse(BaseModel):
    reply: str
class ChatMessage(BaseModel):
    sender: str
    text: str
    time: str
class ChatSession(BaseModel):
    id: str
    title: str
    messages: List[ChatMessage]
    timestamp: float
class ChatSessionList(BaseModel):
    sessions: List[ChatSession]