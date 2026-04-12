"""
routers/telemetry.py
====================
SARA – Smart Airport Resource Allocator
Telemetry Ingestion Router

Handles POST /api/v1/telemetry/occupancy endpoint.
"""

import logging

from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_db
from core.schemas import OccupancyTelemetryRequest, TelemetryResponse
from services.telemetry_service import (
    TelemetryValidationError,
    ingest_telemetry,
    validate_api_key,
)

router = APIRouter(prefix="/api/v1/telemetry", tags=["telemetry"])

logger = logging.getLogger(__name__)


@router.post("/occupancy", response_model=TelemetryResponse)
def ingest_occupancy_telemetry(
    data: OccupancyTelemetryRequest,
    x_api_key: str = Header(..., alias="x-api-key"),
    db: Session = Depends(get_db),
) -> TelemetryResponse:
    """
    Ingest occupancy telemetry data.
    
    Requires API key authentication via x-api-key header.
    
    - **lounge_id**: UUID of the lounge
    - **timestamp**: Timestamp of the reading
    - **delta**: Change in occupancy (not validated strictly)
    - **total_occupancy**: Current total occupancy
    """
    try:
        if not validate_api_key(x_api_key):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid API key",
            )
    except RuntimeError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )

    result = ingest_telemetry(
        db=db,
        lounge_id=str(data.lounge_id),
        timestamp=data.timestamp,
        delta=data.delta,
        total_occupancy=data.total_occupancy,
    )
    
    if result.get("status") == "error":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=result.get("message", "Lounge not found"),
        )
    
    return TelemetryResponse(
        status=result.get("status", "success"),
        message=result.get("message", "Telemetry ingested"),
    )