import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
    
    const { userId, language } = await req.json();

    if (!userId || !language) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const { error } = await supabase
      .from('user_preferences')
      .upsert({ user_id: userId, preferred_language: language, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
