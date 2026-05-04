'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { 
  Mail, 
  Lock, 
  Eye,
  EyeOff,
  Loader2, 
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function SubAdminGateway() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, login } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (user && user.role === 'ADMIN') {
      router.push('/admin/dashboard');
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      const user = data.data.user;
      
      // Strict role check for this gateway
      if (user.role !== 'ADMIN') {
        throw new Error('Access Denied: This gateway is strictly for Staff and Administrators.');
      }
      
      login(data.data.token, user);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

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
            <h2 className="text-2xl font-semibold text-slate-900 ">Admin Portal</h2>
            <p className="text-slate-500 text-base font-medium mt-1">Staff workspace and marketplace management.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 p-8 sm:p-10">
            <div className="flex items-center justify-center gap-2 text-base font-semibold text-[#f58220] uppercase  bg-[#f58220]/5 px-4 py-2 rounded-xl border border-[#f58220]/10 mb-8 mx-auto w-max">
                <Users className="w-4 h-4" /> Admin Workspace
            </div>

            <div className="space-y-6">
               {error && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 text-red-600 text-base font-semibold border border-red-100 rounded-xl flex items-center gap-2">
                     <AlertCircle className="w-4 h-4 shrink-0" />
                     {error}
                  </motion.div>
               )}

               <AnimatePresence mode="wait">
                  <motion.form key="email" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} onSubmit={handleLogin} className="space-y-6">
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
                                  placeholder="staff@platform.internal"
                               />
                            </div>
                         </div>

                         <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1 mr-1">
                               <label className="text-base font-semibold text-slate-500 uppercase ">Password</label>
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
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enter Workspace'}
                            {!loading && <ArrowRight className="w-4 h-4" />}
                         </button>
                  </motion.form>
               </AnimatePresence>
            </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-6">
            <Link href="/" className="text-base font-semibold text-slate-500 hover:text-[#164e33] flex items-center gap-1.5 transition-colors uppercase ">
                <ArrowLeft className="w-3 h-3" /> Main Site
            </Link>
            <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
            <Link href="/super-admin" className="text-base font-semibold text-slate-500 hover:text-[#164e33] transition-colors uppercase ">Super Admin Portal</Link>
        </div>
      </div>
    </div>
  );
}


