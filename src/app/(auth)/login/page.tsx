'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { 
  LogIn, 
  Mail, 
  Lock, 
  Eye,
  EyeOff,
  Loader2, 
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<'PHONE' | 'EMAIL'>('PHONE'); // Default to Phone (Buyer focus)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();
  
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      login(data.data.token, data.data.user);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await apiFetch('/auth/request-otp', {
        method: 'POST',
        body: JSON.stringify({ phone }),
      });
      setOtpSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to request OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ phone, otp }),
      });
      login(data.data.token, data.data.user);
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const TabButton = ({ type, label }: { type: 'PHONE' | 'EMAIL', label: string }) => (
    <button 
        onClick={() => { setLoginMethod(type); setError(''); setOtpSent(false); }}
        className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${loginMethod === type ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
    >
        {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
            <Link href="/" className="inline-flex mb-8">
              <h1 className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-1.5">
                B2B Community <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              </h1>
            </Link>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-slate-500 text-sm">Please sign in to access your account.</p>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 border border-slate-100 p-8 sm:p-10">
            <div className="flex p-1.5 bg-slate-50 border border-slate-100 rounded-2xl mb-8">
                <TabButton type="PHONE" label="Buyer (OTP)" />
                <TabButton type="EMAIL" label="Vendor (Email)" />
            </div>

            <div className="space-y-6">
               {error && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 text-red-600 text-sm font-medium border border-red-100 rounded-xl">
                     {error}
                  </motion.div>
               )}

               <AnimatePresence mode="wait">
                 {loginMethod === 'EMAIL' ? (
                    <motion.form key="email" initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 5 }} onSubmit={handleEmailLogin} className="space-y-6">
                           <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                              <div className="relative group">
                                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                 <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white text-sm text-slate-700 transition-all"
                                    placeholder="Enter your email"
                                 />
                              </div>
                           </div>

                           <div className="space-y-1.5">
                              <div className="flex justify-between items-center ml-1 mr-1">
                                 <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                                 <Link href="#" className="text-xs font-bold text-blue-600 hover:underline">Forgot?</Link>
                              </div>
                              <div className="relative group">
                                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                 <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-11 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white text-sm text-slate-700 transition-all"
                                    placeholder="••••••••"
                                 />
                                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 p-1">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                 </button>
                              </div>
                           </div>

                           <button type="submit" disabled={loading} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm shadow-blue-200">
                              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In'}
                              {!loading && <ArrowRight className="w-4 h-4" />}
                           </button>
                    </motion.form>
                 ) : (
                    <motion.form key="phone" initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 5 }} onSubmit={otpSent ? handleVerifyOTP : handleRequestOTP} className="space-y-6">
                           <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Phone Number</label>
                              <div className="relative group">
                                 <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                 <input
                                    type="tel"
                                    required
                                    disabled={otpSent}
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white text-sm text-slate-700 transition-all"
                                    placeholder="+91..."
                                 />
                              </div>
                           </div>

                           {otpSent && (
                             <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-1.5 pt-2">
                                 <label className="text-xs font-bold text-emerald-600 uppercase tracking-wider ml-1">Verification OTP</label>
                                 <div className="relative group">
                                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                                     <input
                                         type="text"
                                         maxLength={6}
                                         required
                                         value={otp}
                                         onChange={(e) => setOtp(e.target.value)}
                                         className="w-full pl-11 pr-4 py-4 bg-emerald-50/20 border border-emerald-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 text-lg font-bold tracking-[10px] text-center text-slate-700 transition-all"
                                         placeholder="••••••"
                                     />
                                 </div>
                                 <button type="button" onClick={handleRequestOTP} className="w-full text-xs font-bold text-blue-600 hover:underline pt-2">Resend Code</button>
                             </motion.div>
                           )}

                           <button type="submit" disabled={loading} className={`w-full py-4 mt-2 ${otpSent ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-900 hover:bg-slate-800'} text-white rounded-xl font-bold transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm`}>
                              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : otpSent ? 'Authenticate' : 'Send Code'}
                              {!loading && (otpSent ? <CheckCircle2 className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />)}
                           </button>
                    </motion.form>
                 )}
               </AnimatePresence>
            </div>

            <div className="pt-10 text-center border-t border-slate-50">
               <p className="text-sm text-slate-400 mb-1">New to our platform?</p>
               <Link href="/register" className="text-sm font-bold text-blue-600 hover:underline">Register Vendor Registry</Link>
            </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-6">
            <Link href="/" className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1.5 transition-colors">
                <ArrowLeft className="w-3 h-3" /> Back to Home
            </Link>
            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
            <Link href="#" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Support Center</Link>
        </div>
      </div>
    </div>
  );
}
