"""
routers/lounge.py
=================
SARA – Smart Airport Resource Analytics
Lounge API Endpoints

Handles lounge creation and listing.
"""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_db
from core.models import Lounge
from core.schemas import LoungeCreate, LoungeResponse

router = APIRouter(prefix="/lounges", tags=["lounges"])


@router.post("/", response_model=LoungeResponse, status_code=status.HTTP_201_CREATED)
def create_lounge(data: LoungeCreate, db: Session = Depends(get_db)) -> Lounge:
    """
    Create a new lounge.

    - **name**: Lounge name
    - **location**: Terminal or gate location
    - **capacity**: Maximum passenger capacity
    - **airline_id**: ID of the airline owning this lounge
    """
    lounge = Lounge(
        name=data.name,
        location=data.location,
        capacity=data.capacity,
        airline_id=data.airline_id,
    )
    db.add(lounge)
    db.commit()
    db.refresh(lounge)
    return lounge


@router.get("/", response_model=List[LoungeResponse])
def list_lounges(db: Session = Depends(get_db)) -> List[Lounge]:
    """
    List all lounges.

    Returns a list of all lounges in the system.
    """
    return db.query(Lounge).all()