"""
routers/lounge.py
=================
SARA – Smart Airport Resource Analytics
Lounge API Endpoints

Handles lounge creation and listing with multi-tenant security.
"""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.auth import get_current_user
from core.database import get_db
from core.models import Lounge, User
from core.schemas import LoungeCreate, LoungeResponse

router = APIRouter(prefix="/lounges", tags=["lounges"])


@router.post("/", response_model=LoungeResponse, status_code=status.HTTP_201_CREATED)
def create_lounge(
    data: LoungeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Lounge:
    """
    Create a new lounge.

    - **name**: Lounge name
    - **location**: Terminal or gate location
    - **capacity**: Maximum passenger capacity
    - **airline_id**: ID of the airline owning this lounge
    """
    if data.airline_id != current_user.airline_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot create lounge for another airline",
        )

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
def list_lounges(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[Lounge]:
    """
    List all lounges for the user's airline.

    Returns only lounges belonging to the user's airline.
    """
    return db.query(Lounge).filter(Lounge.airline_id == current_user.airline_id).all()


@router.get("/{lounge_id}", response_model=LoungeResponse)
def get_lounge(
    lounge_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Lounge:
    """
    Get a single lounge by ID.

    - **lounge_id**: ID of the lounge to retrieve
    - Returns 404 if lounge not found
    - Returns 403 if lounge belongs to another airline
    """
    lounge = db.query(Lounge).filter(Lounge.id == lounge_id).first()
    if not lounge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lounge with id {lounge_id} not found",
        )

    if lounge.airline_id != current_user.airline_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden",
        )

    return lounge