'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, CheckCircle } from 'lucide-react';

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaintId: string;
  onSuccess: (newTrustScore: number, update: any) => void;
}

export default function EvidenceModal({ isOpen, onClose, complaintId, onSuccess }: EvidenceModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('media', file);
      formData.append('caption', caption);

      const res = await fetch(`/api/complaints/${complaintId}/updates`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        onSuccess(data.new_trust_score, data.update);
        onClose();
        setFile(null);
        setCaption('');
        setPreview(null);
      } else {
        alert(data.error || 'Failed to submit evidence');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-[#111116] border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-fuchsia-500" />
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white/50 hover:text-white bg-white/5 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-instrument text-white mb-2">Submit Work Proof</h2>
            <p className="text-sm text-white/60 mb-6 font-inter">
              Add photos to show progress or new evidence. AI will verify the image and boost the trust score.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-inter">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white/80">Photo Evidence</label>
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    required
                  />
                  <div className={`border-2 border-dashed ${preview ? 'border-transparent' : 'border-white/20 group-hover:border-white/40'} rounded-xl p-4 flex flex-col items-center justify-center min-h-[150px] bg-white/5 transition-colors overflow-hidden`}>
                    {preview ? (
                      <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-white/40 mb-2" />
                        <span className="text-sm text-white/60">Click or drag image here</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white/80">Caption (Optional)</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 min-h-[80px]"
                  placeholder="Describe the update..."
                />
              </div>

              <button
                type="submit"
                disabled={!file || isLoading}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-aurora text-white font-bold py-3 rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Submit Work Proof
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
