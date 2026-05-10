CREATE TABLE IF NOT EXISTS complaint_updates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  complaint_id uuid REFERENCES complaints(id) ON DELETE CASCADE,
  user_id uuid,
  media_path text,
  media_type text,
  caption text,
  created_at timestamptz DEFAULT now(),
  trust_boost integer DEFAULT 0
);

ALTER TABLE complaints 
ADD COLUMN IF NOT EXISTS resolution_feedback text,
ADD COLUMN IF NOT EXISTS resolution_feedback_at timestamptz,
ADD COLUMN IF NOT EXISTS resolved_by text,
ADD COLUMN IF NOT EXISTS resolved_at timestamptz;
