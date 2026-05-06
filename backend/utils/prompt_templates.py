def workout_prompt(data: dict) -> str:
    goal = data.get("goal")
    level = data.get("fitness_level")
    location = data.get("location")
    
    return f"""
    You are AROMI, an expert fitness coach. 
    Create a highly personalized 7-day workout plan for a user with the following profile:
    - Goal: {goal}
    - Fitness Level: {level}
    - Location: {location}
    - Duration: {data.get("duration")} minutes per day
    - Medical Conditions: {data.get("medical_conditions", "None")}
    - Current Day: {data.get("current_day", "Monday")}

    CRITICAL INSTRUCTIONS FOR VARIETY:
    1. LEVEL SPECIFICITY:
       - Beginner: Focus on basic movements, longer rest (90s), and moderate sets/reps.
       - Intermediate: Include compound movements, moderate rest (60s), and higher intensity.
       - Advanced: High intensity, short rest (30-45s), advanced techniques (supersets, dropsets), and high volume.
    2. GOAL SPECIFICITY:
       - Weight Loss: High-intensity interval training (HIIT) and circuit training to maximize calorie burn.
       - Muscle Gain: Hypertrophy focus (8-12 reps) with heavy resistance or challenging bodyweight variations.
       - Stay Fit: Balanced approach of strength, mobility, and steady-state movement.
    3. LOCATION SPECIFICITY:
       - Home: Use bodyweight, chairs, or water bottles. Exercises must be doable in a living room.
       - Gym: Use full range of equipment (barbells, dumbbells, machines).
       - Outdoor: Focus on running, park bench exercises, and functional movements.

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
    Ensure exercises are safe and effective. If medical conditions are provided, adjust the workout to be safe.
    """

def nutrition_prompt(data: dict) -> str:
    diet = data.get("diet_type", "Vegetarian")
    goal = data.get("fitness_goal")
    level = data.get("fitness_level")

    return f"""
    You are a professional nutritionist specializing in Indian cuisine and clinical dietetics. 
    Calculate and create a 7-day Indian meal plan based on this user profile:
    - Age: {data.get("age")}
    - Height: {data.get("height")} cm
    - Weight: {data.get("weight")} kg
    - Fitness Goal: {goal}
    - Fitness Level: {level}
    - Diet Type: {diet}
    - Restrictions/Allergies: {data.get("allergies", "None")}
    - Medical Conditions: {data.get("medical_conditions", "None")}
    - Current Day: {data.get("current_day", "Monday")}

    INSTRUCTIONS:
    1. First, calculate the appropriate daily calorie intake for this user based on their physical metrics and fitness goal.
    2. GOAL-BASED MACROS:
       - Weight Loss: High protein, moderate fat, lower carbs (Caloric Deficit).
       - Muscle Gain: High protein, high carbs, moderate fat (Caloric Surplus).
       - Stay Fit: Balanced macros (Maintenance Calories).
    3. LEVEL-BASED ADJUSTMENT:
       - Advanced users require more protein and potentially higher calories for recovery.
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
    1. Respond ONLY in numbered points using the format: 1. 2. 3. etc.
    2. DO NOT use paragraphs or long passages.
    3. DO NOT use any markdown symbols like "**", "*", or "#".
    4. DO NOT include any introduction ("Hello", "I'm happy to help") or conclusion.
    5. Each point must start with its sequence (e.g., 1. 2. 3.).
    6. Use plain text only. No bold, no italics.
    """