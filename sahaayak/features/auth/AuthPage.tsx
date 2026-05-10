'use client';

import React, { useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { 
  MessageSquare, 
  CheckCircle2, 
  Activity, 
  ShieldCheck, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  MapPin, 
  Briefcase, 
  ChevronRight,
  Globe,
  ArrowLeft,
  Building
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

// --- Components ---

const GlassCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`glass border border-white/20 bg-white/40 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl shadow-black/5 ${className}`}>
    {children}
  </div>
);

const InputField = ({ icon: Icon, label, ...props }: any) => (
  <div className="space-y-2 group">
    <label className="text-xs font-bold tracking-widest uppercase text-black/40 ml-1">{label}</label>
    <div className="relative">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-black transition-colors">
        <Icon size={18} />
      </div>
      <input 
        {...props}
        className="w-full bg-white/50 border border-black/5 rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:bg-white transition-all placeholder:text-black/20"
      />
    </div>
  </div>
);

// --- Main Feature Component ---

type AuthState = 'login' | 'register' | 'forgot_password' | 'otp' | 'admin';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<AuthState>('login');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useGSAP(() => {
    if (!isLoaded) return;

    const tl = gsap.timeline();
    
    tl.from('.auth-reveal', {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: 'power4.out'
    });

    gsap.to('.blob-1', {
      x: '10%',
      y: '10%',
      duration: 20,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    gsap.to('.blob-2', {
      x: '-10%',
      y: '-10%',
      duration: 25,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 2
    });
  }, [isLoaded]);

  return (
    <div className="relative min-h-screen w-full bg-[#FAFAFA] overflow-hidden flex items-center justify-center font-inter px-4 py-20">
      
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="blob-1 absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-400/10 rounded-full blur-[150px] mix-blend-multiply" />
        <div className="blob-2 absolute bottom-[-10%] right-[-10%] w-[1000px] h-[1000px] bg-pink-400/10 rounded-full blur-[180px] mix-blend-multiply" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-blue-50/50 via-transparent to-pink-50/50 opacity-50" />
      </div>

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
        
        {/* Left Side: Branding/Story */}
        <div className="hidden lg:flex flex-col space-y-12 auth-reveal">
          <Link href="/" className="flex items-center gap-3 group w-fit">
            <div className="w-10 h-10 rounded-full glass border border-black/5 flex items-center justify-center bg-white/60 group-hover:scale-110 transition-transform">
              <ArrowLeft size={18} />
            </div>
            <span className="text-sm font-bold tracking-widest uppercase text-black/60">Back to Platform</span>
          </Link>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-blue-500/10 bg-blue-50/30 text-blue-600 text-xs font-bold tracking-widest uppercase">
              <ShieldCheck size={14} />
              {activeTab === 'admin' ? 'Secure Official Portal' : 'Secure Citizen Portal'}
            </div>
            <h1 className="font-instrument text-7xl xl:text-8xl tracking-tighter text-black leading-[0.9]">
              Every citizen deserves to <span className="italic text-black/40">be heard.</span>
            </h1>
            <p className="text-xl text-black/50 font-light leading-relaxed max-w-lg">
              Sahaayak empowers Karnataka citizens with transparent civic complaint tracking, AI-powered verification, and accountable governance.
            </p>
          </div>

          {/* Stats & Cards */}
          <div className="grid grid-cols-2 gap-6">
            <GlassCard className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                <Activity size={24} />
              </div>
              <div>
                <div className="text-3xl font-instrument">14,280+</div>
                <div className="text-xs font-bold tracking-widest uppercase text-black/40">Active Complaints</div>
              </div>
            </GlassCard>

            <GlassCard className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <div className="text-3xl font-instrument">92%</div>
                <div className="text-xs font-bold tracking-widest uppercase text-black/40">Resolution Rate</div>
              </div>
            </GlassCard>
            
            <div className="col-span-2 glass border border-black/5 bg-white/20 p-4 rounded-3xl flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-200">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" />
                  </div>
                ))}
              </div>
              <div className="text-sm text-black/60">
                <span className="font-bold text-black">400+ Citizens</span> joined in the last 24h
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Card */}
        <div className="auth-reveal">
          <GlassCard className="p-10 md:p-12 border-white/40">
            {/* Tabs */}
            {(activeTab === 'login' || activeTab === 'register') && (
              <div className="flex p-1.5 bg-black/5 rounded-2xl mb-10">
                <button 
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'login' ? 'bg-white text-black shadow-lg' : 'text-black/40 hover:text-black/60'}`}
                >
                  Citizen Login
                </button>
                <button 
                  onClick={() => setActiveTab('register')}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'register' ? 'bg-white text-black shadow-lg' : 'text-black/40 hover:text-black/60'}`}
                >
                  Register
                </button>
              </div>
            )}

            {activeTab === 'login' && <LoginForm setTab={setActiveTab} />}
            {activeTab === 'register' && <RegisterForm setTab={setActiveTab} />}
            {activeTab === 'forgot_password' && <ForgotPasswordForm setTab={setActiveTab} />}
            {activeTab === 'otp' && <OTPForm setTab={setActiveTab} />}
            {activeTab === 'admin' && <AdminLoginForm setTab={setActiveTab} />}
          </GlassCard>

          <p className="text-center mt-8 text-sm text-black/40">
            By continuing, you agree to Sahaayak's <span className="text-black font-medium underline cursor-pointer">Terms of Service</span> and <span className="text-black font-medium underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>

      </div>
    </div>
  );
}

