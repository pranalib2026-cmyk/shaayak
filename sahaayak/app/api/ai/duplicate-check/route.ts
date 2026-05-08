import { NextResponse } from 'next/server';
import { duplicateCheckSchema } from '@/lib/utils/validations';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const parseResult = duplicateCheckSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { text, ward, category } = parseResult.data;

    // Simulate finding duplicates
    // In a real app, this queries the `complaints` table using similarity.
    
    // Simulate high similarity if text is long and ward is specific
    let similarity = 0;
    let matchFound = false;

    if (text.length > 20) {
      matchFound = true;
      similarity = Math.floor(Math.random() * (98 - 75 + 1) + 75); // 75 to 98
    }

    const duplicates = matchFound ? [
      {
        id: 'dup-123',
        title: `Similar issue reported in ${ward}`,
        category: category,
        similarity: similarity,
        time: '2 hours ago'
      }
    ] : [];

    let escalation = 'None';
    if (similarity > 90) escalation = 'Critical Cluster Detected';
    else if (similarity > 80) escalation = 'Priority Cluster';

    return NextResponse.json({
      hasDuplicates: matchFound,
      maxSimilarity: similarity,
      duplicates,
      escalation
    });

  } catch (error) {
    console.error('Duplicate Check Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
