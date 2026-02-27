import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_synthetic_data(days=30):
    """Generate synthetic hourly lounge occupancy data with realistic patterns."""
    
    # Create hourly timestamps for the past 30 days
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    timestamps = pd.date_range(start=start_date, end=end_date, freq='h+')
    
    occupancy = []
    
    for ts in timestamps:
        hour = ts.hour
        day_of_week = ts.dayofweek
        
        # Base occupancy
        base = 50
        
        # Morning peak (6-9 AM)
        if 6 <= hour <= 9:
            base += 40 * np.sin((hour - 6) * np.pi / 3)
        
        # Evening peak (5-8 PM)
        if 17 <= hour <= 20:
            base += 50 * np.sin((hour - 17) * np.pi / 3)
        
        # Weekend effect (lower occupancy)
        if day_of_week >= 5:
            base *= 0.7
        
        # Add random noise
        noise = np.random.normal(0, 5)
        
        occupancy.append(max(0, base + noise))
    
    # Create DataFrame
    df = pd.DataFrame({
        'timestamp': timestamps,
        'occupancy': occupancy
    })
    
    return df

if __name__ == '__main__':
    df = generate_synthetic_data()
    df.to_csv('data.csv', index=False)
    print(f"Generated {len(df)} records and saved to data.csv")
