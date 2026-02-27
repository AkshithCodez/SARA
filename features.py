import pandas as pd

def create_features(df):
    """Create time-based and lag features for occupancy prediction."""
    
    df = df.copy()
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    
    # Time-based features
    df['hour'] = df['timestamp'].dt.hour
    df['day_of_week'] = df['timestamp'].dt.dayofweek
    df['is_weekend'] = (df['day_of_week'] >= 5).astype(int)
    
    # Lag features
    df['lag_1'] = df['occupancy'].shift(1)
    df['lag_2'] = df['occupancy'].shift(2)
    
    # Rolling mean feature
    df['rolling_mean_3'] = df['occupancy'].shift(1).rolling(window=3, min_periods=1).mean()
    
    # Drop rows with NaN values from lag features
    df = df.dropna()
    
    return df

def prepare_training_data(df):
    """Prepare features (X) and target (y) for model training."""
    
    feature_cols = ['hour', 'day_of_week', 'is_weekend', 'lag_1', 'lag_2', 'rolling_mean_3']
    X = df[feature_cols]
    y = df['occupancy']
    
    return X, y
