from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
class HealthProfile(Base):
    __tablename__ = "health_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    age = Column(Integer)
    height = Column(Integer)
    weight = Column(Integer)
    gender = Column(String)
    fitness_goal = Column(String)
    fitness_level = Column(String)
    workout_location = Column(String)
    workout_time = Column(String)
    dietary_preference = Column(String, default="Vegetarian")
    allergies = Column(String)
    medical_conditions = Column(String)
    user = relationship("User")