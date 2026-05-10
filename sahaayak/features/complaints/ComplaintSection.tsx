'use client';

import React, { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Road, 
  Droplets, 
  Zap, 
  Trash2, 
  Waves, 
  Lightbulb, 
  Bus, 
  MoreHorizontal,
  MapPin,
  Upload,
  ShieldCheck,
  Languages,
  Sparkles,
  CheckCircle2,
  Loader2,
  XCircle
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

gsap.registerPlugin(ScrollTrigger);


import { useTranslation } from '@/context/LanguageContext';

const categories = (t: any) => [
  { id: 'roads', name: t('common.roads') || 'Roads', sub: 'BBMP/PWD', icon: Road },
  { id: 'water', name: t('common.water') || 'Water', sub: 'BWSSB', icon: Droplets },
  { id: 'electricity', name: t('common.electricity') || 'Electricity', sub: 'BESCOM', icon: Zap },
  { id: 'garbage', name: t('common.garbage') || 'Garbage', sub: 'Solid Waste', icon: Trash2 },
  { id: 'drainage', name: t('common.drainage') || 'Drainage', sub: 'Sanitation', icon: Waves },
  { id: 'streetlights', name: t('common.streetlights') || 'Streetlights', sub: 'Lighting', icon: Lightbulb },
  { id: 'transport', name: t('common.transport') || 'Transport', sub: 'BMTC/KSRTC', icon: Bus },
  { id: 'other', name: t('common.other') || 'Other', sub: 'Miscellaneous', icon: MoreHorizontal },
];

export default function ComplaintSection() {
  const { t, language } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  // Form handling states
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'detecting' | 'detected' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any>(null);

  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useGSAP(() => {
    // Floating background blobs
    gsap.to('.blob', {
      x: 'random(-50, 50)',
      y: 'random(-50, 50)',
      duration: 'random(5, 10)',
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // Reveal animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
      }
    });

    tl.from('.reveal-text', {
      y: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power4.out'
    })
    .from('.reveal-form', {
      x: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    }, '-=0.5');
  }, { scope: sectionRef });

  const detectLocation = () => {
    setLocationStatus('detecting');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationStatus('detected');
        },
        (error) => {
          console.error("Error getting location", error);
          setLocationStatus('error');
        }
      );
    } else {
      setLocationStatus('error');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setMediaFiles((prev) => [...prev, ...newFiles].slice(0, 3)); // max 3 files
    }
  };

  const removeFile = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!selectedCategory) {
      setSubmitError(language === 'en' ? 'Please select a category' : 'ದಯವಿಟ್ಟು ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ');
      return;
    }
    if (!description.trim()) {
      setSubmitError(language === 'en' ? 'Please provide a description' : 'ದಯವಿಟ್ಟು ವಿವರಣೆಯನ್ನು ನೀಡಿ');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const title = `${selectedCategory.toUpperCase()} Issue`;
      const ward = 'General'; // Could be dynamic
      
      const aiFormData = new FormData();
      aiFormData.append('category', selectedCategory);
      aiFormData.append('description', description);
      aiFormData.append('title', title);
      aiFormData.append('ward', ward);
      
      if (location) {
        aiFormData.append('locationLat', String(location.lat));
        aiFormData.append('locationLng', String(location.lng));
      }

      if (mediaFiles.length > 0) {
        aiFormData.append('file', mediaFiles[0]); // Analyze API handles single file for now
      }

      const aiRes = await fetch('/api/ai/analyze', {
        method: 'POST',
        body: aiFormData,
      });

      const aiData = await aiRes.json();

      if (!aiData.success) {
        throw new Error(aiData.error || 'Failed to analyze complaint');
      }

      // Step 2: Submit to the database
      const finalFormData = new FormData();
      finalFormData.append('title', title);
      finalFormData.append('category', selectedCategory);
      finalFormData.append('description', description);
      finalFormData.append('ward', ward);
      finalFormData.append('is_anonymous', String(isAnonymous));
      
      if (location) {
        finalFormData.append('latitude', String(location.lat));
        finalFormData.append('longitude', String(location.lng));
      }
      
      // Append AI Results
      finalFormData.append('trust_score', String(aiData.trust_score));
      finalFormData.append('priority', aiData.priority);
      finalFormData.append('is_duplicate', String(aiData.is_duplicate));
      if (aiData.duplicate_of) {
        finalFormData.append('duplicate_of', aiData.duplicate_of);
      }
      
      // Append all media files
      mediaFiles.forEach((file) => {
        finalFormData.append('media', file);
      });

      const submitRes = await fetch('/api/complaints', {
        method: 'POST',
        body: finalFormData,
      });

      const submitData = await submitRes.json();
      
      if (!submitData.success) {
        throw new Error(submitData.error || 'Failed to submit complaint');
      }

      setSuccessData({
        complaintId: submitData.complaint.id,
        trustScore: aiData.trust_score
      });
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  const resetForm = () => {
    setSuccessData(null);
    setSelectedCategory(null);
    setDescription('');
    setMediaFiles([]);
    setLocation(null);
    setLocationStatus('idle');
    setSubmitError(null);
    setIsAnonymous(false);
  };

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center justify-center py-24 px-6 overflow-hidden"
    >
      {/* Background Aesthetics */}
      <div className="absolute inset-0 z-0">
        <div className="blob absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] opacity-60" />
        <div className="blob absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-rose-500/20 rounded-full blur-[150px] opacity-60" />
        <div className="blob absolute top-[40%] left-[50%] w-[400px] h-[400px] bg-amber-500/15 rounded-full blur-[100px] opacity-40" />
        {/* Extra Colorful Glows */}
        <div className="absolute top-1/4 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] animate-pulse-soft" />
        <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-rose-500/20 rounded-full blur-[120px] animate-pulse-soft" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/5 rounded-full blur-[150px] pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Left Column: Storytelling */}
        <div className="flex flex-col gap-8 pt-12">
          <div className="reveal-text flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-md w-fit shadow-sm">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase font-inter text-gradient-aurora">
              Civic Empowerment Platform
            </span>
          </div>

          <h2 className="reveal-text font-instrument text-6xl md:text-8xl leading-[0.9] tracking-tight text-white">
            Report an issue, <br />
            <span className="text-gradient-aurora italic">impact your city.</span>
          </h2>

          <p className="reveal-text font-inter text-lg text-white/60 max-w-lg leading-relaxed">
            Your voice is the first step toward a better Karnataka. Our AI-assisted platform ensures your complaint reaches the right department with precision and speed.
          </p>

          {/* Stats or Details */}
          <div className="reveal-text grid grid-cols-2 gap-8 mt-8">
            <div className="flex flex-col">
              <span className="font-instrument text-4xl text-gradient-aurora">12.4k</span>
              <span className="font-inter text-sm text-white/40">Resolved this month</span>
            </div>
            <div className="flex flex-col">
              <span className="font-instrument text-4xl text-gradient-aurora">28m</span>
              <span className="font-inter text-sm text-white/40">Avg. Response Time</span>
            </div>
          </div>
        </div>

        {/* Right Column: Complaint Form */}
        <div ref={formRef} className="reveal-form relative">
          <div className="absolute -inset-4 bg-gradient-to-br from-purple-500/20 via-rose-500/10 to-cyan-500/10 blur-3xl rounded-[3rem] -z-10 animate-pulse-soft" />
          <div className="rounded-[2.5rem] p-8 md:p-12 border border-white/10 bg-white/[0.02] backdrop-blur-[40px] shadow-2xl shadow-black/50 relative overflow-hidden">
            {/* Subtle Inner Glow */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
            
            {successData ? (
              // Success State
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="font-instrument text-4xl text-white">Complaint Submitted!</h3>
                <p className="font-inter text-white/60 max-w-md">
                  Thank you for your civic contribution. Your complaint has been recorded and assigned ID: 
                  <br/>
                  <span className="font-bold text-white mt-2 inline-block text-lg">{successData.complaintId}</span>
                </p>
                <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded-lg text-sm font-medium">
                  <Sparkles className="w-4 h-4" />
                  AI Trust Score: {successData.trustScore}/100
                </div>
                <button 
                  onClick={resetForm}
                  className="mt-8 rounded-full px-8 py-4 text-sm font-bold bg-white text-black hover:scale-[1.02] transition-all"
                >
                  Submit Another Issue
                </button>
              </div>
            ) : (
              // Form State
              <>
                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                  <h3 className="font-instrument text-3xl text-white">{t('common.complaints')} Form</h3>
                </div>

                <div className="space-y-10">
                  
                  {/* Category Selection */}
                  <div className="space-y-4">
                    <label className="text-sm font-semibold font-inter text-white/80 block tracking-wide">Select Category *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {categories(t).map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={cn(
                            "group p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 relative overflow-hidden",
                            selectedCategory === cat.id 
                              ? "bg-white border-white text-black shadow-xl scale-[1.05] z-10" 
                              : "bg-white/[0.03] border-white/5 text-white hover:border-white/20 hover:bg-white/[0.08]"
                          )}
                        >
                          <cat.icon className={cn(
                            "w-6 h-6 transition-transform duration-500 group-hover:scale-110",
                            selectedCategory === cat.id ? "text-black" : "text-white/60"
                          )} />
                          <div className="text-center">
                            <p className="text-[10px] font-bold uppercase tracking-tighter opacity-80">{cat.name}</p>
                            <p className="text-[8px] opacity-40">{cat.sub}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* AI Assisted Description */}
                  <div className="space-y-4 relative">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-semibold font-inter text-white/80 tracking-wide">Issue Description *</label>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white/90 shadow-sm backdrop-blur-md">
                        <Sparkles className="w-3 h-3" />
                        AI ASSISTED
                      </div>
                    </div>
                    <div className="relative group">
                      <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={t('ai.placeholder')}
                        className="w-full min-h-[140px] p-6 pb-14 rounded-2xl bg-white/[0.03] border border-white/10 focus:border-white/30 focus:bg-white/[0.06] focus:outline-none transition-all duration-300 font-inter text-white placeholder:text-white/20 resize-none shadow-inner"
                      />
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <button className="text-[10px] font-medium px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white/60">
                          Auto-fix grammar
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Location & Media Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Location */}
                    <div className="space-y-4">
                      <label className="text-sm font-semibold font-inter text-white/80 tracking-wide">Location</label>
                      <button 
                        onClick={detectLocation}
                        disabled={locationStatus === 'detecting' || locationStatus === 'detected'}
                        className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20 hover:border-white/20 transition-all flex items-center justify-between group disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            {locationStatus === 'detecting' ? (
                              <Loader2 className="w-5 h-5 text-white/40 animate-spin" />
                            ) : locationStatus === 'detected' ? (
                              <MapPin className="w-5 h-5 text-green-400" />
                            ) : locationStatus === 'error' ? (
                              <MapPin className="w-5 h-5 text-red-400" />
                            ) : (
                              <>
                                <MapPin className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                                <div className="absolute inset-0 bg-cyan-400/20 rounded-full animate-ping scale-150" />
                              </>
                            )}
                          </div>
                          <span className={cn(
                            "text-sm font-medium font-inter transition-colors",
                            locationStatus === 'detected' ? "text-green-400" : locationStatus === 'error' ? "text-red-400" : "text-white/60 group-hover:text-white"
                          )}>
                            {locationStatus === 'detecting' ? 'Detecting...' : 
                             locationStatus === 'detected' ? 'Location Detected' : 
                             locationStatus === 'error' ? 'Location Failed' : 'Detect my location'}
                          </span>
                        </div>
                        {locationStatus === 'detected' && (
                          <span className="text-[10px] font-bold text-green-600">GPS ACTIVE</span>
                        )}
                      </button>
                    </div>

                    {/* Media Upload */}
                    <div className="space-y-4">
                      <label className="text-sm font-semibold font-inter text-white/80 tracking-wide flex justify-between">
                        Attachments 
                        <span className="text-xs text-white/40 font-normal">{mediaFiles.length}/3</span>
                      </label>
                      
                      {mediaFiles.length > 0 ? (
                        <div className="flex flex-col gap-2">
                          {mediaFiles.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-white/10 border border-white/10 text-sm text-white">
                              <span className="truncate max-w-[150px]">{file.name}</span>
                              <button onClick={() => removeFile(idx)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          {mediaFiles.length < 3 && (
                            <button onClick={() => fileInputRef.current?.click()} className="text-xs text-blue-600 font-medium py-1">
                              + Add more
                            </button>
                          )}
                        </div>
                      ) : (
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full p-4 rounded-2xl border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer group"
                        >
                          <Upload className="w-5 h-5 text-white/20 group-hover:text-white/40 transition-colors" />
                          <span className="text-[10px] font-medium font-inter text-white/40">JPG, PNG or MP4</span>
                        </div>
                      )}
                      
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept="image/*,video/mp4" 
                        multiple 
                      />
                    </div>
                  </div>

                  {/* Privacy Toggle */}
                  <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-white/40" />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white uppercase tracking-tight">Post Anonymously</span>
                        <span className="text-[10px] text-white/40 font-inter">Hide your identity from public view</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsAnonymous(!isAnonymous)}
                      className={cn(
                        "w-12 h-6 rounded-full p-1 transition-colors duration-300 flex items-center",
                        isAnonymous ? "bg-white" : "bg-white/20"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded-full transition-transform duration-300 shadow-sm",
                        isAnonymous ? "translate-x-6 bg-black" : "translate-x-0 bg-white/60"
                      )} />
                    </button>
                  </div>

                  {/* Error Message */}
                  {submitError && (
                    <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100 flex items-center gap-2 animate-in fade-in">
                      <XCircle className="w-4 h-4" />
                      {submitError}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex-1 rounded-full py-5 text-sm font-bold bg-white text-black hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/10 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Complaint
                          <CheckCircle2 className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                    <button className="px-8 rounded-full py-5 text-sm font-medium border border-white/10 hover:bg-white/10 transition-all duration-300 text-white/60 hover:text-white">
                      Save Draft
                    </button>
                  </div>

                </div>
              </>
            )}
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-primary/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-secondary/10 rounded-full blur-2xl animate-pulse delay-700" />
        </div>

      </div>
    </section>
  );
}
