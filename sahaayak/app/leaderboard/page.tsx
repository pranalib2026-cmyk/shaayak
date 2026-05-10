'use client';

import React, { useState, useEffect } from 'react';
import Navbar from "@/components/ui/Navbar";
import { useTranslation } from '@/context/LanguageContext';
import { Trophy, Medal, Star, ShieldCheck, Flame, ArrowUp } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function LeaderboardPage() {
  const { t } = useTranslation();
  const [leaders, setLeaders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const res = await fetch('/api/users/leaderboard');
        const data = await res.json();
        if (data.success) {
          setLeaders(data.leaderboard);
        }
      } catch (err) {
        console.error('Leaderboard Fetch Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaders();
  }, []);

  useGSAP(() => {
    if (!isLoading) {
      gsap.from('.leader-card', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
      });
    }
  }, [isLoading]);

  return (
    <main className="relative min-h-screen w-full bg-[#0a0a0c] text-white font-inter">
      <Navbar />
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/50">
              Civic Heroes
            </span>
          </div>
          <h1 className="font-instrument text-6xl md:text-8xl mb-4">
            Karnataka's <span className="text-gradient-aurora italic">Leaders</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Honoring the citizens who go above and beyond to report issues and improve our state.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {leaders.map((leader, index) => (
              <div 
                key={leader.user_id}
                className="leader-card glass group flex items-center justify-between p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 flex items-center justify-center font-instrument text-3xl text-white/20">
                    {index + 1}
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-aurora opacity-0 group-hover:opacity-20 transition-opacity" />
                    {index === 0 ? <Trophy className="w-8 h-8 text-yellow-500" /> : 
                     index === 1 ? <Medal className="w-8 h-8 text-slate-300" /> :
                     index === 2 ? <Medal className="w-8 h-8 text-amber-600" /> :
                     <Star className="w-8 h-8 text-white/40" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-xl group-hover:text-cyan-400 transition-colors">
                      {leader.full_name || 'Citizen Hero'}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                        {leader.total_complaints} Contributions
                      </span>
                      <div className="w-1 h-1 bg-white/20 rounded-full" />
                      <div className="flex items-center gap-1 text-cyan-400">
                        <ShieldCheck className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase">Verified</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end mb-1">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <span className="font-instrument text-4xl text-gradient-aurora">
                      {leader.reputation_points}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 justify-end text-green-400">
                    <ArrowUp className="w-3 h-3" />
                    <span className="text-[10px] font-bold">Trending</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Decorative Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-fuchsia-500/10 rounded-full blur-[150px] pointer-events-none" />
    </main>
  );
}
