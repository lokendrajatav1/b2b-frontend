'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { 
  Lock, 
  Mail, 
  Loader2, 
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      const user = data.data.user;
      
      if (user.role !== 'ADMIN') {
        setError('UNAUTHORIZED ACCESS');
        setLoading(false);
        return;
      }

      login(data.data.token, user);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
           <Link href="/" className="inline-block group mb-6 text-center">
              <h1 className="text-3xl font-black text-[#05252e] tracking-tighter flex items-center justify-center">
                  B2B Community
                  <span className="w-2.5 h-2.5 bg-red-600 rounded-full ml-1 mb-1 animate-pulse"></span>
              </h1>
              <p className="text-slate-400 font-bold uppercase tracking-[4px] text-[9px] mt-2">Administrative Dashboard</p>
           </Link>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] border-2 border-slate-100 space-y-8">
           {error && (
              <div className="p-4 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest border border-red-100 rounded-2xl flex items-center gap-3">
                 <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                 {error}
              </div>
           )}

           <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Admin Email</label>
                 <div className="relative group">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 group-focus-within:text-red-600 transition-all" />
                    <input
                       type="email"
                       required
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       className="w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-red-600/20 text-[14px] font-bold text-[#05252e] transition-all"
                       placeholder="admin@marketplace.com"
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">password</label>
                 <div className="relative group">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 group-focus-within:text-red-600 transition-all" />
                    <input
                       type="password"
                       required
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       className="w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-red-600/20 text-[14px] font-bold text-[#05252e] transition-all font-mono"
                       placeholder="••••••••"
                    />
                 </div>
              </div>

              <button
                 type="submit"
                 disabled={loading}
                 className="w-full py-6 bg-[#0a0f16] text-white rounded-[1.8rem] font-black text-[11px] uppercase tracking-[5px] hover:bg-red-600 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>login <ArrowRight className="w-4 h-4" /></>}
              </button>
           </form>

           <div className="pt-8 border-t border-slate-50 text-center">
              <Link 
                href="/" 
                className="text-[9px] font-black text-slate-400 uppercase tracking-[4px] hover:text-[#05252e] transition-colors inline-flex items-center gap-2"
              >
                 <ArrowLeft className="w-3 h-3" /> Back to Surface
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
