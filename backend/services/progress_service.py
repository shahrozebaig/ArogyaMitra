from datetime import datetime
async def create_progress(db, user_id: str, data: dict):
    status = data.get("status", "Completed")
    workout_id = data.get("workout_id")
    if status == "In Progress" and workout_id:
        existing = await db.progress.find_one({
            "user_id": user_id,
            "workout_id": workout_id,
            "status": "In Progress"
        }, sort=[("created_at", -1)])
        if existing:
            update_data = {
                "calories_burned": data.get("calories_burned", existing.get("calories_burned")),
                "weight": data.get("weight", existing.get("weight")),
                "workout_completed": data.get("workout_completed", existing.get("workout_completed"))
            }
            await db.progress.update_one({"_id": existing["_id"]}, {"$set": update_data})
            existing.update(update_data)
            existing["id"] = str(existing.pop("_id"))
            return existing
    progress_doc = {
        "user_id": user_id,
        "weight": data.get("weight"),
        "calories_burned": data.get("calories_burned"),
        "workout_completed": data.get("workout_completed"),
        "healthy_meals_count": data.get("healthy_meals_count", 0),
        "status": status,
        "workout_id": workout_id,
        "created_at": datetime.now()
    }
    result = await db.progress.insert_one(progress_doc)
    progress_doc["id"] = str(result.inserted_id)
    if "_id" in progress_doc: progress_doc.pop("_id")
    return progress_doc
async def get_progress_stats(db, user_id: str):
    cursor = db.progress.find({"user_id": user_id}).sort("created_at", 1)
    records = []
    async for record in cursor:
        record["id"] = str(record.pop("_id"))
        records.append(record)
    return records