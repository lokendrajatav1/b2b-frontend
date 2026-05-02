"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { UserCircle, Mail, Phone, ShieldCheck, Edit3, Check, X, Loader2, Camera, User as UserIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '@/lib/api';

export default function ProfilePage() {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user && !isEditing) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || ''
      });
    }
  }, [user, isEditing]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await apiFetch('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
      await refreshUser(); // Refresh user data in context
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
      setIsEditing(false);
    } catch (error: any) {
      console.error('Failed to update profile', error);
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const data = new FormData();
      data.append('image', file);

      await apiFetch('/auth/upload-avatar', {
        method: 'POST',
        body: data
      });
      
      setMessage({ type: 'success', text: 'Profile identity updated successfully.' });
      await refreshUser();
    } catch (error: any) {
      console.error('Failed to upload image', error);
      setMessage({ type: 'error', text: error.message || 'Failed to synchronize profile image.' });
    } finally {
      setUploading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-emerald-50/30 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#1b5e20]/20 border-t-[#1b5e20] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">My Profile</h1>
            <p className="text-base text-slate-800 mt-1">Manage your account details and preferences.</p>
          </div>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-[#1b5e20] text-white px-5 py-2.5 rounded-none text-base font-semibold hover:bg-[#145218] active:bg-[#0e3b12] transition-all shadow-md hover:shadow-lg focus:outline-none"
            >
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsEditing(false)}
                disabled={saving}
                className="flex items-center gap-2 bg-white border border-gray-200 text-slate-800 px-4 py-2.5 rounded-none text-base font-semibold hover:bg-gray-50 active:bg-gray-100 transition-all shadow-sm disabled:opacity-50"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-[#1b5e20] text-white px-5 py-2.5 rounded-none text-base font-semibold hover:bg-[#145218] active:bg-[#0e3b12] transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save
              </button>
            </div>
          )}
        </div>
        
        {/* Notification */}
        <AnimatePresence mode="wait">
          {message.text && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-5 rounded-none border flex items-center gap-4 text-base font-bold shadow-lg ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-emerald-500/10' : 'bg-red-50 text-red-700 border-red-100 shadow-red-500/10'}`}
            >
              {message.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-none p-8 border border-emerald-100/60 shadow-sm relative z-10"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
            {/* Avatar Section */}
            <div className="shrink-0 group">
              <div className="relative w-32 h-32">
                <div className="w-full h-full rounded-none overflow-hidden border-4 border-gray-50 bg-gray-100 flex items-center justify-center shadow-inner relative group/img">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-700 text-4xl font-bold">
                       {user.name?.charAt(0) || <UserIcon className="w-12 h-12" />}
                    </div>
                  )}
                  
                  {/* Overlay for upload */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer text-white"
                  >
                    {uploading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <Camera className="w-6 h-6 mb-1" />
                        <span className="text-xs font-bold uppercase ">Change</span>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Status Indicator */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center shadow-sm">
                   <Check className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*" 
              />
            </div>

            {/* User Details */}
            <div className="flex-1 w-full space-y-6 text-center sm:text-left">
              <div>
                {isEditing ? (
                  <div className="mb-4 text-left">
                    <label className="text-base font-bold text-black uppercase  mb-1 block">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-none text-base font-semibold text-slate-900 outline-none focus:border-[#1b5e20] transition-all"
                    />
                  </div>
                ) : (
                  <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
                )}
                
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-emerald-50 text-emerald-700 text-base font-bold uppercase  border border-emerald-100">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {user.role}
                  </span>
                  {user.vendor?.verified && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-emerald-50 text-emerald-700 text-base font-bold uppercase  border border-emerald-100">
                      Verified Partner
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-emerald-50 text-left">
                {/* Email Field */}
                <div className="space-y-1 min-w-0">
                  <p className="text-base font-bold text-black uppercase  flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-emerald-600" /> Email Address
                  </p>
                  {isEditing ? (
                    <input 
                      type="email" 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="Enter your email"
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-none text-base font-semibold text-slate-900 outline-none focus:border-[#1b5e20] transition-all mt-1"
                    />
                  ) : (
                    <p className="text-base font-bold text-slate-900 truncate" title={user.email}>
                      {user.email || <span className="text-slate-500 italic font-normal">Not provided</span>}
                    </p>
                  )}
                </div>
                
                {/* Phone Field */}
                <div className="space-y-1 min-w-0">
                  <p className="text-base font-bold text-black uppercase  flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" /> Phone Number
                  </p>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={formData.phone} 
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-none text-base font-semibold text-slate-900 outline-none focus:border-[#1b5e20] transition-all mt-1"
                    />
                  ) : (
                    <p className="text-base font-bold text-slate-900 truncate" title={user.phone}>{user.phone || 'Not provided'}</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </motion.div>

        {/* Security / Other Sections could go here */}
      </div>
    </div>
  );
}
