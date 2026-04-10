"""
scripts/test_db.py
==================
SARA – Smart Airport Resource Analytics
Database connection verification script.

Run from project root:
    python scripts/test_db.py

This script tests the database connection and prints the result.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from core.database import verify_connection


def main() -> None:
    print("\n" + "=" * 50)
    print("  SARA — Database Connection Test")
    print("=" * 50)

    if verify_connection():
        print("  [OK] Database connection successful\n")
    else:
        print("  [FAIL] Database connection failed\n")
        sys.exit(1)


if __name__ == "__main__":
    main()