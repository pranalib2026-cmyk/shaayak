import { createClient } from '@supabase/supabase-js';

interface SearchParams {
  category: string;
  ward: string;
  title: string;
}

export async function detectDuplicates(params: SearchParams) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
  
  // Real query logic: Search same ward and category within 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: existingComplaints, error } = await supabase
    .from('complaints')
    .select('id, title, ward, category, complaint_id')
    .eq('ward', params.ward)
    .eq('category', params.category)
    .gt('created_at', thirtyDaysAgo.toISOString());

  if (error) return [];

  const matches = existingComplaints.map(comp => {
    // Simple text similarity calculation
    const s1 = params.title.toLowerCase();
    const s2 = comp.title.toLowerCase();
    const commonWords = s1.split(' ').filter(word => s2.includes(word)).length;
    const similarity = Math.round((commonWords / Math.max(s1.split(' ').length, 1)) * 100);

    return {
      similarity: similarity > 40 ? similarity + 30 : similarity, // Boost for same ward/category match
      ward: comp.ward,
      complaintId: comp.complaint_id,
      id: comp.id
    };
  });

  return matches.filter(m => m.similarity > 50).sort((a, b) => b.similarity - a.similarity);
}
