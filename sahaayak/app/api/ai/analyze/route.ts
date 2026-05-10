import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { analyzeCivicImage } from '@/lib/ai/imageAnalyzer';
import { calculateTrustScore } from '@/lib/ai/trustScore';
import { detectDuplicates } from '@/lib/ai/duplicateDetector';
import { calculatePriority } from '@/lib/ai/priorityEngine';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get('title') as string || 'Civic Issue';
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const ward = formData.get('ward') as string || 'General';
    const file = formData.get('file') as File;
    const locationLat = formData.get('locationLat') ? parseFloat(formData.get('locationLat') as string) : null;
    
    // 1. AI Analysis
    const analysis = await analyzeCivicImage({
      text: description,
      filename: file?.name,
      category: category
    });

    // 2. Duplicate Detection
    const duplicates = await detectDuplicates({
      category: category,
      ward: ward,
      title: title
    });
    
    const is_duplicate = duplicates.length > 0 && duplicates[0].similarity > 0.85;
    const duplicate_of = is_duplicate ? duplicates[0].id : null;

    // 3. Trust Score
    const trust = calculateTrustScore({
      descriptionLength: description.length,
      hasMedia: !!file && file.size > 0,
      hasLocation: !!locationLat,
      nearbyDuplicates: duplicates.length,
      userReputation: 500, // Mocked
      categoryMatch: analysis.issueType === category,
      isSpam: description.length < 10
    });

    // 4. Priority & Recommendations
    const { priority, recommendations } = calculatePriority(
      analysis.severity,
      duplicates[0]?.similarity || 0,
      duplicates.length
    );

    return NextResponse.json({
      success: true,
      trust_score: trust.score,
      priority: priority,
      issue_type: analysis.issueType,
      department: analysis.department,
      is_duplicate: is_duplicate,
      duplicate_of: duplicate_of,
      recommendations,
      analysis: analysis
    });

  } catch (error: any) {
    console.error('AI Analysis Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
