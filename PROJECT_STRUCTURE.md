# SARA Project Structure

Complete file structure for the Smart Airport Resource Allocator system.

```
SARA/
│
├── Backend (Python FastAPI)
│   ├── data_loader.py              # Load and preprocess real airport data
│   ├── data_generator.py           # Synthetic data generator (fallback)
│   ├── features.py                 # Feature engineering for ML
│   ├── model.py                    # RandomForest model training/prediction
│   ├── optimizer.py                # Resource optimization logic
│   ├── main.py                     # FastAPI application with CORS
│   ├── setup.py                    # One-command setup script
│   ├── requirements.txt            # Python dependencies
│   ├── model.pkl                   # Trained ML model (generated)
│   └── data.csv                    # Processed data (generated)
│
├── Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx          # Dashboard header
│   │   │   ├── Header.css
│   │   │   ├── OccupancySection.jsx    # Forecast chart section
│   │   │   ├── OccupancySection.css
│   │   │   ├── StaffingSection.jsx     # Staff optimization section
│   │   │   ├── StaffingSection.css
│   │   │   ├── FoodSection.jsx         # Food waste section
│   │   │   ├── FoodSection.css
│   │   │   ├── CustomerSection.jsx     # Customer assistance section
│   │   │   ├── CustomerSection.css
│   │   │   ├── LoadingSpinner.jsx      # Loading state component
│   │   │   ├── LoadingSpinner.css
│   │   │   ├── ErrorMessage.jsx        # Error handling component
│   │   │   └── ErrorMessage.css
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       # Main dashboard page
│   │   │   └── Dashboard.css
│   │   ├── services/
│   │   │   └── api.js              # Axios API client
│   │   ├── assets/
│   │   │   └── .gitkeep
│   │   ├── App.jsx                 # Root component
│   │   ├── App.css
│   │   ├── main.jsx                # React entry point
│   │   └── index.css               # Global styles
│   ├── index.html                  # HTML template
│   ├── package.json                # Node dependencies
│   ├── vite.config.js              # Vite configuration
│   ├── .gitignore
│   └── README.md                   # Frontend documentation
│
├── Data
│   └── Air_Traffic_Passenger_Statistics.csv    # Real airport data
│
├── Documentation
│   ├── README.md                   # Main project README
│   ├── QUICKSTART.md               # 3-minute setup guide
│   ├── SETUP_INSTRUCTIONS.md       # Detailed setup guide
│   ├── UPGRADE_SUMMARY.md          # Frontend upgrade details
│   ├── REFACTORING_SUMMARY.md      # Data refactoring details
│   └── PROJECT_STRUCTURE.md        # This file
│
└── Environment
    └── venv/                       # Python virtual environment
```

## File Descriptions

### Backend Core Files

**data_loader.py** (150 lines)
- Loads `Air_Traffic_Passenger_Statistics.csv`
- Converts monthly passenger data to hourly
- Applies realistic traffic patterns
- Calculates lounge occupancy with proper scaling
- Outputs: timestamp, occupancy

**features.py** (40 lines)
- Creates ML features: hour, day_of_week, is_weekend
- Generates lag features: lag_1, lag_2
- Calculates rolling_mean_3
- Prepares training data (X, y)

**model.py** (100 lines)
- Trains RandomForestRegressor
- Saves/loads model with joblib
- Iterative 6-hour forecasting
- Applies realistic bounds (0-300)
- Updates lag features dynamically

**optimizer.py** (60 lines)
- Calculates staff breakdown (service, cleaning, reception)
- Computes food requirements (80% of occupancy)
- Assesses risk levels (low/medium/high)
- Estimates operational costs
- Returns comprehensive optimization data

**main.py** (70 lines)
- FastAPI application
- CORS middleware for React
- GET / - Health check
- GET /predict - Main prediction endpoint
- Error handling with HTTPException

**setup.py** (40 lines)
- One-command setup script
- Loads and preprocesses data
- Trains ML model
- Saves model.pkl and data.csv
- Fallback to synthetic data if needed

### Frontend Core Files

**Dashboard.jsx** (60 lines)
- Main dashboard page
- Fetches data from API
- Manages loading/error states
- Renders all sections

**OccupancySection.jsx** (70 lines)
- Line chart with Recharts
- Current/peak occupancy metrics
- Risk level badge with colors
- Responsive design

**StaffingSection.jsx** (80 lines)
- Peak hour alert banner
- Staff breakdown cards (3 types)
- Detailed staffing table
- Highlights peak row

**FoodSection.jsx** (50 lines)
- Total food metric
- Hourly requirements table
- Smart ordering explanation

**CustomerSection.jsx** (40 lines)
- Call staff button
- Toast notification
- Auto-dismiss after 3s

**api.js** (50 lines)
- Axios instance with config
- fetchPrediction() function
- Error handling
- Timeout management

### Configuration Files

**requirements.txt**
```
fastapi
uvicorn
pandas
numpy
scikit-learn
joblib
```

**package.json**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.0",
    "recharts": "^2.10.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0"
  }
}
```

**vite.config.js**
```javascript
export default defineConfig({
  plugins: [react()],
  server: { port: 3000 }
})
```

## Component Hierarchy

```
App
└── Dashboard
    ├── Header
    ├── OccupancySection
    │   └── LineChart (Recharts)
    ├── StaffingSection
    │   ├── Staff Cards (3)
    │   └── Data Table
    ├── FoodSection
    │   ├── Food Metric
    │   └── Data Table
    └── CustomerSection
        ├── Call Button
        └── Notification (conditional)
```

## Data Flow

```
1. User opens http://localhost:3000
2. Dashboard.jsx mounts
3. useEffect calls fetchPrediction()
4. api.js sends GET to http://localhost:8000/predict
5. main.py receives request
6. model.py generates forecast
7. optimizer.py calculates resources
8. Response sent back to frontend
9. Dashboard updates state
10. All sections re-render with new data
```

## API Flow

```
Frontend (React)
    ↓ HTTP GET
Backend (FastAPI)
    ↓ Load data.csv
Model (RandomForest)
    ↓ Predict 6 hours
Optimizer
    ↓ Calculate resources
Response (JSON)
    ↓ Return to frontend
Dashboard (Update UI)
```

## Build Process

### Backend
```bash
python setup.py          # Train model
python main.py           # Start server
```

### Frontend
```bash
npm install              # Install dependencies
npm run dev              # Development server
npm run build            # Production build
```

## Port Configuration

- Backend API: `http://localhost:8000`
- Frontend Dev: `http://localhost:3000`
- Frontend Prod: Static files in `dist/`

## File Sizes (Approximate)

- Backend Python files: ~500 lines total
- Frontend JSX files: ~400 lines total
- Frontend CSS files: ~600 lines total
- Total project: ~1500 lines of code

## Dependencies Count

- Backend: 6 Python packages
- Frontend: 4 production + 2 dev packages

## Generated Files

These files are created by the system:
- `model.pkl` - Trained ML model (~1 MB)
- `data.csv` - Processed data (~50 KB)
- `frontend/node_modules/` - Node packages (~200 MB)
- `frontend/dist/` - Production build (~500 KB)

## Git Ignored

- `venv/` - Python virtual environment
- `__pycache__/` - Python cache
- `frontend/node_modules/` - Node packages
- `frontend/dist/` - Build output
- `*.pyc` - Python compiled files
- `.DS_Store` - macOS files
