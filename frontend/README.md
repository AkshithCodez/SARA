# SARA Frontend - React Dashboard

Professional React frontend for the Smart Airport Resource Allocator (SARA) system.

## Features

- Real-time lounge occupancy forecasting with interactive charts
- Staff optimization breakdown (service, cleaning, reception)
- Food waste reduction tracking
- Customer assistance integration
- Clean, professional corporate design
- Responsive layout

## Tech Stack

- React 18
- Vite (build tool)
- Axios (API calls)
- Recharts (data visualization)
- CSS3 (styling)

## Prerequisites

- Node.js 16+ and npm
- Backend API running at http://localhost:8000

## Installation

```bash
cd frontend
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at http://localhost:3000

## Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── OccupancySection.jsx
│   │   ├── StaffingSection.jsx
│   │   ├── FoodSection.jsx
│   │   ├── CustomerSection.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── ErrorMessage.jsx
│   │   └── *.css
│   ├── pages/
│   │   └── Dashboard.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

## API Integration

The frontend connects to the backend at `http://localhost:8000/predict`

Expected response format:
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

## Troubleshooting

If you see a connection error:
1. Make sure the backend is running: `python main.py`
2. Check that the backend is accessible at http://localhost:8000
3. Verify CORS is enabled in the backend
