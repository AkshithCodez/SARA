from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
import pandas as pd
import os

# ML imports (existing)
from model import load_model, forecast_next_hours
from optimizer import optimize_resources

# NEW: Routers
from routers.lounge import router as lounge_router
from routers.occupancy import router as occupancy_router
from routers.auth import router as auth_router
from routers.telemetry import router as telemetry_router
from routers.predict import router as predict_router
from core.auth import oauth2_scheme

app = FastAPI(title="SARA - Smart Airport Resource Allocator")

# OAuth2 scheme - reuse from core.auth for Swagger UI
# The oauth2_scheme in get_current_user will trigger OAuth2 in Swagger


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
app.include_router(auth_router)
app.include_router(lounge_router)
app.include_router(occupancy_router)
app.include_router(telemetry_router)
app.include_router(predict_router)

# -------------------------------
# ML Setup (existing)
# -------------------------------
MODEL_PATH = 'model.pkl'

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model file not found: {MODEL_PATH}. Run setup.py first.")

model = load_model(MODEL_PATH)

# -------------------------------
# Health Check
# -------------------------------
@app.get("/")
def root():
    return {"status": "SARA backend is running", "version": "3.0"}