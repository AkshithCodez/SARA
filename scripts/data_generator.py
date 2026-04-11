"""
scripts/data_generator.py
=========================
SARA – Smart Airport Resource Allocator
Synthetic Data Generator

Simulates real-world airport lounge occupancy patterns and sends
telemetry data to the backend API.

Usage:
    python scripts/data_generator.py

Requirements:
    - Backend must be running at http://127.0.0.1:8000
    - TELEMETRY_API_KEY must be set in .env file
"""

import os
import sys
import time
import random
from datetime import datetime, timedelta
from typing import Tuple

from dotenv import load_dotenv
import requests

load_dotenv()

API_URL = os.getenv("API_URL", "http://127.0.0.1:8000/api/v1/telemetry/occupancy")
API_KEY = os.getenv("TELEMETRY_API_KEY")
HEALTH_CHECK_URL = os.getenv("HEALTH_CHECK_URL", "http://127.0.0.1:8000/")
LOUNGE_ID = os.getenv("LOUNGE_ID", "11111111-1111-1111-1111-111111111111")

SIMULATION_HOURS = 24
INTERVAL_MINUTES = 5
SIMULATION_SLEEP = 0.5  # Fast-forward simulation (don't wait real time)
MAX_RETRIES = 3


def validate_config():
    """Validate required environment variables."""
    errors = []
    
    if not API_KEY:
        errors.append("TELEMETRY_API_KEY is not set in .env file")
    
    if errors:
        print("=" * 60)
        print("  Configuration Error")
        print("=" * 60)
        for error in errors:
            print(f"  - {error}")
        print()
        print("  Please create a .env file with:")
        print("    TELEMETRY_API_KEY=your-api-key-here")
        print("    API_URL=http://127.0.0.1:8000/api/v1/telemetry/occupancy")
        print("    LOUNGE_ID=11111111-1111-1111-1111-111111111111")
        print("=" * 60)
        sys.exit(1)


def check_server_health():
    """Check if backend server is running."""
    print("Checking backend server...")
    try:
        response = requests.get(HEALTH_CHECK_URL, timeout=5)
        if response.status_code == 200:
            print("  Backend is running.")
            return True
    except requests.exceptions.RequestException:
        pass
    
    print("=" * 60)
    print("  Backend Not Running")
    print("=" * 60)
    print(f"  Could not connect to: {HEALTH_CHECK_URL}")
    print()
    print("  Start the backend with:")
    print("    cd C:\\Users\\reddy\\Downloads\\projects\\sara\\SARA")
    print("    python -m uvicorn main:app --reload --port 8000")
    print("=" * 60)
    sys.exit(1)


def get_time_slot(hour: int) -> str:
    """Determine time slot based on hour."""
    if 6 <= hour < 11:
        return "morning"
    elif 11 <= hour < 16:
        return "afternoon"
    elif 16 <= hour < 21:
        return "evening"
    else:
        return "night"


def get_occupancy_range(time_slot: str, is_weekend: bool) -> Tuple[int, int]:
    """Get min/max occupancy based on time slot and day type."""
    ranges = {
        "morning": (50, 80) if not is_weekend else (40, 70),
        "afternoon": (80, 120) if not is_weekend else (70, 110),
        "evening": (120, 180) if not is_weekend else (100, 150),
        "night": (40, 70),
    }
    return ranges.get(time_slot, (50, 80))


def is_weekend(timestamp: datetime) -> bool:
    """Check if timestamp falls on a weekend."""
    return timestamp.weekday() >= 5


