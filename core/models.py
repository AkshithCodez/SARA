"""
core/models.py
==============
SARA – Smart Airport Resource Analytics
SQLAlchemy ORM Models

Defines the database schema for a multi-tenant system.
All models inherit from Base defined in core.database.

Relationships:
  - Airline -> Users (one-to-many)
  - Airline -> Lounges (one-to-many)
  - Lounge -> OccupancyLogs (one-to-many)
"""

from datetime import datetime
from typing import TYPE_CHECKING, List

from sqlalchemy import DateTime, ForeignKey, Index, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.database import Base

if TYPE_CHECKING:
    from core.database import Base


class Airline(Base):
    """Airlines (tenants) in the multi-tenant system."""

    __tablename__ = "airlines"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
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

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), nullable=False)  # admin, manager
    airline_id: Mapped[int] = mapped_column(
        Integer,
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

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    location: Mapped[str] = mapped_column(String(255), nullable=False)  # e.g., Terminal A
    capacity: Mapped[int] = mapped_column(Integer, nullable=False)
    airline_id: Mapped[int] = mapped_column(
        Integer,
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

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    lounge_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("lounges.id", ondelete="CASCADE"),
        nullable=False,
    )
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True,
    )
    passenger_count: Mapped[int] = mapped_column(Integer, nullable=False)

    lounge: Mapped["Lounge"] = relationship("Lounge", back_populates="occupancy_logs")

    __table_args__ = (
        Index("ix_occupancy_logs_lounge_id", "lounge_id"),
        Index("ix_occupancy_logs_timestamp", "timestamp"),
    )