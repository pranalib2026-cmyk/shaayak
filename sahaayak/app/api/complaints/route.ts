import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(req.url);
    const complaintId = searchParams.get('id');

    if (complaintId) {
      // Fetch specific complaint with related data
      const { data: complaint, error } = await supabase
        .from('complaints')
        .select(`
          *,
          complaint_media (*),
          complaint_updates (*)
        `)
        .eq('complaint_id', complaintId)
        .single();

      if (error) {
        return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, complaint });
    }

    // Fetch all complaints for heatmap/dashboard
    const { data: complaints, error } = await supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, complaints });
  } catch (error: any) {
    console.error('Complaint API GET Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const formData = await req.formData();
    
    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const language = formData.get('language') as string || 'EN';
    const location_lat = formData.get('location_lat') ? parseFloat(formData.get('location_lat') as string) : null;
    const location_lng = formData.get('location_lng') ? parseFloat(formData.get('location_lng') as string) : null;
    const is_anonymous = formData.get('is_anonymous') === 'true';
    
    if (!category || !description) {
      return NextResponse.json({ error: 'Category and description are required' }, { status: 400 });
    }

    // Generate unique complaint ID (e.g. KA-2024-XXXX)
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const complaint_id = `KA-${year}-${randomNum}`;
    
    // Mock Trust Score (AI simulation)
    const trust_score = Math.floor(60 + Math.random() * 35); 
    
    // Insert Complaint
    const { data: complaint, error: complaintError } = await supabase
      .from('complaints')
      .insert({
        complaint_id,
        user_id: is_anonymous ? null : user?.id,
        category,
        description,
        language,
        location_lat,
        location_lng,
        is_anonymous,
        trust_score,
        status: 'pending',
        priority: 'medium'
      })
      .select()
      .single();
      
    if (complaintError) {
      console.error("Complaint insertion error:", complaintError);
      return NextResponse.json({ error: 'Failed to create complaint: ' + complaintError.message }, { status: 500 });
    }

    // Process Media Uploads
    const files = formData.getAll('media') as File[];
    const mediaInserts = [];
    
    for (const file of files) {
      if (file && file.size > 0) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${complaint.id}/${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('complaints')
          .upload(fileName, file);
          
        if (!uploadError && uploadData) {
          const { data: { publicUrl } } = supabase.storage
            .from('complaints')
            .getPublicUrl(fileName);
            
          mediaInserts.push({
            complaint_id: complaint.id,
            media_url: publicUrl,
            media_type: file.type.startsWith('video') ? 'video' : 'image'
          });
        }
      }
    }
    
    if (mediaInserts.length > 0) {
      await supabase
        .from('complaint_media')
        .insert(mediaInserts);
    }
    
    return NextResponse.json({ success: true, complaint });
  } catch (error: any) {
    console.error('Complaint API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
