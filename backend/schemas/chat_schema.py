from pydantic import BaseModel
class ChatRequest(BaseModel):
    message: str
    context: str | None = "Fitness"
class ChatResponse(BaseModel):
    reply: str