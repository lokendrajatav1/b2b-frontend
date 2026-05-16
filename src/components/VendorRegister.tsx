"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Loader2,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/api";

interface VendorRegisterProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin: () => void;
}

export default function VendorRegister({
  isOpen,
  onClose,
  onBackToLogin,
}: VendorRegisterProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted) return null;

  const handleSendOTP = async () => {
    if (!formData.email) {
      setError("Please enter your email address");
      return;
    }
    setOtpLoading(true);
    setError("");
    try {
      await apiFetch("/auth/request-email-otp", {
        method: "POST",
        body: JSON.stringify({ email: formData.email }),
      });
      setOtpSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to send verification code");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!otpSent) {
      setError("Please verify your email address first");
      setLoading(false);
      return;
    }

    try {
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          role: "VENDOR",
        }),
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 overflow-y-auto no-scrollbar">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-[560px] bg-white rounded-[32px] shadow-2xl overflow-hidden my-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-20"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            <div className="p-10">
              <div className="mb-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 leading-tight">
                    Join as Supplier
                  </h2>
                  <p className="text-gray-500 text-[15px]">
                    Create your business profile
                  </p>
                </div>
              </div>

              {success ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Registration Successful
                  </h3>
                  <p className="text-gray-500 mb-8">
                    Your account has been created. <br />
                    Please login to access your dashboard.
                  </p>
                  <button
                    onClick={onBackToLogin}
                    className="w-full h-[64px] bg-[#FF4F00] text-white rounded-xl text-xl font-semibold hover:bg-[#e64600] transition-all"
                  >
                    Login Now
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-100 text-center">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="absolute -top-2 left-4 bg-white px-2 text-[11px] font-semibold text-[#FF4F00] z-10">
                        Name
                      </label>
                      <div className="flex items-center h-[54px] border-2 border-gray-100 rounded-xl px-4 focus-within:border-[#FF4F00] transition-all">
                        <User className="w-4 h-4 text-gray-400 mr-3" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="flex-1 bg-transparent border-none outline-none text-[15px] font-medium text-gray-900"
                          placeholder="Your Name"
                          required
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <label className="absolute -top-2 left-4 bg-white px-2 text-[11px] font-semibold text-[#FF4F00] z-10">
                        Phone
                      </label>
                      <div className="flex items-center h-[54px] border-2 border-gray-100 rounded-xl px-4 focus-within:border-[#FF4F00] transition-all">
                        <Phone className="w-4 h-4 text-gray-400 mr-3" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="flex-1 bg-transparent border-none outline-none text-[15px] font-medium text-gray-900"
                          placeholder="+91..."
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <label className="absolute -top-2 left-4 bg-white px-2 text-[11px] font-semibold text-[#FF4F00] z-10">
                      Email
                    </label>
                    <div className="flex gap-2">
                      <div className="flex items-center h-[54px] flex-1 border-2 border-gray-100 rounded-xl px-4 focus-within:border-[#FF4F00] transition-all">
                        <Mail className="w-4 h-4 text-gray-400 mr-3" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="flex-1 bg-transparent border-none outline-none text-[15px] font-medium text-gray-900"
                          placeholder="business@example.com"
                          required
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        disabled={otpLoading || otpSent}
                        className="px-4 h-[54px] bg-gray-900 text-white rounded-xl text-sm font-semibold disabled:bg-emerald-500 transition-all"
                      >
                        {otpLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : otpSent ? (
                          "Sent"
                        ) : (
                          "Verify"
                        )}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {otpSent && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="relative"
                      >
                        <label className="absolute -top-2 left-4 bg-white px-2 text-[11px] font-semibold text-emerald-600 z-10">
                          OTP Code
                        </label>
                        <div className="flex items-center h-[54px] border-2 border-emerald-100 bg-emerald-50/10 rounded-xl px-4 focus-within:border-emerald-500 transition-all">
                          <KeyRound className="w-4 h-4 text-emerald-500 mr-3" />
                          <input
                            type="text"
                            value={formData.otp}
                            onChange={(e) =>
                              setFormData({ ...formData, otp: e.target.value })
                            }
                            className="flex-1 bg-transparent border-none outline-none text-lg font-semibold text-gray-900 text-center tracking-[0.5em]"
                            placeholder="000000"
                            maxLength={6}
                            required
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="absolute -top-2 left-4 bg-white px-2 text-[11px] font-semibold text-[#FF4F00] z-10">
                        Password
                      </label>
                      <div className="flex items-center h-[54px] border-2 border-gray-100 rounded-xl px-4 focus-within:border-[#FF4F00] transition-all">
                        <Lock className="w-4 h-4 text-gray-400 mr-3" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              password: e.target.value,
                            })
                          }
                          className="flex-1 bg-transparent border-none outline-none text-[15px] font-medium text-gray-900"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <label className="absolute -top-2 left-4 bg-white px-2 text-[11px] font-semibold text-[#FF4F00] z-10">
                        Confirm
                      </label>
                      <div className="flex items-center h-[54px] border-2 border-gray-100 rounded-xl px-4 focus-within:border-[#FF4F00] transition-all">
                        <Lock className="w-4 h-4 text-gray-400 mr-3" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="flex-1 bg-transparent border-none outline-none text-[15px] font-medium text-gray-900"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-[64px] bg-gray-900 text-white rounded-xl text-xl font-semibold hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                  >
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      "Create Account"
                    )}
                    {!loading && <ArrowRight className="w-5 h-5" />}
                  </button>

                  <div className="text-center pt-4 border-t border-gray-100">
                    <p className="text-gray-500 text-sm">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={onBackToLogin}
                        className="text-[#FF4F00] font-semibold hover:underline"
                      >
                        Login here
                      </button>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
