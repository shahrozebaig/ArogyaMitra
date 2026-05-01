import sqlite3
import os
db_path = "backend/arogyamitra.db"
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        cursor.execute("ALTER TABLE progress_records ADD COLUMN healthy_meals_count INTEGER DEFAULT 0;")
        conn.commit()
        print("Successfully added healthy_meals_count column.")
    except Exception as e:
        print(f"Error or column already exists: {e}")
    finally:
        conn.close()
else:
    print(f"Database not found at {db_path}")