def calculate_occupancy(
    timestamp: datetime,
    prev_occupancy: int,
    is_weekend: bool,
    minute_of_day: int,
) -> Tuple[int, int]:
    """
    Calculate occupancy with smooth transitions.
    
    Returns: (total_occupancy, delta)
    """
    hour = timestamp.hour
    time_slot = get_time_slot(hour)
    min_occ, max_occ = get_occupancy_range(time_slot, is_weekend)
    
    target = random.randint(min_occ, max_occ)
    
    if minute_of_day < 120:
        trend = 1.02
    elif minute_of_day < 480:
        trend = 1.05
    elif minute_of_day < 840:
        trend = 1.08
    elif minute_of_day < 1020:
        trend = 1.02
    else:
        trend = 0.98
    
    target = int(target * trend)
    target = max(0, min(target, 300))
    
    diff = target - prev_occupancy
    
    max_change = 15
    if abs(diff) > max_change:
        change = max_change if diff > 0 else -max_change
    else:
        change = diff
    
    new_occupancy = prev_occupancy + change
    
    new_occupancy = max(0, min(new_occupancy, 300))
    delta = new_occupancy - prev_occupancy
    
    return new_occupancy, delta


def send_telemetry(lounge_id: str, timestamp: datetime, delta: int, total_occupancy: int) -> Tuple[bool, str]:
    """Send telemetry data to the API with retry logic."""
    timestamp_str = timestamp.isoformat() + "Z"
    
    payload = {
        "lounge_id": lounge_id,
        "timestamp": timestamp_str,
        "delta": delta,
        "total_occupancy": total_occupancy,
    }
    
    headers = {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
    }
    
    for attempt in range(MAX_RETRIES):
        try:
            response = requests.post(API_URL, json=payload, headers=headers, timeout=5)
            if response.status_code in (200, 201):
                return True, "SUCCESS"
            elif response.status_code == 401:
                return False, "FAILED (401: Invalid API key. Check TELEMETRY_API_KEY in .env)"
            else:
                if attempt < MAX_RETRIES - 1:
                    time.sleep(1)
                    continue
                return False, f"FAILED ({response.status_code})"
        except requests.exceptions.RequestException as e:
            if attempt < MAX_RETRIES - 1:
                time.sleep(1)
                continue
            return False, f"FAILED (Connection error: {e})"
    
    return False, "FAILED (Max retries exceeded)"


def run_simulation():
    """Main simulation loop."""
    validate_config()
    check_server_health()
    
    print()
    print("=" * 60)
    print("  SARA - Synthetic Data Generator")
    print("=" * 60)
    print(f"  API URL: {API_URL}")
    print(f"  Lounge ID: {LOUNGE_ID}")
    print(f"  Duration: {SIMULATION_HOURS} hours")
    print(f"  Interval: {INTERVAL_MINUTES} minutes")
    print(f"  Max Retries: {MAX_RETRIES}")
    print("=" * 60)
    print()
    
    start_time = datetime.utcnow().replace(second=0, microsecond=0)
    
    current_occupancy = 60
    total_sent = 0
    total_failed = 0
    
    simulation_duration = timedelta(hours=SIMULATION_HOURS)
    interval = timedelta(minutes=INTERVAL_MINUTES)
    
    current_time = start_time
    end_time = start_time + simulation_duration
    
    print(f"Starting at: {start_time.strftime('%Y-%m-%d %H:%M')}")
    print(f"Ending at: {end_time.strftime('%Y-%m-%d %H:%M')}")
    print()
    
    while current_time < end_time:
        hour = current_time.hour
        minute_of_day = hour * 60 + current_time.minute
        weekend = is_weekend(current_time)
        
        current_occupancy, delta = calculate_occupancy(
            current_time,
            current_occupancy,
            weekend,
            minute_of_day,
        )
        
        time_str = current_time.strftime("%H:%M")
        success, status = send_telemetry(LOUNGE_ID, current_time, delta, current_occupancy)
        
        if success:
            print(f"[{time_str}] Lounge A: {current_occupancy} ({delta:+d}) -> SUCCESS")
            total_sent += 1
        else:
            print(f"[{time_str}] Lounge A: {current_occupancy} ({delta:+d}) -> {status}")
            total_failed += 1
        
        time.sleep(SIMULATION_SLEEP)
        current_time += interval
    
    print()
    print("=" * 60)
    print("  Simulation Complete")
    print("=" * 60)
    print(f"  Records sent: {total_sent}")
    print(f"  Records failed: {total_failed}")
    print()


if __name__ == "__main__":
    run_simulation()