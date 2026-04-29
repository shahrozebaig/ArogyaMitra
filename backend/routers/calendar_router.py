from fastapi import APIRouter
from datetime import datetime

from services.calendar_service import create_calendar_event

router = APIRouter()


@router.post("/create")
def create_event(data: dict):
    event = create_calendar_event(
        title=data.get("title"),
        description=data.get("description"),
        start_time=datetime.fromisoformat(data.get("start_time")),
    )

    return event