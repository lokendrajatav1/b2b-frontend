'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Lock, 
  Bell, 
  ShieldCheck, 
  Save, 
  RefreshCcw, 
  Camera, 
  Globe, 
  Briefcase,
  ChevronRight,
  LucideIcon,
  CreditCard,
  Settings,
  XCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Zap,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VendorSettings() {
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await apiFetch('/vendors/me');
        setVendor(data.data);
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      // Filter for Joi validation allowed fields
      const { 
        businessName, description, address, socialLinks, 
        googleBusinessLink, workingHours, products, keywords 
      } = vendor;
      
      const updateData = { 
        businessName, description, address, socialLinks, 
        googleBusinessLink, workingHours, products, keywords 
      };

      await apiFetch('/vendors/me', {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
      setMessage('Settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      console.error('Update failed:', error);
      setMessage('Update failed: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 animate-pulse bg-slate-50 rounded-2xl h-80 border border-slate-100"></div>;

  return (
    <div className="space-y-8 animate-simple-fade pb-20 p-2 md:p-0">
      {/* Clean Settings Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 mb-8 max-w-5xl mx-auto">
        <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight flex items-center gap-3">
               Settings
               <div className="p-1.5 bg-gray-50 text-gray-500 rounded-lg border border-gray-100">
                  <Settings className="w-4 h-4" />
               </div>
            </h1>
            <p className="text-gray-500 font-medium text-sm">Manage your profile, security, and notification preferences.</p>
        </div>
        
        <button 
            onClick={handleUpdate}
            disabled={saving}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm disabled:opacity-50 flex items-center gap-2 shadow-sm hover:bg-blue-700 transition-colors"
        >
            {saving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
        {/* Simple Side Nav */}
        <div className="lg:col-span-1 space-y-1">
            {[
                { id: 'profile', label: 'Basic Profile', icon: User, desc: 'Public details' },
                { id: 'security', label: 'Security', icon: Lock, desc: 'Password & access' },
                { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Alert preferences' },
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full px-4 py-3 rounded-xl text-left flex items-center gap-3 transition-colors ${ activeTab === tab.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-50' }`}
                >
                    <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400 '}`} />
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">{tab.label}</span>
                        <span className={`text-xs font-medium ${activeTab === tab.id ? 'text-blue-500' : 'text-gray-400'}`}>{tab.desc}</span>
                    </div>
                </button>
            ))}
        </div>

        {/* Action Center Area */}
        <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 relative overflow-hidden shadow-sm"
                >
                    {message && (
                        <div className={`mb-6 p-4 rounded-xl border text-sm font-semibold flex items-center gap-2 ${ message.includes('success') ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100' }`}>
                           {message.includes('success') ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                           {message}
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-6 border-b border-gray-50 pb-8">
                                <div className="relative group/avatar">
                                    <div className="w-20 h-20 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden">
                                        {vendor?.logo ? <img src={vendor.logo} alt="Logo" className="w-full h-full object-cover" /> : <Building className="w-8 h-8 text-gray-300" />}
                                    </div>
                                    <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:bg-blue-700 transition-colors">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-lg font-semibold text-gray-900">{vendor?.businessName || 'Your Business'}</h3>
                                    <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                        Verified Business
                                    </p>
                                </div>
                            </div>

                            <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-700">Business Name</label>
                                    <input 
                                        type="text" 
                                        value={vendor?.businessName} 
                                        onChange={(e) => setVendor({...vendor, businessName: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none font-medium text-gray-900 text-sm transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-700">Vendor ID</label>
                                    <input 
                                        type="text" 
                                        value={vendor?.id?.slice(0, 12)} 
                                        disabled
                                        className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl outline-none font-medium text-gray-400 cursor-not-allowed text-sm"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-700">Phone Number</label>
                                    <input 
                                        type="text" 
                                        value={vendor?.phone} 
                                        onChange={(e) => setVendor({...vendor, phone: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none font-medium text-gray-900 text-sm transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-700">City</label>
                                    <input 
                                        type="text" 
                                        value={vendor?.city} 
                                        onChange={(e) => setVendor({...vendor, city: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none font-medium text-gray-900 text-sm transition-all"
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-1.5 pt-2">
                                    <label className="text-xs font-semibold text-gray-700">About Business</label>
                                    <textarea 
                                        rows={4}
                                        value={vendor?.description} 
                                        onChange={(e) => setVendor({...vendor, description: e.target.value})}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none font-medium text-gray-900 text-sm resize-none transition-all"
                                        placeholder="Tell buyers about your products and services..."
                                    />
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6">
                           <div className="p-6 bg-white rounded-2xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                               <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center text-gray-500">
                                       <Lock className="w-5 h-5" />
                                   </div>
                                   <div>
                                       <h4 className="text-sm font-semibold text-gray-900 mb-0.5">Change Password</h4>
                                       <p className="text-sm font-medium text-gray-500">Update your account password</p>
                                   </div>
                               </div>
                               <button className="px-5 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                                  Update
                               </button>
                           </div>

                           <div className="p-6 bg-white rounded-2xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                               <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center text-gray-500">
                                       <Globe className="w-5 h-5" />
                                   </div>
                                   <div>
                                       <h4 className="text-sm font-semibold text-gray-900 mb-0.5">Active Devices</h4>
                                       <p className="text-sm font-medium text-gray-500">Manage where you're logged in</p>
                                   </div>
                               </div>
                               <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 w-fit">
                                   Secure
                               </div>
                           </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-4">
                           <div className="mb-6 border-b border-gray-50 pb-4">
                               <h3 className="text-sm font-semibold text-gray-900">Email Notifications</h3>
                               <p className="text-xs font-medium text-gray-500 mt-1">Choose what we email you about.</p>
                           </div>
                           
                           {[
                               { title: 'New Leads', desc: 'When a buyer sends an inquiry', icon: Zap },
                               { title: 'Ranking Updates', desc: 'Weekly changes to your position', icon: TrendingUp },
                               { title: 'Platform Announcements', desc: 'New features and updates', icon: Globe },
                           ].map((n) => (
                               <div key={n.title} className="p-4 bg-white rounded-xl border border-gray-100 flex items-center justify-between hover:border-gray-200 transition-colors">
                                   <div className="flex items-center gap-4">
                                       <div className="w-10 h-10 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400">
                                           <n.icon className="w-4 h-4" />
                                       </div>
                                       <div className="space-y-0.5">
                                            <h4 className="text-sm font-semibold text-gray-800">{n.title}</h4>
                                            <p className="text-xs font-medium text-gray-500">{n.desc}</p>
                                       </div>
                                   </div>
                                   <div className="relative w-11 h-6 bg-blue-600 rounded-full cursor-pointer transition-colors shadow-inner flex items-center px-0.5">
                                       <div className="w-5 h-5 bg-white rounded-full shadow-sm transform translate-x-5 transition-transform"></div>
                                   </div>
                               </div>
                           ))}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
