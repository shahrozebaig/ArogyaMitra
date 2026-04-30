from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base
class NutritionPlan(Base):
    __tablename__ = "nutrition_plans"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    calories = Column(Integer)
    diet_type = Column(String)
    plan_json = Column(Text)
    user = relationship("User")
