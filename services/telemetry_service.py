"""
services/telemetry_service.py
=============================
SARA – Smart Airport Resource Allocator
Telemetry Ingestion Service

Business logic for processing occupancy telemetry data.
"""

import os
from datetime import datetime
from typing import Optional

from dotenv import load_dotenv
from sqlalchemy import and_
from sqlalchemy.orm import Session

from core.models import Lounge, OccupancyLog

load_dotenv()

API_KEY = os.getenv("TELEMETRY_API_KEY", "")
MAX_DELTA = 100


class TelemetryValidationError(Exception):
    """Raised when telemetry data fails validation."""
    pass


class TelemetryAuthenticationError(Exception):
    """Raised when API key authentication fails."""
    pass


def validate_api_key(api_key: str) -> bool:
    """Validate the API key against environment variable."""
    if not API_KEY:
        raise RuntimeError("TELEMETRY_API_KEY not configured in environment")
    return api_key == API_KEY


def validate_telemetry(
    total_occupancy: int,
    delta: int,
    timestamp: datetime,
) -> None:
    """
    Validate telemetry data rules.
    
    Raises:
        TelemetryValidationError: If validation fails
    """
    if total_occupancy < 0:
        raise TelemetryValidationError("total_occupancy must be >= 0")
    
    if abs(delta) > MAX_DELTA:
        raise TelemetryValidationError(f"delta exceeds maximum allowed value ({MAX_DELTA})")
    
    now = datetime.now(timestamp.tzinfo) if timestamp.tzinfo else datetime.now()
    if timestamp > now:
        raise TelemetryValidationError("timestamp cannot be in the future")


def process_telemetry(
    db: Session,
    lounge_id: int,
    timestamp: datetime,
    delta: int,
    total_occupancy: int,
) -> bool:
    """
    Process and store telemetry data with idempotency.
    
    Args:
        db: Database session
        lounge_id: ID of the lounge
        timestamp: Timestamp of the reading
        delta: Change in occupancy
        total_occupancy: Current total occupancy
    
    Returns:
        True if ingested, False if duplicate
    """
    existing = db.query(OccupancyLog).filter(
        and_(
            OccupancyLog.lounge_id == lounge_id,
            OccupancyLog.timestamp == timestamp,
        )
    ).first()

    if existing:
        if existing.passenger_count != total_occupancy:
            existing.passenger_count = total_occupancy
            db.commit()
        return False

    lounge = db.query(Lounge).filter(Lounge.id == lounge_id).first()
    if not lounge:
        return False

    log = OccupancyLog(
        lounge_id=lounge_id,
        timestamp=timestamp,
        passenger_count=total_occupancy,
    )
    db.add(log)
    db.commit()
    return True


def ingest_telemetry(
    db: Session,
    lounge_id: int,
    timestamp: datetime,
    delta: int,
    total_occupancy: int,
) -> dict:
    """
    Main entry point for telemetry ingestion.
    
    Validates, processes, and stores telemetry data.
    """
    validate_telemetry(total_occupancy, delta, timestamp)
    ingested = process_telemetry(db, lounge_id, timestamp, delta, total_occupancy)
    
    return {
        "status": "success",
        "message": "Telemetry ingested" if ingested else "Telemetry already exists (duplicate)",
    }