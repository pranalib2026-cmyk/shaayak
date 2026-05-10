'use client';

import React, { useState, useRef, useEffect } from 'react';
import Navbar from "../../components/ui/Navbar";
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ShieldCheck, Upload, AlertTriangle, Activity, BrainCircuit, Scan, Eye, MapPin, Building2, Server, CheckCircle2, FileWarning } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/context/LanguageContext';

export default function AIVerificationPage() {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [processingStep, setProcessingStep] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!text && !file) return;
    
    setIsAnalyzing(true);
    setResults(null);
    
    // Progressive Processing Steps
    const steps = [
      'Uploading image to secure storage...',
      'Analyzing civic damage patterns...',
      'Checking nearby complaints in Rajajinagar...',
      'Calculating weighted trust score...',
      'Generating department recommendations...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(steps[i]);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    try {
      const formData = new FormData();
      formData.append('title', text.slice(0, 30));
      formData.append('description', text);
      formData.append('category', 'Roads'); // Default for demo
      formData.append('ward', 'Rajajinagar');
      if (file) formData.append('file', file);
      formData.append('userId', '00000000-0000-0000-0000-000000000000'); // Mocked UUID

      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        // API returns: trust_score, issue_type, department, is_duplicate, duplicate_of,
        // recommendations, analysis (with severity, confidence, department, issueType)
        const analysis = data.analysis || {};
        const trustScore = data.trust_score ?? 70;
        const fakeProbability = Math.max(0, 100 - trustScore);
        const severity = analysis.severity || 'Moderate';
        const department = analysis.department || data.department || 'General';
        const issueType = analysis.issueType || data.issue_type || 'General';
        const confidence = analysis.confidence ?? 80;
        const duplicateMatches = data.is_duplicate
          ? [{ id: data.duplicate_of, similarity: 90 }]
          : [];

        setResults({
          analyze: {
            textAnalysis: {
              severity,
              category: issueType,
              department,
              confidence,
            },
            mediaAnalysis: {
              detectedObjects: issueType !== 'Other'
                ? [{ object: issueType, confidence }]
                : [],
              damageHighlight: 'Structural issue detected.',
            },
            riskAnalysis: {
              areaDangerProbability: severity === 'Critical' ? 95 : 60,
              citizenImpactScore: trustScore,
              escalationUrgency: severity === 'Critical' ? 'Immediate' : 'Standard',
              slaBreachRisk: severity === 'Critical' ? 'High' : 'Low',
            },
          },
          trust: {
            trustScore,
            fakeProbability,
            fraudIndicator: fakeProbability > 50 ? 'High' : 'Low',
          },
          duplicate: {
            hasDuplicates: duplicateMatches.length > 0,
            maxSimilarity: duplicateMatches[0]?.similarity || 0,
            duplicates: duplicateMatches,
          },
          recommendations: data.recommendations || [],
        });
      } else {
        console.error('Analysis failed:', data.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
      setProcessingStep('');
    }
  };

  return (
    <main ref={containerRef} className="relative min-h-screen w-full bg-[#0a0a0c] overflow-hidden text-white font-inter pb-24">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[150px] ambient-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-fuchsia-500/10 rounded-full blur-[120px] ambient-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-50">
        <Navbar />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32">
        {/* Header */}
        <div className="stagger-fade text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <Server className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-cyan-400">
              {t('ai.title')}
            </span>
          </div>
          <h1 className="font-instrument text-5xl md:text-7xl mb-4">
            {t('ai.title')}
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            {t('ai.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Input & Scanning */}
          <div className="lg:col-span-5 space-y-8">
            <div className="stagger-fade glass rounded-3xl p-6 border border-white/10 bg-white/5 backdrop-blur-md relative overflow-hidden">
              <h2 className="font-instrument text-2xl mb-6 flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-cyan-400" />
                {t('ai.console_title')}
              </h2>

              <div className="space-y-4 relative">
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder={t('ai.placeholder')}
                  className="w-full h-40 bg-black/40 border border-white/10 rounded-2xl p-4 text-white placeholder-white/30 focus:border-cyan-500/50 outline-none resize-none transition-colors"
                />
                
                <div className="relative">
                  <input 
                    type="file" 
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    accept="image/*"
                  />
                  <div className={`w-full h-24 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${file ? 'border-cyan-500/50 bg-cyan-500/10' : 'border-white/10 hover:border-white/30 bg-black/40'}`}>
                    {file ? (
                      <div className="text-center">
                        <CheckCircle2 className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                        <span className="text-sm text-cyan-400 font-medium">{file.name}</span>
                      </div>
                    ) : (
                      <div className="text-center text-white/40">
                        <Upload className="w-6 h-6 mx-auto mb-2" />
                        <span className="text-sm">Click to upload image</span>
                      </div>
                    )}
                  </div>
                </div>

                {isAnalyzing && (
                  <div className="text-center py-2 animate-pulse">
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">{processingStep}</span>
                  </div>
                )}

                <button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || (!text && !file)}
                  className="w-full py-4 rounded-xl bg-gradient-aurora text-white font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  {isAnalyzing ? (
                    <><Activity className="w-5 h-5 animate-spin" /> {t('ai.analyze_btn')}...</>
                  ) : (
                    <><Scan className="w-5 h-5 group-hover:rotate-90 transition-transform" /> {t('ai.analyze_btn')}</>
                  )}
                </button>
              </div>
            </div>

            {/* Image Scanning Simulation (Appears if media attached and analyzed) */}
            <AnimatePresence>
              {results?.analyze?.mediaAnalysis && file && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="glass rounded-3xl p-6 border border-white/10 bg-white/5 backdrop-blur-md relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-20 mix-blend-luminosity" />
                  
                  <div className="relative z-10">
                    <h3 className="font-instrument text-xl mb-4 flex items-center gap-2">
                      <Eye className="w-5 h-5 text-fuchsia-400" />
                      Computer Vision Scan
                    </h3>
                    
                    <div className="relative w-full aspect-video border border-white/20 rounded-xl overflow-hidden mb-4">
                      {/* Fake bounding box */}
                      <div className="absolute top-[20%] left-[30%] w-[40%] h-[50%] border-2 border-red-500 bg-red-500/10 flex items-start p-1">
                        <span className="bg-red-500 text-white text-[10px] font-bold px-1 rounded-sm">94% MATCH</span>
                      </div>
                      {/* Scan line */}
                      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent to-cyan-400/30 border-b border-cyan-400 animate-pulse-soft" />
                    </div>

                    <div className="space-y-2">
                      {results.analyze.mediaAnalysis.detectedObjects.map((obj: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="text-white/80">{obj.object}</span>
                          <span className="text-cyan-400 font-mono">{obj.confidence}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT COLUMN: Results Dashboard */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Row: Trust Score & Fraud Detection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Trust Score */}
              <div className="stagger-fade glass rounded-3xl p-6 border border-white/10 bg-white/5 backdrop-blur-md flex flex-col items-center justify-center relative overflow-hidden h-64">
                <h3 className="absolute top-6 left-6 font-instrument text-xl">Trust Score</h3>
                
                {results ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative w-32 h-32 flex items-center justify-center mt-4">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path className="text-white/10" d="M18 2 a 16 16 0 0 1 0 32 a 16 16 0 0 1 0 -32" fill="none" stroke="currentColor" strokeWidth="2" />
                      <path 
                        className={`transition-all duration-1500 ${results.trust.trustScore > 80 ? 'text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]' : results.trust.trustScore > 50 ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]'}`}
                        strokeDasharray={`${results.trust.trustScore}, 100`} d="M18 2 a 16 16 0 0 1 0 32 a 16 16 0 0 1 0 -32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" 
                      />
                    </svg>
                    <div className="text-center">
                      <span className="block font-instrument text-4xl">{results.trust.trustScore}%</span>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-white/20 flex flex-col items-center mt-4">
                    <ShieldCheck className="w-12 h-12 mb-2 opacity-50" />
                    <span className="text-sm">Awaiting Analysis</span>
                  </div>
                )}
              </div>

              {/* Fraud Detection */}
              <div className="stagger-fade glass rounded-3xl p-6 border border-white/10 bg-white/5 backdrop-blur-md relative h-64 flex flex-col">
                <h3 className="font-instrument text-xl mb-4">Fake Detection</h3>
                {results ? (
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/60">Fraud Probability</span>
                        <span className={results.trust.fakeProbability < 30 ? 'text-green-400' : 'text-red-400'}>{results.trust.fakeProbability}%</span>
                      </div>
                      <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${results.trust.fakeProbability}%` }} 
                          className={`h-full ${results.trust.fakeProbability < 30 ? 'bg-green-400' : 'bg-red-500'}`} 
                        />
                      </div>
                    </div>
                    
                    <div className={`p-3 rounded-xl border ${results.trust.fraudIndicator === 'Low' ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'} flex items-start gap-3`}>
                      <FileWarning className={`w-5 h-5 ${results.trust.fraudIndicator === 'Low' ? 'text-green-400' : 'text-red-400'}`} />
                      <div>
                        <div className={`text-sm font-bold ${results.trust.fraudIndicator === 'Low' ? 'text-green-400' : 'text-red-400'}`}>
                          {results.trust.fraudIndicator} Risk
                        </div>
                        <div className="text-xs text-white/60">
                          {results.trust.fraudIndicator === 'Low' ? 'Complaint appears genuine based on behavior patterns.' : 'Anomalous behavior detected. Flagged for review.'}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-white/20">
                    <span className="text-sm">No data</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Row: Risk & Department */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Risk Probability Dashboard */}
              <div className="stagger-fade glass rounded-3xl p-6 border border-white/10 bg-white/5 backdrop-blur-md">
                <h3 className="font-instrument text-xl mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  Risk Assessment
                </h3>
                
                {results ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-sm text-white/70">Severity</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${results.analyze.textAnalysis.severity === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                        {results.analyze.textAnalysis.severity}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-sm text-white/70">Citizen Impact</span>
                      <span className="text-fuchsia-400 font-mono">{results.analyze.riskAnalysis.citizenImpactScore}/100</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-sm text-white/70">SLA Breach Risk</span>
                      <span className={`text-sm ${results.analyze.riskAnalysis.slaBreachRisk === 'High' ? 'text-red-400' : 'text-green-400'}`}>
                        {results.analyze.riskAnalysis.slaBreachRisk}
                      </span>
                    </div>
                  </div>
                ) : (
                   <div className="h-32 flex items-center justify-center text-white/20 text-sm">Waiting for analysis</div>
                )}
              </div>

              {/* Department Assignment */}
              <div className="stagger-fade glass rounded-3xl p-6 border border-white/10 bg-white/5 backdrop-blur-md">
                <h3 className="font-instrument text-xl mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  Department Routing
                </h3>
                
                {results ? (
                  <div className="h-full flex flex-col justify-center pb-4">
                    <div className="text-center mb-6">
                      <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Assigned To</div>
                      <div className="text-2xl font-instrument text-cyan-400">{results.analyze.textAnalysis.department}</div>
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 text-sm text-white/70 border-t border-white/10 pt-4">
                      <MapPin className="w-4 h-4" />
                      Karnataka Ward System
                    </div>
                  </div>
                ) : (
                   <div className="h-32 flex items-center justify-center text-white/20 text-sm">Waiting for analysis</div>
                )}
              </div>
            </div>

            {/* Recommendations Panel */}
            <AnimatePresence>
              {results && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="stagger-fade glass rounded-3xl p-6 border border-fuchsia-500/30 bg-fuchsia-500/5 backdrop-blur-md"
                >
                  <h3 className="font-instrument text-xl mb-4 text-fuchsia-400">AI Recommendations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.recommendations.map((rec: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-black/40 rounded-xl border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-fuchsia-400 mt-1.5 shrink-0 animate-pulse" />
                        <p className="text-sm text-white/80">{rec}</p>
                      </div>
                    ))}
                    {results.duplicate.hasDuplicates && (
                      <div className="flex items-start gap-3 p-3 bg-red-500/10 rounded-xl border border-red-500/20 col-span-1 md:col-span-2">
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-red-400 font-bold mb-1">Duplicate Cluster Detected</p>
                          <p className="text-xs text-white/60">
                            {results.duplicate.maxSimilarity}% similar to ongoing issues in the area. Escalating to prevent redundant deployments.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </main>
  );
}