// --- Sub Forms ---

function LoginForm({ setTab }: { setTab: (tab: AuthState) => void }) {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check URL params for OAuth callback errors
    const params = new URLSearchParams(window.location.search);
    if (params.get('error') === 'auth_callback_error') {
      setError('Google login failed. Please try again.');
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) setError(authError.message);
    else window.location.href = '/';
    setLoading(false);
  };

  const handleGoogleAuth = async () => {
    await supabase.auth.signInWithOAuth({ 
      provider: 'google', 
      options: { 
        redirectTo: window.location.origin + '/auth/callback' 
      } 
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h2 className="font-instrument text-4xl">Welcome back.</h2>
        <p className="text-sm text-black/40">Enter your credentials to access your dashboard.</p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-6">
        <InputField icon={Mail} label="Email Address" placeholder="name@example.com" type="email" required value={email} onChange={(e: any) => setEmail(e.target.value)} />
        <InputField icon={Lock} label="Password" placeholder="••••••••" type="password" required value={password} onChange={(e: any) => setPassword(e.target.value)} />

        <div className="flex items-center justify-between px-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-black/10 text-black focus:ring-black/5" />
            <span className="text-xs text-black/60 group-hover:text-black transition-colors">Remember me</span>
          </label>
          <button type="button" onClick={() => setTab('forgot_password')} className="text-xs font-bold text-black hover:opacity-60 transition-opacity">Forgot password?</button>
        </div>

        <button disabled={loading} className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-xl shadow-black/10 disabled:opacity-50">
          {loading ? 'Logging in...' : 'Login to Account'}
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </form>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-black/5"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest">
          <span className="bg-white/10 px-4 text-black/40 font-bold backdrop-blur-md">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button type="button" onClick={handleGoogleAuth} className="glass border border-black/5 bg-white/60 py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-white transition-all group">
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4 grayscale group-hover:grayscale-0 transition-all" alt="Google" />
          <span className="text-sm font-bold">Google</span>
        </button>
        <button type="button" onClick={() => setTab('otp')} className="glass border border-black/5 bg-white/60 py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-white transition-all group">
          <Phone size={18} className="text-black/40 group-hover:text-black transition-all" />
          <span className="text-sm font-bold">OTP Login</span>
        </button>
      </div>

      <div className="text-center">
        <button type="button" onClick={() => setTab('admin')} className="text-xs font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors">
          Government Official Login
        </button>
      </div>
    </div>
  );
}

function RegisterForm({ setTab }: { setTab: (tab: AuthState) => void }) {
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '', age: '', gender: 'Male', phone: '', occupation: 'Student',
    house: '', area: '', district: 'Bengaluru Urban', pincode: '', language: 'English',
    email: '', password: '', confirmPassword: '', anonymousMode: false
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          age: formData.age,
          gender: formData.gender,
          phone: formData.phone,
          occupation: formData.occupation,
          address: `${formData.house}, ${formData.area}, ${formData.pincode}`,
          district: formData.district,
          preferred_language: formData.language,
          anonymous_mode: formData.anonymousMode,
          role: 'citizen'
        }
      }
    });

    if (error) {
      alert(error.message);
    } else if (data.session) {
      // Automatically logged in (Email confirmation is likely disabled)
      window.location.href = '/';
    } else {
      // Email confirmation is enabled
      alert('Registration successful! Please check your email to verify your account.');
      setTab('login');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-black' : 'bg-black/5'}`} />
          ))}
        </div>
        <h2 className="font-instrument text-4xl">Join the movement.</h2>
        <p className="text-sm text-black/40">Step {step} of 3: {step === 1 ? 'Personal Details' : step === 2 ? 'Address Information' : 'Account Security'}</p>
      </div>

      <form className="space-y-6">
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <InputField icon={User} label="Full Name" placeholder="Rahul Sharma" value={formData.fullName} onChange={(e: any) => setFormData({...formData, fullName: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <InputField icon={Activity} label="Age" placeholder="24" type="number" value={formData.age} onChange={(e: any) => setFormData({...formData, age: e.target.value})} />
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest uppercase text-black/40 ml-1">Gender</label>
                <select value={formData.gender} onChange={(e: any) => setFormData({...formData, gender: e.target.value})} className="w-full bg-white/50 border border-black/5 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all appearance-none">
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <InputField icon={Phone} label="Phone Number" placeholder="+91 ••••• •••••" value={formData.phone} onChange={(e: any) => setFormData({...formData, phone: e.target.value})} />
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-widest uppercase text-black/40 ml-1">Occupation</label>
              <select value={formData.occupation} onChange={(e: any) => setFormData({...formData, occupation: e.target.value})} className="w-full bg-white/50 border border-black/5 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all appearance-none">
                <option>Student</option>
                <option>Employee</option>
                <option>Government Worker</option>
                <option>Business</option>
                <option>Farmer</option>
                <option>Homemaker</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <InputField icon={MapPin} label="House / Street" placeholder="No. 12, MG Road" value={formData.house} onChange={(e: any) => setFormData({...formData, house: e.target.value})} />
            <InputField icon={MapPin} label="Area / Locality" placeholder="Indiranagar" value={formData.area} onChange={(e: any) => setFormData({...formData, area: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest uppercase text-black/40 ml-1">District</label>
                <select value={formData.district} onChange={(e: any) => setFormData({...formData, district: e.target.value})} className="w-full bg-white/50 border border-black/5 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all appearance-none">
                  <option>Bengaluru Urban</option>
                  <option>Mysuru</option>
                  <option>Dharwad</option>
                  <option>Belagavi</option>
                </select>
              </div>
              <InputField icon={MapPin} label="Pincode" placeholder="560038" value={formData.pincode} onChange={(e: any) => setFormData({...formData, pincode: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-widest uppercase text-black/40 ml-1">Preferred Language</label>
              <div className="flex gap-4">
                <label className="flex-1 cursor-pointer group">
                  <input type="radio" name="lang" className="peer hidden" checked={formData.language === 'English'} onChange={() => setFormData({...formData, language: 'English'})} />
                  <div className="py-3 text-center rounded-xl border border-black/5 bg-white/50 peer-checked:bg-black peer-checked:text-white transition-all font-bold text-sm">English</div>
                </label>
                <label className="flex-1 cursor-pointer group">
                  <input type="radio" name="lang" className="peer hidden" checked={formData.language === 'Kannada'} onChange={() => setFormData({...formData, language: 'Kannada'})} />
                  <div className="py-3 text-center rounded-xl border border-black/5 bg-white/50 peer-checked:bg-black peer-checked:text-white transition-all font-bold text-sm">ಕನ್ನಡ</div>
                </label>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <InputField icon={Mail} label="Email Address" placeholder="rahul@example.com" type="email" value={formData.email} onChange={(e: any) => setFormData({...formData, email: e.target.value})} />
            <InputField icon={Lock} label="Password" placeholder="••••••••" type="password" value={formData.password} onChange={(e: any) => setFormData({...formData, password: e.target.value})} />
            <InputField icon={Lock} label="Confirm Password" placeholder="••••••••" type="password" value={formData.confirmPassword} onChange={(e: any) => setFormData({...formData, confirmPassword: e.target.value})} />
            
            <div className="p-4 rounded-2xl border border-black/5 bg-white/30 space-y-3">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm font-medium text-black/60 group-hover:text-black">Anonymous Mode</span>
                <input type="checkbox" className="sr-only peer" checked={formData.anonymousMode} onChange={(e: any) => setFormData({...formData, anonymousMode: e.target.checked})} />
                <div className="w-11 h-6 bg-black/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black relative"></div>
              </label>
              <p className="text-[10px] text-black/30 leading-tight">
                When enabled, your identity will be hidden from departments. Note that this might affect resolution time for some issues.
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-4 pt-2">
          {step > 1 && (
            <button 
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-6 py-4 rounded-2xl border border-black/5 font-bold hover:bg-black/5 transition-all"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button 
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex-1 bg-black text-white py-4 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-xl shadow-black/10"
            >
              Next Step
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button 
              type="button"
              onClick={handleRegister}
              disabled={loading}
              className="flex-1 bg-black text-white py-4 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-xl shadow-black/10 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Citizen Account'}
              <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function ForgotPasswordForm({ setTab }: { setTab: (tab: AuthState) => void }) {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) alert(error.message);
    else alert('Password reset link sent to your email.');
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button onClick={() => setTab('login')} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors">
        <ArrowLeft size={14} /> Back to Login
      </button>

      <div className="space-y-2">
        <h2 className="font-instrument text-4xl">Reset Password.</h2>
        <p className="text-sm text-black/40">Enter your email to receive a recovery link.</p>
      </div>

      <form onSubmit={handleReset} className="space-y-6">
        <InputField icon={Mail} label="Email Address" placeholder="name@example.com" type="email" required value={email} onChange={(e: any) => setEmail(e.target.value)} />

        <button disabled={loading} className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-xl shadow-black/10 disabled:opacity-50">
          {loading ? 'Sending link...' : 'Send Recovery Link'}
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </div>
  );
}

function OTPForm({ setTab }: { setTab: (tab: AuthState) => void }) {
  const supabase = createClient();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) alert(error.message);
    else setStep(2);
    setLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' });
    if (error) alert(error.message);
    else window.location.href = '/';
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button onClick={() => setTab('login')} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors">
        <ArrowLeft size={14} /> Back to Email Login
      </button>

      <div className="space-y-2">
        <h2 className="font-instrument text-4xl">Phone Login.</h2>
        <p className="text-sm text-black/40">{step === 1 ? 'Enter your mobile number to receive an OTP.' : 'Enter the 6-digit OTP sent to your phone.'}</p>
      </div>

      <form onSubmit={step === 1 ? handleSendOTP : handleVerifyOTP} className="space-y-6">
        {step === 1 ? (
          <InputField icon={Phone} label="Phone Number" placeholder="+91 ••••• •••••" type="tel" required value={phone} onChange={(e: any) => setPhone(e.target.value)} />
        ) : (
          <InputField icon={Lock} label="One-Time Password" placeholder="123456" type="text" required value={otp} onChange={(e: any) => setOtp(e.target.value)} />
        )}

        <button disabled={loading} className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-xl shadow-black/10 disabled:opacity-50">
          {loading ? 'Processing...' : step === 1 ? 'Send OTP' : 'Verify & Login'}
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </div>
  );
}

function AdminLoginForm({ setTab }: { setTab: (tab: AuthState) => void }) {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      alert(error.message);
    } else if (data.user?.user_metadata?.role !== 'admin') {
      alert("Access Denied: This account does not have administrative privileges.");
      await supabase.auth.signOut();
    } else {
      window.location.href = '/';
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button onClick={() => setTab('login')} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors">
        <ArrowLeft size={14} /> Back to Citizen Login
      </button>

      <div className="space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center text-black mb-4">
          <Building size={24} />
        </div>
        <h2 className="font-instrument text-4xl">Admin Portal.</h2>
        <p className="text-sm text-black/40">Secure access for government officials and reviewers.</p>
      </div>

      <form onSubmit={handleAdminLogin} className="space-y-6">
        <InputField icon={Mail} label="Official Email" placeholder="admin@karnataka.gov.in" type="email" required value={email} onChange={(e: any) => setEmail(e.target.value)} />
        <InputField icon={Lock} label="Admin Password" placeholder="••••••••" type="password" required value={password} onChange={(e: any) => setPassword(e.target.value)} />

        <button disabled={loading} className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-xl shadow-black/10 disabled:opacity-50">
          {loading ? 'Authenticating...' : 'Access Admin Dashboard'}
          <ShieldCheck size={18} className="group-hover:scale-110 transition-transform" />
        </button>
      </form>
    </div>
  );
}
