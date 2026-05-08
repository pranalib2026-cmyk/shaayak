import { NextResponse } from 'next/server';
import { trustScoreSchema } from '@/lib/utils/validations';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const parseResult = trustScoreSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { textLength, hasMedia, userReputation } = parseResult.data;

    // Simulate AI Trust Scoring Logic
    let baseScore = 50; // Start at 50%
    
    // Add points for detail
    if (textLength > 100) baseScore += 15;
    else if (textLength > 50) baseScore += 10;
    
    // Media is strong proof
    if (hasMedia) baseScore += 20;

    // Reputation impact (-10 to +15)
    let repBonus = 0;
    if (userReputation > 500) repBonus = 15;
    else if (userReputation > 100) repBonus = 10;
    else if (userReputation < 0) repBonus = -20;

    let finalScore = baseScore + repBonus;
    if (finalScore > 98) finalScore = 98; // Cap
    if (finalScore < 5) finalScore = 5;

    // Calculate Fake Probability (inverse relationship with trust, but adds randomness)
    let fakeProbability = 100 - finalScore + (Math.random() * 5);
    if (fakeProbability > 99) fakeProbability = 99;
    if (fakeProbability < 1) fakeProbability = 1;

    let fraudIndicator = 'Low';
    if (fakeProbability > 70) fraudIndicator = 'High';
    else if (fakeProbability > 40) fraudIndicator = 'Medium';

    return NextResponse.json({
      trustScore: Math.round(finalScore),
      fakeProbability: Math.round(fakeProbability),
      fraudIndicator,
      confidence: Math.round(finalScore * 0.95)
    });

  } catch (error) {
    console.error('Trust Score Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
