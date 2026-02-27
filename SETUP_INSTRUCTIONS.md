# SARA Setup Instructions

Complete setup guide for the Smart Airport Resource Allocator (SARA) system.

## System Architecture

- **Backend**: Python FastAPI (Port 8000)
- **Frontend**: React with Vite (Port 3000)
- **ML Model**: RandomForestRegressor
- **Data**: Real airport passenger statistics

## Prerequisites

### Backend
- Python 3.8+
- Virtual environment (venv)

### Frontend
- Node.js 16+
- npm or yarn

## Backend Setup

### 1. Activate Virtual Environment

```bash
venv\Scripts\activate
```

### 2. Install Dependencies (if not already installed)

```bash
pip install -r requirements.txt
```

### 3. Train the Model (if not already done)

```bash
python setup.py
```

This will:
- Load real airport passenger data
- Convert to hourly lounge occupancy
- Train the ML model
- Save as `model.pkl`

### 4. Start the Backend API

```bash
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

The backend is now running at http://localhost:8000

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- React 18
- Axios (API client)
- Recharts (charts)
- Vite (build tool)

### 3. Start Development Server

```bash
npm run dev
```

The frontend will be available at http://localhost:3000

Your browser should automatically open the SARA Dashboard.

## Verification

### Test Backend API

Open http://localhost:8000/docs in your browser to see the API documentation.

Or test the predict endpoint:
```bash
curl http://localhost:8000/predict
```

### Test Frontend

Open http://localhost:3000 in your browser.

You should see:
- Header with "SARA Dashboard"
- Lounge Occupancy Forecast chart
- Staffing Optimization breakdown
- Food Waste Reduction section
- Customer Experience button

## Running Both Services

You need TWO terminal windows:

**Terminal 1 (Backend):**
```bash
venv\Scripts\activate
python main.py
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

## Production Build

To build the frontend for production:

```bash
cd frontend
npm run build
```

The production files will be in `frontend/dist/`

## Troubleshooting

### Backend Issues

**Error: "Model file not found"**
- Run `python setup.py` to train the model

**Error: "Data file not found"**
- Ensure `Air_Traffic_Passenger_Statistics.csv` exists
- Run `python setup.py`

**Port 8000 already in use**
- Stop other services using port 8000
- Or change the port in `main.py`

### Frontend Issues

**Error: "Cannot connect to backend"**
- Make sure backend is running at http://localhost:8000
- Check CORS settings in `main.py`

**Port 3000 already in use**
- Vite will automatically use the next available port
- Or change the port in `vite.config.js`

**npm install fails**
- Try deleting `node_modules` and `package-lock.json`
- Run `npm install` again

## API Response Format

The `/predict` endpoint returns:

```json
{
  "forecast": [64.14, 64.12, 64.13, 64.13, 64.13, 186.8],
  "confidence_margin": [6.41, 6.41, 6.41, 6.41, 6.41, 18.68],
  "risk_level": ["low", "low", "low", "low", "low", "medium"],
  "staff_required": {
    "service": [3, 3, 3, 3, 3, 7],
    "cleaning": [2, 2, 2, 2, 2, 4],
    "reception": [2, 2, 2, 2, 2, 2]
  },
  "food_required": [51.31, 51.30, 51.30, 51.30, 51.30, 149.44],
  "estimated_cost": 1234.56
}
```

## Project Structure

```
SARA/
├── backend/
│   ├── data_loader.py          # Data preprocessing
│   ├── features.py             # Feature engineering
│   ├── model.py                # ML model
│   ├── optimizer.py            # Resource optimization
│   ├── main.py                 # FastAPI app
│   ├── setup.py                # Setup script
│   └── requirements.txt        # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Dashboard page
│   │   ├── services/           # API service
│   │   └── ...
│   ├── package.json            # Node dependencies
│   └── vite.config.js          # Vite config
└── Air_Traffic_Passenger_Statistics.csv
```

## Next Steps

1. Customize the UI colors in CSS files
2. Add more features to the dashboard
3. Deploy to production server
4. Add authentication if needed
5. Set up monitoring and logging

## Support

For issues or questions, check:
- Backend logs in the terminal
- Browser console for frontend errors
- Network tab in browser DevTools for API calls
