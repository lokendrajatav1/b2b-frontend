'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { 
  Settings, 
  ShieldCheck, 
  Database, 
  Globe, 
  Lock, 
  Bell, 
  Mail, 
  Cloud, 
  Zap, 
  RefreshCcw, 
  Save, 
  Activity,
  Layers,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Sliders,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<'system' | 'auth' | 'notifications' | 'infrastructure' | 'website'>('website');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [settings, setSettings] = useState({
    rankingWeightProfile: 0.4,
    rankingWeightPerformance: 0.6,
    marketplaceId: 'B2B-INDIA-ROOT-01',
    hubName: 'Mumbai Central',
    alertVendorOnboarding: true,
    alertPaymentExceptions: true,
    alertInquirySpikes: false,
    cdnUrl: 'https://cdn.b2b-community.com/primary'
  });
  const [globalSettings, setGlobalSettings] = useState({
    websiteName: 'Admission Master',
    contactEmail: 'contact@example.com',
    contactPhone: '+91 0000000000',
    address: 'Your Address Here',
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    youtubeUrl: '',
    googleAdSenseId: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const [adminData, globalData] = await Promise.all([
        apiFetch('/admin/settings'),
        apiFetch('/settings')
      ]);
      
      if (adminData?.data) {
        setSettings({
          ...settings,
          rankingWeightProfile: adminData.data.rankingWeightProfile,
          rankingWeightPerformance: adminData.data.rankingWeightPerformance,
          marketplaceId: adminData.data.marketplaceId || 'B2B-INDIA-ROOT-01',
          hubName: adminData.data.hubName || 'Mumbai Central',
          alertVendorOnboarding: adminData.data.alertVendorOnboarding ?? true,
          alertPaymentExceptions: adminData.data.alertPaymentExceptions ?? true,
          alertInquirySpikes: adminData.data.alertInquirySpikes ?? false,
          cdnUrl: adminData.data.cdnUrl || 'https://cdn.b2b-community.com/primary'
        });
      }
      if (globalData) {
        setGlobalSettings({
          ...globalSettings,
          ...globalData
        });
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      if (activeTab === 'website') {
        await apiFetch('/settings', {
          method: 'PUT',
          body: JSON.stringify(globalSettings)
        });
      } else {
        await apiFetch('/admin/settings', {
          method: 'PATCH',
          body: JSON.stringify(settings)
        });
      }
      setMessage({ type: 'success', text: 'Platform settings updated successfully.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Failed to update settings: ' + error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 animate-pulse bg-slate-50 rounded-xl h-80 border border-slate-100"></div>;

  return (
    <div className="space-y-8 animate-simple-fade pb-20 p-2 md:p-0">
      {/* Clean Admin Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 max-w-6xl mx-auto">
        <div className="flex items-center gap-5">
           <div className="w-12 h-12 bg-slate-100/50 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600">
              <Settings className="w-6 h-6" />
           </div>
           <div>
              <h1 className="text-xl font-semibold text-slate-900">Platform Configuration</h1>
              <p className="text-sm text-gray-600 font-normal mt-1">Manage global marketplace settings and vendor ranking logic.</p>
           </div>
        </div>
        
        <button 
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 bg-[#164e33] text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-colors hover:bg-[#113f29]"
        >
            {saving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {/* Simple Side Nav */}
        <div className="lg:col-span-1 space-y-2">
            {[
                { id: 'website', label: 'Website Global', icon: Globe, desc: 'Contact & Links' },
                { id: 'system', label: 'Ranking Logic', icon: Sliders, desc: 'Vendor Algorithm' },
                { id: 'infrastructure', label: 'Platform Core', icon: Layers, desc: 'Global Config' },
                { id: 'auth', label: 'Security Options', icon: Lock, desc: 'Access Control' },
                { id: 'notifications', label: 'Alert Settings', icon: Bell, desc: 'System Events' },
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full p-4 rounded-xl text-left flex items-center gap-4 transition-colors ${ activeTab === tab.id ? 'bg-[#164e33]/10 text-[#164e33] font-semibold border-[#164e33]/20' : 'text-slate-800 border border-transparent hover:bg-gray-50' }`}
                >
                    <tab.icon className={`w-5 h-5 shrink-0 ${activeTab === tab.id ? 'text-[#164e33]' : 'text-slate-700'}`} />
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">{tab.label}</span>
                        <span className={`text-sm ${activeTab === tab.id ? 'text-[#164e33]/80 font-medium' : 'text-slate-700'}`}>{tab.desc}</span>
                    </div>
                </button>
            ))}
        </div>

        {/* Content Node */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 p-6 md:p-8">
            <AnimatePresence mode="wait">
                {message.text && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`mb-8 p-4 rounded-xl border text-sm font-semibold flex items-center gap-3 ${ message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200' }`}
                    >
                        {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
                        {message.text}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="min-h-[400px]">
                {activeTab === 'website' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                          <Globe className="w-5 h-5 text-[#164e33]" />
                          <h3 className="text-base font-semibold text-slate-900">Global Website Settings</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 uppercase ml-1">Website Name</label>
                                <input 
                                    type="text" 
                                    value={globalSettings.websiteName}
                                    onChange={(e) => setGlobalSettings({...globalSettings, websiteName: e.target.value})}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#164e33] focus:ring-4 focus:ring-[#164e33]/10 outline-none text-sm transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 uppercase ml-1">Contact Email</label>
                                <input 
                                    type="email" 
                                    value={globalSettings.contactEmail}
                                    onChange={(e) => setGlobalSettings({...globalSettings, contactEmail: e.target.value})}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#164e33] focus:ring-4 focus:ring-[#164e33]/10 outline-none text-sm transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 uppercase ml-1">Contact Phone</label>
                                <input 
                                    type="text" 
                                    value={globalSettings.contactPhone}
                                    onChange={(e) => setGlobalSettings({...globalSettings, contactPhone: e.target.value})}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#164e33] focus:ring-4 focus:ring-[#164e33]/10 outline-none text-sm transition-all"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-semibold text-slate-700 uppercase ml-1">Address</label>
                                <input 
                                    type="text" 
                                    value={globalSettings.address}
                                    onChange={(e) => setGlobalSettings({...globalSettings, address: e.target.value})}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#164e33] focus:ring-4 focus:ring-[#164e33]/10 outline-none text-sm transition-all"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <h4 className="text-sm font-semibold text-slate-900 mb-4">Integrations</h4>
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 uppercase ml-1">Google AdSense Publisher ID</label>
                                    <input 
                                        type="text" 
                                        value={globalSettings.googleAdSenseId || ''}
                                        onChange={(e) => setGlobalSettings({...globalSettings, googleAdSenseId: e.target.value})}
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#164e33] focus:ring-4 focus:ring-[#164e33]/10 outline-none text-sm transition-all"
                                        placeholder="e.g. ca-pub-XXXXXXXXXXXXXXXX"
                                    />
                                    <p className="text-sm text-slate-700 ml-1">Leave empty to disable Google Ads on the platform.</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <h4 className="text-sm font-semibold text-slate-900 mb-4">Social Media Links</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 uppercase ml-1">Facebook URL</label>
                                    <input type="url" value={globalSettings.facebookUrl || ''} onChange={(e) => setGlobalSettings({...globalSettings, facebookUrl: e.target.value})} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#164e33] focus:ring-4 focus:ring-[#164e33]/10 outline-none text-sm transition-all" placeholder="https://facebook.com/..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 uppercase ml-1">Twitter/X URL</label>
                                    <input type="url" value={globalSettings.twitterUrl || ''} onChange={(e) => setGlobalSettings({...globalSettings, twitterUrl: e.target.value})} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#164e33] focus:ring-4 focus:ring-[#164e33]/10 outline-none text-sm transition-all" placeholder="https://twitter.com/..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 uppercase ml-1">Instagram URL</label>
                                    <input type="url" value={globalSettings.instagramUrl || ''} onChange={(e) => setGlobalSettings({...globalSettings, instagramUrl: e.target.value})} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#164e33] focus:ring-4 focus:ring-[#164e33]/10 outline-none text-sm transition-all" placeholder="https://instagram.com/..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 uppercase ml-1">LinkedIn URL</label>
                                    <input type="url" value={globalSettings.linkedinUrl || ''} onChange={(e) => setGlobalSettings({...globalSettings, linkedinUrl: e.target.value})} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#164e33] focus:ring-4 focus:ring-[#164e33]/10 outline-none text-sm transition-all" placeholder="https://linkedin.com/in/..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 uppercase ml-1">YouTube URL</label>
                                    <input type="url" value={globalSettings.youtubeUrl || ''} onChange={(e) => setGlobalSettings({...globalSettings, youtubeUrl: e.target.value})} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#164e33] focus:ring-4 focus:ring-[#164e33]/10 outline-none text-sm transition-all" placeholder="https://youtube.com/..." />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'system' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                        <div className="space-y-4 mb-8 border-b border-gray-100 pb-6">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#164e33]/10 rounded-xl text-[#164e33] border border-[#164e33]/20">
                              <TrendingUp className="w-5 h-5" />
                            </div>
                            <h3 className="text-base font-semibold text-slate-900">Vendor Ranking Algorithm</h3>
                          </div>
                          <p className="text-sm font-medium text-slate-700 max-w-2xl leading-relaxed">
                             Fine-tune the weight distribution for vendor scores. These adjustments directly impact the default search order for buyers.
                          </p>
                       </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-slate-800">Profile Completeness ({Math.round(settings.rankingWeightProfile * 100)}%)</label>
                                    <span className="text-sm font-semibold text-[#164e33] bg-[#164e33]/10 px-2 py-0.5 rounded border border-[#164e33]/20 uppercase">Base Weight</span>
                                  </div>
                                  <input 
                                    type="range" min="0" max="1" step="0.05"
                                    value={settings.rankingWeightProfile}
                                    onChange={(e) => setSettings({...settings, rankingWeightProfile: parseFloat(e.target.value)})}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#164e33] outline-none"
                                  />
                                </div>
                                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                                  Importance of a fully filled profile (photos, verified GST, detailed descriptions, etc).
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-slate-800">Service Performance ({Math.round(settings.rankingWeightPerformance * 100)}%)</label>
                                    <span className="text-sm font-semibold text-[#164e33] bg-[#164e33]/10 px-2 py-0.5 rounded border border-[#164e33]/20 uppercase">Growth Weight</span>
                                  </div>
                                  <input 
                                    type="range" min="0" max="1" step="0.05"
                                    value={settings.rankingWeightPerformance}
                                    onChange={(e) => setSettings({...settings, rankingWeightPerformance: parseFloat(e.target.value)})}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#164e33] outline-none"
                                  />
                                </div>
                                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                                  Influence of response times, lead conversion rates, and overall buyer satisfaction scores.
                                </p>
                            </div>
                        </div>

                        <div className="bg-amber-50 p-5 rounded-xl border border-amber-200 flex gap-4 items-start mt-8">
                           <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                           <div className="space-y-1">
                             <p className="text-sm font-semibold text-amber-900 leading-none">Algorithm Recalculation</p>
                             <p className="text-sm font-medium text-amber-700 leading-relaxed mt-1">
                               Saving these changes will trigger a background update for all vendor listings. Rankings will stabilize within a few minutes.
                             </p>
                           </div>
                        </div>
                    </motion.div>
                )}

                {(activeTab === 'auth' || activeTab === 'infrastructure') && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                        <Layers className="w-5 h-5 text-[#164e33]" />
                        <h3 className="text-base font-semibold text-slate-900">Platform Core Details</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                              <label className="text-sm font-semibold text-slate-700 uppercase ml-1">Marketplace ID</label>
                              <input 
                                  type="text" 
                                  value={settings.marketplaceId} 
                                  onChange={(e) => setSettings({...settings, marketplaceId: e.target.value})}
                                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#164e33] focus:ring-4 focus:ring-[#164e33]/10 outline-none font-medium text-slate-900 text-sm transition-all"
                              />
                          </div>
                          <div className="space-y-2">
                              <label className="text-sm font-semibold text-slate-700 uppercase ml-1">Operational Hub</label>
                              <input 
                                  type="text" 
                                  value={settings.hubName}
                                  onChange={(e) => setSettings({...settings, hubName: e.target.value})}
                                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#164e33] focus:ring-4 focus:ring-[#164e33]/10 outline-none font-medium text-slate-900 text-sm transition-all"
                              />
                          </div>
                      </div>
                  </motion.div>
                )}

                {activeTab === 'notifications' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                          <Bell className="w-5 h-5 text-[#164e33]" />
                          <h3 className="text-base font-semibold text-slate-900">System Alert Preferences</h3>
                        </div>
                        {[
                            { id: 'alertVendorOnboarding', title: 'Vendor Onboarding', desc: 'Alert when new verification documents are uploaded', icon: ShieldCheck, enabled: settings.alertVendorOnboarding },
                            { id: 'alertPaymentExceptions', title: 'Payment Exceptions', desc: 'Instant alerts for subscription or billing failures', icon: CreditCard, enabled: settings.alertPaymentExceptions },
                            { id: 'alertInquirySpikes', title: 'Inquiry Spikes', desc: 'Notify if lead volume exceeds threshold', icon: Zap, enabled: settings.alertInquirySpikes },
                        ].map((n) => (
                            <div key={n.title} className="p-5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between group/row hover:border-[#164e33]/20 hover:bg-white transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-slate-700 group-hover/row:text-[#164e33] group-hover/row:border-[#164e33]/20 transition-colors">
                                        <n.icon className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-0.5">
                                         <h4 className="text-sm font-semibold text-slate-900 leading-none">{n.title}</h4>
                                         <p className="text-sm font-semibold text-slate-700 uppercase mt-1">{n.desc}</p>
                                    </div>
                                </div>
                                <div 
                                    onClick={() => setSettings({...settings, [n.id]: !settings[n.id as keyof typeof settings]})}
                                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all flex items-center shrink-0 ${n.enabled ? 'bg-[#164e33]' : 'bg-gray-200'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${n.enabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
