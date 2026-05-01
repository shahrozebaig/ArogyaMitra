from sqlalchemy.orm import Session
from models.user_model import User
from utils.password_handler import hash_password, verify_password
from utils.jwt_handler import create_access_token
def register_user(db: Session, name: str, email: str, password: str):
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        return None
    new_user = User(
        name=name,
        email=email,
        password=hash_password(password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
def login_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    if not verify_password(password, user.password):
        return None
    token = create_access_token({"user_id": user.id})
    return {"user": user, "token": token}