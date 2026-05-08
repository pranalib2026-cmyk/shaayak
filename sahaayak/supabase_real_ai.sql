-- supabase_real_ai.sql

-- Ensure PostGIS is enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Main Complaints Table
CREATE TABLE IF NOT EXISTS public.complaints (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    complaint_id VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    ward VARCHAR(100),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    image_url TEXT,
    trust_score NUMERIC(5, 2),
    confidence NUMERIC(5, 2),
    severity VARCHAR(50),
    department VARCHAR(100),
    issue_type VARCHAR(100),
    fake_probability NUMERIC(5, 2),
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 2. Duplicate Complaints Table
CREATE TABLE IF NOT EXISTS public.duplicate_complaints (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE,
    matched_complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE,
    similarity_percentage NUMERIC(5, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 3. AI Analysis Logs
CREATE TABLE IF NOT EXISTS public.ai_analysis_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE,
    analysis_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Storage Setup (Note: Bucket creation must be done in Supabase UI or via Admin API)
-- policy to allow public read access to complaint-media
-- policy to allow authenticated users to upload to complaint-media
