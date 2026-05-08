import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // In a real application, you might join with a users table to get names/wards.
    // Assuming auth.users is inaccessible or we store a profile table.
    // For this example, we return the top 10 reputation scores.
    const { data: leaderboard, error } = await supabase
      .from('citizen_reputation')
      .select('user_id, total_points, trust_tier, verified_complaints')
      .order('total_points', { ascending: false })
      .limit(10);

    if (error) throw error;

    return NextResponse.json({
      leaderboard
    });
  } catch (error) {
    console.error('Leaderboard Fetch Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
