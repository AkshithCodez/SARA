# SARA - Smart Airport Resource Allocator

A minimal Python backend for predicting airport lounge occupancy and optimizing resource allocation.

## Features

- Real airport passenger data processing and conversion to hourly lounge occupancy
- Machine learning prediction using RandomForestRegressor
- 6-hour iterative forecasting with lag features
- Resource optimization (staff breakdown and food requirements)
- Professional React dashboard with real-time data visualization
- FastAPI REST endpoint with CORS support

## Setup

1. Create and activate virtual environment:
```bash
python -m venv venv
venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Load real data and train model:
```bash
python setup.py
```

This will:
- Load `Air_Traffic_Passenger_Statistics.csv`
- Convert monthly passenger data to hourly lounge occupancy
- Train the prediction model
- Save as `model.pkl`

## Run the Backend API

```bash
python main.py
```

Or with uvicorn:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## Run the Frontend Dashboard

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The dashboard will open in your browser at `http://localhost:3000`

See [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) for detailed setup guide.

## API Endpoint

### GET /predict

Returns 6-hour forecast with resource optimization.

**Response:**
```json
{
  "forecast": [65.23, 78.45, 82.11, 75.33, 68.90, 55.67],
  "peak_hour_index": 2,
  "staff_required": [3, 4, 4, 4, 3, 3],
  "food_required": [52.18, 62.76, 65.69, 60.26, 55.12, 44.54]
}
```

## Project Structure

- `data_loader.py` - Real dataset loading and preprocessing
- `data_generator.py` - Synthetic data generation (fallback)
- `features.py` - Feature engineering
- `model.py` - Model training and forecasting
- `optimizer.py` - Resource optimization logic
- `main.py` - FastAPI application
- `frontend/` - React dashboard application
- `setup.py` - One-command setup script

## Data Processing

The system loads `Air_Traffic_Passenger_Statistics.csv` and:
1. Aggregates monthly passenger counts
2. Converts to hourly time series using interpolation
3. Applies realistic hourly traffic patterns (morning/evening peaks)
4. Calculates lounge occupancy (5% of total passengers)
5. Generates features for ML prediction
