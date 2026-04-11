# SARA Quick Start Guide

Get SARA up and running in 5 minutes.

## Prerequisites

- Python 3.13+
- Node.js 18+
- Supabase account (for database)

## Step 1: Database Setup

### 1.1 Configure Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```env
# Database (Supabase PostgreSQL)
DATABASE_URL=postgresql+psycopg2://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres

# Authentication
SECRET_KEY=your-secret-key-here

# Telemetry API
TELEMETRY_API_KEY=your-telemetry-api-key-here
```

### 1.2 Run Database Schema

Execute the UUID schema in Supabase SQL Editor:

```bash
# Open Supabase Dashboard → SQL Editor
# Paste contents from: sql/schema_uuid.sql
# Run to create tables with UUID primary keys
```

## Step 2: Install Dependencies

```bash
# Install Python dependencies
pip install -r requirements.txt

# Install frontend dependencies
cd travel-booking/frontend
npm install
```

## Step 3: Start Backend (Terminal 1)

```bash
cd C:\Users\reddy\Downloads\projects\sara\SARA
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Wait for: `Uvicorn running on http://0.0.0.0:8000`

## Step 4: Start Frontend (Terminal 2)

```bash
cd C:\Users\reddy\Downloads\projects\sara\SARA\travel-booking\frontend
npm run dev
```

Wait for: `Local: http://localhost:5173`

## Step 5: Open Dashboard

Your browser should automatically open to http://localhost:5173

If not, manually open: http://localhost:5173

## What You'll See

- Header: SARA Dashboard title with gradient theme
- Section 1: Lounge Occupancy Forecast (chart, metrics, risk level)
- Section 2: Staffing Optimization (alerts, staff breakdown)
- Section 3: Food Waste Reduction (metrics, tables)
- API Documentation: Visit http://localhost:8000/docs

## Testing the API

```bash
# Health check
curl http://localhost:8000/

# Prediction endpoint
curl http://localhost:8000/predict

# Create user (signup)
curl -X POST http://localhost:8000/auth/signup ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@test.com\",\"password\":\"test123\",\"role\":\"admin\",\"airline_id\":\"a1b2c3d4-1234-5678-9abc-def012345678\"}"

# Login
curl -X POST http://localhost:8000/auth/login ^
  -H "Content-Type: application/x-www-form-urlencoded" ^
  -d "username=admin@test.com&password=test123"

# Ingest telemetry (requires API key)
curl -X POST http://localhost:8000/api/v1/telemetry/occupancy ^
  -H "Content-Type: application/json" ^
  -H "x-api-key: your-telemetry-api-key-here" ^
  -d "{\"lounge_id\":\"b2c3d4e5-2345-6789-abcd-ef0123456789\",\"timestamp\":\"2026-04-11T19:00:00Z\",\"delta\":5,\"total_occupancy\":42}"
```

## Troubleshooting

### Backend not starting?
```bash
# Verify database connection
python scripts/test_db.py
```

### Frontend shows connection error?
- Check backend is running at http://localhost:8000
- Visit http://localhost:8000/docs to verify API

### Model file missing?
```bash
python setup.py
```

## Project Structure

```
SARA/
├── main.py                 # FastAPI application entry point
├── core/
│   ├── database.py        # SQLAlchemy connection
│   ├── models.py          # ORM models (UUID-based)
│   ├── schemas.py        # Pydantic schemas
│   └── auth.py           # JWT authentication
├── routers/
│   ├── auth.py           # /auth endpoints
│   ├── lounge.py         # /lounges endpoints
│   ├── occupancy.py      # /occupancy endpoints
│   └── telemetry.py     # /api/v1/telemetry endpoints
├── services/
│   └── telemetry_service.py  # Business logic
├── sql/
│   └── schema_uuid.sql   # Database schema (UUID)
└── travel-booking/frontend/  # React frontend
```

## Need Help?

See [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) for detailed setup guide.
