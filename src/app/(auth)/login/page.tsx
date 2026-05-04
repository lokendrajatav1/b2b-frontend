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
  Phone,
  ShieldCheck,
  Building2,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<'PHONE' | 'EMAIL'>('EMAIL'); 
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

  const TabButton = ({ type, label, icon: Icon }: { type: 'PHONE' | 'EMAIL', label: string, icon: any }) => (
    <button 
        onClick={() => { setLoginMethod(type); setError(''); setOtpSent(false); }}
        className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-base font-semibold rounded-xl transition-all ${loginMethod === type ? 'bg-[#164e33] text-white shadow-lg' : 'text-slate-500 hover:text-slate-800 hover:bg-gray-100'}`}
    >
        <Icon className="w-4 h-4" />
        {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#164e33]" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#164e33]/[0.02] rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#f58220]/[0.02] rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
            <Link href="/" className="inline-flex mb-6 hover:scale-105 transition-transform">
              <img src="/logo.png" alt="India B2B" className="h-16 lg:h-20 w-auto object-contain" />
            </Link>
            <h2 className="text-2xl font-semibold text-slate-900 ">Access Your Gateway</h2>
            <p className="text-slate-500 text-base font-medium mt-1">Connect with the heartbeat of Indian trade.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 p-8 sm:p-10">
            <div className="flex p-1.5 bg-gray-50 border border-gray-100 rounded-2xl mb-8">
                <TabButton type="EMAIL" label="Vendor Portal" icon={Building2} />
                <TabButton type="PHONE" label="Buyer Portal" icon={Users} />
            </div>

            <div className="space-y-6">
               {error && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 text-red-600 text-base font-semibold border border-red-100 rounded-xl flex items-center gap-2">
                     <AlertCircle className="w-4 h-4 shrink-0" />
                     {error}
                  </motion.div>
               )}

               <AnimatePresence mode="wait">
                 {loginMethod === 'EMAIL' ? (
                    <motion.form key="email" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} onSubmit={handleEmailLogin} className="space-y-6">
                           <div className="space-y-2">
                              <label className="text-base font-semibold text-slate-500 uppercase  ml-1">Email Address</label>
                              <div className="relative group">
                                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#164e33] transition-colors" />
                                 <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#164e33] focus:bg-white text-base font-medium text-slate-800 transition-all placeholder:text-gray-300"
                                    placeholder="your@email.com"
                                 />
                              </div>
                           </div>

                           <div className="space-y-2">
                              <div className="flex justify-between items-center ml-1 mr-1">
                                 <label className="text-base font-semibold text-slate-500 uppercase ">Password</label>
                                 <Link href="#" className="text-base font-semibold text-[#164e33] hover:underline uppercase ">Recover?</Link>
                              </div>
                              <div className="relative group">
                                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#164e33] transition-colors" />
                                 <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-11 py-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#164e33] focus:bg-white text-base font-medium text-slate-800 transition-all placeholder:text-gray-300"
                                    placeholder="••••••••"
                                 />
                                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-slate-800 p-1">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                 </button>
                              </div>
                           </div>

                           <button type="submit" disabled={loading} className="w-full py-4 bg-[#164e33] text-white rounded-xl font-semibold text-base hover:bg-[#113f29] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#164e33]/10">
                              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In to Dashboard'}
                              {!loading && <ArrowRight className="w-4 h-4" />}
                           </button>
                    </motion.form>
                 ) : (
                    <motion.form key="phone" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} onSubmit={otpSent ? handleVerifyOTP : handleRequestOTP} className="space-y-6">
                           <div className="space-y-2">
                              <label className="text-base font-semibold text-slate-500 uppercase  ml-1">Phone Number</label>
                              <div className="relative group">
                                 <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#164e33] transition-colors" />
                                 <input
                                    type="tel"
                                    required
                                    disabled={otpSent}
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#164e33] focus:bg-white text-base font-medium text-slate-800 transition-all placeholder:text-gray-300"
                                    placeholder="+91..."
                                 />
                              </div>
                           </div>

                           {otpSent && (
                             <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2 pt-2">
                                 <label className="text-base font-semibold text-[#164e33] uppercase  ml-1 text-center block">Enter 6-Digit OTP</label>
                                 <div className="relative group">
                                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#164e33]" />
                                     <input
                                         type="text"
                                         maxLength={6}
                                         required
                                         value={otp}
                                         onChange={(e) => setOtp(e.target.value)}
                                         className="w-full pl-11 pr-4 py-4 bg-[#164e33]/5 border border-[#164e33]/20 rounded-xl outline-none focus:bg-white focus:border-[#164e33] text-lg font-semibold  text-center text-slate-800 transition-all"
                                         placeholder="••••••"
                                     />
                                 </div>
                                 <button type="button" onClick={handleRequestOTP} className="w-full text-base font-semibold text-slate-500 hover:text-[#164e33] transition-colors pt-2 uppercase ">Resend Code</button>
                             </motion.div>
                           )}

                           <button type="submit" disabled={loading} className={`w-full py-4 mt-2 ${otpSent ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gray-900 hover:bg-gray-800'} text-white rounded-xl font-semibold text-base transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg`}>
                              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : otpSent ? 'Verify & Continue' : 'Request Secure Code'}
                              {!loading && (otpSent ? <CheckCircle2 className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />)}
                           </button>
                    </motion.form>
                 )}
               </AnimatePresence>
            </div>

            <div className="pt-10 text-center border-t border-gray-50 mt-4">
               <p className="text-base text-slate-500 mb-2 font-medium">New to the community?</p>
               <Link href="/register" className="text-base font-semibold text-[#164e33] hover:text-[#f58220] transition-colors flex items-center justify-center gap-2 group">
                  <Building2 className="w-4 h-4" />
                  Join as Verified Supplier 
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
               </Link>
               <Link href="/register/admin" className="text-base font-semibold text-slate-500 hover:text-[#164e33] transition-colors flex items-center justify-center gap-2 group mt-3 uppercase ">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Apply for Admin Hub
               </Link>
            </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-6">
            <Link href="/" className="text-base font-semibold text-slate-500 hover:text-[#164e33] flex items-center gap-1.5 transition-colors uppercase ">
                <ArrowLeft className="w-3 h-3" /> Marketplace
            </Link>
            <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
            <Link href="#" className="text-base font-semibold text-slate-500 hover:text-[#164e33] transition-colors uppercase ">Security Policy</Link>
        </div>
      </div>
    </div>
  );
}

function AlertCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  );
}


