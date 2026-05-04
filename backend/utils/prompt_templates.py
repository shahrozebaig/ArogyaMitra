def workout_prompt(data: dict) -> str:
    return f"""
    You are AROMI, an expert fitness coach. 
    Create a highly personalized 7-day workout plan for a user with the following profile:
    - Goal: {data.get("goal")}
    - Fitness Level: {data.get("fitness_level")}
    - Location: {data.get("location")}
    - Duration: {data.get("duration")} minutes per day
    - Medical Conditions: {data.get("medical_conditions", "None")}
    - Current Day: {data.get("current_day", "Monday")}
    Return a valid JSON object with the following structure:
    {{
      "today": {{
        "title": "String (Must be the workout for {data.get("current_day", "Monday")})",
        "duration": "String",
        "exerciseCount": Number,
        "recommendedTime": "String",
        "exercises": [
          {{ "id": Number, "name": "String", "sets": Number, "reps": "String", "rest": "String", "description": "String" }}
        ]
      }},
      "week": [
        {{ "day": "String", "title": "String", "duration": "String", "exercises": Number, "status": "Upcoming/Rest Day", "active": Boolean }}
      ]
    }}
    Ensure exercises are safe and effective. If medical conditions are provided, adjust the workout to be safe (e.g., if 'Knee Pain', avoid jumping; if 'Back Pain', focus on core stability and avoid heavy spinal loading). If the location is "Home", focus on bodyweight or minimal equipment.
    """
def nutrition_prompt(data: dict) -> str:
    diet = data.get("diet_type", "Vegetarian")
    return f"""
    You are a professional nutritionist specializing in Indian cuisine and clinical dietetics. 
    Calculate and create a 7-day Indian meal plan based on this user profile:
    - Age: {data.get("age")}
    - Height: {data.get("height")} cm
    - Weight: {data.get("weight")} kg
    - Fitness Goal: {data.get("fitness_goal")}
    - Fitness Level: {data.get("fitness_level")}
    - Diet Type: {diet}
    - Restrictions/Allergies: {data.get("allergies", "None")}
    - Medical Conditions: {data.get("medical_conditions", "None")}
    - Current Day: {data.get("current_day", "Monday")}

    INSTRUCTIONS:
    1. First, calculate the appropriate daily calorie intake for this user based on their physical metrics and fitness goal.
    2. Create a meal plan that matches these calculated calories.
    3. If medical conditions are provided, ensure the diet supports them (e.g., low salt for 'Hypertension', balanced sugar for 'Diabetes').
    4. STRICT DIET RULES:
       - If "Vegetarian": No meat, no fish, no eggs. Dairy is okay.
       - If "Non-Vegetarian": YOU MUST INCLUDE chicken, fish, eggs, or mutton in EVERY Lunch and Dinner.
       - If "Vegan": No meat, no dairy, no eggs.
       - If "Eggetarian": No meat/fish, but eggs MUST be included.

    Return a valid JSON object with the following structure:
    {{
      "today": [
        {{ "type": "Breakfast/Lunch/Dinner/Snack", "time": "String", "name": "String", "calories": Number, "protein": Number, "carbs": Number, "fat": Number, "ingredients": ["String"], "image": "Emoji" }}
      ],
      "week": [
        {{ "day": "String", "meals": ["String"], "today": Boolean }}
      ],
      "shoppingList": [
        {{ "name": "String", "bought": false }}
      ]
    }}
    Strictly avoid {data.get("allergies", "None")} and consider {data.get("medical_conditions", "None")}. Focus on balanced macros and traditional healthy Indian dishes.
    """
def chat_prompt(message: str, context: str = "Fitness") -> str:
    persona = "AROMI, a smart, adaptive AI health companion" if context == "AROMI" else "an expert AI Assistant"
    focus = "overall health, wellness, and lifestyle" if context == "AROMI" else "nutrition preparation and exercise guidance"
    return f"""
    You are {persona}. 
    Your primary focus is {focus}.
    A user has sent you this message: "{message}"
    
    STRICT RESPONSE RULES:
    1. Respond ONLY in numbered points using the format: 1st, 2nd, 3rd, etc.
    2. DO NOT use paragraphs or long passages.
    3. DO NOT use any markdown symbols like "**", "*", or "#".
    4. DO NOT include any introduction ("Hello", "I'm happy to help") or conclusion.
    5. Each point must start with its sequence (e.g., 1st, 2nd, 3rd).
    6. Use plain text only. No bold, no italics.
    """