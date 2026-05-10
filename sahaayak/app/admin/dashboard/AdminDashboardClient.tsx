'use client';

import React, { useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import {
  LogOut,
  Settings,
  Users,
  AlertCircle,
  Activity,
  MapPin,
  Search,
  Bell,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const GlassCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`glass border border-white/20 bg-white/40 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl shadow-black/5 ${className}`}>
    {children}
  </div>
);

export default function AdminDashboardClient({ user }: { user: any }) {
  const supabase = createClient();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useGSAP(() => {
    if (!isLoaded) return;

    const tl = gsap.timeline();

    tl.from('.dashboard-reveal', {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: 'power4.out'
    });

    gsap.to('.blob-1', {
      x: '10%',
      y: '10%',
      duration: 20,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    gsap.to('.blob-2', {
      x: '-10%',
      y: '-10%',
      duration: 25,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 2
    });
  }, [isLoaded]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const stats = [
    { label: 'Pending Reviews', value: '1,248', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Resolved Today', value: '342', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'High Priority', value: '89', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
    { label: 'Active Personnel', value: '412', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' }
  ];

  const recentActivity = [
    { id: 'CMP-8924', type: 'Water Supply', location: 'Indiranagar, Ward 71', status: 'Pending Verification', time: '10 mins ago' },
    { id: 'CMP-8923', type: 'Road Maintenance', location: 'Koramangala, Ward 68', status: 'Assigned to PWD', time: '25 mins ago' },
    { id: 'CMP-8922', type: 'Street Light', location: 'Jayanagar, Ward 54', status: 'Resolved', time: '1 hour ago' },
    { id: 'CMP-8921', type: 'Garbage Collection', location: 'Malleswaram, Ward 45', status: 'In Progress', time: '2 hours ago' },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#FAFAFA] overflow-hidden font-inter flex flex-col md:flex-row">

      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden fixed">
        <div className="blob-1 absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-400/10 rounded-full blur-[150px] mix-blend-multiply" />
        <div className="blob-2 absolute bottom-[-10%] right-[-10%] w-[1000px] h-[1000px] bg-pink-400/10 rounded-full blur-[180px] mix-blend-multiply" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-blue-50/50 via-transparent to-pink-50/50 opacity-50" />
      </div>

      {/* Sidebar */}
      <aside className="w-full md:w-80 h-auto md:h-screen sticky top-0 z-20 p-6 flex flex-col gap-8 dashboard-reveal">
        <GlassCard className="flex-1 p-6 flex flex-col h-full border-white/40">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="font-instrument text-2xl leading-none">Sahaayak</h2>
              <span className="text-[10px] font-bold tracking-widest uppercase text-black/40">Admin Portal</span>
            </div>
          </div>

          <nav className="space-y-2 flex-1">
            {[
              { icon: Activity, label: 'Overview', active: true },
              { icon: MapPin, label: 'Live Heatmap' },
              { icon: Building, label: 'Departments' },
              { icon: Users, label: 'Citizens' },
              { icon: Settings, label: 'Settings' }
            ].map((item, i) => (
              <button
                key={i}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${item.active
                    ? 'bg-black text-white shadow-lg'
                    : 'text-black/60 hover:bg-white/50 hover:text-black'
                  }`}
              >
                <item.icon size={18} />
                <span className="text-sm font-bold">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-black/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold truncate">{user?.user_metadata?.full_name || 'Official Admin'}</div>
                <div className="text-[10px] text-black/40 truncate">{user?.email}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all font-bold text-sm"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </GlassCard>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 pt-0 md:pt-6 z-10">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 dashboard-reveal">
            <div>
              <h1 className="font-instrument text-5xl tracking-tight">Dashboard Overview</h1>
              <p className="text-black/50">Karnataka Civic Operations Center</p>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" />
                <input
                  type="text"
                  placeholder="Search Complaints..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/40 border border-black/5 rounded-full py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:bg-white transition-all backdrop-blur-md"
                />
              </div>
              <button className="w-12 h-12 rounded-full glass border border-black/5 flex items-center justify-center bg-white/40 hover:bg-white transition-all relative">
                <Bell size={18} />
                <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 dashboard-reveal">
            {stats.map((stat, i) => (
              <GlassCard key={i} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                    <stat.icon size={24} />
                  </div>
                </div>
                <div className="text-4xl font-instrument mb-1">{stat.value}</div>
                <div className="text-xs font-bold tracking-widest uppercase text-black/40">{stat.label}</div>
              </GlassCard>
            ))}
          </div>

          {/* Activity Feed */}
          <GlassCard className="p-8 dashboard-reveal">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-instrument text-3xl">Recent Activity</h3>
              <button className="text-sm font-bold text-black/60 hover:text-black transition-colors">View All</button>
            </div>

            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-black/5 bg-white/20 hover:bg-white/40 transition-all gap-4">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center font-bold text-xs">
                      {activity.id.split('-')[1]}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{activity.type}</div>
                      <div className="text-xs text-black/50">{activity.location}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${activity.status === 'Resolved' ? 'bg-green-500' :
                          activity.status === 'In Progress' ? 'bg-blue-500' :
                            'bg-orange-500'
                        }`}></span>
                      <span className="text-xs font-bold text-black/60">{activity.status}</span>
                    </div>
                    <div className="text-xs text-black/40">{activity.time}</div>
                    <button className="px-4 py-2 bg-white rounded-lg border border-black/5 text-xs font-bold shadow-sm hover:shadow-md transition-all">
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

        </div>
      </main>

    </div>
  );
} 