import sqlite3
import os
db_path = "arogyamitra.db"
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        cursor.execute("ALTER TABLE progress_records ADD COLUMN workout_id INTEGER")
        print("Added workout_id column.")
    except sqlite3.OperationalError as e:
        print(f"workout_id column error: {e}")
    try:
        cursor.execute("ALTER TABLE progress_records ADD COLUMN status VARCHAR DEFAULT 'Completed'")
        print("Added status column.")
    except sqlite3.OperationalError as e:
        print(f"status column error: {e}")  
    conn.commit()
    conn.close()
    print("Database update complete.")
else:
    print(f"Database {db_path} not found.")