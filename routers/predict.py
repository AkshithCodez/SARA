"""
routers/predict.py
==================
SARA – Smart Airport Resource Allocator
Prediction API Endpoints

Exposes ML forecasting functionality via REST API.
"""

from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.database import get_db
from services.ml_service import forecast_lounge

router = APIRouter(
    tags=["prediction"]
)


@router.get("/lounges/{lounge_id}/forecast")
def predict_lounge(lounge_id: UUID, db: Session = Depends(get_db)):
    """
    Generate occupancy forecast for a specific lounge.

    - **lounge_id**: UUID of the lounge to predict

    Returns:
        {
            "lounge_id": "uuid",
            "forecast": [50.0, 52.3, ...],
            "model_version": "v1"
        }
    """
    return forecast_lounge(db, lounge_id)