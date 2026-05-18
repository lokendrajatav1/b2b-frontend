"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import VendorForgotPassword from "./VendorForgotPassword";
import VendorRegister from "./VendorRegister";

interface VendorAuthDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VendorLogin({
  isOpen,
  onClose,
}: VendorAuthDrawerProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (data?.data?.token) {
        login(data.data.token, data.data.user, false);
        onClose();
      } else {
        setError("Invalid login response. Please contact support.");
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div key="vendor-login-main" className="fixed inset-0 z-[10000] flex items-center justify-center p-4 overflow-y-auto scrollbar-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-[440px] md:max-w-[480px] bg-white rounded-2xl sm:rounded-[32px] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-20"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </button>

            <div className="p-6 sm:p-10 overflow-y-auto scrollbar-none flex-1 max-h-[92vh]">
              <div className="mb-6 sm:mb-10">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 leading-tight">Vendor Login</h2>
                  <p className="text-gray-700 text-xs sm:text-[15px]">Manage your business profile</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-100 text-center">
                    {error}
                  </div>
                )}

                <div className="relative">
                  <label className="absolute -top-2.5 left-4 bg-white px-2 text-xs sm:text-[13px] font-semibold text-[#FF4F00] z-10">
                    Business Email
                  </label>
                  <div className="flex items-center h-[54px] sm:h-[64px] border-2 border-gray-100 rounded-xl px-4 sm:px-5 focus-within:border-[#FF4F00] transition-all">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 mr-3 sm:mr-4" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none text-base sm:text-lg font-medium text-gray-900"
                      placeholder="business@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="absolute -top-2.5 left-4 bg-white px-2 text-xs sm:text-[13px] font-semibold text-[#FF4F00] z-10">
                    Password
                  </label>
                  <div className="flex items-center h-[54px] sm:h-[64px] border-2 border-gray-100 rounded-xl px-4 sm:px-5 focus-within:border-[#FF4F00] transition-all">
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 mr-3 sm:mr-4" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none text-base sm:text-lg font-medium text-gray-900"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1.5 sm:p-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                      ) : (
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(true)}
                    className="text-xs sm:text-sm font-semibold text-[#FF4F00] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[54px] sm:h-[64px] bg-[#FF4F00] hover:bg-[#e64600] text-white rounded-xl text-lg sm:text-xl font-semibold transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                  ) : (
                    'Login'
                  )}
                  {!loading && <ArrowRight className="w-4.5 h-4.5 sm:w-5 sm:h-5" />}
                </button>

                <div className="text-center pt-3 sm:pt-4 border-t border-gray-100">
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Want to sell on IndiaB2B?{' '}
                    <button
                      type="button"
                      onClick={() => setIsRegisterOpen(true)}
                      className="text-[#FF4F00] font-semibold hover:underline"
                    >
                      Register Now
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Sub-modals */}
      <VendorForgotPassword
        key="vendor-forgot-password-modal"
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        onBackToLogin={() => setIsForgotPasswordOpen(false)}
      />

      <VendorRegister
        key="vendor-register-modal"
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onBackToLogin={() => setIsRegisterOpen(false)}
      />
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
