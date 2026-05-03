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
        print("Adding gender to health_profiles...")
        cursor.execute("ALTER TABLE health_profiles ADD COLUMN gender TEXT")
    except sqlite3.OperationalError as e:
        print(f"HealthProfile migration: {e}")
    conn.commit()
    conn.close()
    print("Migration finished.")
if __name__ == "__main__":
    migrate()