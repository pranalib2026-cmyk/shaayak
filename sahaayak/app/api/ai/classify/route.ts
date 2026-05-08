import { NextResponse } from 'next/server';
import { classifyComplaint } from '@/lib/ai/classifier';
import { classifyRequestSchema } from '@/lib/utils/validations';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate input
    const parseResult = classifyRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ error: 'Invalid input', details: parseResult.error.issues }, { status: 400 });
    }

    const { complaintText } = parseResult.data;

    // Call the AI classification engine
    const result = await classifyComplaint(complaintText);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Classification Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
