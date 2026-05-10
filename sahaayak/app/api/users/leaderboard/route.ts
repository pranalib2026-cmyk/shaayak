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

    // Fetch all complaints to build leaderboard from real data
    const { data: complaints, error } = await supabase
      .from('complaints')
      .select('user_id, trust_score, status');

    if (error) throw error;

    // Group by user_id and calculate a reputation score
    const userMap: Record<string, { total_complaints: number; trust_sum: number; resolved: number }> = {};
    for (const c of complaints || []) {
      if (!c.user_id) continue;
      if (!userMap[c.user_id]) {
        userMap[c.user_id] = { total_complaints: 0, trust_sum: 0, resolved: 0 };
      }
      userMap[c.user_id].total_complaints += 1;
      userMap[c.user_id].trust_sum += c.trust_score || 70;
      if (c.status === 'Resolved') userMap[c.user_id].resolved += 1;
    }

    // reputation_points = total_complaints * average_trust_score
    const sortedUsers = Object.entries(userMap)
      .map(([user_id, stats]) => ({
        user_id,
        ...stats,
        reputation_points: Math.round(
          stats.total_complaints * (stats.trust_sum / stats.total_complaints)
        ),
      }))
      .sort((a, b) => b.reputation_points - a.reputation_points)
      .slice(0, 10);

    if (sortedUsers.length === 0) {
      return NextResponse.json({ success: true, leaderboard: [] });
    }

    // Fetch profile names for these user IDs
    const userIds = sortedUsers.map((u) => u.user_id);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .in('id', userIds);

    const profileMap: Record<string, { full_name: string; avatar_url: string }> = {};
    for (const p of profiles || []) {
      profileMap[p.id] = { full_name: p.full_name, avatar_url: p.avatar_url };
    }

    const leaderboard = sortedUsers.map((u) => ({
      user_id: u.user_id,
      full_name: profileMap[u.user_id]?.full_name || 'Citizen Hero',
      avatar_url: profileMap[u.user_id]?.avatar_url || null,
      total_complaints: u.total_complaints,
      resolved_complaints: u.resolved,
      reputation_points: u.reputation_points,
    }));

    return NextResponse.json({ success: true, leaderboard });
  } catch (error: any) {
    console.error('Leaderboard Fetch Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
