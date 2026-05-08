import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminDashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== 'admin') {
    redirect('/login');
  }

  return <AdminDashboardClient user={user} />;
}
