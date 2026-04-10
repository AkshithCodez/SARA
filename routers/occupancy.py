"""
routers/occupancy.py
====================
SARA – Smart Airport Resource Analytics
Occupancy API Endpoints

Handles occupancy log insertion.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_db
from core.models import Lounge, OccupancyLog
from core.schemas import OccupancyLogCreate, OccupancyLogResponse

router = APIRouter(prefix="/occupancy", tags=["occupancy"])


@router.post("/", response_model=OccupancyLogResponse, status_code=status.HTTP_201_CREATED)
def create_occupancy_log(data: OccupancyLogCreate, db: Session = Depends(get_db)) -> OccupancyLog:
    """
    Insert a new occupancy log entry.

    - **lounge_id**: ID of the lounge
    - **passenger_count**: Current number of passengers

    Returns 404 if the lounge does not exist.
    """
    lounge = db.query(Lounge).filter(Lounge.id == data.lounge_id).first()
    if not lounge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lounge with id {data.lounge_id} not found",
        )

    log = OccupancyLog(
        lounge_id=data.lounge_id,
        passenger_count=data.passenger_count,
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log