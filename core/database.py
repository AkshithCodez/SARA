"""
core/database.py
================
SARA – Smart Airport Resource Analytics
Database Connection Layer

Establishes a connection to Supabase PostgreSQL via SQLAlchemy.
Provides a reusable session factory, declarative base, and a
FastAPI-compatible dependency for dependency injection.

Architecture notes:
  - SSL is required by Supabase (sslmode=require).
  - Connection pool is tuned for production workloads; adjust
    pool_size / max_overflow based on your Supabase plan limits.
  - The module is intentionally free of any business logic, models,
    or route definitions — pure infrastructure.
"""

import os
import logging
from contextlib import contextmanager
from typing import Generator
from sqlalchemy.dialects.postgresql import UUID

from dotenv import load_dotenv
from sqlalchemy import create_engine, event, text
from sqlalchemy.engine import Engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker
from sqlalchemy.pool import QueuePool

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Environment
# ---------------------------------------------------------------------------
# Load variables from `.env` (or `.env.local`) at import time.
# In production (Docker / cloud) these are already injected by the runtime,
# so load_dotenv() is a safe no-op when the variables are already set.
load_dotenv()

DATABASE_URL: str = os.getenv("DATABASE_URL", "")

if not DATABASE_URL:
    raise EnvironmentError(
        "DATABASE_URL is not set. "
        "Add it to your .env file or inject it as an environment variable."
    )

# ---------------------------------------------------------------------------
# Engine
# ---------------------------------------------------------------------------
# connect_args carries driver-level SSL config that Supabase mandates.
# QueuePool (the default) is explicitly named here for clarity and future
# tuning — swap to NullPool for serverless / short-lived workers.
_CONNECT_ARGS: dict = {
    "sslmode": "require",  # Supabase enforces TLS on all connections
}

engine: Engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=2,           # number of persistent connections to keep open
    max_overflow=3,       # extra connections allowed beyond pool_size
    pool_timeout=30,       # seconds to wait for a free connection before error
    pool_recycle=1800,     # recycle connections every 30 min (avoids stale TCP)
    pool_pre_ping=True,    # issue a lightweight SELECT 1 before using a conn
    connect_args=_CONNECT_ARGS,
    echo=False,            # set to True during local development for SQL logs
)

# ---------------------------------------------------------------------------
# Checkout event — optional per-connection hardening
# ---------------------------------------------------------------------------
@event.listens_for(engine, "connect")
def _on_connect(dbapi_conn, connection_record) -> None:  # noqa: ARG001
    """
    Called once whenever a *new* raw connection is created.
    Useful for session-level settings (e.g. setting search_path for
    multi-tenant schemas, application_name for pg_stat_activity, etc.).
    """
    cursor = dbapi_conn.cursor()
    cursor.execute("SET application_name = 'SARA-Backend'")
    cursor.close()


# ---------------------------------------------------------------------------
# Session factory
# ---------------------------------------------------------------------------
# autocommit=False  → transactions must be explicitly committed (safe default)
# autoflush=False   → prevents implicit flushes that can cause subtle bugs
#                     during complex write sequences; flush manually when needed
SessionLocal: sessionmaker[Session] = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,  # keep attributes accessible after commit()
)


# ---------------------------------------------------------------------------
# Declarative base
# ---------------------------------------------------------------------------
# All ORM model classes will inherit from `Base`.
# Centralising it here ensures a single metadata object across the app,
# which is required for tools like Alembic migrations.
class Base(DeclarativeBase):
    """Project-wide SQLAlchemy declarative base."""


# ---------------------------------------------------------------------------
# FastAPI dependency — get_db()
# ---------------------------------------------------------------------------
def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency that provides a transactional database session.

    Usage in a route::

        @router.get("/flights")
        def list_flights(db: Session = Depends(get_db)):
            return db.execute(select(Flight)).scalars().all()

    The session is automatically closed (and the transaction rolled back on
    any unhandled exception) when the request lifecycle ends.
    """
    db: Session = SessionLocal()
    try:
        yield db
        db.commit()        # commit if the route handler completed without error
    except Exception:
        db.rollback()      # roll back on any unhandled exception
        raise
    finally:
        db.close()         # always release the connection back to the pool


# ---------------------------------------------------------------------------
# Context-manager helper — for use outside of FastAPI (scripts, workers)
# ---------------------------------------------------------------------------
@contextmanager
def get_db_context() -> Generator[Session, None, None]:
    """
    Synchronous context manager for scripts and background workers that run
    outside the FastAPI request/response lifecycle.

    Usage::

        with get_db_context() as db:
            results = db.execute(text("SELECT 1")).fetchone()
    """
    db: Session = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


# ---------------------------------------------------------------------------
# Connection health-check
# ---------------------------------------------------------------------------
def verify_connection() -> bool:
    """
    Executes a lightweight query to confirm the database is reachable.

    Returns:
        True  — connection successful.
        False — connection failed (error is logged with details).

    Call this during application startup or in a /health endpoint to
    surface database connectivity issues early.
    """
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        logger.info("✅  Database connection verified — Supabase PostgreSQL reachable.")
        return True
    except Exception as exc:
        logger.error("❌  Database connection FAILED: %s", exc, exc_info=True)
        return False
