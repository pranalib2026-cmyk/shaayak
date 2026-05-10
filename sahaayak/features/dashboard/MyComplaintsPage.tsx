'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, Clock, MapPin, ThumbsUp, AlertTriangle, CheckCircle, ChevronDown, Check, X, Shield, PlusCircle } from 'lucide-react';
import EvidenceModal from '../../components/EvidenceModal';

export default function MyComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [activeComplaintForEvidence, setActiveComplaintForEvidence] = useState<string | null>(null);

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  const fetchMyComplaints = async () => {
    try {
      const res = await fetch('/api/complaints/my');
      const data = await res.json();
      if (data.success) {
        setComplaints(data.complaints);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolutionFeedback = async (id: string, feedback: 'confirmed' | 'disputed') => {
    try {
      const res = await fetch(`/api/complaints/${id}/feedback`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback })
      });
      const data = await res.json();
      if (data.success) {
        setComplaints(complaints.map(c => 
          c.id === id ? { ...c, resolution_feedback: feedback, status: data.complaint.status } : c
        ));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredComplaints = complaints
    .filter(c => filter === 'All' ? true : c.status.toLowerCase() === filter.toLowerCase())
    .sort((a, b) => {
      if (sortBy === 'Newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'Oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === 'Highest Trust') return (b.trust_score || 0) - (a.trust_score || 0);
      return 0;
    });

  const stats = {
    total: complaints.length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    avgTrust: complaints.length > 0 ? Math.round(complaints.reduce((acc, curr) => acc + (curr.trust_score || 0), 0) / complaints.length) : 0
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'In Progress': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'Rejected': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    }
  };

  return (
    <div className="w-full pb-32">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-instrument text-white mb-4">My Complaints</h1>
        <p className="text-white/60 font-inter">Track the status, add work proofs, and verify resolutions of your reported civic issues.</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 font-inter">
        {[
          { label: 'Total Reports', value: stats.total, color: 'text-white' },
          { label: 'Resolved', value: stats.resolved, color: 'text-green-400' },
          { label: 'Pending', value: stats.pending, color: 'text-yellow-400' },
          { label: 'Avg Trust Score', value: `${stats.avgTrust}%`, color: 'text-cyan-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-1 backdrop-blur-md">
            <span className="text-sm text-white/50 font-medium">{stat.label}</span>
            <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 font-inter justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
        <div className="flex flex-wrap gap-2">
          {['All', 'Pending', 'In Progress', 'Resolved', 'Rejected'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === f ? 'bg-white text-black' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/50">Sort by:</span>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-white border border-white/20 rounded-lg px-3 py-1.5 outline-none focus:border-white/50 text-sm"
          >
            <option className="bg-black text-white">Newest</option>
            <option className="bg-black text-white">Oldest</option>
            <option className="bg-black text-white">Highest Trust</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="h-[300px] rounded-2xl bg-white/5 animate-pulse border border-white/10" />
          ))}
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="w-full py-20 flex flex-col items-center justify-center border border-dashed border-white/20 rounded-3xl bg-white/5">
          <Shield className="w-16 h-16 text-white/20 mb-4" />
          <h3 className="text-xl text-white font-instrument">No complaints found</h3>
          <p className="text-white/50 font-inter mt-2">You haven't submitted any issues matching this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-inter">
          <AnimatePresence>
            {filteredComplaints.map(complaint => (
              <motion.div
                key={complaint.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#111116] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group"
              >
                {/* Background glow based on trust score */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Header */}
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{complaint.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <span className="bg-white/10 px-2 py-1 rounded-md">{complaint.category}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {complaint.city || 'Bengaluru'}</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(complaint.status)}`}>
                    {complaint.status}
                  </div>
                </div>

                {/* Feedback Banner (Feature 3) */}
                {complaint.status === 'Resolved' && !complaint.resolution_feedback && (
                  <div className="mb-4 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 relative z-10">
                    <p className="text-sm text-blue-200 font-medium mb-3">This issue was marked as resolved. Was it actually fixed?</p>
                    <div className="flex gap-3">
                      <button onClick={() => handleResolutionFeedback(complaint.id, 'confirmed')} className="flex items-center gap-2 text-xs font-bold bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors">
                        <Check className="w-4 h-4" /> Yes, it's fixed
                      </button>
                      <button onClick={() => handleResolutionFeedback(complaint.id, 'disputed')} className="flex items-center gap-2 text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg hover:bg-red-500/40 transition-colors">
                        <X className="w-4 h-4" /> No, still an issue
                      </button>
                    </div>
                  </div>
                )}

                {/* Badges for Feedback */}
                {complaint.resolution_feedback === 'confirmed' && (
                  <div className="mb-4 flex items-center gap-2 text-xs text-green-400 font-medium bg-green-500/10 w-fit px-3 py-1 rounded-full border border-green-500/20">
                    <CheckCircle className="w-4 h-4" /> Citizen Verified
                  </div>
                )}
                {complaint.resolution_feedback === 'disputed' && (
                  <div className="mb-4 flex items-center gap-2 text-xs text-amber-400 font-medium bg-amber-500/10 w-fit px-3 py-1 rounded-full border border-amber-500/20">
                    <AlertTriangle className="w-4 h-4" /> Reopened by Citizen
                  </div>
                )}

                {/* Trust Score Bar */}
                <div className="mb-6 relative z-10">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/60">Trust Score</span>
                    <span className="text-cyan-400 font-bold">{complaint.trust_score || 0}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${complaint.trust_score || 0}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-aurora rounded-full"
                    />
                  </div>
                </div>

                {/* Footer actions */}
                <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-2 relative z-10">
                  <span className="text-xs text-white/40 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(complaint.created_at).toLocaleDateString()}
                  </span>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setActiveComplaintForEvidence(complaint.id);
                        setIsEvidenceModalOpen(true);
                      }}
                      className="text-xs flex items-center gap-1 bg-white/5 hover:bg-white/10 text-white/80 px-3 py-1.5 rounded-lg border border-white/10 transition-colors"
                    >
                      <PlusCircle className="w-3 h-3" /> Add Evidence
                    </button>
                    <button 
                      onClick={() => setSelectedComplaintId(selectedComplaintId === complaint.id ? null : complaint.id)}
                      className="text-xs flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium px-2"
                    >
                      {selectedComplaintId === complaint.id ? 'Hide Details' : 'View Details'}
                      <ChevronDown className={`w-4 h-4 transition-transform ${selectedComplaintId === complaint.id ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Expandable Details */}
                <AnimatePresence>
                  {selectedComplaintId === complaint.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-6 mt-4 border-t border-white/10 text-sm text-white/70 space-y-4">
                        <p>{complaint.description}</p>
                        
                        {/* Media Grid */}
                        {complaint.complaint_media?.length > 0 && (
                          <div className="grid grid-cols-3 gap-2 mt-4">
                            {complaint.complaint_media.map((media: any) => (
                              <div key={media.id} className="aspect-square rounded-lg bg-white/5 overflow-hidden border border-white/10">
                                <img src={media.media_url} alt="Evidence" className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Updates Feed */}
                        {complaint.complaint_updates?.length > 0 && (
                          <div className="mt-6">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Work Proofs & Updates</h4>
                            <div className="space-y-3 pl-2 border-l border-white/10">
                              {complaint.complaint_updates.map((update: any) => (
                                <div key={update.id} className="relative pl-4">
                                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-cyan-500" />
                                  <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                    <div className="flex justify-between items-start mb-2">
                                      <span className="text-xs text-white/40">{new Date(update.created_at).toLocaleDateString()}</span>
                                      {update.trust_boost > 0 && (
                                        <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded font-bold">
                                          +{update.trust_boost} pts
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex gap-3">
                                      <img src={update.media_path} className="w-12 h-12 rounded object-cover border border-white/10" />
                                      <p className="text-xs text-white/80">{update.caption || 'Photo evidence added'}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5 text-xs text-white/50">
                          <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {complaint.upvotes} Upvotes</span>
                          {complaint.is_duplicate && (
                            <span className="text-amber-400/80 bg-amber-500/10 px-2 py-1 rounded">Marked as Duplicate</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Evidence Modal */}
      {activeComplaintForEvidence && (
        <EvidenceModal
          isOpen={isEvidenceModalOpen}
          onClose={() => {
            setIsEvidenceModalOpen(false);
            setActiveComplaintForEvidence(null);
          }}
          complaintId={activeComplaintForEvidence}
          onSuccess={(newTrustScore, newUpdate) => {
            setComplaints(complaints.map(c => {
              if (c.id === activeComplaintForEvidence) {
                return {
                  ...c,
                  trust_score: newTrustScore,
                  complaint_updates: [...(c.complaint_updates || []), newUpdate]
                };
              }
              return c;
            }));
          }}
        />
      )}
    </div>
  );
}
