'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  ChevronRight, 
  ArrowUpRight,
  Zap,
  Droplets,
  HardHat,
  Building2,
  Activity,
  Heart
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Mock Data ---

const monthlyTrends = [
  { name: 'Jan', complaints: 4000, resolved: 3200 },
  { name: 'Feb', complaints: 3000, resolved: 2800 },
  { name: 'Mar', complaints: 2000, resolved: 1900 },
  { name: 'Apr', complaints: 2780, resolved: 2100 },
  { name: 'May', complaints: 1890, resolved: 1700 },
  { name: 'Jun', complaints: 2390, resolved: 2000 },
  { name: 'Jul', complaints: 3490, resolved: 3100 },
];

const districtData = [
  { name: 'Bengaluru', roads: 400, water: 240, power: 120 },
  { name: 'Mysuru', roads: 200, water: 150, power: 80 },
  { name: 'Hubballi', roads: 180, water: 130, power: 100 },
  { name: 'Mangaluru', roads: 150, water: 100, power: 60 },
  { name: 'Belagavi', roads: 120, water: 90, power: 50 },
];

const deptPerformance = [
  { name: 'BBMP', efficiency: 88, color: '#FF6B6B' },
  { name: 'BESCOM', efficiency: 94, color: '#4D96FF' },
  { name: 'BWSSB', efficiency: 82, color: '#6BCB77' },
  { name: 'PWD', efficiency: 76, color: '#FFD93D' },
];

const resolutionStats = [
  { name: 'Within SLA', value: 75, color: '#6BCB77' },
  { name: 'Delayed', value: 20, color: '#FFD93D' },
  { name: 'Breached', value: 5, color: '#FF6B6B' },
];

// --- Sub-components ---

const StatCard = ({ title, value, sub, icon: Icon, trend }: any) => (
  <div className="reveal-item glass rounded-3xl p-6 border border-black/5 bg-white/40 backdrop-blur-md shadow-xl shadow-black/5 hover:scale-[1.02] transition-all duration-500">
    <div className="flex justify-between items-start mb-4">
      <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center">
        <Icon className="w-6 h-6 text-black/60" />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">
          <TrendingUp className="w-3 h-3" />
          {trend}
        </div>
      )}
    </div>
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">{title}</p>
      <h3 className="text-3xl font-bold text-black tracking-tighter">{value}</h3>
      <p className="text-xs text-black/30">{sub}</p>
    </div>
  </div>
);

const EfficiencyRing = ({ value, label, icon: Icon, color }: any) => (
  <div className="flex flex-col items-center gap-4">
    <div className="relative w-24 h-24">
      <svg className="w-full h-full -rotate-90">
        <circle
          cx="48"
          cy="48"
          r="40"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-black/5"
        />
        <circle
          cx="48"
          cy="48"
          r="40"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={251.2}
          strokeDashoffset={251.2 - (251.2 * value) / 100}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-black">{value}%</span>
      </div>
    </div>
    <div className="text-center">
       <div className="flex items-center justify-center gap-2 mb-1">
          <Icon className="w-3 h-3 text-black/40" />
          <span className="text-[10px] font-bold text-black uppercase">{label}</span>
       </div>
    </div>
  </div>
);

