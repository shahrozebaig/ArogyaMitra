from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.health_model import HealthProfile
from schemas.health_schema import HealthCreate, HealthResponse

router = APIRouter()


@router.post("/assessment", response_model=HealthResponse)
def create_health(data: HealthCreate, db: Session = Depends(get_db)):
    user_id = 1

    health = HealthProfile(
        user_id=user_id,
        **data.dict()
    )

    db.add(health)
    db.commit()
    db.refresh(health)

    return health