'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { 
  Search, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight, 
  Image as ImageIcon,
  AlertCircle,
  RotateCcw,
  Languages,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types & Mock Data ---

const timelineStages = [
  { id: 1, title: 'Submitted', sub: 'Complaint received', kn: 'ಸಲ್ಲಿಸಲಾಗಿದೆ' },
  { id: 2, title: 'AI Verified', sub: 'Validation complete', kn: 'AI ಪರಿಶೀಲಿಸಲಾಗಿದೆ' },
  { id: 3, title: 'Assigned', sub: 'Sent to Department', kn: 'ಇಲಾಖೆಗೆ ನಿಯೋಜಿಸಲಾಗಿದೆ' },
  { id: 4, title: 'Review', sub: 'BBMP/BESCOM Review', kn: 'ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ' },
  { id: 5, title: 'In Progress', sub: 'Work started', kn: 'ಪ್ರಗತಿಯಲ್ಲಿದೆ' },
  { id: 6, title: 'Work Proof', sub: 'Proof uploaded', kn: 'ಕೆಲಸದ ಪುರಾವೆ' },
  { id: 7, title: 'Citizen Verified', sub: 'Awaiting your approval', kn: 'ನಾಗರಿಕ ಪರಿಶೀಲನೆ' },
  { id: 8, title: 'Resolved', sub: 'Issue closed', kn: 'ಪರಿಹರಿಸಲಾಗಿದೆ' },
];

const mockComplaintData = {
  id: 'KA-2024-8842',
  title: 'Pothole at Indiranagar 100ft Road',
  category: 'Roads & Infrastructure',
  dept: 'BBMP',
  currentStage: 6,
  trustScore: 98.4,
  slaRemaining: '4h 12m',
  submittedAt: 'May 04, 2024',
  updates: [
    { time: '10:30 AM', text: 'Work proof uploaded by field engineer.' },
    { time: 'Yesterday', text: 'Materials dispatched to site.' },
    { time: 'May 05', text: 'Assigned to Ward 82 PWD Engineer.' },
  ],
  beforeImg: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=1000&auto=format&fit=crop',
  afterImg: 'https://images.unsplash.com/photo-1590132816551-c0683058869c?q=80&w=1000&auto=format&fit=crop'
};

// --- Sub-components ---

