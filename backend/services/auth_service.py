from utils.password_handler import hash_password, verify_password
from utils.jwt_handler import create_access_token
async def register_user(db, name: str, email: str, password: str):
    existing_user = await db.users.find_one({"email": email})
    if existing_user:
        return None
    new_user = {
        "name": name,
        "email": email,
        "password": hash_password(password)
    }
    result = await db.users.insert_one(new_user)
    new_user["id"] = str(result.inserted_id)
    if "_id" in new_user: new_user.pop("_id")
    return new_user
from fastapi import HTTPException
async def login_user(db, email: str, password: str):
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="Account not found")
    if not verify_password(password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid password")
    user["id"] = str(user.pop("_id"))
    token = create_access_token({"user_id": user["id"]})
    return {"user": user, "token": token}