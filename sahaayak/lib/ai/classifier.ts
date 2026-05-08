// lib/ai/classifier.ts

type Category = 'Roads' | 'Water' | 'Electricity' | 'Garbage' | 'Drainage' | 'Streetlights' | 'Public Transport' | 'Other';
type Severity = 'Low' | 'Medium' | 'High' | 'Critical';
type Escalation = 'Normal' | 'Priority' | 'Immediate';

interface ClassificationResult {
  category: Category;
  department: string;
  severity: Severity;
  confidence: number;
  escalation: Escalation;
  sentiment: string[];
}

const CATEGORY_MAP: Record<Category, { dept: string, keywords: string[] }> = {
  'Roads': {
    dept: 'BBMP/PWD',
    keywords: ['road', 'pothole', 'asphalt', 'tar', 'crack', 'street', 'highway', 'traffic']
  },
  'Water': {
    dept: 'BWSSB',
    keywords: ['water', 'pipe', 'leak', 'drinking', 'supply', 'tap', 'dry']
  },
  'Electricity': {
    dept: 'BESCOM',
    keywords: ['power', 'electricity', 'wire', 'shock', 'pole', 'transformer', 'outage', 'current']
  },
  'Garbage': {
    dept: 'Solid Waste Management',
    keywords: ['garbage', 'trash', 'waste', 'dump', 'smell', 'bin', 'sweeper']
  },
  'Drainage': {
    dept: 'BWSSB Sanitation',
    keywords: ['drain', 'sewage', 'clog', 'overflow', 'gutter', 'stagnant', 'mosquitoes']
  },
  'Streetlights': {
    dept: 'BBMP Lighting',
    keywords: ['streetlight', 'dark', 'bulb', 'lamp', 'visibility', 'night']
  },
  'Public Transport': {
    dept: 'BMTC/KSRTC',
    keywords: ['bus', 'stop', 'stand', 'depot', 'route', 'conductor', 'driver']
  },
  'Other': {
    dept: 'General Administration',
    keywords: []
  }
};

const SEVERITY_KEYWORDS = {
  Critical: ['accident', 'dangerous', 'electric shock', 'flooding', 'death', 'emergency', 'fire', 'collapsed', 'fatal'],
  High: ['leakage', 'pothole', 'garbage overflow', 'no power', 'stagnant water', 'blocked', 'broken'],
  Medium: ['maintenance', 'damaged', 'flickering', 'dirty', 'delay', 'repair'],
  Low: ['request', 'suggestion', 'information', 'inquiry', 'clean']
};

export async function classifyComplaint(text: string): Promise<ClassificationResult> {
  const lowerText = text.toLowerCase();
  
  // 1. Determine Category
  let bestCategory: Category = 'Other';
  let maxScore = 0;

  Object.entries(CATEGORY_MAP).forEach(([cat, data]) => {
    let score = 0;
    data.keywords.forEach(kw => {
      if (lowerText.includes(kw)) score += 1;
    });
    if (score > maxScore) {
      maxScore = score;
      bestCategory = cat as Category;
    }
  });

  // 2. Determine Severity
  let detectedSeverity: Severity = 'Low';
  if (SEVERITY_KEYWORDS.Critical.some(kw => lowerText.includes(kw))) {
    detectedSeverity = 'Critical';
  } else if (SEVERITY_KEYWORDS.High.some(kw => lowerText.includes(kw))) {
    detectedSeverity = 'High';
  } else if (SEVERITY_KEYWORDS.Medium.some(kw => lowerText.includes(kw))) {
    detectedSeverity = 'Medium';
  }

  // 3. Escalation Recommendation
  let escalation: Escalation = 'Normal';
  if (detectedSeverity === 'Critical') escalation = 'Immediate';
  else if (detectedSeverity === 'High') escalation = 'Priority';

  // 4. Calculate Mock Confidence based on word count & keyword matches
  const wordCount = lowerText.split(/\s+/).length;
  let confidence = 50 + (maxScore * 10) + (wordCount > 10 ? 10 : 0);
  if (confidence > 98) confidence = 98; // Cap at 98% for realism
  if (bestCategory === 'Other') confidence = Math.max(40, confidence - 20);

  // 5. Sentiment Analysis (Mocked via heuristics)
  const sentiment: string[] = [];
  if (detectedSeverity === 'Critical' || lowerText.includes('urgent')) sentiment.push('Urgent');
  if (lowerText.includes('frustrat') || lowerText.includes('angry') || lowerText.includes('worst')) sentiment.push('Frustrated');
  if (SEVERITY_KEYWORDS.Critical.some(kw => lowerText.includes(kw))) sentiment.push('Dangerous');
  if (sentiment.length === 0) sentiment.push('Concerned');

  return {
    category: bestCategory,
    department: CATEGORY_MAP[bestCategory].dept,
    severity: detectedSeverity,
    confidence,
    escalation,
    sentiment
  };
}
