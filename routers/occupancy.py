"""
routers/occupancy.py
====================
SARA – Smart Airport Resource Analytics
Occupancy API Endpoints

Handles occupancy log insertion and retrieval with multi-tenant security.
"""

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from core.auth import get_current_user
from core.database import get_db
from core.models import Lounge, OccupancyLog, User
from core.schemas import OccupancyLogCreate, OccupancyLogResponse

router = APIRouter(prefix="/occupancy", tags=["occupancy"])


@router.post("/", response_model=OccupancyLogResponse, status_code=status.HTTP_201_CREATED)
def create_occupancy_log(
    data: OccupancyLogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> OccupancyLog:
    """
    Insert a new occupancy log entry.

    - **lounge_id**: ID of the lounge
    - **passenger_count**: Current number of passengers

    Returns 404 if the lounge does not exist.
    Returns 403 if the lounge belongs to another airline.
    """
    lounge = db.query(Lounge).filter(Lounge.id == data.lounge_id).first()
    if not lounge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lounge with id {data.lounge_id} not found",
        )

    if lounge.airline_id != current_user.airline_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden",
        )

    log = OccupancyLog(
        lounge_id=data.lounge_id,
        passenger_count=data.passenger_count,
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


@router.get("/", response_model=List[OccupancyLogResponse])
def list_occupancy_logs(
    lounge_id: Optional[int] = Query(None, description="Filter by lounge ID"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[OccupancyLog]:
    """
    Retrieve occupancy logs.

    - **lounge_id**: Optional filter by specific lounge
    - Returns logs ordered by timestamp descending (latest first)
    - Only returns logs for lounges in the user's airline
    """
    # Get lounge IDs for user's airline
    airline_lounges = db.query(Lounge.id).filter(Lounge.airline_id == current_user.airline_id).all()
    allowed_lounge_ids = [l.id for l in airline_lounges]

    if not allowed_lounge_ids:
        return []

    query = db.query(OccupancyLog).filter(OccupancyLog.lounge_id.in_(allowed_lounge_ids))

    if lounge_id is not None:
        if lounge_id not in allowed_lounge_ids:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Forbidden",
            )
        query = query.filter(OccupancyLog.lounge_id == lounge_id)

    return query.order_by(OccupancyLog.timestamp.desc()).all()