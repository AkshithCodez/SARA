"""
routers/telemetry.py
====================
SARA – Smart Airport Resource Allocator
Telemetry Ingestion Router

Handles POST /api/v1/telemetry/occupancy endpoint.
"""

from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_db
from core.schemas import OccupancyTelemetryRequest, TelemetryResponse
from services.telemetry_service import (
    TelemetryAuthenticationError,
    TelemetryValidationError,
    ingest_telemetry,
    validate_api_key,
)

router = APIRouter(prefix="/api/v1/telemetry", tags=["telemetry"])


@router.post("/occupancy", response_model=TelemetryResponse)
def ingest_occupancy_telemetry(
    data: OccupancyTelemetryRequest,
    x_api_key: str = Header(..., alias="x-api-key"),
    db: Session = Depends(get_db),
) -> TelemetryResponse:
    """
    Ingest occupancy telemetry data.
    
    Requires API key authentication via x-api-key header.
    
    - **lounge_id**: ID of the lounge
    - **timestamp**: Timestamp of the reading
    - **delta**: Change in occupancy
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

    try:
        result = ingest_telemetry(
            db=db,
            lounge_id=data.lounge_id,
            timestamp=data.timestamp,
            delta=data.delta,
            total_occupancy=data.total_occupancy,
        )
        return TelemetryResponse(**result)
    except TelemetryValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )