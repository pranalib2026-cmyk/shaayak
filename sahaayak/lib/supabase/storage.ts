import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
}

export async function uploadComplaintImage(file: File, complaintId: string) {
  const supabase = getSupabase();
  const fileExt = file.name.split('.').pop();
  const fileName = `${complaintId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `complaints/${fileName}`;

  const { data, error } = await supabase.storage
    .from('complaints')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  return {
    path: data.path,
    publicUrl: supabase.storage.from('complaints').getPublicUrl(data.path).data.publicUrl
  };
}

export async function deleteComplaintImage(path: string) {
  const supabase = getSupabase();
  const { error } = await supabase.storage
    .from('complaints')
    .remove([path]);

  if (error) throw error;
}

export function getPublicImageUrl(path: string) {
  const supabase = getSupabase();
  return supabase.storage.from('complaints').getPublicUrl(path).data.publicUrl;
}
