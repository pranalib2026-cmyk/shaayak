'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.push('/')}
      className="fixed top-8 left-8 z-[100] flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-xl border border-black/5 rounded-full shadow-2xl hover:bg-white hover:scale-105 transition-all group"
    >
      <ChevronLeft className="w-5 h-5 text-black group-hover:-translate-x-1 transition-transform" />
      <span className="text-xs font-bold uppercase tracking-widest text-black">Back to Home</span>
    </button>
  );
}
