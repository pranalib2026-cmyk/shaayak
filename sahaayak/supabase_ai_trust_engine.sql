-- supabase_ai_trust_engine.sql

-- Enable PostGIS if not present
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. AI Trust Scores
CREATE TABLE IF NOT EXISTS public.ai_trust_scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE,
    trust_score NUMERIC(5, 2) NOT NULL,
    confidence NUMERIC(5, 2) NOT NULL,
    fake_probability NUMERIC(5, 2) NOT NULL,
    duplicate_probability NUMERIC(5, 2) NOT NULL,
    risk_level VARCHAR(50),
    department VARCHAR(100),
    priority VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 2. Duplicate Complaints (Enhances previous similar_complaints)
CREATE TABLE IF NOT EXISTS public.duplicate_complaints (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE,
    matched_complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE,
    similarity_percentage NUMERIC(5, 2) NOT NULL,
    ward VARCHAR(100),
    district VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    UNIQUE(complaint_id, matched_complaint_id)
);

-- 3. AI Risk Analysis
CREATE TABLE IF NOT EXISTS public.ai_risk_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE,
    area_danger_probability NUMERIC(5, 2),
    citizen_impact_score NUMERIC(5, 2),
    escalation_urgency VARCHAR(50),
    sla_breach_risk VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 4. AI Recommendations
CREATE TABLE IF NOT EXISTS public.ai_recommendations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE,
    recommendation_text TEXT NOT NULL,
    type VARCHAR(50), -- e.g., 'Escalation', 'Duplicate', 'Hazard'
    is_actioned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 5. Complaint Scans (For Image/Media analysis)
CREATE TABLE IF NOT EXISTS public.complaint_scans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE,
    image_url TEXT,
    detected_objects JSONB, -- e.g., [{"object": "Pothole", "confidence": 94}]
    scan_status VARCHAR(50) DEFAULT 'Completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Row Level Security (RLS)
ALTER TABLE public.ai_trust_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.duplicate_complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_risk_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_scans ENABLE ROW LEVEL SECURITY;

-- Read Access Policies
CREATE POLICY "Public Read Trust Scores" ON public.ai_trust_scores FOR SELECT USING (true);
CREATE POLICY "Public Read Duplicates" ON public.duplicate_complaints FOR SELECT USING (true);
CREATE POLICY "Public Read Risk Analysis" ON public.ai_risk_analysis FOR SELECT USING (true);
CREATE POLICY "Public Read Recommendations" ON public.ai_recommendations FOR SELECT USING (true);
CREATE POLICY "Public Read Scans" ON public.complaint_scans FOR SELECT USING (true);

-- Enable Realtime
-- (Note: In Supabase dashboard, you must manually toggle these tables for Realtime replication in Database -> Replication)
