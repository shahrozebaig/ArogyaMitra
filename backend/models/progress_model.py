from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base
class ProgressRecord(Base):
    __tablename__ = "progress_records"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    weight = Column(Float)
    calories_burned = Column(Float)
    workout_completed = Column(Integer)
    healthy_meals_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User")