const BeforeAfterSlider = ({ before, after }: { before: string, after: string }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(Math.max(position, 0), 100));
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMove}
      onTouchMove={handleMove}
      className="relative w-full aspect-video rounded-3xl overflow-hidden cursor-ew-resize border border-black/5"
    >
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${after})` }} />
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: `url(${before})`, width: `${sliderPos}%` }} 
      />
      
      {/* Slider Bar */}
      <div className="absolute top-0 bottom-0 w-1 bg-white shadow-xl" style={{ left: `${sliderPos}%` }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-2xl flex items-center justify-center">
          <ArrowRight className="w-4 h-4 text-black rotate-180" />
          <ArrowRight className="w-4 h-4 text-black" />
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest">Before</div>
      <div className="absolute top-4 right-4 px-3 py-1 bg-primary/50 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest">After</div>
    </div>
  );
};

// --- Main Dashboard ---

// --- Main Dashboard ---

import { useTranslation } from '@/context/LanguageContext';

export default function TrackingExperience() {
  const { t, language } = useTranslation();
  const [searchId, setSearchId] = useState('');
  const [complaintData, setComplaintData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Initial reveals
    gsap.from('.reveal-item', {
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: 'power4.out'
    });

    // Floating animation for cards
    gsap.to('.floating-card', {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      stagger: 0.2
    });

    // Watermark reveal
    gsap.from('.watermark', {
      opacity: 0,
      x: -50,
      duration: 2,
      stagger: 0.3,
      ease: 'power2.out',
      delay: 0.5
    });

    if (complaintData) {
      gsap.from('.result-reveal', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out'
      });

      const stage = getStatusStage(complaintData.status);
      gsap.to('.timeline-glow', {
        x: (stage - 1) * 100 + '%',
        duration: 2,
        ease: 'power2.inOut'
      });
    }
  }, [complaintData]);

  const getStatusStage = (status: string) => {
    const mapping: Record<string, number> = {
      'pending': 1,
      'verified': 2,
      'assigned': 3,
      'review': 4,
      'in_progress': 5,
      'work_proof': 6,
      'citizen_verified': 7,
      'resolved': 8
    };
    return mapping[status] || 1;
  };

  const handleSearch = async () => {
    if (!searchId) return;
    setLoading(true);
    setError(null);
    setComplaintData(null);

    try {
      const res = await fetch(`/api/complaints?id=${searchId.toUpperCase()}`);
      const data = await res.json();

      if (data.success) {
        setComplaintData(data.complaint);
      } else {
        setError(data.error || 'Complaint not found');
      }
    } catch (err) {
      setError('Failed to fetch tracking data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={pageRef} className="relative min-h-screen w-full bg-[#FAFAFA] flex flex-col items-center pt-32 pb-24 px-6 overflow-hidden font-inter selection:bg-black selection:text-white">
      
      {/* Background Watermark Text */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <div className="watermark absolute top-[15%] -left-10 text-[12vw] font-instrument font-black text-black/[0.02] leading-none whitespace-nowrap uppercase">
          Civic Transparency
        </div>
        <div className="watermark absolute top-[35%] -right-10 text-[12vw] font-instrument font-black text-black/[0.02] leading-none whitespace-nowrap uppercase">
          Public Accountability
        </div>
        <div className="watermark absolute top-[55%] -left-10 text-[12vw] font-instrument font-black text-black/[0.02] leading-none whitespace-nowrap uppercase">
          Smart Governance
        </div>
        <div className="watermark absolute top-[75%] -right-10 text-[12vw] font-instrument font-black text-black/[0.02] leading-none whitespace-nowrap uppercase">
          Real-Time Resolution
        </div>
      </div>

      {/* Floating Aesthetics */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[150px] animate-pulse-soft" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-rose-500/20 rounded-full blur-[180px] animate-pulse-soft delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-500/10 rounded-full blur-[200px] pointer-events-none" />
      </div>

      {/* LEFT FLOATING CARD */}
      <div className="floating-card absolute left-12 top-48 z-20 hidden xl:flex flex-col gap-1 p-6 rounded-[2rem] bg-white/70 backdrop-blur-xl border border-white/40 shadow-aurora animate-float">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600/60">Network Status</span>
        </div>
        <p className="text-2xl font-instrument text-black leading-none">12,847</p>
        <p className="text-[10px] font-bold text-black/60 uppercase mb-3">Complaints Resolved</p>
        <div className="pt-3 border-t border-black/5">
          <p className="text-[10px] font-bold text-black/40 uppercase">Avg. Resolution</p>
          <p className="text-sm font-bold text-black">3.2 Days</p>
        </div>
      </div>

      {/* RIGHT FLOATING CARD */}
      <div className="floating-card absolute right-12 top-64 z-20 hidden xl:flex flex-col gap-1 p-6 rounded-[2rem] bg-white/70 backdrop-blur-xl border border-white/40 shadow-aurora w-48 animate-float" style={{ animationDelay: '1.5s' }}>
        <p className="text-[10px] font-bold text-peach-600/60 uppercase tracking-widest mb-2">Resolution Efficiency</p>
        <div className="relative h-24 w-24 mx-auto mb-2">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path className="stroke-black/5" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className="stroke-black transition-all duration-1000" strokeWidth="3" strokeDasharray="94, 100" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <text x="18" y="20.35" className="text-[8px] font-bold" textAnchor="middle" fill="black">94%</text>
          </svg>
        </div>
        <p className="text-[10px] font-bold text-center text-black/60 uppercase">Success Rate</p>
      </div>

      {/* BOTTOM LEFT LIVE UPDATE CARD */}
      <div className="floating-card absolute left-12 bottom-12 z-20 hidden lg:flex items-center gap-4 p-5 rounded-[2rem] bg-black/90 backdrop-blur-3xl border border-white/20 shadow-aurora animate-float">
        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shadow-[inset_0_0_15px_rgba(255,255,255,0.1)]">
          <AlertCircle className="w-6 h-6 text-violet-400 animate-pulse" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400">Live Update</span>
            <div className="w-1 h-1 rounded-full bg-violet-400 animate-ping" />
          </div>
          <p className="text-sm font-bold leading-tight text-white">KA-2024 • Road Damage</p>
          <p className="text-[10px] text-white/50">Resolved by BBMP Roads Dept • 12m ago</p>
        </div>
      </div>

      {/* BOTTOM RIGHT MINI MAP CARD */}
      <div className="floating-card absolute right-12 bottom-12 z-20 hidden lg:flex flex-col gap-4 p-5 rounded-[2rem] bg-white/80 backdrop-blur-3xl border border-white/40 shadow-aurora w-64 animate-float" style={{ animationDelay: '2.5s' }}>
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] font-bold uppercase tracking-tight text-rose-600/60">Live Karnataka Map</span>
          <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
        </div>
        <div className="h-32 w-full rounded-2xl bg-black/5 overflow-hidden relative border border-black/5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/e6/Karnataka_outline_map.svg')] bg-contain bg-no-repeat bg-center invert" />
          <div className="absolute top-[60%] left-[45%] w-1.5 h-1.5 rounded-full bg-black" />
          <div className="absolute top-[40%] left-[30%] w-1.5 h-1.5 rounded-full bg-black/40" />
          <div className="absolute top-[65%] left-[35%] w-1.5 h-1.5 rounded-full bg-black/40" />
          <div className="absolute top-[35%] left-[25%] w-1.5 h-1.5 rounded-full bg-black/40" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {['Bengaluru', 'Hubballi', 'Mysuru', 'Belagavi'].map(city => (
            <div key={city} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-black/20" />
              <span className="text-[9px] font-medium text-black/60">{city}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-5xl w-full flex flex-col items-center gap-12">
        
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="reveal-item flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-black/5 backdrop-blur-md w-fit mx-auto shadow-aurora">
            <ShieldCheck className="w-4 h-4 text-purple-500 animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-gradient-aurora">
              Civic Accountability Engine
            </span>
          </div>
          <h1 className="reveal-item font-instrument text-5xl md:text-8xl tracking-tight text-black leading-none">
            Track your <span className="text-gradient-aurora italic">impact.</span>
          </h1>
          
          <div className="reveal-item flex flex-col gap-2 mt-4">
             <p className="text-sm text-black/40 font-medium">Every complaint leaves a digital footprint.</p>
             <div className="flex gap-4 justify-center">
                {['AI-Powered Routing', 'Geo-Tagged Evidence', 'Live Status Sync'].map(label => (
                   <span key={label} className="text-[9px] font-bold uppercase tracking-widest text-black/30 border border-black/5 px-2 py-0.5 rounded-md">{label}</span>
                ))}
             </div>
          </div>

          {/* Search Bar */}
          <div className="reveal-item max-w-2xl mx-auto mt-12 flex flex-col gap-3">
            <div className="flex gap-3 p-2 rounded-full bg-white border border-black/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
              <div className="flex-1 flex items-center gap-4 px-6">
                <Search className="w-5 h-5 text-black/20" />
                <input 
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder={language === 'en' ? "Enter Complaint ID (e.g. KA-2024-8842)" : "ದೂರು ಐಡಿ ನಮೂದಿಸಿ (ಉದಾ. KA-2024-8842)"}
                  className="bg-transparent border-none outline-none text-base font-medium w-full text-black placeholder:text-black/20"
                />
              </div>
              <button 
                onClick={handleSearch}
                disabled={loading}
                className="bg-black text-white rounded-full px-12 py-5 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (language === 'en' ? 'Searching...' : 'ಹುಡುಕಲಾಗುತ್ತಿದೆ...') : (language === 'en' ? 'Track Now' : 'ಈಗ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {error && <p className="text-red-500 text-xs font-bold uppercase tracking-widest animate-pulse">{error}</p>}
          </div>

          <div className="reveal-item flex gap-8 justify-center mt-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-black/30">Built for accountability, not bureaucracy.</p>
          </div>
        </div>

        {complaintData ? (
          <div className="result-reveal w-full space-y-8">
            
            {/* Main Tracking Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 via-rose-500/30 to-peach-500/30 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[3rem]" />
              <div className="glass rounded-[3rem] p-8 md:p-16 border border-white/40 bg-white/40 backdrop-blur-3xl shadow-aurora relative overflow-hidden">
              
              {/* Card Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-tighter bg-black text-white px-2 py-1 rounded-md">ID: {complaintData.complaint_id}</span>
                    <span className="text-[10px] font-bold uppercase tracking-tighter text-black/40">{complaintData.category}</span>
                  </div>
                  <h2 className="font-instrument text-5xl text-black leading-none max-w-2xl">{complaintData.description.slice(0, 50)}{complaintData.description.length > 50 ? '...' : ''}</h2>
                </div>
                
                <div className="flex gap-4">
                  <div className="glass p-4 rounded-2xl border border-black/5 bg-white/40 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary-dark" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-black/40 uppercase">Status</span>
                      <span className="text-sm font-bold text-black uppercase">{complaintData.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative mb-20">
                <div className="absolute top-4 left-0 right-0 h-1 bg-black/5 rounded-full overflow-hidden">
                  <div className="timeline-glow absolute top-0 left-0 h-full w-[12.5%] bg-black transition-all" />
                </div>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-4 relative">
                  {timelineStages.map((stage) => {
                    const currentStageIdx = getStatusStage(complaintData.status);
                    return (
                      <div key={stage.id} className="flex flex-col items-center gap-4 group">
                        <div className={cn(
                          "w-8 h-8 rounded-full border-2 z-10 transition-all duration-500 flex items-center justify-center",
                          stage.id <= currentStageIdx
                            ? "bg-black border-black shadow-[0_0_15px_rgba(0,0,0,0.2)]" 
                            : "bg-white border-black/10 group-hover:border-black/30"
                        )}>
                          {stage.id < currentStageIdx ? (
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          ) : (
                            <span className={cn("text-[10px] font-bold", stage.id <= currentStageIdx ? "text-white" : "text-black/20")}>
                              {stage.id}
                            </span>
                          )}
                        </div>
                        <div className="text-center">
                          <p className={cn(
                            "text-[9px] font-bold uppercase tracking-tighter transition-colors",
                            stage.id <= currentStageIdx ? "text-black" : "text-black/30"
                          )}>
                            {language === 'en' ? stage.title : stage.kn}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                
                {/* Proof Section */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-instrument text-2xl text-black">Resolution Evidence</h3>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-[10px] font-bold text-green-700 border border-green-200">
                      <ImageIcon className="w-3 h-3" />
                      OFFICIAL RECORDS
                    </div>
                  </div>
                  {complaintData.complaint_media && complaintData.complaint_media.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        {complaintData.complaint_media.map((media: any) => (
                           <div key={media.id} className="relative aspect-video rounded-3xl overflow-hidden border border-black/5 bg-black/5">
                              {media.media_type === 'video' ? (
                                <video src={media.media_url} controls className="w-full h-full object-cover" />
                              ) : (
                                <img src={media.media_url} className="w-full h-full object-cover" alt="Evidence" />
                              )}
                           </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video rounded-3xl bg-black/5 border border-dashed border-black/10 flex flex-col items-center justify-center gap-3">
                       <ImageIcon className="w-12 h-12 text-black/10" />
                       <p className="text-[10px] font-bold uppercase tracking-widest text-black/20">No media uploaded yet</p>
                    </div>
                  )}
                  <p className="text-[10px] text-black/40 italic text-center uppercase tracking-widest">Geo-tagged visual proof from the field</p>
                </div>

                {/* Status & Verification */}
                <div className="space-y-8">
                  
                  {/* Detailed Preview Info */}
                  <div className="p-8 rounded-[2rem] bg-black/5 border border-black/5 grid grid-cols-2 gap-8">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-black/40">Category</span>
                      <span className="text-xs font-bold text-black uppercase">{complaintData.category}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-black/40">Priority</span>
                      <span className={cn(
                        "text-xs font-bold uppercase flex items-center gap-2",
                        complaintData.priority === 'high' ? 'text-red-500' : 'text-black'
                      )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full", complaintData.priority === 'high' ? 'bg-red-500' : 'bg-green-500')} />
                        {complaintData.priority}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-black/40">AI Trust Score</span>
                      <span className="text-xs font-bold text-black uppercase">{complaintData.trust_score}%</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-black/40">Submitted On</span>
                      <span className="text-xs font-bold text-black uppercase">{new Date(complaintData.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Activity Feed */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Live Execution Stream</p>
                    <div className="space-y-3">
                      {complaintData.complaint_updates && complaintData.complaint_updates.length > 0 ? (
                        complaintData.complaint_updates.map((update: any, i: number) => (
                          <div key={i} className="flex justify-between items-center p-4 rounded-2xl border border-black/5 bg-white/40 hover:bg-white transition-all cursor-default">
                            <span className="text-xs font-medium text-black/80">{update.update_text}</span>
                            <span className="text-[9px] font-bold text-black/30">{new Date(update.created_at).toLocaleTimeString()}</span>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 rounded-2xl border border-black/5 bg-white/20 text-center">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-black/20">Awaiting department updates</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Verification CTA */}
                  <div className="flex gap-4 pt-4">
                    <button className="flex-1 rounded-full py-5 text-sm font-bold bg-black text-white hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-widest">
                      Verify Resolution
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button className="flex-1 rounded-full py-5 text-sm font-bold border border-black/10 text-black hover:bg-black/5 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-widest">
                      Escalate Issue
                      <AlertCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              </div>
            </div>

            {/* AI Tags Section */}
            <div className="flex flex-wrap gap-4 justify-center">
              {['Smart Department Allocation', 'Duplicate Complaint Detection', 'AI Content Verification'].map(feature => (
                <div key={feature} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-black/5 text-[9px] font-bold uppercase tracking-widest text-black/40">
                  <Sparkles className="w-3 h-3" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Placeholder View / Preview Card */
          <div className="reveal-item w-full max-w-sm p-8 rounded-[2.5rem] bg-white border border-black/5 shadow-2xl shadow-black/5 flex flex-col gap-6 items-center opacity-60">
             <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center">
                <Search className="w-8 h-8 text-black/10" />
             </div>
             <div className="text-center space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">Waiting for Input</p>
                <p className="text-sm font-medium text-black/60">Enter a valid ID above to see the real-time execution flow.</p>
             </div>
          </div>
        )}

        <div className="reveal-item flex flex-col items-center gap-4 mt-8">
           <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">Every complaint leaves a digital footprint</p>
           <p className="text-[10px] font-bold uppercase tracking-widest text-black/20">Transparency powered by technology • Real-time Civic Accountability</p>
        </div>

      </div>

      {/* SCROLLING LIVE FEED */}
      <div className="fixed bottom-0 left-0 right-0 z-50 h-10 bg-white/80 backdrop-blur-md border-t border-black/5 flex items-center overflow-hidden">
        <div className="flex items-center gap-8 animate-marquee whitespace-nowrap px-8">
          {[
            'Water leakage fixed in Mysuru',
            'Streetlights restored in Hubballi',
            'Garbage cleared in Bengaluru',
            'Pothole repaired in Davanagere',
            'Public park cleanup completed in Belagavi',
            'KA-2041 Resolved by BBMP Roads Dept'
          ].map((text, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-black/60">{text}</span>
              <span className="text-black/10 mx-4">•</span>
            </div>
          ))}
        </div>
        {/* Duplicate for seamless scroll */}
        <div className="flex items-center gap-8 animate-marquee whitespace-nowrap px-8" aria-hidden="true">
          {[
            'Water leakage fixed in Mysuru',
            'Streetlights restored in Hubballi',
            'Garbage cleared in Bengaluru',
            'Pothole repaired in Davanagere',
            'Public park cleanup completed in Belagavi',
            'KA-2041 Resolved by BBMP Roads Dept'
          ].map((text, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-black/60">{text}</span>
              <span className="text-black/10 mx-4">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* Styles for Marquee */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>

    </div>
  );
}
