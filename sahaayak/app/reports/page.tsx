'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Navbar from "@/components/ui/Navbar";
import CinematicVideo from "@/components/background-video/CinematicVideo";
import { useTranslation } from "@/context/LanguageContext";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Activity,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Shield,
  Building2
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Helper for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  trust_score: number;
  city: string;
  is_anonymous: boolean;
  created_at: string;
  complaint_media?: any[];
  complaint_updates?: any[];
}

// --- Helpers ---
const DEPARTMENTS = ['BBMP', 'BESCOM', 'BWSSB', 'PWD', 'Other'];
const STATUSES = ['All', 'Pending', 'In Progress', 'Resolved', 'Rejected'];

const getDepartment = (category: string): string => {
  switch (category?.toLowerCase()) {
    case 'roads': return 'PWD';
    case 'water': return 'BWSSB';
    case 'electricity': return 'BESCOM';
    case 'garbage':
    case 'streetlights':
    case 'drainage': return 'BBMP';
    default: return 'Other';
  }
};

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    case 'in progress': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'resolved': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    case 'rejected': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
    default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
};

const getDeptColor = (dept: string) => {
  switch (dept) {
    case 'BBMP': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    case 'BESCOM': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    case 'BWSSB': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    case 'PWD': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    default: return 'bg-white/5 text-white/40 border-white/10';
  }
};

