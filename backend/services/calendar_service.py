from datetime import datetime, timedelta

def create_calendar_event(title: str, description: str, start_time: datetime):
    end_time = start_time + timedelta(minutes=60)

    return {
        "status": "success",
        "event": {
            "title": title,
            "description": description,
            "start": start_time.isoformat(),
            "end": end_time.isoformat(),
        }
    }