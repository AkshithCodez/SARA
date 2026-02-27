from fastapi import FastAPI, HTTPException
import pandas as pd
from model import load_model, forecast_next_hours
from optimizer import optimize_resources
import os

app = FastAPI(title="SARA - Smart Airport Resource Allocator")

# Load model at startup
MODEL_PATH = 'model.pkl'
DATA_PATH = 'data.csv'

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model file not found: {MODEL_PATH}. Run model.py first.")

model = load_model(MODEL_PATH)

@app.get("/")
def root():
    """Health check endpoint."""
    return {"status": "SARA backend is running", "version": "1.0"}

@app.get("/predict")
def predict():
    """
    Predict lounge occupancy for the next 6 hours and optimize resources.
    
    Returns:
        - forecast: List of predicted occupancy values for next 6 hours
        - peak_hour_index: Index (0-5) of the hour with highest predicted occupancy
        - staff_required: List of staff count needed for each hour
        - food_required: List of food units needed for each hour
    """
    
    try:
        # Load the most recent data
        if not os.path.exists(DATA_PATH):
            raise FileNotFoundError(f"Data file not found: {DATA_PATH}")
        
        df = pd.read_csv(DATA_PATH)
        
        # Forecast next 6 hours
        forecast = forecast_next_hours(model, df, hours=6)
        
        # Optimize resources
        optimization = optimize_resources(forecast)
        
        return {
            "forecast": [round(val, 2) for val in forecast],
            "peak_hour_index": optimization['peak_hour_index'],
            "staff_required": optimization['staff_required'],
            "food_required": [round(val, 2) for val in optimization['food_required']]
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
