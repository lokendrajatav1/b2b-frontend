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
  Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Vendor {
  id: string;
  businessName: string;
  category?: { name: string };
  city: string;
  verified?: boolean;
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
        className="w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden relative"
      >
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
            <X className="w-5 h-5" />
        </button>

        {/* Vendor Header Section */}
        <div className="bg-[#f8fafc] p-6 pb-8 border-b border-gray-100 relative">
            <span className="text-[#007367] text-base font-semibold uppercase  block mb-2">
                {vendor.category?.name || 'Business Service'}
            </span>
            <h2 className="text-xl font-semibold text-slate-900 leading-snug mb-3 pr-8">
                {vendor.businessName}
            </h2>
            
            <div className="flex items-center text-base font-medium text-slate-700 mb-4">
                <MapPin className="w-4 h-4 mr-1.5" /> {vendor.city}
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-slate-800 text-base font-semibold rounded border border-gray-200">
                    <FileText className="w-3 h-3" /> GST
                </span>
                {vendor.verified && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 text-base font-semibold rounded border border-green-200">
                        <ShieldCheck className="w-3 h-3" /> Verified Supplier
                    </span>
                )}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#007367]/5 text-blue-700 text-base font-semibold rounded border border-blue-200">
                    <Clock className="w-3 h-3" /> 11 yrs
                </span>
            </div>
        </div>

        {/* Login Form Section */}
        <div className="p-8">
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-1">Connect with this Supplier</h3>
                <p className="text-base font-medium text-slate-700">We just need to verify your mobile number to get started.</p>
            </div>

            {error && (
                <div className="mb-6 p-3 bg-red-50 text-red-600 text-base font-semibold border border-red-100 rounded-xl">
                    {error}
                </div>
            )}

            <form onSubmit={otpSent ? handleVerifyOTP : handleRequestOTP} className="space-y-5">
                {!otpSent ? (
                    <div>
                        <div className="relative flex items-center">
                            <div className="absolute left-0 pl-4 py-3 flex items-center pr-3 border-r border-gray-200 pointer-events-none">
                                <span className="text-slate-700 font-semibold text-base">+91</span>
                            </div>
                            <input
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full pl-[4.5rem] pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#007367] focus:bg-white text-slate-900 font-semibold transition-all shadow-sm"
                                placeholder="Enter your Mobile"
                            />
                        </div>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                        <div className="bg-emerald-50 rounded-xl p-4 mb-4 flex items-center justify-between border border-emerald-100">
                           <div className="flex flex-col">
                             <span className="text-emerald-800 text-base font-semibold uppercase  mb-1">We've sent a code to +91 {phone}</span>
                             <span className="text-emerald-900 font-medium text-base">Almost there! Just type it in below.</span>
                           </div>
                           <button type="button" onClick={() => setOtpSent(false)} className="text-emerald-600 hover:text-emerald-800 text-base font-semibold underline transition-colors">Edit</button>
                        </div>
                        <input
                            type="text"
                            maxLength={6}
                            required
                            autoFocus
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full px-4 py-4 bg-white border-2 border-emerald-200 rounded-xl outline-none focus:border-emerald-500 text-center text-3xl font-semibold  text-slate-900 transition-all shadow-inner"
                            placeholder="••••••"
                        />
                    </motion.div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 rounded-xl font-semibold text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                        otpSent ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-[#007367] hover:bg-[#005e54]'
                    } disabled:opacity-50`}
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        otpSent ? <>Verify & Connect <CheckCircle2 className="w-4 h-4" /></> : <>Continue <ArrowRight className="w-4 h-4" /></>
                    )}
                </button>
            </form>

            <p className="text-center text-base text-slate-500 font-medium mt-6">
                By logging in, you agree to our Terms of Service and Privacy Policy.
            </p>
        </div>
      </motion.div>
    </div>
  );
}
