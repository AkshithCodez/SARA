"""
core/schemas.py
===============
SARA – Smart Airport Resource Analytics
Pydantic Schemas

Request/response validation models for FastAPI.
Uses Pydantic v2 with ConfigDict for ORM mode.
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


# =============================================================================
# Lounge Schemas
# =============================================================================


class LoungeBase(BaseModel):
    """Base schema with common lounge fields."""

    name: str = Field(..., max_length=255)
    location: str = Field(..., max_length=255)
    capacity: int = Field(..., gt=0)


class LoungeCreate(LoungeBase):
    """Schema for creating a new lounge."""

    airline_id: int = Field(..., gt=0)


class LoungeUpdate(BaseModel):
    """Schema for updating a lounge (all fields optional)."""

    name: Optional[str] = Field(None, max_length=255)
    location: Optional[str] = Field(None, max_length=255)
    capacity: Optional[int] = Field(None, gt=0)


class LoungeResponse(LoungeBase):
    """Schema for lounge responses."""

    id: int
    airline_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# =============================================================================
# OccupancyLog Schemas
# =============================================================================


class OccupancyLogBase(BaseModel):
    """Base schema with common occupancy log fields."""

    passenger_count: int = Field(..., ge=0)


class OccupancyLogCreate(OccupancyLogBase):
    """Schema for creating a new occupancy log entry."""

    lounge_id: UUID = Field(..., gt=0)


class OccupancyLogResponse(OccupancyLogBase):
    """Schema for occupancy log responses."""

    id: int
    lounge_id: UUID
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)


# =============================================================================
# Airline Schemas (for completeness)
# =============================================================================


class AirlineBase(BaseModel):
    """Base schema with common airline fields."""

    name: str = Field(..., max_length=255)


class AirlineCreate(AirlineBase):
    """Schema for creating a new airline."""


class AirlineResponse(AirlineBase):
    """Schema for airline responses."""

    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# =============================================================================
# User Schemas (for completeness)
# =============================================================================


class UserBase(BaseModel):
    """Base schema with common user fields."""

    email: str = Field(..., max_length=255)
    role: str = Field(..., max_length=50)


class UserCreate(UserBase):
    """Schema for creating a new user."""

    hashed_password: str = Field(..., max_length=255)
    airline_id: int = Field(..., gt=0)


class UserResponse(UserBase):
    """Schema for user responses (excludes password)."""

    id: int
    airline_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# =============================================================================
# Auth Schemas
# =============================================================================


class SignupRequest(BaseModel):
    """Request schema for user signup."""

    email: str = Field(..., max_length=255)
    password: str = Field(..., min_length=6, max_length=255)
    role: str = Field(..., max_length=50)
    airline_id: int = Field(..., gt=0)


class LoginRequest(BaseModel):
    """Request schema for user login."""

    email: str = Field(..., max_length=255)
    password: str = Field(..., max_length=255)


class TokenResponse(BaseModel):
    """Response schema for authentication tokens."""

    access_token: str
    token_type: str = "bearer"


# =============================================================================
# Telemetry Schemas
# =============================================================================


class OccupancyTelemetryRequest(BaseModel):
    """Request schema for occupancy telemetry ingestion."""

    lounge_id: UUID = Field(..., description="UUID of the lounge")
    timestamp: datetime = Field(..., description="Timestamp of the reading")
    delta: int = Field(..., ge=-100, le=100, description="Change in occupancy (-100 to 100)")
    total_occupancy: int = Field(..., ge=0, description="Current total occupancy")


class TelemetryResponse(BaseModel):
    """Response schema for telemetry ingestion."""

    status: str
    message: str