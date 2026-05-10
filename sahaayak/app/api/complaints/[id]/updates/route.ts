import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { analyzeCivicImage } from '@/lib/ai/imageAnalyzer';

export async function POST(req: Request, { params }: { params: { id: string } }) {
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

    const formData = await req.formData();
    const media = formData.get('media') as File;
    const caption = formData.get('caption') as string || '';

    if (!media || media.size === 0) {
      return NextResponse.json({ error: 'Media file is required' }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { db: { schema: 'public' } }
    );

    // Get current complaint to know category and current trust score
    const { data: complaint, error: fetchError } = await supabaseAdmin
      .from('complaints')
      .select('category, trust_score')
      .eq('id', complaintId)
      .single();

    if (fetchError || !complaint) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    // AI Analysis for Trust Boost
    const aiAnalysis = await analyzeCivicImage({
      text: caption,
      filename: media.name,
      category: complaint.category
    });

    // Calculate trust boost (0 - 20 max)
    const baseBoost = Math.floor((aiAnalysis.confidence / 100) * 15);
    const categoryBonus = aiAnalysis.issueType === complaint.category ? 5 : 0;
    const trustBoost = baseBoost + categoryBonus;

    // Upload media to storage
    const fileExt = media.name.split('.').pop();
    const timestamp = Date.now();
    const fileName = `updates/${complaintId}/${timestamp}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('complaints')
      .upload(fileName, media);

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json({ error: 'Failed to upload media' }, { status: 500 });
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('complaints')
      .getPublicUrl(fileName);

    // Insert update record
    const { data: updateRecord, error: updateError } = await supabaseAdmin
      .from('complaint_updates')
      .insert({
        complaint_id: complaintId,
        user_id: user.id,
        media_path: publicUrl,
        media_type: media.type.startsWith('video') ? 'video' : 'image',
        caption: caption,
        trust_boost: trustBoost
      })
      .select()
      .single();

    if (updateError) {
      console.error("Insert update error:", updateError);
      return NextResponse.json({ error: 'Failed to save update record' }, { status: 500 });
    }

    // Update complaint trust score
    const newTrustScore = Math.min(100, (complaint.trust_score || 0) + trustBoost);
    const { error: updateComplaintError } = await supabaseAdmin
      .from('complaints')
      .update({ trust_score: newTrustScore })
      .eq('id', complaintId);

    if (updateComplaintError) {
       console.error("Update complaint error:", updateComplaintError);
    }

    return NextResponse.json({ 
      success: true, 
      update: updateRecord,
      new_trust_score: newTrustScore,
      trust_boost: trustBoost
    });

  } catch (error: any) {
    console.error('Update API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
