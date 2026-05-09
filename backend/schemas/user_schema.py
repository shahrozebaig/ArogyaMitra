from pydantic import BaseModel, EmailStr
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
class UserLogin(BaseModel):
    email: EmailStr
    password: str
class UserUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
class ProfileImageUpdate(BaseModel):
    profile_image: str
class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    profile_image: str | None = None
    class Config:
        from_attributes = True