import requests
from config import YOUTUBE_API_KEY


def get_exercise_video(query: str):
    url = "https://www.googleapis.com/youtube/v3/search"

    params = {
        "part": "snippet",
        "q": f"{query} exercise",
        "key": YOUTUBE_API_KEY,
        "maxResults": 1,
        "type": "video"
    }

    response = requests.get(url, params=params).json()

    if "items" in response and len(response["items"]) > 0:
        video_id = response["items"][0]["id"]["videoId"]
        return f"https://www.youtube.com/watch?v={video_id}"

    return None