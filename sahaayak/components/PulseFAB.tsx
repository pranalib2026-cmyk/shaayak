'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Phone, Shield, Droplets, Flame, Wind } from 'lucide-react';

const emergencyContacts = [
  { name: 'Police', number: '100', icon: Shield, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { name: 'Fire Dept', number: '101', icon: Flame, color: 'text-red-500', bg: 'bg-red-500/10' },
  { name: 'Ambulance', number: '102', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/10' },
  { name: 'Water Emergency', number: '1916', icon: Droplets, color: 'text-teal-500', bg: 'bg-teal-500/10' },
  { name: 'Gas Leak', number: '1906', icon: Wind, color: 'text-amber-500', bg: 'bg-amber-500/10' }
];

export default function PulseFAB() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 flex flex-col gap-3"
          >
            {emergencyContacts.map((contact, idx) => (
              <a
                key={contact.name}
                href={`tel:${contact.number}`}
                className="group flex items-center justify-between gap-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-4 py-3 hover:bg-white/10 transition-all shadow-lg w-64 cursor-pointer relative"
                title="Tap to call on mobile"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${contact.bg}`}>
                    <contact.icon className={`w-5 h-5 ${contact.color}`} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">{contact.name}</span>
                    <span className="text-xs text-white/50">{contact.number}</span>
                  </div>
                </div>
                <div className="p-2 rounded-full bg-white/5 group-hover:bg-green-500/20 transition-colors">
                  <Phone className="w-4 h-4 text-white/60 group-hover:text-green-400" />
                </div>
                {/* Tooltip for desktop hover */}
                <span className="absolute -top-8 right-0 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none md:block hidden">
                  Tap to call on mobile
                </span>
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative group">
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Emergency
        </span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur border-2 border-blue-300/60 shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-transform"
        >
          <span className="absolute inset-0 rounded-full border-2 border-blue-400/50 animate-ping"></span>
          <ShieldAlert className="w-8 h-8 text-blue-300" />
        </button>
      </div>
      
      {isOpen && (
        <div 
          className="fixed inset-0 z-[-1]" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
