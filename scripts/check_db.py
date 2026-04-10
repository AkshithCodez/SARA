"""
scripts/check_db.py
====================
SARA – Smart Airport Resource Analytics
Standalone database connection verification script.

Run from the project root::

    python scripts/check_db.py

This script is intentionally kept separate from the FastAPI app so it
can be executed in CI pipelines, pre-deployment checks, or developer
setup workflows without starting the full server.
"""

import sys
import logging
from pathlib import Path

# ---------------------------------------------------------------------------
# Path bootstrap — allows running from the project root without installing
# the package (useful during early development).
# ---------------------------------------------------------------------------
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import text

from core.database import engine, verify_connection, get_db_context

# ---------------------------------------------------------------------------
# Basic logging to stdout for script usage
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
)
logger = logging.getLogger("sara.check_db")


def run_checks() -> None:
    """
    Runs a suite of lightweight database checks and prints a summary.
    Exits with code 1 if any check fails — useful for CI/CD pipelines.
    """
    passed: list[str] = []
    failed: list[str] = []

    # ------------------------------------------------------------------
    # Check 1: Basic connectivity (SELECT 1)
    # ------------------------------------------------------------------
    logger.info("Running Check 1: Basic connectivity …")
    if verify_connection():
        passed.append("Basic connectivity (SELECT 1)")
    else:
        failed.append("Basic connectivity (SELECT 1)")

    # ------------------------------------------------------------------
    # Check 2: PostgreSQL server version
    # ------------------------------------------------------------------
    logger.info("Running Check 2: Server version …")
    try:
        with engine.connect() as conn:
            row = conn.execute(text("SELECT version()")).fetchone()
            version_str = row[0] if row else "unknown"
        logger.info("   Server version: %s", version_str)
        passed.append("Server version query")
    except Exception as exc:
        logger.error("   Server version query failed: %s", exc)
        failed.append("Server version query")

    # ------------------------------------------------------------------
    # Check 3: Session / ORM layer via context manager
    # ------------------------------------------------------------------
    logger.info("Running Check 3: ORM session (context manager) …")
    try:
        with get_db_context() as db:
            result = db.execute(text("SELECT current_database(), current_user")).fetchone()
            db_name, db_user = result[0], result[1]
        logger.info("   Connected to DB '%s' as user '%s'", db_name, db_user)
        passed.append("ORM session context manager")
    except Exception as exc:
        logger.error("   ORM session check failed: %s", exc)
        failed.append("ORM session context manager")

    # ------------------------------------------------------------------
    # Summary report
    # ------------------------------------------------------------------
    print("\n" + "=" * 55)
    print("  SARA — Database Connection Check Report")
    print("=" * 55)
    for item in passed:
        print(f"  ✅  PASS  {item}")
    for item in failed:
        print(f"  ❌  FAIL  {item}")
    print("=" * 55)
    print(f"  Results: {len(passed)} passed, {len(failed)} failed")
    print("=" * 55 + "\n")

    if failed:
        sys.exit(1)


if __name__ == "__main__":
    run_checks()
