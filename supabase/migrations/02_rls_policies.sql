-- Supabase Row Level Security (RLS) Policies
-- File: supabase/migrations/02_rls_policies.sql

-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_places ENABLE ROW LEVEL SECURITY;

-- 1. Policies for `users` table
CREATE POLICY "Users can view their own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.users FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 2. Policies for `trips` table
CREATE POLICY "Users can view their own trips"
    ON public.trips FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create trips"
    ON public.trips FOR INSERT
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own trips"
    ON public.trips FOR UPDATE
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own trips"
    ON public.trips FOR DELETE
    USING (auth.uid() = user_id);

-- 3. Policies for `itineraries` table
CREATE POLICY "Users can view itineraries for their trips"
    ON public.itineraries FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.trips
            WHERE trips.id = itineraries.trip_id
            AND (trips.user_id = auth.uid() OR trips.user_id IS NULL)
        )
    );

CREATE POLICY "Users can insert itineraries for their trips"
    ON public.itineraries FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.trips
            WHERE trips.id = itineraries.trip_id
            AND (trips.user_id = auth.uid() OR trips.user_id IS NULL)
        )
    );

CREATE POLICY "Users can update itineraries for their trips"
    ON public.itineraries FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.trips
            WHERE trips.id = itineraries.trip_id
            AND (trips.user_id = auth.uid() OR trips.user_id IS NULL)
        )
    );

CREATE POLICY "Users can delete itineraries for their trips"
    ON public.itineraries FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.trips
            WHERE trips.id = itineraries.trip_id
            AND trips.user_id = auth.uid()
        )
    );

-- 4. Policies for `saved_places` table
CREATE POLICY "Users can view their saved places"
    ON public.saved_places FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can add saved places"
    ON public.saved_places FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their saved places"
    ON public.saved_places FOR DELETE
    USING (auth.uid() = user_id);

