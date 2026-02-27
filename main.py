from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from model import load_model, forecast_next_hours
from optimizer import optimize_resources
import os

app = FastAPI(title="SARA - Smart Airport Resource Allocator")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Vite and CRA default ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model at startup
MODEL_PATH = 'model.pkl'
DATA_PATH = 'data.csv'

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model file not found: {MODEL_PATH}. Run setup.py first.")

model = load_model(MODEL_PATH)

@app.get("/")
def root():
    """Health check endpoint."""
    return {"status": "SARA backend is running", "version": "2.0"}

@app.get("/predict")
def predict():
    """
    Predict lounge occupancy for the next 6 hours and optimize resources.
    
    Returns:
        - forecast: List of predicted occupancy values for next 6 hours
        - confidence_margin: Confidence interval for each prediction
        - risk_level: Risk assessment for each hour (low/medium/high)
        - staff_required: Breakdown of staff by type (service, cleaning, reception)
        - food_required: List of food units needed for each hour
        - estimated_cost: Total estimated operational cost
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
            "confidence_margin": [round(val, 2) for val in optimization['confidence_margin']],
            "risk_level": optimization['risk_level'],
            "staff_required": {
                "service": optimization['staff_required']['service'],
                "cleaning": optimization['staff_required']['cleaning'],
                "reception": optimization['staff_required']['reception']
            },
            "food_required": [round(val, 2) for val in optimization['food_required']],
            "estimated_cost": optimization['estimated_cost']
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
