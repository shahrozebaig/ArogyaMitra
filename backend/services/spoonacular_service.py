import requests
from config import SPOONACULAR_API_KEY


def get_meal_plan(calories: int, diet_type: str):
    url = "https://api.spoonacular.com/mealplanner/generate"

    params = {
        "apiKey": SPOONACULAR_API_KEY,
        "timeFrame": "week",
        "targetCalories": calories,
        "diet": diet_type
    }

    response = requests.get(url, params=params)

    if response.status_code != 200:
        return {"error": "Spoonacular API failed", "status": response.status_code}

    try:
        return response.json()
    except:
        return {"error": "Invalid JSON response from Spoonacular"}