import AuthPage from '@/features/auth/AuthPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Citizen Login | Sahaayak',
  description: 'Access your citizen dashboard and track civic complaints across Karnataka.',
};

export default function LoginPage() {
  return (
    <main>
      <AuthPage />
    </main>
  );
}
