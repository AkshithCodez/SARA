import pandas as pd
import numpy as np
from datetime import datetime

# Configuration
DATASET_PATH = 'Air_Traffic_Passenger_Statistics.csv'

# Realistic lounge occupancy assumptions
LOUNGE_USAGE_RATE = 0.02  # Only 2% of airport passengers use lounges
NUM_LOUNGES = 8  # Airport has 8 lounges total
HOURS_PER_DAY = 24  # For daily to hourly conversion

# Realistic bounds for single lounge occupancy
MIN_OCCUPANCY = 50  # Minimum realistic lounge occupancy
MAX_OCCUPANCY = 250  # Maximum realistic lounge occupancy (scaled target)

def load_and_preprocess_dataset(csv_path=DATASET_PATH):
    """
    Load real airport passenger dataset and convert to hourly lounge occupancy format.
    
    Returns:
        DataFrame with columns: timestamp, occupancy
    """
    
    try:
        # Load dataset
        print(f"Loading dataset from {csv_path}...")
        df = pd.read_csv(csv_path)
        print(f"Loaded {len(df)} records")
        
        # Clean column names
        df.columns = df.columns.str.strip()
        
        # Check required columns
        required_cols = ['Year', 'Month', 'Passenger Count']
        missing_cols = [col for col in required_cols if col not in df.columns]
        if missing_cols:
            raise ValueError(f"Missing required columns: {missing_cols}")
        
        # Convert Activity Period to datetime if available
        if 'Activity Period' in df.columns:
            df['timestamp'] = pd.to_datetime(df['Activity Period'].astype(str), format='%Y%m', errors='coerce')
        else:
            # Create datetime from Year and Month
            df['timestamp'] = pd.to_datetime(df['Year'].astype(str) + '-' + df['Month'].astype(str), 
                                            format='%Y-%B', errors='coerce')
        
        # Drop rows with invalid timestamps
        df = df.dropna(subset=['timestamp'])
        
        # Use Adjusted Passenger Count if available, otherwise Passenger Count
        if 'Adjusted Passenger Count' in df.columns:
            passenger_col = 'Adjusted Passenger Count'
        else:
            passenger_col = 'Passenger Count'
        
        # Aggregate by timestamp (sum passengers per month)
        df_agg = df.groupby('timestamp')[passenger_col].sum().reset_index()
        df_agg.columns = ['timestamp', 'total_passengers']
        
        # Sort by timestamp
        df_agg = df_agg.sort_values('timestamp').reset_index(drop=True)
        
        # Handle missing values
        df_agg['total_passengers'] = df_agg['total_passengers'].fillna(0)
        
        print(f"Aggregated to {len(df_agg)} time periods")
        
        # Convert to hourly time series
        df_hourly = convert_to_hourly(df_agg)
        
        # Calculate realistic single lounge occupancy
        df_hourly['occupancy'] = calculate_lounge_occupancy(df_hourly['total_passengers'])
        
        # Keep only required columns
        df_final = df_hourly[['timestamp', 'occupancy']].copy()
        
        print(f"Final dataset: {len(df_final)} hourly records")
        print(f"Date range: {df_final['timestamp'].min()} to {df_final['timestamp'].max()}")
        print(f"Occupancy range: {df_final['occupancy'].min():.2f} to {df_final['occupancy'].max():.2f}")
        
        # Safety check: warn if occupancy exceeds realistic bounds
        if df_final['occupancy'].max() > 500:
            print(f"⚠️  WARNING: Maximum occupancy ({df_final['occupancy'].max():.2f}) exceeds realistic bounds!")
        
        return df_final
    
    except FileNotFoundError:
        raise FileNotFoundError(f"Dataset not found: {csv_path}")
    except Exception as e:
        raise Exception(f"Error loading dataset: {str(e)}")

