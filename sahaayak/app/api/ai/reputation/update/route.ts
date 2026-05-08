import { NextResponse } from 'next/server';
import { ACTION_POINTS, getTrustTier, checkAchievements } from '@/lib/scoring/reputation';
import { reputationUpdateSchema } from '@/lib/utils/validations';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const body = await req.json();
    
    // Validate
    const parseResult = reputationUpdateSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ error: 'Invalid input', details: parseResult.error.issues }, { status: 400 });
    }

    const { userId, action } = parseResult.data;
    const pointsToAdd = ACTION_POINTS[action];

    // Get current reputation
    const { data: currentRep, error: fetchError } = await supabase
      .from('citizen_reputation')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is not found
      throw fetchError;
    }

    let newPoints = pointsToAdd;
    let newVerified = action === 'SUBMIT_VALID_COMPLAINT' ? 1 : 0;
    let newResolved = action === 'CONFIRM_RESOLUTION' ? 1 : 0;

    if (currentRep) {
      newPoints += currentRep.total_points;
      newVerified += currentRep.verified_complaints;
      newResolved += currentRep.resolved_issues;
    }

    const newTier = getTrustTier(newPoints);

    // Upsert reputation
    const { data: updatedRep, error: upsertError } = await supabase
      .from('citizen_reputation')
      .upsert({
        user_id: userId,
        total_points: newPoints,
        trust_tier: newTier,
        verified_complaints: newVerified,
        resolved_issues: newResolved,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })
      .select()
      .single();

    if (upsertError) throw upsertError;

    // Log history
    await supabase.from('reputation_history').insert({
      user_id: userId,
      points_change: pointsToAdd,
      reason: action
    });

    // Check for new achievements
    // We mock the stats parameter for now
    const mockStats = {
      roadsReported: 5,
      waterReported: 2,
      electricityReported: 0
    };
    
    const newBadges = checkAchievements(newPoints, mockStats);
    
    if (newBadges.length > 0) {
      for (const badge of newBadges) {
        // Use upsert to avoid duplicate key errors if they already have it
        await supabase.from('achievement_badges').upsert({
          user_id: userId,
          badge_name: badge
        }, { onConflict: 'user_id, badge_name' });
      }
    }

    return NextResponse.json({
      success: true,
      newTotal: newPoints,
      tier: newTier,
      badgesAwarded: newBadges
    });

  } catch (error) {
    console.error('Reputation Update Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
