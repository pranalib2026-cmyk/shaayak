'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useTranslation } from '@/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const { t } = useTranslation();
  
  // Create client once or rely on the stable createBrowserClient
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []); // removed supabase.auth to prevent infinite loops

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };
  
  const navItems = [
    { name: t('common.home'), href: '/' },
    { name: t('common.leaderboard') || 'Leaderboard', href: '/leaderboard' },
    { name: t('common.complaints'), href: '/track' },
    { name: t('common.dashboard'), href: '/dashboard' },
    ...(user ? [{ name: 'My Complaints', href: '/dashboard/my-complaints' }] : []),
    { name: t('common.ai_verification'), href: '/ai-verification' },
    { name: t('common.how_it_works'), href: '/how-it-works' },
    { name: t('common.total_reports') || 'Total Reports', href: '/reports' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] border-b border-white/5 backdrop-blur-md bg-black/5">
      <nav className="w-full px-8 py-4 max-w-7xl mx-auto flex justify-between items-center font-inter">
        <Link href="/" className="text-3xl tracking-tight font-instrument text-white font-normal cursor-pointer group">
          Sahaayak
        </Link>
  
        <div className="hidden lg:flex gap-8 items-center ml-12 mr-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition-all duration-300 hover:text-white whitespace-nowrap px-2 py-1 rounded-md ${
                  isActive ? 'text-white font-medium bg-white/5' : 'text-white/60 hover:bg-white/5'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
  
        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-[10px] font-bold tracking-widest uppercase text-white/50 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                {user.user_metadata?.role || 'Citizen'}
              </span>
              <button 
                onClick={handleLogout}
                className="rounded-full px-6 py-2.5 text-sm font-medium border border-white/10 backdrop-blur-md bg-white/5 text-white/80 hover:bg-white/20 transition-all duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="rounded-full px-6 py-2.5 text-sm font-medium border border-white/10 backdrop-blur-md bg-white/5 text-white/80 hover:bg-white/20 transition-all duration-300"
            >
              Login
            </Link>
          )}
          <Link 
            href="/#complaint-form" 
            className="hidden md:block rounded-full px-6 py-2.5 text-sm bg-gradient-aurora text-white font-bold hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 shadow-xl shadow-cyan-500/20"
          >
            {t('hero.submit_btn')}
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