def convert_to_hourly(df_agg):
    """
    Convert monthly/daily data to hourly using resampling and interpolation.
    
    Args:
        df_agg: DataFrame with timestamp and total_passengers columns
    
    Returns:
        DataFrame with hourly timestamps and interpolated passenger counts
    """
    
    # Set timestamp as index
    df_agg = df_agg.set_index('timestamp')
    
    # Determine frequency (monthly or daily)
    time_diff = df_agg.index[1] - df_agg.index[0]
    
    if time_diff.days > 25:  # Monthly data
        print("Detected monthly data, converting to hourly...")
        
        # First resample to daily
        df_daily = df_agg.resample('D').interpolate(method='linear')
        
        # Then resample to hourly with distribution pattern
        df_hourly = df_daily.resample('h').interpolate(method='linear')
        
        # Apply hourly distribution pattern (simulate airport traffic patterns)
        df_hourly = apply_hourly_pattern(df_hourly)
        
    elif time_diff.days >= 1:  # Daily data
        print("Detected daily data, converting to hourly...")
        df_hourly = df_agg.resample('h').interpolate(method='linear')
        df_hourly = apply_hourly_pattern(df_hourly)
    
    else:  # Already hourly or finer
        print("Data is already at hourly or finer granularity")
        df_hourly = df_agg.resample('h').mean()
    
    # Reset index
    df_hourly = df_hourly.reset_index()
    
    return df_hourly

def calculate_lounge_occupancy(passenger_counts):
    """
    Convert airport passenger counts to realistic single lounge occupancy.
    
    Assumptions:
    - Only 2% of airport passengers use lounges
    - Airport has 8 lounges total
    - Distribute passengers across lounges
    - Scale to realistic operational range (50-250 customers)
    
    Args:
        passenger_counts: Series of total airport passenger counts
    
    Returns:
        Series of realistic single lounge occupancy values
    """
    
    # Step 1: Calculate lounge users (2% of total passengers)
    lounge_users = passenger_counts * LOUNGE_USAGE_RATE
    
    # Step 2: Distribute across 8 lounges (single lounge occupancy)
    single_lounge = lounge_users / NUM_LOUNGES
    
    # Step 3: Normalize to realistic bounds using min-max scaling
    # This ensures values fall within operational range
    current_min = single_lounge.min()
    current_max = single_lounge.max()
    
    if current_max > current_min:
        # Normalize to 0-1 range
        normalized = (single_lounge - current_min) / (current_max - current_min)
        
        # Scale to realistic range (MIN_OCCUPANCY to MAX_OCCUPANCY)
        occupancy = normalized * (MAX_OCCUPANCY - MIN_OCCUPANCY) + MIN_OCCUPANCY
    else:
        # If all values are the same, use middle of range
        occupancy = pd.Series([150] * len(single_lounge), index=single_lounge.index)
    
    return occupancy

def apply_hourly_pattern(df_hourly):
    """
    Apply realistic hourly traffic pattern to distributed data.
    Simulates morning and evening peaks typical of airport lounges.
    """
    
    df_hourly = df_hourly.copy()
    
    # Create hourly multiplier based on time of day
    hours = df_hourly.index.hour
    
    # Base multiplier (normalized to average 1.0 over 24 hours)
    multiplier = np.ones(len(df_hourly))
    
    # Morning peak (6-9 AM): 1.5x
    morning_mask = (hours >= 6) & (hours <= 9)
    multiplier[morning_mask] = 1.5
    
    # Evening peak (5-8 PM): 1.8x
    evening_mask = (hours >= 17) & (hours <= 20)
    multiplier[evening_mask] = 1.8
    
    # Late night (11 PM - 5 AM): 0.3x
    night_mask = (hours >= 23) | (hours <= 5)
    multiplier[night_mask] = 0.3
    
    # Midday (10 AM - 4 PM): 1.2x
    midday_mask = (hours >= 10) & (hours <= 16)
    multiplier[midday_mask] = 1.2
    
    # Apply multiplier
    df_hourly['total_passengers'] = df_hourly['total_passengers'] * multiplier
    
    return df_hourly

def get_recent_data(df, days=30):
    """
    Get the most recent N days of data for training.
    
    Args:
        df: DataFrame with timestamp and occupancy
        days: Number of recent days to extract
    
    Returns:
        DataFrame with recent data
    """
    
    df = df.copy()
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    
    # Get the last date
    last_date = df['timestamp'].max()
    
    # Calculate cutoff date
    cutoff_date = last_date - pd.Timedelta(days=days)
    
    # Filter data
    df_recent = df[df['timestamp'] >= cutoff_date].copy()
    
    print(f"Extracted {len(df_recent)} records from last {days} days")
    
    return df_recent

if __name__ == '__main__':
    # Test the data loader
    df = load_and_preprocess_dataset()
    print("\nSample data:")
    print(df.head(10))
    print("\nData info:")
    print(df.info())
