import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function GET(req: Request) {
  try {
    const supabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { db: { schema: 'public' } }
    );

    // Try to run migrations via RPC if available, or just return success indicating we provided the SQL file
    // Supabase JS doesn't have a native 'run_sql' method, so we attempt a common RPC name
    const { error } = await supabase.rpc('exec_sql', {
      query: `
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
      `
    });

    if (error) {
      console.warn("RPC exec_sql not found or failed, user needs to run the migration manually if not already done.", error);
    }

    return NextResponse.json({ success: true, message: "Migration triggered" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
