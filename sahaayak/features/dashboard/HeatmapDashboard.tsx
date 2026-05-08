'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { 
  Activity, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Search,
  Filter,
  ChevronRight,
  Bell,
  Target,
  Zap,
  Droplets,
  HardHat,
  Info
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Mock Data & Constants ---

const cities = [
  { name: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
  { name: 'Mysuru', lat: 12.2958, lng: 76.6394 },
  { name: 'Hubballi', lat: 15.3647, lng: 75.1240 },
  { name: 'Belagavi', lat: 15.8497, lng: 74.4977 },
  { name: 'Davanagere', lat: 14.4644, lng: 75.9218 },
];

const departments = ['BBMP', 'BESCOM', 'BWSSB', 'Karnataka PWD'];

const generateMockComplaints = (count: number) => {
  return Array.from({ length: count }).map((_, i) => {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const dept = departments[Math.floor(Math.random() * departments.length)];
    const category = dept === 'BBMP' ? 'Garbage' : dept === 'BESCOM' ? 'Electricity' : dept === 'BWSSB' ? 'Water' : 'Roads';
    
    return {
      id: `KA-${2000 + Math.floor(Math.random() * 5000)}`,
      title: `${category} issue fixed in ${city.name}`,
      category,
      department: dept,
      latitude: city.lat + (Math.random() - 0.5) * 0.5,
      longitude: city.lng + (Math.random() - 0.5) * 0.5,
      status: ['Pending', 'Resolved', 'In Progress'][Math.floor(Math.random() * 3)],
      intensity: Math.random(),
      timestamp: new Date(Date.now() - Math.random() * 10000000).toLocaleTimeString(),
      city: city.name,
      officer: 'Active',
      estResolution: '2 Days'
    };
  });
};

// --- Helpers ---
const getDeptColor = (dept: string) => {
  switch (dept) {
    case 'BBMP': return { 
      bg: 'bg-amber-500/10', 
      text: 'text-amber-600', 
      glow: 'shadow-amber-500/30',
      marker: 'bg-amber-500',
      icon: Activity
    };
    case 'BESCOM': return { 
      bg: 'bg-cyan-500/10', 
      text: 'text-cyan-600', 
      glow: 'shadow-cyan-500/30',
      marker: 'bg-cyan-500',
      icon: Zap
    };
    case 'BWSSB': return { 
      bg: 'bg-blue-600/10', 
      text: 'text-blue-700', 
      glow: 'shadow-blue-600/30',
      marker: 'bg-blue-600',
      icon: Droplets
    };
    case 'Karnataka PWD': return { 
      bg: 'bg-rose-500/10', 
      text: 'text-rose-600', 
      glow: 'shadow-rose-500/30',
      marker: 'bg-rose-500',
      icon: HardHat
    };
    default: return { 
      bg: 'bg-slate-500/10', 
      text: 'text-slate-600', 
      glow: 'shadow-slate-500/30',
      marker: 'bg-slate-500',
      icon: Info
    };
  }
};

const ActivityItem = ({ complaint }: any) => {
  const colors = getDeptColor(complaint.department);
  const Icon = colors.icon;
  return (
    <div className="flex gap-4 p-4 rounded-3xl hover:bg-white/80 transition-all group cursor-pointer border border-transparent hover:border-black/5 hover:shadow-xl hover:shadow-black/5 bg-white/40 backdrop-blur-md">
      <div className={cn(
        "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border border-black/5",
        colors.bg
      )}>
        <Icon className={cn("w-4 h-4", colors.text)} />
      </div>
      <div className="flex flex-col gap-0.5 overflow-hidden flex-1">
        <div className="flex justify-between items-center">
          <span className={cn("text-[8px] font-bold uppercase tracking-widest", colors.text)}>{complaint.department}</span>
          <span className="text-[8px] text-black/40 font-mono">{complaint.timestamp}</span>
        </div>
        <p className="text-xs font-medium text-black/80 truncate">{complaint.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className={cn("w-1.5 h-1.5 rounded-full", colors.marker, colors.glow, "animate-pulse")} />
          <span className="text-[8px] font-bold uppercase tracking-wider text-black/40">{complaint.status}</span>
        </div>
      </div>
    </div>
  );
};

// --- Main Dashboard ---

import { createClient } from '@/lib/supabase/client';

export default function HeatmapDashboard() {
  const supabase = createClient();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [viewState, setViewState] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
    zoom: 6.5,
  });
  const [activeDept, setActiveDept] = useState('All');
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const mapComplaint = (c: any) => ({
    id: c.complaint_id,
    title: c.title,
    category: c.category,
    department: c.department || 'General',
    latitude: c.location_lat || 12.9716 + (Math.random() - 0.5) * 0.1,
    longitude: c.location_lng || 77.5946 + (Math.random() - 0.5) * 0.1,
    status: c.status || 'Pending',
    intensity: (c.trust_score || 70) / 100,
    timestamp: new Date(c.created_at).toLocaleTimeString(),
    city: c.ward || 'Bengaluru',
    officer: 'Active',
    estResolution: '2 Days'
  });

  // Real Data Fetching + Realtime
  useEffect(() => {
    const fetchInitial = async () => {
      const res = await fetch('/api/complaints');
      const data = await res.json();
      if (data.success) {
        setComplaints(data.complaints.map(mapComplaint));
      }
    };

    fetchInitial();

    // Subscribe to new complaints
    const channel = supabase
      .channel('public:complaints')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'complaints' }, (payload) => {
        const newC = mapComplaint(payload.new);
        setComplaints(prev => [newC, ...prev.slice(0, 49)]);
        
        // Visual feedback
        gsap.fromTo('.reveal-card', { scale: 0.95 }, { scale: 1, duration: 0.5, ease: 'elastic.out' });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useGSAP(() => {
    gsap.from('.reveal-card', {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'expo.out',
      delay: 0.5
    });

    gsap.from('.watermark-text', {
      x: -100,
      opacity: 0,
      duration: 2,
      stagger: 0.2,
      ease: 'power4.out'
    });
  }, { scope: dashboardRef });

  const stats = useMemo(() => {
    const resolved = 12847 + Math.floor(Math.random() * 10);
    return { resolved, avgTime: '3.2 Days', efficiency: '94%', active: complaints.length };
  }, [complaints]);

  const filteredComplaints = useMemo(() => {
    if (activeDept === 'All') return complaints;
    return complaints.filter(c => c.department === activeDept);
  }, [complaints, activeDept]);

  return (
    <div ref={dashboardRef} className="relative w-full h-screen bg-[#FAFAFA] overflow-hidden flex flex-col font-inter">
      
      {/* BACKGROUND WATERMARK TEXT */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0 flex flex-col justify-center p-20 gap-20">
        <h1 className="watermark-text text-[15vw] font-black text-black/[0.02] leading-none tracking-tighter whitespace-nowrap -rotate-6 uppercase">CIVIC TRANSPARENCY</h1>
        <h1 className="watermark-text text-[15vw] font-black text-black/[0.02] leading-none tracking-tighter whitespace-nowrap rotate-3 uppercase translate-x-1/4">PUBLIC ACCOUNTABILITY</h1>
        <h1 className="watermark-text text-[15vw] font-black text-black/[0.02] leading-none tracking-tighter whitespace-nowrap -rotate-2 uppercase">SMART GOVERNANCE</h1>
      </div>

      {/* MAP IMPLEMENTATION */}
      <div className="absolute inset-0 z-0">
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
          style={{ width: '100%', height: '100%' }}
        >
          <NavigationControl position="top-right" />
          
          {filteredComplaints.map((c) => {
            const colors = getDeptColor(c.department);
            return (
              <Marker key={c.id} latitude={c.latitude} longitude={c.longitude} anchor="center">
                <div 
                  className="relative group cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedComplaint(c);
                  }}
                >
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 border-white shadow-2xl transition-all duration-300 group-hover:scale-150 z-10 relative",
                    colors.marker,
                    colors.glow
                  )} />
                  <div className={cn(
                    "absolute inset-0 rounded-full animate-ping opacity-50 scale-150",
                    colors.marker
                  )} />
                </div>
              </Marker>
            );
          })}
        </Map>
      </div>

      {/* TOP HEADER */}
      <header className="absolute top-8 left-1/2 -translate-x-1/2 z-20 w-full max-w-5xl px-8 flex gap-4">
        <div className="reveal-card flex-1 h-16 glass rounded-full border border-black/5 flex items-center px-8 gap-4 shadow-aurora">
          <Search className="w-5 h-5 text-black/20" />
          <input 
            type="text" 
            placeholder="Explore live civic pulse..." 
            className="bg-transparent border-none outline-none text-sm font-medium w-full text-black placeholder:text-black/20"
          />
        </div>
        <div className="reveal-card h-16 glass px-6 rounded-full border border-black/5 flex items-center gap-3 shadow-aurora">
          {['All', 'BBMP', 'BESCOM', 'BWSSB'].map(dept => (
            <button 
              key={dept}
              onClick={() => setActiveDept(dept)}
              className={cn(
                "px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                activeDept === dept ? "bg-black text-white" : "text-black/40 hover:text-black"
              )}
            >
              {dept}
            </button>
          ))}
        </div>
      </header>

      {/* LEFT FLOATING CARD */}
      <div className="absolute left-8 top-32 z-20 w-72 flex flex-col gap-4">
        <div className="reveal-card glass p-8 rounded-[2.5rem] border border-black/5 shadow-aurora flex flex-col gap-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Global Status</p>
          </div>
          <p className="text-3xl font-black tracking-tighter text-black">
            {stats.resolved.toLocaleString()} <span className="text-xs font-bold text-black/20 uppercase tracking-normal">Resolved</span>
          </p>
          <p className="text-xs font-medium text-black/60">
            Average Resolution Time: <span className="text-black font-bold">{stats.avgTime}</span>
          </p>
        </div>

        {/* CITY QUICK JUMP */}
        <div className="reveal-card glass p-6 rounded-[2.5rem] border border-black/5 shadow-aurora flex flex-col gap-3">
          <p className="text-[9px] font-black text-black/20 uppercase tracking-[0.3em] mb-1 px-2">City Centers</p>
          {cities.map(city => (
            <button 
              key={city.name}
              onClick={() => setViewState({ ...viewState, latitude: city.lat, longitude: city.lng, zoom: 12 })}
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-black/5 transition-all group"
            >
              <span className="text-xs font-bold text-black/60 group-hover:text-black">{city.name}</span>
              <ChevronRight className="w-4 h-4 text-black/10 group-hover:text-black group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT FLOATING CARD (Live Feed) */}
      <aside className="absolute right-8 top-32 bottom-32 w-80 z-20 hidden lg:flex flex-col gap-6">
        <div className="reveal-card glass flex-1 rounded-[3rem] border border-black/5 flex flex-col overflow-hidden shadow-aurora">
          <div className="p-8 border-b border-black/5 flex justify-between items-center bg-white/40">
            <h3 className="font-bold text-lg text-black tracking-tight">Active Pulse</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
              <span className="text-[9px] font-black uppercase text-black/20 tracking-widest">LIVE</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-2">
            {filteredComplaints.slice(0, 10).map(c => (
              <ActivityItem key={c.id} complaint={c} />
            ))}
          </div>
          <div className="p-6 bg-white/40 border-t border-black/5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-bold text-black/40 uppercase">Efficiency</span>
              <span className="text-sm font-black text-black">{stats.efficiency}</span>
            </div>
            <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
              <div className="h-full bg-black w-[94%]" />
            </div>
            <p className="text-[9px] text-black/30 mt-3 text-center font-medium">94% SUCCESS RATE ACROSS DEPARTMENTS</p>
          </div>
        </div>
      </aside>

      {/* COMPLAINT PREVIEW CARD (Selected) */}
      {selectedComplaint && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-4 animate-in fade-in zoom-in duration-300">
          <div className="glass p-8 rounded-[3rem] border border-white shadow-2xl shadow-black/20 relative">
            <button 
              onClick={() => setSelectedComplaint(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all"
            >
              ×
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div className={cn("w-14 h-14 rounded-3xl flex items-center justify-center", getDeptColor(selectedComplaint.department).bg)}>
                {React.createElement(getDeptColor(selectedComplaint.department).icon, { className: cn("w-6 h-6", getDeptColor(selectedComplaint.department).text) })}
              </div>
              <div>
                <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mb-1">Complaint ID: {selectedComplaint.id}</p>
                <h2 className="text-xl font-bold text-black tracking-tight leading-none">{selectedComplaint.department}</h2>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-bold text-black/20 uppercase tracking-widest mb-2">Subject</p>
                <p className="text-sm font-medium text-black/80 leading-relaxed">{selectedComplaint.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-black/5">
                  <p className="text-[9px] font-bold text-black/40 uppercase mb-1">Status</p>
                  <p className="text-xs font-bold text-black">{selectedComplaint.status}</p>
                </div>
                <div className="p-4 rounded-2xl bg-black/5">
                  <p className="text-[9px] font-bold text-black/40 uppercase mb-1">City</p>
                  <p className="text-xs font-bold text-black">{selectedComplaint.city}</p>
                </div>
                <div className="p-4 rounded-2xl bg-black/5">
                  <p className="text-[9px] font-bold text-black/40 uppercase mb-1">Assigned Officer</p>
                  <p className="text-xs font-bold text-black">{selectedComplaint.officer}</p>
                </div>
                <div className="p-4 rounded-2xl bg-black/5">
                  <p className="text-[9px] font-bold text-black/40 uppercase mb-1">Est. Resolution</p>
                  <p className="text-xs font-bold text-black">{selectedComplaint.estResolution}</p>
                </div>
              </div>

              <button className="w-full py-5 rounded-[2rem] bg-black text-white text-xs font-bold uppercase tracking-[0.2em] hover:scale-[1.02] transition-all shadow-xl shadow-black/20">
                Track Detailed Progress
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM LEFT LIVE UPDATE CARD */}
      <div className="absolute left-8 bottom-32 z-20 reveal-card">
        <div className="glass p-6 rounded-[2rem] border border-black/5 bg-white/80 shadow-aurora flex gap-4 items-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/20">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-black text-black">KA-2041</span>
              <div className="w-1 h-1 bg-black/20 rounded-full" />
              <span className="text-[10px] font-bold text-rose-600 uppercase">Road Damage</span>
            </div>
            <p className="text-[11px] font-medium text-black/60">Resolved by BBMP Roads Dept</p>
            <p className="text-[9px] text-black/30 font-bold mt-1">UPDATED 12 MINS AGO</p>
          </div>
        </div>
      </div>

      {/* BOTTOM RIGHT MINI MAP CARD (Issue Summary) */}
      <div className="absolute right-8 bottom-32 z-20 reveal-card">
        <div className="glass p-6 rounded-[2rem] border border-black/5 bg-white/80 shadow-aurora w-64">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black text-black uppercase tracking-tighter">Issue Hotspots</span>
            <div className="flex gap-1">
              <div className="w-1 h-1 rounded-full bg-rose-500" />
              <div className="w-1 h-1 rounded-full bg-amber-500" />
              <div className="w-1 h-1 rounded-full bg-blue-500" />
            </div>
          </div>
          <div className="space-y-3">
            {cities.slice(0, 4).map(city => (
              <div key={city.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-black/10" />
                  <span className="text-[11px] font-medium text-black/60">{city.name}</span>
                </div>
                <span className="text-[10px] font-bold text-black/20">{Math.floor(Math.random() * 50) + 10} Fixed</span>
              </div>
            ))}
          </div>
          <p className="text-[9px] font-bold text-black/20 mt-6 text-center tracking-widest border-t border-black/5 pt-4">LIVE KARNATAKA ISSUE MAP</p>
        </div>
      </div>

      {/* SCROLLING LIVE FEED (Ticker) */}
      <div className="absolute bottom-12 left-0 w-full z-30 bg-white/40 backdrop-blur-3xl border-y border-black/5 py-3 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center mx-12">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-4 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              <span className="text-[11px] font-bold text-black/60 tracking-tight uppercase">
                {cities[i % cities.length].name}: {['Pothole repaired', 'Water leakage fixed', 'Streetlights restored', 'Garbage cleared'][i % 4]}
              </span>
              <span className="mx-6 text-black/10">|</span>
            </div>
          ))}
          {/* Double for seamless loop */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`loop-${i}`} className="flex items-center mx-12">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-4 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              <span className="text-[11px] font-bold text-black/60 tracking-tight uppercase">
                {cities[i % cities.length].name}: {['Pothole repaired', 'Water leakage fixed', 'Streetlights restored', 'Garbage cleared'][i % 4]}
              </span>
              <span className="mx-6 text-black/10">|</span>
            </div>
          ))}
        </div>
      </div>

      {/* SMALL TAGLINES */}
      <div className="absolute bottom-4 left-0 w-full text-center z-30">
        <p className="text-[9px] font-black text-black/20 uppercase tracking-[0.5em] animate-pulse">
          Every complaint leaves a digital footprint • Accountability through Transparency
        </p>
      </div>

      {/* AESTHETIC OVERLAYS */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#FAFAFA] to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#FAFAFA] to-transparent" />
      </div>

    </div>
  );
}
