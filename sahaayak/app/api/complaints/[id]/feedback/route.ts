import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabaseAuth = createServerClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const complaintId = params.id;
    if (!complaintId) {
      return NextResponse.json({ error: 'Complaint ID is required' }, { status: 400 });
    }

    const body = await req.json();
    const { feedback } = body; // 'confirmed' | 'disputed'

    if (feedback !== 'confirmed' && feedback !== 'disputed') {
      return NextResponse.json({ error: 'Invalid feedback value' }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { db: { schema: 'public' } }
    );

    // Verify ownership
    const { data: complaint, error: fetchError } = await supabaseAdmin
      .from('complaints')
      .select('user_id, status')
      .eq('id', complaintId)
      .single();

    if (fetchError || !complaint) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    if (complaint.user_id !== user.id) {
      return NextResponse.json({ error: 'Only the original creator can provide resolution feedback' }, { status: 403 });
    }

    if (complaint.status !== 'Resolved') {
      return NextResponse.json({ error: 'Complaint is not marked as resolved yet' }, { status: 400 });
    }

    const updates: any = {
      resolution_feedback: feedback,
      resolution_feedback_at: new Date().toISOString()
    };

    if (feedback === 'disputed') {
      updates.status = 'In Progress';
      updates.resolved_at = null;
    }

    const { data: updatedComplaint, error: updateError } = await supabaseAdmin
      .from('complaints')
      .update(updates)
      .eq('id', complaintId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, complaint: updatedComplaint });
  } catch (error: any) {
    console.error('Feedback API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
