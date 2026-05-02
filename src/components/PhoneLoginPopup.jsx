'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { X, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PhoneLoginPopup() {
  const { user, login } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const hasSkipped = sessionStorage.getItem('login_popup_skipped');
    if (!user && !hasSkipped) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleSkip = () => {
    sessionStorage.setItem('login_popup_skipped', 'true');
    setIsOpen(false);
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
        setError('Enter valid number');
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
    } catch (err) {
      setError(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
        setError('Enter code');
        return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ phone, otp }),
      });
      login(data.data.token, data.data.user, true);
      setIsOpen(false);
    } catch (err) {
      setError(err.message || 'Invalid');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10000 flex items-center justify-center p-6 bg-white/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-white border border-gray-100 rounded-3xl shadow-sm relative overflow-hidden"
      >
        <button 
            onClick={handleSkip} 
            className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 transition-colors"
        >
            <span className="text-base mr-2">Skip</span>
            <X className="w-4 h-4" />
        </button>

        <div className="p-10 pt-16">
            <div className="mb-8">
                <h3 className="text-xl text-slate-900 mb-2">Welcome</h3>
                <p className="text-base text-slate-700">Sign in to continue to community.</p>
            </div>

            {error && (
                <div className="mb-6 py-2 text-base text-red-500 border-t border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={otpSent ? handleVerifyOTP : handleRequestOTP} className="space-y-4">
                {!otpSent ? (
                    <div>
                        <div className="flex border-b border-gray-200">
                            <span className="py-4 pr-3 text-slate-500 text-base">+91</span>
                            <input
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full py-4 bg-transparent outline-none text-slate-900 text-base"
                                placeholder="Mobile number"
                            />
                        </div>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="flex justify-between items-center mb-4 text-base">
                          <span className="text-slate-700">OTP sent to +91 {phone}</span>
                          <button type="button" onClick={() => setOtpSent(false)} className="text-slate-500 underline">Edit</button>
                        </div>
                        <input
                            type="text"
                            maxLength={6}
                            required
                            autoFocus
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full py-4 border-b border-gray-200 outline-none text-center text-xl  text-slate-900"
                            placeholder="Code"
                        />
                    </motion.div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gray-900 text-white rounded-full text-base transition-opacity hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                        otpSent ? 'Verify' : 'Continue'
                    )}
                </button>
            </form>
        </div>
      </motion.div>
    </div>
  );
}
