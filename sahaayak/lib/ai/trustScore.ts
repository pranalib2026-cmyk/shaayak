interface TrustFactors {
  descriptionLength: number;
  hasMedia: boolean;
  hasLocation: boolean;
  nearbyDuplicates: number;
  userReputation: number;
  categoryMatch: boolean;
  isSpam: boolean;
}

export function calculateTrustScore(factors: TrustFactors) {
  let score = 0;

  if (factors.isSpam) return {
    score: 15,
    label: 'Spam Detected',
    fakeProbability: 85
  };

  // 1. Description Quality (up to 20)
  if (factors.descriptionLength > 100) score += 20;
  else if (factors.descriptionLength > 30) score += 10;

  // 2. Image Presence (20)
  if (factors.hasMedia) score += 20;

  // 3. Location Precision (15)
  if (factors.hasLocation) score += 15;

  // 4. Social Proof / Nearby Context (20)
  if (factors.nearbyDuplicates > 0) score += 20;

  // 5. User History (15)
  if (factors.userReputation > 500) score += 15;
  else if (factors.userReputation > 100) score += 5;

  // 6. Metadata Consistency (10)
  if (factors.categoryMatch) score += 10;

  // Clamp and finalize
  const finalScore = Math.max(0, Math.min(100, score));
  
  let label = 'Suspicious';
  if (finalScore >= 90) label = 'Highly Trusted';
  else if (finalScore >= 70) label = 'Likely Genuine';
  else if (finalScore >= 50) label = 'Needs Review';

  return {
    score: finalScore,
    label: label,
    fakeProbability: 100 - finalScore
  };
}
