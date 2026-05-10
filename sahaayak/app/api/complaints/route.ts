import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function GET(req: Request) {
  try {
    const supabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { db: { schema: 'public' } }
    );
    const { searchParams } = new URL(req.url);
    const complaintId = searchParams.get('id');

    if (complaintId) {
      const { data: complaint, error } = await supabase
        .from('complaints')
        .select(`
          *,
          complaint_media (*)
        `)
        .eq('id', complaintId)
        .single();

      if (error) {
        return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, complaint });
    }

    const { data: complaints, error } = await supabase
      .from('complaints')
      .select(`
        *,
        complaint_media (*),
        complaint_updates (*)
      `)
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
    console.log('SUPABASE URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('SERVICE KEY SET:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { db: { schema: 'public' } }
    );
    
    // Auth client to verify user
    const supabaseAuth = createServerClient();
    const formData = await req.formData();
    
    // Auth check
    const { data: { user } } = await supabaseAuth.auth.getUser();
    
    const title = formData.get('title') as string || 'Civic Issue';
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const latitude = formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : null;
    const longitude = formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : null;
    const is_anonymous = formData.get('is_anonymous') === 'true';
    const trust_score = formData.get('trust_score') ? parseInt(formData.get('trust_score') as string) : 50;
    const priority = formData.get('priority') as string || 'Medium';
    const is_duplicate = formData.get('is_duplicate') === 'true';
    const duplicate_of = formData.get('duplicate_of') as string || null;
    const ward = formData.get('ward') as string || null;
    const city = formData.get('city') as string || null;
    const address = formData.get('address') as string || null;

    if (!category || !description) {
      return NextResponse.json({ error: 'Category and description are required' }, { status: 400 });
    }

    // Insert Complaint
    const { data: complaint, error: complaintError } = await supabaseAdmin
      .from('complaints')
      .insert({
        title,
        description,
        category,
        status: 'Pending',
        priority,
        trust_score,
        latitude,
        longitude,
        address,
        ward,
        city,
        upvotes: 0,
        is_duplicate,
        duplicate_of,
        user_id: is_anonymous ? null : user?.id
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
        
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from('complaints')
          .upload(fileName, file);
          
        if (!uploadError && uploadData) {
          const { data: { publicUrl } } = supabaseAdmin.storage
            .from('complaints')
            .getPublicUrl(fileName);
            
          mediaInserts.push({
            complaint_id: complaint.id,
            media_url: publicUrl,
            media_type: file.type.startsWith('video') ? 'video' : 'image'
          });
        } else {
          console.error("Storage upload error:", uploadError);
        }
      }
    }
    
    if (mediaInserts.length > 0) {
      const { error: mediaError } = await supabaseAdmin
        .from('complaint_media')
        .insert(mediaInserts);
        
      if (mediaError) {
         console.error("Media DB insert error:", mediaError);
      }
    }
    
    return NextResponse.json({ success: true, complaint });
  } catch (error: any) {
    console.error('Complaint API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
