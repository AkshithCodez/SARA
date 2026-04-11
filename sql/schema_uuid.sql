-- =============================================================================
-- SARA Database Schema (UUID-based)
-- =============================================================================
-- Multi-tenant system with UUID primary keys
-- Run these queries in Supabase SQL Editor
-- =============================================================================

-- Drop existing tables (in correct dependency order)
DROP TABLE IF EXISTS occupancy_logs CASCADE;
DROP TABLE IF EXISTS lounges CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS airlines CASCADE;

-- =============================================================================
-- Airlines (Tenants)
-- =============================================================================
CREATE TABLE airlines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- Lounges
-- =============================================================================
CREATE TABLE lounges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    airline_id UUID NOT NULL REFERENCES airlines(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ix_lounges_airline_id ON lounges(airline_id);

-- =============================================================================
-- Users (for JWT auth)
-- =============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    hashed_password TEXT NOT NULL,
    role TEXT NOT NULL,
    airline_id UUID NOT NULL REFERENCES airlines(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ix_users_airline_id ON users(airline_id);
CREATE INDEX ix_users_email ON users(email);

-- =============================================================================
-- Occupancy Logs (Time-series)
-- =============================================================================
CREATE TABLE occupancy_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lounge_id UUID NOT NULL REFERENCES lounges(id) ON DELETE CASCADE,
    passenger_count INTEGER NOT NULL CHECK (passenger_count >= 0),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ix_occupancy_logs_lounge_id ON occupancy_logs(lounge_id);
CREATE INDEX ix_occupancy_logs_timestamp ON occupancy_logs(timestamp);

-- =============================================================================
-- Sample Data
-- =============================================================================

-- Insert sample airline
INSERT INTO airlines (id, name)
VALUES ('a1b2c3d4-1234-5678-9abc-def012345678', 'Delta Air Lines')
ON CONFLICT (name) DO NOTHING;

-- Insert sample lounge (linked to airline)
INSERT INTO lounges (id, name, location, capacity, airline_id)
VALUES (
    'b2c3d4e5-2345-6789-abcd-ef0123456789',
    'Delta Sky Club',
    'Terminal A, Gate 24',
    150,
    'a1b2c3d4-1234-5678-9abc-def012345678'
);

-- Insert sample user (password: 'admin123' - hashed with bcrypt)
INSERT INTO users (id, email, hashed_password, role, airline_id)
VALUES (
    'c3d4e5f6-3456-789a-bcde-f01234567890',
    'admin@delta.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYfQ3ZJH9G',  -- admin123
    'admin',
    'a1b2c3d4-1234-5678-9abc-def012345678'
);

-- Verify inserts
SELECT * FROM airlines;
SELECT * FROM lounges;
SELECT * FROM users;