import math
import numpy as np

def optimize_resources(forecast):
    """Calculate resource requirements based on predicted occupancy."""
    
    # Staff required breakdown
    # Service staff: 1 per 30 customers
    service_staff = [math.ceil(occupancy / 30) for occupancy in forecast]
    
    # Cleaning staff: 1 per 50 customers
    cleaning_staff = [math.ceil(occupancy / 50) for occupancy in forecast]
    
    # Reception staff: minimum 2, +1 per 100 customers
    reception_staff = [max(2, math.ceil(occupancy / 100)) for occupancy in forecast]
    
    # Food required: 80% of predicted occupancy
    food_required = [occupancy * 0.8 for occupancy in forecast]
    
    # Detect peak hour (index with highest predicted occupancy)
    peak_hour_index = forecast.index(max(forecast))
    
    # Calculate confidence margin (±10% variation)
    confidence_margin = [occupancy * 0.1 for occupancy in forecast]
    
    # Calculate risk level based on occupancy
    risk_levels = []
    for occupancy in forecast:
        if occupancy < 100:
            risk_levels.append("low")
        elif occupancy < 200:
            risk_levels.append("medium")
        else:
            risk_levels.append("high")
    
    # Estimate cost (staff cost + food cost)
    # Assume: staff = $25/hour, food = $5/unit
    total_staff = [s + c + r for s, c, r in zip(service_staff, cleaning_staff, reception_staff)]
    estimated_cost = sum(staff * 25 for staff in total_staff) + sum(food * 5 for food in food_required)
    
    return {
        'staff_required': {
            'service': service_staff,
            'cleaning': cleaning_staff,
            'reception': reception_staff
        },
        'food_required': food_required,
        'peak_hour_index': peak_hour_index,
        'confidence_margin': confidence_margin,
        'risk_level': risk_levels,
        'estimated_cost': round(estimated_cost, 2)
    }
