-- Supabase PostgreSQL Schema for TravelGenie
-- File: supabase/migrations/01_initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (Mirroring Supabase Auth or Standalone Profile)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Trips Table
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    destination TEXT NOT NULL,
    starting_location TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    travelers INT DEFAULT 1 NOT NULL,
    adults INT DEFAULT 1 NOT NULL,
    children INT DEFAULT 0 NOT NULL,
    budget NUMERIC NOT NULL,
    budget_type TEXT DEFAULT 'per_person' CHECK (budget_type IN ('per_person', 'total_group')),
    currency TEXT DEFAULT 'INR',
    travel_style TEXT NOT NULL,
    travel_pace TEXT DEFAULT 'balanced' CHECK (travel_pace IN ('relaxed', 'balanced', 'packed')),
    interests TEXT[] DEFAULT '{}',
    transportation TEXT DEFAULT 'public',
    accommodation TEXT DEFAULT 'hotel',
    additional_preferences TEXT,
    status TEXT DEFAULT 'planned' CHECK (status IN ('draft', 'planned', 'completed', 'archived')),
    cover_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Itineraries Table (Stores structured AI Output and version history)
CREATE TABLE IF NOT EXISTS public.itineraries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    itinerary_json JSONB NOT NULL,
    total_estimated_budget NUMERIC NOT NULL,
    currency TEXT DEFAULT 'INR',
    version INT DEFAULT 1 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Saved Places Table (User bookmarks and custom spots)
CREATE TABLE IF NOT EXISTS public.saved_places (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    place_name TEXT NOT NULL,
    destination TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    category TEXT DEFAULT 'attraction',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON public.trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_destination ON public.trips(destination);
CREATE INDEX IF NOT EXISTS idx_itineraries_trip_id ON public.itineraries(trip_id);
CREATE INDEX IF NOT EXISTS idx_saved_places_user_id ON public.saved_places(user_id);

