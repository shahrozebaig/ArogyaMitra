import sqlite3
import os
db_path = r"c:\Users\shahr\ArogyaMitra\backend\arogyamitra.db"
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        cursor.execute("ALTER TABLE health_profiles ADD COLUMN dietary_preference TEXT DEFAULT 'Vegetarian'")
        conn.commit()
        print("Success: Added dietary_preference column to health_profiles table.")
    except sqlite3.OperationalError as e:
        print(f"Notice: {e}")
    finally:
        conn.close()
else:
    print(f"Error: Database not found at {db_path}")