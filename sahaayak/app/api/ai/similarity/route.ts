import { NextResponse } from 'next/server';
import { calculateSimilarity } from '@/lib/ai/similarity';
import { similarityRequestSchema } from '@/lib/utils/validations';
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
    
    // Validate input
    const parseResult = similarityRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ error: 'Invalid input', details: parseResult.error.issues }, { status: 400 });
    }

    const newComplaint = parseResult.data;

    // Fetch existing complaints in the same ward to limit the search space
    // In a real production app with PostGIS, we would use st_dwithin for radius search
    const { data: existingComplaints, error } = await supabase
      .from('complaints')
      .select('id, title, description, category, ward, created_at')
      .eq('ward', newComplaint.ward)
      .limit(100); // Limit for performance

    if (error) throw error;

    // Calculate similarity
    const result = await calculateSimilarity(newComplaint, existingComplaints || []);

    // Example of saving a cluster if risk is High
    if (result.clusterRisk === 'High') {
      // Background task: log cluster to db
      await supabase.from('complaint_clusters').insert({
        category: newComplaint.category,
        ward: newComplaint.ward,
        complaint_count: result.nearbyCount + 1,
        risk_level: result.clusterRisk
      });
    }

    return NextResponse.json({
      priority: result.priority,
      similarity: result.overallSimilarity,
      nearbyComplaints: result.nearbyCount,
      clusterRisk: result.clusterRisk,
      similarItems: result.similarComplaints
    });

  } catch (error) {
    console.error('Similarity Engine Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
