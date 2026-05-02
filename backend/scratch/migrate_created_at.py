import sqlite3
import os
db_path = r'c:\Users\shahr\ArogyaMitra\backend\arogyamitra.db'
def migrate():
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        print("Adding created_at to workout_plans...")
        cursor.execute("ALTER TABLE workout_plans ADD COLUMN created_at TEXT")
    except sqlite3.OperationalError as e:
        print(f"WorkoutPlan migration: {e}")
    try:
        print("Adding created_at to nutrition_plans...")
        cursor.execute("ALTER TABLE nutrition_plans ADD COLUMN created_at TEXT")
    except sqlite3.OperationalError as e:
        print(f"NutritionPlan migration: {e}")
    conn.commit()
    conn.close()
    print("Migration finished.")
if __name__ == "__main__":
    migrate()