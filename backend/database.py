from motor.motor_asyncio import AsyncIOMotorClient
from config import MONGO_URL
client = AsyncIOMotorClient(MONGO_URL)
db = client.get_database("arogyamitra")
async def get_db():
    return db