export default function TransparencyDashboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(() => {
    if (!mounted) return;
    gsap.from('.reveal-item', {
      y: 40,
      opacity: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: 'power4.out'
    });
    
    // Ambient gradient movement
    gsap.to('.gradient-blob', {
      x: 'random(-50, 50)',
      y: 'random(-50, 50)',
      duration: 'random(5, 10)',
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }, { scope: containerRef });

  if (!mounted) return <div className="min-h-screen bg-[#FAFAFA]" />;

  return (
    <div ref={containerRef} className="relative min-h-screen w-full bg-[#FAFAFA] flex flex-col py-24 px-6 md:px-12 overflow-hidden font-inter">
      
      {/* Background Aesthetics */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="gradient-blob absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[180px] opacity-60" />
        <div className="gradient-blob absolute bottom-[-10%] right-[-10%] w-[900px] h-[900px] bg-secondary/10 rounded-full blur-[200px] opacity-60" />
        <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] bg-blue-100/20 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="space-y-4">
            <div className="reveal-item flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-black/5 backdrop-blur-md w-fit shadow-sm">
              <ShieldCheck className="w-4 h-4 text-primary-dark" />
              <span className="text-xs font-bold tracking-widest uppercase text-black/60">
                Transparency & Governance Portal
              </span>
            </div>
            <h1 className="reveal-item font-instrument text-6xl md:text-8xl tracking-tighter text-black leading-none">
              Civic <span className="italic text-black/40">Transparency.</span>
            </h1>
            <p className="reveal-item text-lg text-black/40 max-w-xl font-light">
              Real-time audit of Karnataka's civic health, department efficiency, and resource accountability.
            </p>
          </div>
          
          <div className="reveal-item glass p-6 rounded-[2.5rem] bg-white/60 border border-black/5 flex items-center gap-8 shadow-2xl shadow-black/5">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center border-4 border-green-500/20">
                <Heart className="w-8 h-8 text-green-500 animate-pulse" />
              </div>
              <span className="text-[10px] font-bold text-black/40 uppercase">Civic Health</span>
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-bold text-black tracking-tighter">92.4<span className="text-xl text-black/30">/100</span></p>
              <div className="flex items-center gap-2">
                <div className="h-1 w-24 bg-black/5 rounded-full overflow-hidden">
                  <div className="h-full w-[92.4%] bg-green-500" />
                </div>
                <span className="text-[10px] font-bold text-green-600 uppercase">Optimal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard 
            title="Total Complaints" 
            value="14,842" 
            sub="+1,204 this month" 
            icon={Activity} 
            trend="12%"
          />
          <StatCard 
            title="Resolved Issues" 
            value="12,109" 
            sub="82% Success Rate" 
            icon={CheckCircle2} 
          />
          <StatCard 
            title="Avg. Resolution" 
            value="3.4 Days" 
            sub="Below SLA target" 
            icon={Clock} 
          />
          <StatCard 
            title="AI Trust Score" 
            value="98.1%" 
            sub="Verification Accuracy" 
            icon={ShieldCheck} 
          />
          <StatCard 
            title="SLA Breaches" 
            value="142" 
            sub="-24% from last month" 
            icon={AlertTriangle} 
          />
        </div>

        {/* Middle Section: Trends & Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Trend Chart */}
          <div className="reveal-item lg:col-span-2 glass rounded-[3rem] p-8 md:p-12 border border-black/5 bg-white/40 shadow-2xl shadow-black/5">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h3 className="font-instrument text-3xl text-black">Complaint Trends</h3>
                <p className="text-xs text-black/40 uppercase tracking-widest mt-1">Monthly frequency vs resolution rate</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-[10px] font-bold text-black/60 uppercase">Incoming</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-black" />
                  <span className="text-[10px] font-bold text-black/60 uppercase">Resolved</span>
                </div>
              </div>
            </div>
            
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrends}>
                  <defs>
                    <linearGradient id="colorComplaints" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000008" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fontWeight: 700, fill: '#00000040'}} 
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fontWeight: 700, fill: '#00000040'}}
                  />
                  <Tooltip 
                    contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', backdropFilter: 'blur(10px)'}}
                  />
                  <Area type="monotone" dataKey="complaints" stroke="var(--primary)" fillOpacity={1} fill="url(#colorComplaints)" strokeWidth={3} />
                  <Area type="monotone" dataKey="resolved" stroke="#000000" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Distribution Chart */}
          <div className="reveal-item glass rounded-[3rem] p-8 md:p-12 border border-black/5 bg-white/40 shadow-2xl shadow-black/5">
            <h3 className="font-instrument text-3xl text-black mb-12">SLA Status</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={resolutionStats}
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {resolutionStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4 mt-8">
              {resolutionStats.map((stat) => (
                <div key={stat.name} className="flex items-center justify-between p-4 rounded-2xl border border-black/5 bg-white/60">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stat.color }} />
                    <span className="text-[10px] font-bold text-black uppercase tracking-widest">{stat.name}</span>
                  </div>
                  <span className="text-sm font-bold text-black">{stat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section: District Analytics & Dept Scorecards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* District Bar Chart */}
          <div className="reveal-item glass rounded-[3rem] p-8 md:p-12 border border-black/5 bg-white/40 shadow-2xl shadow-black/5">
             <div className="flex justify-between items-center mb-12">
                <h3 className="font-instrument text-3xl text-black">District Analytics</h3>
                <div className="flex gap-2">
                   {['Roads', 'Water', 'Power'].map((cat, i) => (
                      <div key={cat} className="flex items-center gap-1.5">
                         <div className={cn("w-2 h-2 rounded-full", i === 0 ? "bg-[#FF6B6B]" : i === 1 ? "bg-[#4D96FF]" : "bg-[#6BCB77]")} />
                         <span className="text-[8px] font-bold text-black/40 uppercase">{cat}</span>
                      </div>
                   ))}
                </div>
             </div>
             <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={districtData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000008" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 10, fontWeight: 700, fill: '#00000040'}}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 10, fontWeight: 700, fill: '#00000040'}}
                    />
                    <Tooltip 
                       contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'}}
                    />
                    <Bar dataKey="roads" fill="#FF6B6B" radius={[6, 6, 0, 0]} barSize={20} />
                    <Bar dataKey="water" fill="#4D96FF" radius={[6, 6, 0, 0]} barSize={20} />
                    <Bar dataKey="power" fill="#6BCB77" radius={[6, 6, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Department Performance */}
          <div className="reveal-item glass rounded-[3rem] p-8 md:p-12 border border-black/5 bg-white/40 shadow-2xl shadow-black/5">
            <h3 className="font-instrument text-3xl text-black mb-12">Department Efficiency</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <EfficiencyRing value={88} label="BBMP" color="#FF6B6B" icon={Building2} />
              <EfficiencyRing value={94} label="BESCOM" color="#4D96FF" icon={Zap} />
              <EfficiencyRing value={82} label="BWSSB" color="#6BCB77" icon={Droplets} />
              <EfficiencyRing value={76} label="PWD" color="#FFD93D" icon={HardHat} />
            </div>
            
            <div className="space-y-4">
              <p className="text-xs font-bold text-black/40 uppercase tracking-widest">Efficiency Rankings</p>
              {deptPerformance.sort((a, b) => b.efficiency - a.efficiency).map((dept, i) => (
                <div key={dept.name} className="flex items-center gap-4 p-4 rounded-2xl border border-black/5 bg-white/60 hover:bg-white transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center font-bold text-black/40 text-sm">
                    #{i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-black">{dept.name}</p>
                    <div className="h-1 w-full bg-black/5 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="h-full transition-all duration-1000" 
                        style={{ width: `${dept.efficiency}%`, backgroundColor: dept.color }} 
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-black">{dept.efficiency}%</p>
                    <p className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">Improving</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-black/20 group-hover:translate-x-1 transition-transform" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="reveal-item glass rounded-[3rem] p-12 border border-black/5 bg-black text-white overflow-hidden relative group">
          <div className="absolute top-[-50%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] group-hover:scale-110 transition-transform duration-1000" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
            <div>
              <h2 className="font-instrument text-4xl md:text-5xl text-white">Demand <span className="italic opacity-60">Accountability.</span></h2>
              <p className="text-white/40 text-sm mt-4 max-w-md">
                Every data point on this dashboard is cryptographically verified by the Sahaayak Audit Engine. Transparency is not just a promise, it's a protocol.
              </p>
            </div>
            <button className="rounded-full px-12 py-5 bg-white text-black text-sm font-bold flex items-center gap-3 hover:scale-105 transition-transform">
              Download Audit Report
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
