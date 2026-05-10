'use client';

import HowItWorks from '@/features/story/HowItWorks';
import Navbar from '@/components/ui/Navbar';
import SmoothScrollProvider from '@/components/ui/SmoothScrollProvider';

export default function HowItWorksPage() {
  return (
    <SmoothScrollProvider>
      <main className="min-h-screen bg-[#0a0a0c]">
        <Navbar />
        <HowItWorks />
      </main>
    </SmoothScrollProvider>
  );
}
