'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  MessageSquare, Cpu, Briefcase, CheckCircle2,
  MapPin, Camera, ShieldCheck, Zap, AlertTriangle,
  ArrowRight, Star, Clock, Users
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DEPARTMENTS = [
  { name: 'BBMP', label: 'Solid Waste & Roads', img: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=600&auto=format&fit=crop' },
  { name: 'BESCOM', label: 'Electricity', img: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=600&auto=format&fit=crop' },
  { name: 'BWSSB', label: 'Water & Sanitation', img: 'https://images.unsplash.com/photo-1541888009-322198083bf2?q=80&w=600&auto=format&fit=crop' },
  { name: 'PWD', label: 'Public Works', img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop' }
];

const PANELS = [
  {
    step: '01',
    title: 'Report it.',
    subtitle: 'Every civic problem deserves a voice.',
    desc: 'A citizen spots an issue — a pothole, broken streetlight, or overflowing drain. Using Sahaayak, they file a structured report in under 60 seconds. GPS coordinates, timestamp, and category are auto-captured.',
    bullets: [
      { icon: MapPin, text: 'Automatic GPS location tagging' },
      { icon: Camera, text: 'Photo & video evidence upload (up to 3 files)' },
      { icon: ShieldCheck, text: 'Anonymous posting option for sensitive issues' },
      { icon: MessageSquare, text: 'Bilingual support — English & Kannada' },
    ],
    icon: MessageSquare,
    gradient: 'from-cyan-500/20 to-blue-500/20',
    accent: 'text-cyan-400',
    border: 'border-cyan-500/20',
    type: 'citizen'
  },
  {
    step: '02',
    title: 'Verify it.',
    subtitle: 'AI that cuts through noise instantly.',
    desc: 'Our multi-layer AI engine processes every submission in real time. It scans the description and media for authenticity, checks for duplicates within the same ward, and generates a Trust Score from 0–100.',
    bullets: [
      { icon: Cpu, text: 'AI classifies issue type and assigns responsible dept' },
      { icon: AlertTriangle, text: 'Duplicate detection across same ward & category' },
      { icon: Star, text: 'Trust Score based on description quality, photo, GPS & reputation' },
      { icon: Zap, text: 'Priority assigned: Low / Medium / High / Critical' },
    ],
    icon: Cpu,
    gradient: 'from-purple-500/20 to-fuchsia-500/20',
    accent: 'text-purple-400',
    border: 'border-purple-500/20',
    type: 'ai'
  },
  {
    step: '03',
    title: 'Route it.',
    subtitle: 'Zero manual handoffs. Instant dispatch.',
    desc: 'The verified complaint is automatically routed to the nodal officer at the exact responsible department — BBMP, BESCOM, BWSSB, or PWD. SLA timers begin the moment it lands in their queue.',
    bullets: [
      { icon: Briefcase, text: 'Auto-routed to correct department in <30 seconds' },
      { icon: Clock, text: 'SLA countdown begins immediately on assignment' },
      { icon: Users, text: 'Nodal officer notified with complaint ID & priority' },
      { icon: ArrowRight, text: 'Full complaint thread visible to officer in admin panel' },
    ],
    icon: Briefcase,
    gradient: 'from-orange-500/20 to-amber-500/20',
    accent: 'text-orange-400',
    border: 'border-orange-500/20',
    type: 'department'
  },
  {
    step: '04',
    title: 'Resolve it.',
    subtitle: 'Accountability closed by the citizen.',
    desc: "Field engineers upload photo proof of completed work directly into the platform. The original reporter receives a notification and gets to confirm whether the issue was genuinely fixed — or flag it as still unresolved.",
    bullets: [
      { icon: Camera, text: 'Engineers upload before/after photo evidence' },
      { icon: CheckCircle2, text: 'AI verifies work proof and boosts Trust Score' },
      { icon: Star, text: 'Citizen confirms resolution — or disputes it to reopen' },
      { icon: Zap, text: 'Department gets scored on leaderboard for response speed' },
    ],
    icon: CheckCircle2,
    gradient: 'from-green-500/20 to-emerald-500/20',
    accent: 'text-green-400',
    border: 'border-green-500/20',
    type: 'resolution'
  }
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const panels = gsap.utils.toArray('.story-panel');

    gsap.to(panels, {
      xPercent: -100 * (panels.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1,
        snap: 1 / (panels.length - 1),
        end: () => '+=' + (scrollWrapperRef.current?.scrollWidth! - window.innerWidth)
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative h-screen w-full bg-[#0a0a0c] overflow-hidden font-inter border-t border-white/5">

      {/* Background glows */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[10%] w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[1000px] h-[1000px] bg-cyan-500/5 rounded-full blur-[180px]" />
      </div>

      {/* Progress indicator */}
      <div className="absolute top-28 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {PANELS.map((p, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className={cn('text-[10px] font-black uppercase tracking-[0.2em]', p.accent)}>{p.step}</span>
              <span className="text-[10px] text-white/20 uppercase tracking-widest hidden sm:block">{p.title.replace('.', '')}</span>
            </div>
            {i < PANELS.length - 1 && <div className="w-8 h-px bg-white/10" />}
          </div>
        ))}
      </div>

      <div ref={scrollWrapperRef} className="h-full w-[400vw] flex relative z-10">
        {PANELS.map((panel, idx) => {
          const Icon = panel.icon;
          return (
            <div key={idx} className="story-panel w-screen h-full flex flex-col justify-center items-center px-6 md:px-16 relative">
              <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                {/* Left: Text Content */}
                <div className="space-y-8 relative z-20">
                  {/* Step badge */}
                  <div className="flex items-center gap-4">
                    <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center border backdrop-blur-md bg-white/5', panel.border)}>
                      <span className={cn('font-instrument text-xl font-bold', panel.accent)}>{panel.step}</span>
                    </div>
                    <div className="h-px w-16 bg-gradient-to-r from-white/20 to-transparent" />
                  </div>

                  {/* Headline */}
                  <div>
                    <p className={cn('text-xs font-bold uppercase tracking-[0.25em] mb-3', panel.accent)}>{panel.subtitle}</p>
                    <h2 className="font-instrument text-6xl md:text-8xl tracking-tighter text-white leading-none">
                      {panel.title}
                    </h2>
                  </div>

                  {/* Description */}
                  <p className="text-lg text-white/50 font-light leading-relaxed max-w-lg">
                    {panel.desc}
                  </p>

                  {/* Bullet points */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {panel.bullets.map((bullet, bi) => {
                      const BIcon = bullet.icon;
                      return (
                        <div key={bi} className={cn('flex items-start gap-3 p-3 rounded-xl border bg-white/[0.03] backdrop-blur-sm', panel.border)}>
                          <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-white/5 border', panel.border)}>
                            <BIcon className={cn('w-3.5 h-3.5', panel.accent)} />
                          </div>
                          <span className="text-xs text-white/60 leading-relaxed">{bullet.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right: Visual Panel */}
                <div className={cn('relative z-10 w-full h-[420px] md:h-[520px] rounded-[3rem] border bg-white/[0.03] backdrop-blur-3xl p-8 flex items-center justify-center overflow-hidden group', panel.border)}>
                  {/* Gradient glow inside card */}
                  <div className={cn('absolute inset-0 bg-gradient-to-br opacity-30 blur-2xl', panel.gradient)} />

                  {/* Panel 1: Report */}
                  {panel.type === 'citizen' && (
                    <div className="relative w-full h-full flex flex-col justify-between">
                      {/* Mock form */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-6">
                          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Live Submission</span>
                        </div>
                        {['Category: Roads / BBMP', 'Description: Pothole on MG Road near Brigade...', 'Media: photo_evidence.jpg (2.4MB)'].map((item, i) => (
                          <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                            <span className="text-xs text-white/60 truncate">{item}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-green-400" />
                          <span className="text-xs font-bold text-green-400">GPS ACTIVE</span>
                        </div>
                        <span className="text-[10px] text-white/40">12.9716° N, 77.5946° E</span>
                      </div>
                    </div>
                  )}

                  {/* Panel 2: AI Verify */}
                  {panel.type === 'ai' && (
                    <div className="relative text-center space-y-6 w-full">
                      <div className="relative w-36 h-36 mx-auto">
                        <div className="absolute inset-0 rounded-full border border-purple-500/30 animate-spin-slow" />
                        <div className="absolute inset-4 rounded-full border border-purple-500/20 animate-spin-slow" style={{ animationDirection: 'reverse' }} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Cpu className="w-14 h-14 text-purple-400" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: 'Trust Score', value: '87/100', color: 'text-cyan-400' },
                          { label: 'Priority', value: 'HIGH', color: 'text-orange-400' },
                          { label: 'Duplicate', value: 'No', color: 'text-green-400' },
                          { label: 'Confidence', value: '98.4%', color: 'text-purple-400' },
                        ].map((stat, i) => (
                          <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{stat.label}</p>
                            <p className={cn('text-sm font-black', stat.color)}>{stat.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Panel 3: Route to department */}
                  {panel.type === 'department' && (
                    <div className="relative w-full h-full flex flex-col justify-center gap-4">
                      <div className="grid grid-cols-2 gap-3 h-full">
                        {DEPARTMENTS.map((dept) => (
                          <div key={dept.name} className="relative rounded-2xl overflow-hidden group/dept border border-white/10">
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover/dept:scale-110" style={{ backgroundImage: `url(${dept.img})` }} />
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                              <span className="font-black text-white tracking-widest uppercase text-sm">{dept.name}</span>
                              <span className="text-[10px] text-white/50">{dept.label}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Panel 4: Resolve */}
                  {panel.type === 'resolution' && (
                    <div className="relative text-center space-y-6 w-full">
                      <div className="w-40 h-40 mx-auto rounded-full bg-green-500/10 border border-green-500/30 shadow-[0_0_60px_rgba(34,197,94,0.15)] flex items-center justify-center relative">
                        <div className="absolute inset-0 rounded-full border-2 border-green-500/30 animate-ping opacity-30" />
                        <CheckCircle2 className="w-16 h-16 text-green-400" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-instrument text-3xl text-white">Issue Closed</h3>
                        <p className="text-sm text-white/40">Citizen verified • 2 days 4 hrs</p>
                      </div>
                      <div className="flex justify-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                          <Star className="w-3.5 h-3.5 text-green-400" />
                          <span className="text-xs font-bold text-green-400">+25 Dept Score</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                          <Zap className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="text-xs font-bold text-white/60">SLA Met</span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Scroll hint on last panel */}
              {idx === 0 && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 animate-pulse">
                  <span className="text-[10px] text-white/20 uppercase tracking-widest">Scroll to explore</span>
                  <ArrowRight className="w-3 h-3 text-white/20" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}