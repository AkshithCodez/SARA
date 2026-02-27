# SARA Quick Start Guide

Get SARA up and running in 3 minutes.

## Step 1: Start Backend (Terminal 1)

```bash
# Activate virtual environment
venv\Scripts\activate

# Start the API
python main.py
```

Wait for: `Uvicorn running on http://0.0.0.0:8000`

## Step 2: Start Frontend (Terminal 2)

```bash
# Navigate to frontend
cd frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

Wait for: `Local: http://localhost:3000`

## Step 3: Open Dashboard

Your browser should automatically open to http://localhost:3000

If not, manually open: http://localhost:3000

## What You'll See

✅ **Header**: SARA Dashboard title with blue gradient

✅ **Section 1**: Lounge Occupancy Forecast
- Line chart showing next 6 hours
- Current occupancy metric
- Peak occupancy metric
- Risk level badge (color-coded)

✅ **Section 2**: Staffing Optimization
- Peak hour alert banner
- Staff breakdown cards (Service, Cleaning, Reception)
- Detailed staffing table for all 6 hours

✅ **Section 3**: Food Waste Reduction
- Total food required metric
- Hourly food requirements table
- Smart ordering explanation

✅ **Section 4**: Customer Experience
- "Call Staff for Assistance" button
- Success notification on click

## Troubleshooting

### Backend not starting?
```bash
# Make sure model is trained
python setup.py

# Then try again
python main.py
```

### Frontend shows connection error?
- Check backend is running at http://localhost:8000
- Visit http://localhost:8000/docs to verify

### npm install fails?
```bash
# Clear cache and retry
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## Testing the API

```bash
# Test health endpoint
curl http://localhost:8000/

# Test prediction endpoint
curl http://localhost:8000/predict
```

## Next Steps

- Customize colors in CSS files
- Add more features
- Deploy to production

## Need Help?

See [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) for detailed setup guide.
