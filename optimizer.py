import math

def optimize_resources(forecast):
    """Calculate resource requirements based on predicted occupancy."""
    
    # Staff required: 1 staff per 25 people (rounded up)
    staff_required = [math.ceil(occupancy / 25) for occupancy in forecast]
    
    # Food required: 80% of predicted occupancy
    food_required = [occupancy * 0.8 for occupancy in forecast]
    
    # Detect peak hour (index with highest predicted occupancy)
    peak_hour_index = forecast.index(max(forecast))
    
    return {
        'staff_required': staff_required,
        'food_required': food_required,
        'peak_hour_index': peak_hour_index
    }
