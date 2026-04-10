from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os

# ML imports (existing)
from model import load_model, forecast_next_hours
from optimizer import optimize_resources

# NEW: Routers
from routers.lounge import router as lounge_router
from routers.occupancy import router as occupancy_router

app = FastAPI(title="SARA - Smart Airport Resource Allocator")

# -------------------------------
# CORS (keep as is)
# -------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# Include Routers (NEW)
# -------------------------------
app.include_router(lounge_router)
app.include_router(occupancy_router)

# -------------------------------
# ML Setup (existing)
# -------------------------------
MODEL_PATH = 'model.pkl'
DATA_PATH = 'data.csv'

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model file not found: {MODEL_PATH}. Run setup.py first.")

model = load_model(MODEL_PATH)

# -------------------------------
# Health Check
# -------------------------------
@app.get("/")
def root():
    return {"status": "SARA backend is running", "version": "3.0"}

# -------------------------------
# EXISTING ML ENDPOINT (keep)
# -------------------------------
@app.get("/predict")
def predict():
    try:
        if not os.path.exists(DATA_PATH):
            raise FileNotFoundError(f"Data file not found: {DATA_PATH}")
        
        df = pd.read_csv(DATA_PATH)

        forecast = forecast_next_hours(model, df, hours=6)
        optimization = optimize_resources(forecast)

        return {
            "forecast": [round(val, 2) for val in forecast],
            "confidence_margin": [round(val, 2) for val in optimization['confidence_margin']],
            "risk_level": optimization['risk_level'],
            "staff_required": optimization['staff_required'],
            "food_required": [round(val, 2) for val in optimization['food_required']],
            "estimated_cost": optimization['estimated_cost']
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))