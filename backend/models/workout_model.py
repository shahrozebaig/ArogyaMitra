from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base
class WorkoutPlan(Base):
    __tablename__ = "workout_plans"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    goal = Column(String)
    duration = Column(Integer)
    plan_json = Column(Text)
    user = relationship("User")
