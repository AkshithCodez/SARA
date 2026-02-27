# SARA - Smart Airport Resource Allocator

A minimal Python backend for predicting airport lounge occupancy and optimizing resource allocation.

## Features

- Synthetic hourly occupancy data generation with realistic patterns
- Machine learning prediction using RandomForestRegressor
- 6-hour iterative forecasting with lag features
- Resource optimization (staff and food requirements)
- FastAPI REST endpoint

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

3. Generate data and train model:
```bash
python setup.py
```

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
streamlit run app.py
```

The dashboard will open in your browser at `http://localhost:8501`

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

- `data_generator.py` - Synthetic data generation
- `features.py` - Feature engineering
- `model.py` - Model training and forecasting
- `optimizer.py` - Resource optimization logic
- `main.py` - FastAPI application
- `setup.py` - One-command setup script
