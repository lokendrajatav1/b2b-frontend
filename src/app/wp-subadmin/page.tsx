'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { 
  ShieldAlert, 
  Mail, 
  Lock, 
  Eye,
  EyeOff,
  Loader2, 
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Terminal,
  Activity,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SubAdminGateway() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

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
      if (user.role !== 'SUBADMIN' && user.role !== 'ADMIN') {
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
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-6 selection:bg-blue-500/30">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Brand/Header */}
        <div className="text-center mb-10 space-y-4">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex p-4 bg-blue-600/10 rounded-3xl border border-blue-500/20 shadow-2xl shadow-blue-500/10"
            >
               <ShieldAlert className="w-10 h-10 text-blue-500" />
            </motion.div>
            <div className="space-y-1">
               <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic py-1 bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Access Portal
               </h1>
               <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-blue-500 uppercase tracking-[0.3em]">
                  <Activity className="w-3 h-3 animate-pulse" /> Staff Workspace
               </div>
            </div>
        </div>

        {/* Login Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-[#121214] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] transform translate-x-4 -translate-y-4">
               <Terminal className="w-32 h-32 text-white" />
            </div>

            <div className="relative z-10 space-y-8">
               <div className="space-y-2">
                  <h2 className="text-xl font-bold text-white tracking-tight uppercase">Welcome Back</h2>
                  <p className="text-sm font-medium text-gray-500 leading-relaxed">Log in with your staff account to manage the marketplace.</p>
               </div>

               <form onSubmit={handleLogin} className="space-y-6">
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-bold flex items-center gap-3"
                    >
                       <ShieldAlert className="w-4 h-4 shrink-0" /> {error}
                    </motion.div>
                  )}

                  <div className="space-y-5">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative group/input">
                           <div className="absolute inset-y-0 left-4 flex items-center text-gray-500 group-focus-within/input:text-blue-500 transition-colors">
                              <Mail className="w-4 h-4" />
                           </div>
                           <input 
                              required
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full bg-[#1a1a1e] border border-white/5 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50 focus:bg-[#1a1a1e] text-sm text-white font-medium transition-all shadow-inner"
                              placeholder="staff@platform.internal"
                           />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative group/input">
                           <div className="absolute inset-y-0 left-4 flex items-center text-gray-500 group-focus-within/input:text-blue-500 transition-colors">
                              <Lock className="w-4 h-4" />
                           </div>
                           <input 
                              required
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full bg-[#1a1a1e] border border-white/5 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-blue-500/50 focus:bg-[#1a1a1e] text-sm text-white font-medium transition-all shadow-inner"
                              placeholder="••••••••"
                           />
                           <button 
                             type="button" 
                             onClick={() => setShowPassword(!showPassword)}
                             className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                           >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                           </button>
                        </div>
                     </div>
                  </div>

                  <button 
                    disabled={loading}
                    className="w-full py-4 mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold tracking-wide transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 uppercase text-xs"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Zap className="w-4 h-4" /> Enter Workspace
                      </>
                    )}
                  </button>
               </form>

               <div className="flex items-center justify-center gap-4 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/5 px-3 py-1.5 rounded-full border border-emerald-500/10">
                     <ShieldCheck className="w-3.5 h-3.5" /> Secure Access
                  </div>
                  <div className="w-1 h-1 bg-white/10 rounded-full" />
                  <Link href="/login" className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors">
                     Standard Login
                  </Link>
               </div>
            </div>
        </motion.div>

        {/* Footer Links */}
        <div className="mt-10 flex items-center justify-between px-4">
            <Link href="/" className="text-[10px] font-bold text-gray-600 hover:text-blue-500 flex items-center gap-2 transition-all group">
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> RETURN TO MAIN SITE
            </Link>
            <div className="flex items-center gap-6">
                <span className="text-[10px] font-bold text-gray-700 uppercase tracking-tighter">NODE_V.2.4.0</span>
                <span className="text-[10px] font-bold text-gray-700 uppercase tracking-tighter">SSL_ACTIVE</span>
            </div>
        </div>
      </div>
    </div>
  );
}
