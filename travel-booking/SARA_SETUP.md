# SARA Dashboard - Setup Guide

## Overview

SARA Dashboard with travel-agency inspired clean UI design, featuring tab-based navigation for different operational views.

## Features

✅ **Tab-Based Navigation:**
- Lounge Traffic - Customer forecast with line chart
- Staffing - Staff breakdown and allocation
- Food Optimization - Waste reduction tracking
- Risk Monitoring - Capacity and risk assessment
- Customer Experience - Service quality and assistance

✅ **Real-time Data:**
- Connects to FastAPI backend at http://localhost:8000
- Fetches predictions on page load
- Loading and error states

✅ **Clean Design:**
- White theme with soft blue accents
- Professional business layout
- Responsive design
- No heavy animations

## Quick Start

### 1. Start Backend

```bash
# From SARA root directory
venv\Scripts\activate
python main.py
```

Backend runs at http://localhost:8000

### 2. Start Frontend

```bash
# Navigate to frontend
cd travel-booking/frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

Frontend runs at http://localhost:3000

## Project Structure

```
travel-booking/frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx              # Navigation tabs
│   │   ├── LoungeTraffic.jsx       # Traffic forecast tab
│   │   ├── Staffing.jsx            # Staffing tab
│   │   ├── FoodOptimization.jsx    # Food tab
│   │   ├── RiskMonitoring.jsx      # Risk tab
│   │   ├── CustomerExperience.jsx  # Customer tab
│   │   ├── LoadingSpinner.jsx      # Loading state
│   │   ├── ErrorMessage.jsx        # Error handling
│   │   └── TabContent.css          # Shared tab styles
│   ├── services/
│   │   └── api.js                  # Backend API client
│   ├── App.jsx                     # Main app with tab logic
│   └── main.jsx                    # React entry point
├── package.json
└── vite.config.js
```

## Tab Components

### Lounge Traffic
- Line chart showing 6-hour forecast
- Current occupancy metric
- Peak occupancy metric
- Forecast period indicator

### Staffing
- Service/Cleaning/Reception breakdown
- Peak hour alert banner
- Hourly staffing table
- Total staff calculation

### Food Optimization
- Total food required metric
- Average per hour
- Waste reduction percentage
- Hourly requirements table
- Smart ordering explanation

### Risk Monitoring
- Current risk level badge
- Lounge capacity info
- Capacity utilization percentage
- 6-hour risk summary
- Hourly risk assessment table

### Customer Experience
- Call staff assistance button
- Service quality metrics
- Operational efficiency display
- Toast notification on button click

## API Integration

Backend endpoint: `GET http://localhost:8000/predict`

Expected response:
```json
{
  "forecast": [64.14, 64.12, ...],
  "confidence_margin": [6.41, 6.41, ...],
  "risk_level": ["low", "low", ...],
  "staff_required": {
    "service": [3, 3, ...],
    "cleaning": [2, 2, ...],
    "reception": [2, 2, ...]
  },
  "food_required": [51.31, 51.30, ...],
  "estimated_cost": 1234.56
}
```

## Customization

### Colors
Edit CSS files to change accent colors:
- Primary: `#3b82f6` (blue)
- Success: `#10b981` (green)
- Warning: `#f59e0b` (orange)
- Danger: `#ef4444` (red)

### Tab Order
Edit `Header.jsx` to reorder tabs:
```javascript
const tabs = [
  { id: 'lounge', label: 'Lounge Traffic' },
  // Add or reorder tabs here
];
```

## Troubleshooting

**Backend not connecting:**
- Verify backend is running at http://localhost:8000
- Check CORS is enabled in main.py
- Test endpoint: `curl http://localhost:8000/predict`

**npm install fails:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Port 3000 in use:**
- Vite will automatically use next available port
- Or change port in `vite.config.js`

## Production Build

```bash
npm run build
```

Output in `dist/` folder ready for deployment.
