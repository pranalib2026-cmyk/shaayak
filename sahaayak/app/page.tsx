'use client';

import Navbar from "../components/ui/Navbar";
import CinematicVideo from "../components/background-video/CinematicVideo";
import ComplaintSection from "../features/complaints/ComplaintSection";
import LanguageSwitcher from "../components/ui/LanguageSwitcher";
import { useTranslation } from "@/context/LanguageContext";

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="relative min-h-screen w-full bg-[#0a0a0c]">
      {/* Background Layer */}
      <CinematicVideo src="https://www.pexels.com/download/video/34645692/" />

      {/* Navbar */}
      <Navbar />

      {/* Hero Content */}
      <section
        className="relative z-10 flex flex-col items-center justify-center text-center px-6"
        style={{ paddingTop: 'calc(16rem - 75px)', paddingBottom: '14rem' }}
      >
        <div className="animate-fade-rise mb-2">
          <span className="font-instrument text-7xl md:text-[10rem] font-normal text-gradient-aurora tracking-tighter leading-none">
            Sahaayak
          </span>
        </div>

        <div className="animate-fade-rise flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50">
            {t('hero.badge')}
          </span>
        </div>

        <h1 className="animate-fade-rise font-instrument text-5xl sm:text-7xl md:text-8xl max-w-7xl font-normal leading-[0.95] tracking-[-2.46px] text-white">
          Turning civic <span className="text-gradient-aurora italic">voices</span> into <br />
          <span className="text-gradient-aurora italic">visible action.</span>
        </h1>

        <p className="animate-fade-rise-delay font-inter text-base sm:text-lg max-w-2xl mt-8 leading-relaxed text-white/60">
          {t('hero.subtitle')}
        </p>

        <div className="animate-fade-rise-delay-2 mt-12 flex gap-4 flex-wrap justify-center font-inter">
          <button
            onClick={() => {
              document.getElementById('complaint-form')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="rounded-full px-14 py-5 text-base bg-white text-black font-bold hover:scale-[1.03] transition-all duration-300 shadow-xl shadow-white/5"
          >
            {t('hero.submit_btn')}
          </button>
          <button
            onClick={() => {
              window.location.href = '/dashboard';
            }}
            className="rounded-full px-14 py-5 text-base border border-white/10 text-white bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300"
          >
            {t('hero.track_btn')}
          </button>
        </div>
      </section>

      {/* Complaint Section */}
      <div id="complaint-form">
        <ComplaintSection />
      </div>

      {/* Floating UI Details */}
      <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse-soft" />
      <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[150px] pointer-events-none animate-pulse-soft" style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/[0.02] blur-[200px] pointer-events-none" />

      {/* Language Switcher - Bottom Left Corner */}
      <div className="fixed bottom-10 left-10 z-50 hover:scale-105 transition-transform duration-300">
        <div className="p-1 rounded-full bg-black/20 backdrop-blur-xl border border-white/5 shadow-2xl shadow-black/50">
          <LanguageSwitcher />
        </div>
      </div>
    </main>
  );
}
