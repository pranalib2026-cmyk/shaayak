-- supabase_i18n.sql

-- 1. User Preferences Table
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    preferred_language VARCHAR(5) DEFAULT 'en',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own preferences"
ON public.user_preferences FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
ON public.user_preferences FOR UPSERT
WITH CHECK (auth.uid() = user_id);
