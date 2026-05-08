import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

async def check_users():
    mongo_url = os.getenv("MONGO_URL")
    if not mongo_url:
        print("MONGO_URL not found in .env")
        return
    
    client = AsyncIOMotorClient(mongo_url)
    db = client.get_database("arogyamitra")

    
    users = await db.users.find().to_list(100)
    print(f"Found {len(users)} users.")
    for u in users:
        print(f"- {u.get('name')} ({u.get('email')})")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(check_users())
