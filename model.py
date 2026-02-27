import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestRegressor
from features import create_features, prepare_training_data

# Realistic bounds for lounge occupancy
MIN_OCCUPANCY = 0
MAX_OCCUPANCY = 300  # Maximum realistic lounge capacity

def train_model(csv_path='data.csv'):
    """Train RandomForestRegressor on historical occupancy data."""
    
    # Load data
    df = pd.read_csv(csv_path)
    
    # Create features
    df = create_features(df)
    
    # Prepare training data
    X, y = prepare_training_data(df)
    
    # Train model
    model = RandomForestRegressor(n_estimators=100, random_state=42, max_depth=10)
    model.fit(X, y)
    
    print(f"Model trained on {len(X)} samples")
    print(f"Feature importance: {dict(zip(X.columns, model.feature_importances_))}")
    
    return model

def save_model(model, path='model.pkl'):
    """Save trained model to disk."""
    joblib.dump(model, path)
    print(f"Model saved to {path}")

def load_model(path='model.pkl'):
    """Load trained model from disk."""
    return joblib.load(path)

def forecast_next_hours(model, last_data, hours=6):
    """
    Forecast occupancy for the next N hours using iterative prediction.
    Applies realistic bounds to ensure operational validity.
    """
    
    predictions = []
    
    # Get the last known values for lag features
    lag_1 = last_data['occupancy'].iloc[-1]
    lag_2 = last_data['occupancy'].iloc[-2]
    recent_values = list(last_data['occupancy'].tail(3))
    
    # Get the last timestamp
    last_timestamp = pd.to_datetime(last_data['timestamp'].iloc[-1])
    
    for i in range(hours):
        # Calculate next hour timestamp
        next_timestamp = last_timestamp + pd.Timedelta(hours=i+1)
        
        # Extract time features
        hour = next_timestamp.hour
        day_of_week = next_timestamp.dayofweek
        is_weekend = 1 if day_of_week >= 5 else 0
        
        # Calculate rolling mean from recent values
        rolling_mean_3 = sum(recent_values[-3:]) / len(recent_values[-3:])
        
        # Create feature vector
        features = pd.DataFrame({
            'hour': [hour],
            'day_of_week': [day_of_week],
            'is_weekend': [is_weekend],
            'lag_1': [lag_1],
            'lag_2': [lag_2],
            'rolling_mean_3': [rolling_mean_3]
        })
        
        # Predict
        pred = model.predict(features)[0]
        
        # Apply realistic bounds (clip to 0-300 range)
        pred_clipped = np.clip(pred, MIN_OCCUPANCY, MAX_OCCUPANCY)
        predictions.append(float(pred_clipped))
        
        # Update lag values for next iteration (use clipped value)
        lag_2 = lag_1
        lag_1 = pred_clipped
        recent_values.append(pred_clipped)
    
    # Safety check: warn if predictions are unrealistic
    if max(predictions) > 500:
        print(f"⚠️  WARNING: Forecast contains unrealistic values (max: {max(predictions):.2f})")
    
    return predictions

if __name__ == '__main__':
    # Train and save model
    model = train_model()
    save_model(model)
