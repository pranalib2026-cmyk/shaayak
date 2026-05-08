'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageSquare, Cpu, Briefcase, CheckCircle2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Images for departments
const DEPARTMENTS = [
  { name: 'BBMP', img: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=600&auto=format&fit=crop' },
  { name: 'BESCOM', img: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=600&auto=format&fit=crop' },
  { name: 'BWSSB', img: 'https://images.unsplash.com/photo-1541888009-322198083bf2?q=80&w=600&auto=format&fit=crop' },
  { name: 'PWD', img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop' }
];

const PANELS = [
  {
    title: 'Report it.',
    desc: 'Citizen captures the issue. Location, timestamp, and context are automatically securely logged.',
    icon: MessageSquare,
    color: 'bg-blue-500',
    type: 'citizen'
  },
  {
    title: 'Verify it.',
    desc: 'Our AI Engine scans the submission for authenticity, categorizes the urgency, and builds a Trust Score.',
    icon: Cpu,
    color: 'bg-purple-500',
    type: 'ai'
  },
  {
    title: 'Route it.',
    desc: 'The verified task is immediately dispatched to the exact nodal officer at the responsible department.',
    icon: Briefcase,
    color: 'bg-orange-500',
    type: 'department'
  },
  {
    title: 'Resolve it.',
    desc: 'Field engineers upload visual proof of work. You approve the resolution, closing the accountability loop.',
    icon: CheckCircle2,
    color: 'bg-green-500',
    type: 'resolution'
  }
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const panels = gsap.utils.toArray('.story-panel');

    // Horizontal scroll animation
    gsap.to(panels, {
      xPercent: -100 * (panels.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1,
        snap: 1 / (panels.length - 1),
        // Base the end distance on the total width of all panels minus one viewport
        end: () => "+=" + (scrollWrapperRef.current?.scrollWidth! - window.innerWidth)
      }
    });

    // Parallax background elements
    gsap.to('.parallax-bg', {
      x: '-20%',
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        scrub: true,
        start: 'top top',
        end: 'bottom top'
      }
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative h-screen w-full bg-[#FAFAFA] overflow-hidden font-inter border-t border-black/5">

      {/* Cinematic Backgrounds */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="parallax-bg absolute top-[-20%] left-[10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] mix-blend-multiply" />
        <div className="parallax-bg absolute bottom-[-10%] right-[-10%] w-[1000px] h-[1000px] bg-secondary/10 rounded-full blur-[180px] mix-blend-multiply delay-100" />
      </div>

      <div ref={scrollWrapperRef} className="h-full w-[400vw] flex relative z-10">
        {PANELS.map((panel, idx) => {
          const Icon = panel.icon;
          return (
            <div key={idx} className="story-panel w-screen h-full flex flex-col justify-center items-center px-6 md:px-16 relative">
              <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                {/* Text Content */}
                <div className="space-y-8 relative z-20">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full glass border border-black/5 flex items-center justify-center bg-white/40 shadow-xl">
                      <span className="font-instrument text-2xl text-black">0{idx + 1}</span>
                    </div>
                    <div className="h-px w-24 bg-gradient-to-r from-black/20 to-transparent" />
                  </div>

                  <h2 className="font-instrument text-6xl md:text-8xl tracking-tighter text-black leading-none">
                    {panel.title}
                  </h2>
                  <p className="text-xl md:text-2xl text-black/50 font-light leading-relaxed max-w-lg">
                    {panel.desc}
                  </p>
                </div>

                {/* Visual Content based on Type */}
                <div className="relative z-10 w-full h-[400px] md:h-[500px] glass rounded-[3rem] border border-black/5 bg-white/30 backdrop-blur-3xl shadow-2xl shadow-black/5 p-8 flex items-center justify-center overflow-hidden group">

                  {/* Subtle pulsing background specific to panel */}
                  <div className={cn("absolute inset-0 opacity-20 blur-3xl mix-blend-multiply transition-transform duration-1000 group-hover:scale-110", panel.color)} />

                  {panel.type === 'citizen' && (
                    <div className="relative text-center space-y-6">
                      <div className="w-32 h-32 mx-auto rounded-3xl bg-white border border-black/10 shadow-2xl flex items-center justify-center animate-bounce-slow">
                        <MessageSquare className="w-12 h-12 text-black/80" />
                      </div>
                      <div className="glass px-6 py-3 rounded-full border border-black/5 bg-white/80 text-sm font-bold tracking-widest uppercase text-black/60 shadow-lg">
                        Location: Detected
                      </div>
                    </div>
                  )}

                  {panel.type === 'ai' && (
                    <div className="relative text-center space-y-8">
                      <div className="relative w-40 h-40 mx-auto">
                        <div className="absolute inset-0 rounded-full border border-black/10 animate-spin-slow" />
                        <div className="absolute inset-4 rounded-full border border-black/10 animate-spin-slow" style={{ animationDirection: 'reverse' }} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Cpu className="w-16 h-16 text-black/80" />
                        </div>
                      </div>
                      <div className="glass px-6 py-3 rounded-full border border-green-500/20 bg-green-50 text-sm font-bold tracking-widest uppercase text-green-700 shadow-lg flex items-center justify-center gap-2 w-fit mx-auto">
                        <CheckCircle2 className="w-4 h-4" />
                        98.4% Confidence
                      </div>
                    </div>
                  )}

                  {panel.type === 'department' && (
                    <div className="relative w-full h-full flex flex-col justify-center gap-4">
                      <div className="grid grid-cols-2 gap-4 h-full">
                        {DEPARTMENTS.map((dept, i) => (
                          <div key={dept.name} className="relative rounded-2xl overflow-hidden group/dept border border-black/5 shadow-sm">
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover/dept:scale-110" style={{ backgroundImage: `url(${dept.img})` }} />
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity group-hover/dept:opacity-60" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="font-bold text-white tracking-widest uppercase text-sm md:text-lg">{dept.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {panel.type === 'resolution' && (
                    <div className="relative text-center space-y-6 w-full">
                      <div className="w-48 h-48 mx-auto rounded-full bg-green-50 border border-green-200 shadow-[0_0_50px_rgba(34,197,94,0.2)] flex items-center justify-center relative">
                        <div className="absolute inset-0 rounded-full border-2 border-green-500 animate-ping opacity-20" />
                        <CheckCircle2 className="w-20 h-20 text-green-500" />
                      </div>
                      <h3 className="font-instrument text-4xl text-black">Issue Closed</h3>
                    </div>
                  )}

                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}