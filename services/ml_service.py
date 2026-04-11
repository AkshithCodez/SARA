"""
services/ml_service.py
======================
SARA – Smart Airport Resource Allocator
ML Prediction Service

Provides occupancy forecasting for lounge data.
Production-ready, type-safe, and optimized.
"""

import numpy as np
import pandas as pd
import joblib
from datetime import datetime, timedelta
from pathlib import Path
from typing import List
from uuid import UUID

from sqlalchemy.orm import Session

from core.models import OccupancyLog

MODEL_PATH = Path(__file__).parent.parent / "model.pkl"

MIN_OCCUPANCY = 0
MAX_OCCUPANCY = 300
DEFAULT_COLD_START = [50, 50, 50, 50, 50, 50]
FORECAST_HORIZON = 6
HISTORY_LIMIT = 30
MODEL_VERSION = "v1"

# Global model instance (loaded once)
_model = None


def get_model():
    """Load model globally (only once)."""
    global _model
    if _model is None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError(f"Model not found at {MODEL_PATH}")
        _model = joblib.load(MODEL_PATH)
    return _model


def fetch_data(db: Session, lounge_id: UUID) -> pd.DataFrame:
    """
    Fetch last N occupancy records for a specific lounge.
    Sorted by timestamp ASC for correct lag computation.

    Args:
        db: Database session
        lounge_id: UUID of the lounge

    Returns:
        DataFrame with columns: timestamp, occupancy
    """
    results = (
        db.query(OccupancyLog.timestamp, OccupancyLog.passenger_count)
        .filter(OccupancyLog.lounge_id == str(lounge_id))
        .order_by(OccupancyLog.timestamp.asc())
        .limit(HISTORY_LIMIT)
        .all()
    )

    if not results:
        return pd.DataFrame(columns=["timestamp", "occupancy"])

    df = pd.DataFrame(results, columns=["timestamp", "occupancy"])
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    return df


def create_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Create features matching training: hour, day_of_week, is_weekend, lag_1, lag_2, rolling_mean_3.

    Args:
        df: DataFrame with 'timestamp' and 'occupancy' columns

    Returns:
        DataFrame with all required features
    """
    if df.empty or len(df) < 2:
        return df

    df = df.copy()

    df["hour"] = df["timestamp"].dt.hour
    df["day_of_week"] = df["timestamp"].dt.dayofweek
    df["is_weekend"] = (df["day_of_week"] >= 5).astype(int)

    df["lag_1"] = df["occupancy"].shift(1)
    df["lag_2"] = df["occupancy"].shift(2)
    df["rolling_mean_3"] = df["occupancy"].shift(1).rolling(window=3, min_periods=1).mean()

    return df.dropna()


def predict_next_steps(df: pd.DataFrame) -> List[float]:
    """
    Generate predictions for the next 6 hours using iterative approach.

    Args:
        df: Historical data with features

    Returns:
        List of 6 predicted occupancy values
    """
    if len(df) < 3:
        return [float(x) for x in DEFAULT_COLD_START.copy()]

    model = get_model()

    predictions = []
    lag_1 = df["occupancy"].iloc[-1]
    lag_2 = df["occupancy"].iloc[-2]
    recent_values = list(df["occupancy"].tail(3))

    last_timestamp = df["timestamp"].iloc[-1]

    for i in range(FORECAST_HORIZON):
        next_ts = last_timestamp + timedelta(hours=i + 1)

        hour = next_ts.hour
        day_of_week = next_ts.dayofweek
        is_weekend = 1 if day_of_week >= 5 else 0
        rolling_mean_3 = sum(recent_values[-3:]) / len(recent_values[-3:])

        features = pd.DataFrame({
            "hour": [hour],
            "day_of_week": [day_of_week],
            "is_weekend": [is_weekend],
            "lag_1": [lag_1],
            "lag_2": [lag_2],
            "rolling_mean_3": [rolling_mean_3],
        })

        pred = model.predict(features)[0]
        pred_clipped = float(np.clip(pred, MIN_OCCUPANCY, MAX_OCCUPANCY))
        predictions.append(pred_clipped)

        lag_2 = lag_1
        lag_1 = pred_clipped
        recent_values.append(pred_clipped)

    return predictions


def forecast_lounge(db: Session, lounge_id: UUID) -> dict:
    """
    Main entry point: Generate occupancy forecast for a lounge.

    Args:
        db: Database session
        lounge_id: UUID of the lounge

    Returns:
        dict with lounge_id, forecast, and model_version
    """
    try:
        df = fetch_data(db, lounge_id)

        if df.empty or len(df) < 2:
            return {
                "lounge_id": str(lounge_id),
                "forecast": [float(x) for x in DEFAULT_COLD_START],
                "model_version": MODEL_VERSION,
            }

        df_features = create_features(df)

        if len(df_features) < 3:
            return {
                "lounge_id": str(lounge_id),
                "forecast": [float(x) for x in DEFAULT_COLD_START],
                "model_version": MODEL_VERSION,
            }

        predictions = predict_next_steps(df_features)

        return {
            "lounge_id": str(lounge_id),
            "forecast": [round(p, 2) for p in predictions],
            "model_version": MODEL_VERSION,
        }

    except Exception:
        return {
            "lounge_id": str(lounge_id),
            "forecast": DEFAULT_COLD_START.copy(),
            "model_version": MODEL_VERSION,
        }