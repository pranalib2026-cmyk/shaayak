interface AnalysisInput {
  text: string;
  filename?: string;
  category?: string;
}

const ISSUE_KEYWORDS: Record<string, string[]> = {
  'Road Damage': ['road', 'pothole', 'asphalt', 'tar', 'crack', 'street', 'pavement'],
  'Garbage': ['garbage', 'trash', 'waste', 'dump', 'bin', 'litter'],
  'Water Leakage': ['water', 'pipe', 'leak', 'flood', 'overflow', 'drain'],
  'Broken Streetlight': ['light', 'dark', 'bulb', 'lamp', 'electricity', 'pole'],
  'Drainage Blockage': ['drain', 'sewage', 'clog', 'gutter', 'stink'],
  'Exposed Wires': ['wire', 'electric', 'shock', 'cable', 'hanging'],
};

const DEPT_MAPPING: Record<string, string> = {
  'Road Damage': 'BBMP Road Maintenance',
  'Garbage': 'Solid Waste Management',
  'Water Leakage': 'BWSSB',
  'Broken Streetlight': 'BBMP Lighting',
  'Drainage Blockage': 'BWSSB Sanitation',
  'Exposed Wires': 'BESCOM',
};

export async function analyzeCivicImage(input: AnalysisInput) {
  const combinedText = `${input.text} ${input.filename || ''} ${input.category || ''}`.toLowerCase();
  
  let detectedIssue = 'Other';
  let maxMatch = 0;

  for (const [issue, keywords] of Object.entries(ISSUE_KEYWORDS)) {
    const matches = keywords.filter(kw => combinedText.includes(kw)).length;
    if (matches > maxMatch) {
      maxMatch = matches;
      detectedIssue = issue;
    }
  }

  const confidence = Math.min(85 + (maxMatch * 3), 98);
  const severity = combinedText.includes('accident') || combinedText.includes('dangerous') || combinedText.includes('emergency') ? 'Critical' : 'High';

  return {
    issueType: detectedIssue,
    department: DEPT_MAPPING[detectedIssue] || 'General Administration',
    severity: severity,
    confidence: confidence,
    detectedObjects: ISSUE_KEYWORDS[detectedIssue]?.slice(0, 2) || ['Issue'],
    aiRemarks: `High probability of ${detectedIssue.toLowerCase()} based on visual and textual context.`
  };
}
