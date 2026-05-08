'use client';

import React from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { Languages } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();

  return (
    <div className="flex items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
          language === 'en' 
          ? 'bg-gradient-aurora text-white shadow-[0_0_10px_rgba(34,211,238,0.3)]' 
          : 'text-white/40 hover:text-white/60'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('kn')}
        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
          language === 'kn' 
          ? 'bg-gradient-aurora text-white shadow-[0_0_10px_rgba(244,114,182,0.3)]' 
          : 'text-white/40 hover:text-white/60'
        }`}
      >
        ಕನ್ನಡ
      </button>
    </div>
  );
}
