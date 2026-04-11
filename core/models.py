"""
core/models.py
==============
SARA – Smart Airport Resource Analytics
SQLAlchemy ORM Models (UUID-based)

Defines the database schema for a multi-tenant system.
All models inherit from Base defined in core.database.

Relationships:
  - Airline -> Users (one-to-many)
  - Airline -> Lounges (one-to-many)
  - Lounge -> OccupancyLogs (one-to-many)
"""

from datetime import datetime
from typing import TYPE_CHECKING, List

from sqlalchemy import DateTime, ForeignKey, Index, String, func
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.database import Base

if TYPE_CHECKING:
    from core.database import Base


class Airline(Base):
    """Airlines (tenants) in the multi-tenant system."""

    __tablename__ = "airlines"

    id: Mapped[str] = mapped_column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=lambda: str(__import__("uuid").uuid4()),
    )
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    users: Mapped[List["User"]] = relationship(
        "User",
        back_populates="airline",
        cascade="all, delete-orphan",
    )
    lounges: Mapped[List["Lounge"]] = relationship(
        "Lounge",
        back_populates="airline",
        cascade="all, delete-orphan",
    )


class User(Base):
    """User accounts belonging to an airline."""

    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=lambda: str(__import__("uuid").uuid4()),
    )
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), nullable=False)
    airline_id: Mapped[str] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("airlines.id", ondelete="CASCADE"),
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    airline: Mapped["Airline"] = relationship("Airline", back_populates="users")

    __table_args__ = (
        Index("ix_users_airline_id", "airline_id"),
        Index("ix_users_email", "email"),
    )


class Lounge(Base):
    """Airport lounges operated by an airline."""

    __tablename__ = "lounges"

    id: Mapped[str] = mapped_column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=lambda: str(__import__("uuid").uuid4()),
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    location: Mapped[str] = mapped_column(String(255), nullable=False)
    capacity: Mapped[int] = mapped_column(nullable=False)
    airline_id: Mapped[str] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("airlines.id", ondelete="CASCADE"),
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    airline: Mapped["Airline"] = relationship("Airline", back_populates="lounges")
    occupancy_logs: Mapped[List["OccupancyLog"]] = relationship(
        "OccupancyLog",
        back_populates="lounge",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        Index("ix_lounges_airline_id", "airline_id"),
    )


class OccupancyLog(Base):
    """Time-series occupancy data for lounges."""

    __tablename__ = "occupancy_logs"

    id: Mapped[str] = mapped_column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=lambda: str(__import__("uuid").uuid4()),
    )
    lounge_id: Mapped[str] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("lounges.id", ondelete="CASCADE"),
        nullable=False,
    )
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True,
    )
    passenger_count: Mapped[int] = mapped_column(nullable=False)

    lounge: Mapped["Lounge"] = relationship("Lounge", back_populates="occupancy_logs")

    __table_args__ = (
        Index("ix_occupancy_logs_lounge_id", "lounge_id"),
        Index("ix_occupancy_logs_timestamp", "timestamp"),
    )