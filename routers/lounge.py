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


@router.get("/{lounge_id}", response_model=LoungeResponse)
def get_lounge(lounge_id: int, db: Session = Depends(get_db)) -> Lounge:
    """
    Get a single lounge by ID.

    - **lounge_id**: ID of the lounge to retrieve
    - Returns 404 if lounge not found
    """
    lounge = db.query(Lounge).filter(Lounge.id == lounge_id).first()
    if not lounge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lounge with id {lounge_id} not found",
        )
    return lounge