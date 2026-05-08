import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    // Get reputation
    const { data: reputation, error: repError } = await supabase
      .from('citizen_reputation')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (repError && repError.code !== 'PGRST116') {
      throw repError;
    }

    // Get badges
    const { data: badges, error: badgeError } = await supabase
      .from('achievement_badges')
      .select('badge_name')
      .eq('user_id', userId);

    if (badgeError) throw badgeError;

    return NextResponse.json({
      reputation: reputation || {
        total_points: 0,
        trust_tier: 'Bronze Citizen',
        verified_complaints: 0,
        resolved_issues: 0,
        accuracy_rate: 100.0
      },
      badges: badges?.map(b => b.badge_name) || []
    });
  } catch (error) {
    console.error('Reputation Fetch Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
