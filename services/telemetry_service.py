"""
services/telemetry_service.py
=============================
SARA – Smart Airport Resource Allocator
Telemetry Ingestion Service

Business logic for processing occupancy telemetry data.
Tolerant of minor inconsistencies - trusts incoming data.
"""

import os
import logging
from datetime import datetime
from uuid import UUID

from dotenv import load_dotenv
from sqlalchemy import and_
from sqlalchemy.orm import Session

from core.models import Lounge, OccupancyLog

load_dotenv()

logger = logging.getLogger(__name__)

API_KEY = os.getenv("TELEMETRY_API_KEY", "")
MAX_DELTA = 200


class TelemetryValidationError(Exception):
    """Raised when telemetry data fails validation."""
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
    
    Relaxed validation - trusts incoming data.
    """
    if total_occupancy < 0:
        raise TelemetryValidationError("total_occupancy must be >= 0")
    
    if abs(delta) > MAX_DELTA:
        logger.warning(f"Delta {delta} exceeds typical range, but accepting")
    
    now = datetime.now(timestamp.tzinfo) if timestamp.tzinfo else datetime.now()
    if timestamp.replace(tzinfo=None) > now.replace(tzinfo=None):
        logger.warning("Timestamp is in the future, but accepting")


def normalize_timestamp(timestamp: datetime) -> datetime:
    """Normalize timestamp to prevent duplicate issues from precision differences."""
    if timestamp.tzinfo is not None:
        timestamp = timestamp.replace(tzinfo=None)
    return timestamp.replace(second=0, microsecond=0)


def process_telemetry(
    db: Session,
    lounge_id: str,
    timestamp: datetime,
    delta: int,
    total_occupancy: int,
) -> dict:
    """
    Process and store telemetry data.
    
    Relaxed idempotency - trusts incoming total_occupancy as source of truth.
    """
    normalized_ts = normalize_timestamp(timestamp)
    
    existing = db.query(OccupancyLog).filter(
        and_(
            OccupancyLog.lounge_id == lounge_id,
            OccupancyLog.timestamp == normalized_ts,
        )
    ).first()

    if existing:
        existing.passenger_count = total_occupancy
        db.commit()
        logger.info(f"Updated occupancy for lounge {lounge_id} at {normalized_ts}")
        return {"status": "success", "message": "Telemetry updated", "created": False}

    lounge = db.query(Lounge).filter(Lounge.id == lounge_id).first()
    if not lounge:
        logger.warning(f"Lounge {lounge_id} not found")
        return {"status": "error", "message": "Lounge not found", "created": False}

    log = OccupancyLog(
        lounge_id=lounge_id,
        timestamp=normalized_ts,
        passenger_count=total_occupancy,
    )
    db.add(log)
    db.commit()
    logger.info(f"Inserted occupancy for lounge {lounge_id} at {normalized_ts}: {total_occupancy}")
    
    return {"status": "success", "message": "Telemetry ingested", "created": True}


def ingest_telemetry(
    db: Session,
    lounge_id: str,
    timestamp: datetime,
    delta: int,
    total_occupancy: int,
) -> dict:
    """
    Main entry point for telemetry ingestion.
    
    Validates, processes, and stores telemetry data.
    """
    try:
        validate_telemetry(total_occupancy, delta, timestamp)
    except TelemetryValidationError as e:
        logger.warning(f"Validation warning: {e}")
    
    result = process_telemetry(db, lounge_id, timestamp, delta, total_occupancy)
    
    return result