import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { uploadComplaintImage } from '@/lib/supabase/storage';
import { analyzeCivicImage } from '@/lib/ai/imageAnalyzer';
import { calculateTrustScore } from '@/lib/ai/trustScore';
import { detectDuplicates } from '@/lib/ai/duplicateDetector';
import { calculatePriority } from '@/lib/ai/priorityEngine';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
    const formData = await req.formData();
    const title = formData.get('title') as string || 'Civic Issue';
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const ward = formData.get('ward') as string || 'General';
    const file = formData.get('file') as File;
    const locationLat = formData.get('locationLat') ? parseFloat(formData.get('locationLat') as string) : null;
    const locationLng = formData.get('locationLng') ? parseFloat(formData.get('locationLng') as string) : null;
    
    // Auth check (server-side client)
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || formData.get('userId') as string || null;

    const complaintId = `SHA-${Math.floor(1000 + Math.random() * 9000)}`;

    // 1. Storage Upload
    let imageUrl = '';
    if (file && file.size > 0) {
      const upload = await uploadComplaintImage(file, complaintId);
      imageUrl = upload.publicUrl;
    }

    // 2. AI Analysis
    const analysis = await analyzeCivicImage({
      text: description,
      filename: file?.name,
      category: category
    });

    // 3. Duplicate Detection
    const duplicates = await detectDuplicates({
      category: category,
      ward: ward,
      title: title
    });

    // 4. Trust Score
    const trust = calculateTrustScore({
      descriptionLength: description.length,
      hasMedia: !!file && file.size > 0,
      hasLocation: !!locationLat,
      nearbyDuplicates: duplicates.length,
      userReputation: 500, // Mocked
      categoryMatch: analysis.issueType === category,
      isSpam: description.length < 10
    });

    // 5. Priority & Recommendations
    const { priority, recommendations } = calculatePriority(
      analysis.severity,
      duplicates[0]?.similarity || 0,
      duplicates.length
    );

    // 6. DB Storage
    const { data: complaint, error } = await supabase
      .from('complaints')
      .insert({
        complaint_id: complaintId,
        user_id: userId,
        title,
        description,
        category,
        ward,
        image_url: imageUrl,
        trust_score: trust.score,
        confidence: analysis.confidence,
        severity: priority,
        department: analysis.department,
        issue_type: analysis.issueType,
        fake_probability: trust.fakeProbability,
        latitude: locationLat,
        longitude: locationLng,
        status: 'Pending'
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      complaintId: complaintId,
      trustScore: trust.score,
      severity: priority,
      department: analysis.department,
      issueType: analysis.issueType,
      confidence: analysis.confidence,
      fakeProbability: trust.fakeProbability,
      duplicateMatches: duplicates.slice(0, 3),
      recommendations,
      complaint: complaint
    });

  } catch (error: any) {
    console.error('Full-Stack AI Analysis Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
