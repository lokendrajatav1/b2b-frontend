'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  FileText,
  Clock,
  Loader2,
  ArrowRight,
  CheckCircle2,
  Phone,
  Building2,
  Star,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Vendor {
  id: string;
  businessName: string;
  category?: { name: string };
  city: string;
  verified?: boolean;
  logoUrl?: string;
}

interface VendorLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: Vendor | null;
  onSuccess?: () => void;
}

export default function VendorLoginModal({ isOpen, onClose, vendor, onSuccess }: VendorLoginModalProps) {
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !vendor) return null;

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
        setError('Please enter a valid mobile number');
        return;
    }
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
    if (!otp || otp.length < 6) {
        setError('Please enter the 6-digit OTP');
        return;
    }
    setLoading(true);
    setError('');
    try {
      // Authenticate
      const data = await apiFetch('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ phone, otp }),
      });
      
      login(data.data.token, data.data.user, true);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden relative flex flex-col md:flex-row"
      >
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 hover:bg-gray-100 rounded-full transition-colors z-[60]"
        >
            <X className="w-5 h-5" />
        </button>

        {/* Left Section: Vendor Branding & Details */}
        <div className="md:w-[280px] shrink-0 bg-[#f8fafc] border-r border-gray-100 flex flex-col overflow-hidden">
            <div className="w-full h-48 bg-white border-b border-gray-100 flex items-center justify-center overflow-hidden relative">
                {vendor.logoUrl ? (
                    <img
                        src={vendor.logoUrl}
                        alt={vendor.businessName}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#164e33]/10 to-[#164e33]/5 flex items-center justify-center">
                        <Building2 className="w-20 h-20 text-[#164e33]/20" />
                        <span className="absolute text-5xl font-bold text-[#164e33] opacity-20">{vendor.businessName.charAt(0)}</span>
                    </div>
                )}
                <div className="absolute top-3 left-3">
                    <span className="bg-[#1b5e20] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" /> Supplier
                    </span>
                </div>
            </div>

            <div className="p-6 md:p-8 flex flex-col gap-5">
                <div>
                    <span className="text-[#164e33] text-sm font-bold uppercase block mb-1.5">
                        {vendor.category?.name || 'Business Service'}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 leading-tight mb-2.5">
                        {vendor.businessName}
                    </h3>
                    <div className="flex items-center text-base font-semibold text-slate-600">
                        <MapPin className="w-4.5 h-4.5 mr-1.5 text-[#164e33]" /> {vendor.city}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 text-slate-700 text-sm font-bold rounded border border-gray-100 uppercase">
                        <FileText className="w-3.5 h-3.5" /> GST
                    </span>
                    {vendor.verified && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 text-sm font-bold rounded border border-green-100 uppercase">
                            <ShieldCheck className="w-3.5 h-3.5" /> Verified
                        </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 text-sm font-bold rounded border border-blue-100 uppercase">
                        <Clock className="w-3.5 h-3.5" /> 11 yrs
                    </span>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <Star className="w-4.5 h-4.5 fill-amber-400 text-amber-400" />
                            <span className="text-base font-bold text-slate-900">4.5</span>
                            <span className="text-sm text-slate-400 font-medium">(24)</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#164e33]">
                            <Shield className="w-4 h-4" />
                            <span className="text-sm font-bold uppercase">TrustSeal</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Section: Verification Form */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center bg-white relative">
            <div className="mb-10">
                <h3 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">Connect with this Supplier</h3>
                <p className="text-lg font-medium text-slate-600">We just need to verify your mobile number to get started.</p>
            </div>

            {error && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-4.5 bg-red-50 text-red-600 text-base font-bold border border-red-100 rounded-2xl flex items-center gap-3"
                >
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                    {error}
                </motion.div>
            )}

            <form onSubmit={otpSent ? handleVerifyOTP : handleRequestOTP} className="space-y-8">
                {!otpSent ? (
                    <div className="space-y-5">
                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-3 border-r border-gray-200 pr-4 z-10">
                                <img src="https://flagcdn.com/w20/in.png" alt="India" className="w-6 h-auto rounded-lg" />
                                <span className="text-lg font-bold text-slate-700">+91</span>
                            </div>
                            <input
                                type="tel"
                                required
                                pattern="[0-9]{10}"
                                value={phone}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/[^0-9]/g, '');
                                    if (val.length <= 10) setPhone(val);
                                }}
                                className="w-full pl-28 pr-6 py-5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-[#164e33] focus:bg-white focus:ring-4 focus:ring-[#164e33]/5 text-xl font-bold text-slate-900 transition-all placeholder:text-slate-400 placeholder:font-medium"
                                placeholder="Enter your Mobile"
                            />
                        </div>
                        <p className="text-base text-slate-600 font-semibold flex items-center gap-2 px-1">
                            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" /> Verified suppliers get your requirement instantly.
                        </p>
                    </div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }} 
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        <div className="bg-emerald-50 rounded-2xl p-5 flex items-center justify-between border border-emerald-100 shadow-sm">
                           <div className="flex flex-col">
                             <span className="text-sm text-emerald-800 font-bold uppercase mb-1">OTP sent to +91 {phone}</span>
                             <span className="text-emerald-950 font-bold text-base">Enter the code below</span>
                           </div>
                           <button type="button" onClick={() => setOtpSent(false)} className="text-emerald-700 hover:text-emerald-900 text-sm font-bold underline decoration-2 underline-offset-4 transition-all">Edit Number</button>
                        </div>
                        <input
                            type="text"
                            maxLength={6}
                            required
                            autoFocus
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                            className="w-full px-6 py-5 bg-white border-2 border-emerald-100 rounded-2xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-center text-4xl font-black text-slate-900 transition-all tracking-[0.5em] shadow-inner"
                            placeholder="••••••"
                        />
                    </motion.div>
                )}

                <button
                    type="submit"
                    disabled={loading || (!otpSent && phone.length !== 10) || (otpSent && otp.length !== 6)}
                    className={`w-full py-5 rounded-2xl font-bold text-white transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 text-lg ${
                        otpSent 
                            ? 'bg-emerald-600 hover:bg-emerald-700' 
                            : 'bg-[#164e33] hover:bg-[#113f29]'
                    } disabled:opacity-50 disabled:shadow-none disabled:active:scale-100`}
                >
                    {loading ? (
                        <Loader2 className="w-7 h-7 animate-spin" />
                    ) : (
                        otpSent ? (
                            <>Verify & Connect <CheckCircle2 className="w-6 h-6" /></>
                        ) : (
                            <>Continue <ArrowRight className="w-6 h-6" /></>
                        )
                    )}
                </button>
            </form>

            <div className="mt-12 pt-8 border-t border-gray-50">
                <p className="text-center text-base text-slate-500 font-bold leading-relaxed">
                    By logging in, you agree to our <a href="#" className="text-slate-800 hover:underline">Terms of Service</a> and <a href="#" className="text-slate-800 hover:underline">Privacy Policy</a>.
                </p>
            </div>
        </div>
      </motion.div>
    </div>
  );
}