export default function TotalReportsPage() {
  const { t } = useTranslation();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters & UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await fetch('/api/complaints');
        const data = await res.json();
        if (data.success) {
          setComplaints(data.complaints);
        }
      } catch (err) {
        console.error("Failed to fetch complaints:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (!loading && statsRef.current) {
      gsap.from('.stat-card', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 90%',
        }
      });
    }
  }, [loading]);

  // --- Filtering & Sorting ---
  const filteredData = useMemo(() => {
    let result = complaints.filter(c => {
      const matchesSearch = c.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           c.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchesDept = deptFilter === 'All' || getDepartment(c.category) === deptFilter;
      return matchesSearch && matchesStatus && matchesDept;
    });

    result.sort((a, b) => {
      if (sortBy === 'Newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'Oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === 'Highest Trust Score') return b.trust_score - a.trust_score;
      if (sortBy === 'Highest Priority') {
        const priorityMap: any = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return (priorityMap[b.priority] || 0) - (priorityMap[a.priority] || 0);
      }
      return 0;
    });

    return result;
  }, [complaints, searchQuery, statusFilter, deptFilter, sortBy]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // --- Aggregations ---
  const stats = useMemo(() => {
    return {
      total: complaints.length,
      resolved: complaints.filter(c => c.status === 'Resolved').length,
      pending: complaints.filter(c => c.status === 'Pending').length,
      inProgress: complaints.filter(c => c.status === 'In Progress').length,
    };
  }, [complaints]);

  const chartData = useMemo(() => {
    return DEPARTMENTS.map(dept => ({
      name: dept,
      value: complaints.filter(c => getDepartment(c.category) === dept).length
    })).filter(d => d.name !== 'Other' || d.value > 0);
  }, [complaints]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] dark:bg-[#0a0a0c] selection:bg-cyan-500/30">
      <CinematicVideo src="https://www.pexels.com/download/video/34645692/" />
      
      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-16 px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 text-[10px] font-bold tracking-[0.2em] uppercase text-white/50">
            {t('reports.subtitle') || "Public Transparency Dashboard"}
          </span>
          <h1 className="font-instrument text-5xl md:text-7xl text-white tracking-tight mb-6">
            {t('reports.title') || "Total Reports"}
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto font-inter">
            Monitor civic progress in real-time. Every voice, every action, fully transparent.
          </p>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section ref={statsRef} className="relative z-10 px-6 -mt-8 mb-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: t('reports.stats.total') || 'Total Complaints', value: stats.total, color: 'text-white', icon: Activity },
            { label: t('reports.stats.resolved') || 'Total Resolved', value: stats.resolved, color: 'text-emerald-400', icon: CheckCircle2 },
            { label: t('reports.stats.pending') || 'Total Pending', value: stats.pending, color: 'text-amber-400', icon: Clock },
            { label: t('reports.stats.in_progress') || 'In Progress', value: stats.inProgress, color: 'text-blue-400', icon: AlertCircle },
          ].map((stat, i) => (
            <div key={i} className="stat-card p-8 rounded-[2rem] bg-white/5 backdrop-blur-3xl border border-white/10 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <stat.icon className="w-12 h-12 text-white" />
              </div>
              <p className="text-sm font-medium text-white/40 mb-2 uppercase tracking-wider">{stat.label}</p>
              <h3 className={`text-4xl font-instrument ${stat.color}`}>{stat.value}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Content Section */}
      <section className="relative z-10 px-6 py-12 bg-[#FAFAFA] rounded-t-[4rem] text-slate-900 min-h-screen">
        <div className="max-w-7xl mx-auto">
          
          {/* Chart Section */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Building2 className="w-6 h-6 text-slate-400" />
              <h2 className="text-2xl font-instrument tracking-tight">Reports by Department</h2>
            </div>
            <div className="h-[400px] w-full p-8 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="aurora" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="50%" stopColor="#f472b6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="url(#aurora)" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col gap-8 mb-12">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <div className="relative w-full md:w-[400px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder={t('reports.filters.search') || "Search complaints..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 rounded-full bg-white border border-slate-200 focus:border-cyan-500/50 focus:outline-none focus:ring-4 focus:ring-cyan-500/5 transition-all text-sm shadow-sm"
                />
              </div>
              
              <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200">
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-xs font-bold text-slate-600 focus:outline-none cursor-pointer"
                  >
                    <option>Newest</option>
                    <option>Oldest</option>
                    <option>Highest Trust Score</option>
                    <option>Highest Priority</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-3 pr-4 border-r border-slate-200 mr-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status</span>
              </div>
              {STATUSES.map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "px-6 py-2 rounded-full text-xs font-bold transition-all border",
                    statusFilter === status 
                      ? "bg-slate-900 border-slate-900 text-white shadow-lg" 
                      : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-3 pr-4 border-r border-slate-200 mr-2">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Department</span>
              </div>
              {['All', ...DEPARTMENTS].map(dept => (
                <button
                  key={dept}
                  onClick={() => setDeptFilter(dept)}
                  className={cn(
                    "px-6 py-2 rounded-full text-xs font-bold transition-all border",
                    deptFilter === dept 
                      ? "bg-cyan-600 border-cyan-600 text-white shadow-lg shadow-cyan-600/20" 
                      : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                  )}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Complaints List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {paginatedData.map((complaint, i) => {
                const dept = getDepartment(complaint.category);
                return (
                  <motion.div
                    key={complaint.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.4, delay: (i % 10) * 0.05 }}
                    className="group bg-white rounded-[2.5rem] border border-slate-200 p-8 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 relative flex flex-col h-full"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          #{complaint.id.slice(0, 8)}
                        </span>
                        <div className={cn("px-3 py-1 rounded-full text-[10px] font-bold border w-fit", getDeptColor(dept))}>
                          {dept}
                        </div>
                      </div>
                      <div className={cn("px-3 py-1 rounded-full text-[10px] font-bold border", getStatusColor(complaint.status))}>
                        {complaint.status}
                      </div>
                    </div>

                    <h3 className="text-lg font-instrument font-medium text-slate-900 mb-3 group-hover:text-cyan-600 transition-colors">
                      {complaint.title}
                    </h3>
                    
                    <p className="text-sm text-slate-500 line-clamp-3 mb-6 font-inter">
                      {complaint.description}
                    </p>

                    <div className="mt-auto space-y-6">
                      {/* Trust Score Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                          <span className="text-slate-400">Trust Score</span>
                          <span className="text-cyan-600">{complaint.trust_score}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${complaint.trust_score}%` }}
                            className="h-full bg-gradient-aurora"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between pt-6 border-t border-slate-100 gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <MapPin className="w-3 h-3" />
                            <span className="text-[11px] font-medium">{complaint.city || 'Karnataka'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Clock className="w-3 h-3" />
                            <span className="text-[11px] font-medium">
                              {new Date(complaint.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        {complaint.is_anonymous && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 text-white">
                            <Shield className="w-3 h-3" />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Anonymous</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {filteredData.length === 0 && (
            <div className="py-32 text-center">
              <div className="inline-flex p-6 rounded-full bg-slate-50 mb-6">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-instrument text-slate-900 mb-2">No complaints found</h3>
              <p className="text-slate-500">Try adjusting your filters or search keywords.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-20 flex justify-center items-center gap-4">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-3 rounded-full border border-slate-200 disabled:opacity-30 hover:bg-white hover:shadow-lg transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={cn(
                      "w-10 h-10 rounded-full text-xs font-bold transition-all",
                      currentPage === i + 1 
                        ? "bg-slate-900 text-white scale-110 shadow-lg shadow-slate-900/20" 
                        : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300"
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-3 rounded-full border border-slate-200 disabled:opacity-30 hover:bg-white hover:shadow-lg transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Decorative Blobs */}
      <div className="fixed top-[20%] left-[10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse-soft z-0" />
      <div className="fixed bottom-[20%] right-[10%] w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[150px] pointer-events-none animate-pulse-soft z-0" style={{ animationDelay: '3s' }} />
    </main>
  );
}
