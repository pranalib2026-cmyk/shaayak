// lib/ai/similarity.ts

export interface ComplaintData {
  id: string;
  title: string;
  description: string;
  category: string;
  ward: string;
  created_at: string;
}

export interface SimilarityResult {
  similarComplaints: Array<{
    complaint: ComplaintData;
    similarity: number;
  }>;
  overallSimilarity: number;
  nearbyCount: number;
  priority: string;
  clusterRisk: string;
}

// Basic Jaccard index for text similarity (simplified NLP approach)
function getTextSimilarity(text1: string, text2: string): number {
  const set1 = new Set(text1.toLowerCase().match(/\b\w+\b/g) || []);
  const set2 = new Set(text2.toLowerCase().match(/\b\w+\b/g) || []);
  
  if (set1.size === 0 && set2.size === 0) return 0;
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

export async function calculateSimilarity(
  newComplaint: Omit<ComplaintData, 'id' | 'created_at'>,
  existingComplaints: ComplaintData[]
): Promise<SimilarityResult> {
  const similarItems = [];
  
  for (const existing of existingComplaints) {
    let score = 0;
    
    // 1. Same Ward Match (High weight: 40%)
    if (existing.ward === newComplaint.ward) score += 40;
    
    // 2. Same Category Match (Medium weight: 30%)
    if (existing.category === newComplaint.category) score += 30;
    
    // 3. Text Similarity (Variable weight: up to 30%)
    const titleSim = getTextSimilarity(newComplaint.title, existing.title);
    const descSim = getTextSimilarity(newComplaint.description, existing.description);
    const textSimScore = Math.round(((titleSim + descSim) / 2) * 30);
    
    score += textSimScore;
    
    if (score > 40) { // Only keep if somewhat similar
      similarItems.push({
        complaint: existing,
        similarity: score
      });
    }
  }

  // Sort by highest similarity
  similarItems.sort((a, b) => b.similarity - a.similarity);
  const topMatches = similarItems.slice(0, 5);

  const highestSimilarity = topMatches.length > 0 ? topMatches[0].similarity : 0;
  
  let priority = 'Normal';
  let clusterRisk = 'Low';

  if (highestSimilarity > 90 && topMatches.length >= 3) {
    priority = 'Critical';
    clusterRisk = 'High';
  } else if (highestSimilarity > 80) {
    priority = 'High';
    clusterRisk = 'Medium';
  }

  return {
    similarComplaints: topMatches,
    overallSimilarity: highestSimilarity,
    nearbyCount: similarItems.length,
    priority,
    clusterRisk
  };
}
