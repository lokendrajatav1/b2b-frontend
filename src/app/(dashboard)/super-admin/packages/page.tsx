'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { 
  Package, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  X, 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  CreditCard,
  Target,
  RefreshCcw,
  AlertCircle,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState<any>(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    const header = document.getElementById('main-dashboard-header');
    if (header) {
      if (isModalOpen) {
        header.style.opacity = '0';
        header.style.pointerEvents = 'none';
      } else {
        header.style.opacity = '1';
        header.style.pointerEvents = 'auto';
      }
    }
  }, [isModalOpen]);

  const fetchPackages = async () => {
    try {
      const data = await apiFetch('/admin/packages');
      setPackages(data.data || []);
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to retire this membership tier? This will not affect active subscribers immediately.')) return;
    try {
      await apiFetch(`/admin/packages/${id}`, { method: 'DELETE' });
      setPackages(packages.filter((p: any) => p.id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  if (loading) return <div className="p-12 animate-pulse bg-slate-50 rounded-2xl h-[400px] border border-gray-100"></div>;

  return (
    <div className="space-y-10 animate-simple-fade pb-24 p-2 md:p-0">
      {/* Humanized Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 max-w-7xl mx-auto">
        <div className="space-y-1.5">
           <h1 className="text-2xl font-semibold text-slate-900  flex items-center gap-3">
             Membership Tiers
             <div className="p-1.5 bg-[#007367]/10 text-[#007367] rounded-none border border-[#007367]/20">
                <ShieldCheck className="w-5 h-5" />
             </div>
           </h1>
           <p className="text-slate-700 font-medium text-base">Design and manage subscription plans for platform vendors.</p>
        </div>

        <button 
           onClick={() => { setCurrentPackage(null); setIsModalOpen(true); }}
           className="px-5 py-2.5 bg-[#007367] text-white rounded-none font-semibold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#007367]/20 hover:bg-[#005e54] transition-all active:scale-95"
        >
           <Plus className="w-4 h-4" />
           Create New Plan
        </button>
      </div>

      {/* Modern Grid Representation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {packages.map((pkg: any, idx) => (
          <motion.div 
             key={pkg.id}
             initial={{ opacity: 0, y: 15 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: idx * 0.1 }}
             className="bg-white rounded-4xl border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
          >
             {/* Decorative Background Accent */}
             <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#007367]/10 rounded-full opacity-0 group-hover:opacity-50 transition-opacity"></div>
             
             <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                   <div className="p-4 bg-gray-50 rounded-none border border-gray-100 group-hover:bg-[#007367]/5 group-hover:border-[#007367]/20 transition-colors">
                      <Zap className={`w-6 h-6 ${pkg.price > 0 ? 'text-[#007367]' : 'text-slate-500'}`} />
                   </div>
                   <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setCurrentPackage(pkg); setIsModalOpen(true); }} className="p-2 hover:bg-gray-100 rounded-lg text-slate-500 hover:text-[#007367] transition-all">
                         <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(pkg.id)} className="p-2 hover:bg-red-50 rounded-lg text-slate-500 hover:text-red-500 transition-all">
                         <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                </div>

                <div className="space-y-4 mb-10">
                   <h3 className="text-xl font-semibold text-slate-900  capitalize">{pkg.name}</h3>
                   <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-semibold text-slate-900 er">₹{pkg.price?.toLocaleString()}</span>
                      <span className="text-base font-semibold text-slate-500">/month</span>
                   </div>
                   <p className="text-base font-medium text-slate-700 leading-relaxed line-clamp-2">
                       {pkg.description || `Full access to marketplace tools within ${pkg.name} tier.`}
                   </p>
                </div>

                <div className="space-y-4 mb-8">
                   <p className="text-base font-semibold text-slate-500 uppercase  border-b border-gray-50 pb-2">Plan Details</p>
                   <div className="space-y-3">
                      <div className="flex items-center gap-3">
                         <div className="w-5 h-5 rounded-full bg-[#007367]/10 border border-[#007367]/20 flex items-center justify-center">
                            <Target className="w-3 h-3 text-[#007367]" />
                         </div>
                         <span className="text-base font-semibold text-slate-800">{pkg.monthlyLeads ?? 0} Monthly Leads</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-5 h-5 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center">
                            <Zap className="w-3 h-3 text-amber-600" />
                         </div>
                         <span className="text-base font-semibold text-slate-800">{pkg.leadLimit ?? 0} Lead Limit</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-5 h-5 rounded-full bg-[#007367]/5 border border-[#007367]/10 flex items-center justify-center">
                            <TrendingUp className="w-3 h-3 text-[#007367]" />
                         </div>
                         <span className="text-base font-semibold text-slate-800">Priority: {pkg.priority ?? 1}</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-5 h-5 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center">
                            <ShieldCheck className="w-3 h-3 text-purple-600" />
                         </div>
                         <span className="text-base font-semibold text-slate-800">Ranking Weight: {pkg.rankingWeight ?? 0}</span>
                      </div>
                      {Array.isArray(pkg.features) && pkg.features.length > 0 && pkg.features.map((f: string) => (
                        <div key={f} className="flex items-center gap-3">
                           <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                           </div>
                           <span className="text-base font-semibold text-slate-800">{f}</span>
                        </div>
                      ))}
                      {(!pkg.features || pkg.features.length === 0) && (
                        <p className="text-base text-slate-500 italic">No features configured yet</p>
                      )}
                   </div>
                </div>


             </div>
          </motion.div>
        ))}

        {/* Empty State / Quick Create */}
        <div className="bg-slate-50 rounded-4xl border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center text-center space-y-4 group hover:border-[#007367]/30 transition-all">
           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8 text-gray-300 group-hover:text-[#007367]" />
           </div>
           <div className="space-y-1">
              <h4 className="text-base font-semibold text-slate-900">Define Membership</h4>
              <p className="text-base font-medium text-slate-500">Launch a custom tier for specific vendor needs.</p>
           </div>
        </div>
      </div>

      {/* New Feature: Global Subscription Insight */}
      <div className="max-w-7xl mx-auto mt-16 bg-[#f0f9f8] border border-[#007367]/20 rounded-[2.5rem] p-10 text-slate-900 relative overflow-hidden shadow-sm">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/50 rounded-full blur-3xl"></div>
          <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-[#007367]/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
             <div className="space-y-5 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 rounded-full border border-[#007367]/10 text-base font-semibold uppercase  text-[#007367]">
                   <RefreshCcw className="w-3 h-3 text-[#007367]" /> Performance Nominal
                </div>
                <h2 className="text-4xl font-semibold leading-tight  text-[#007367]">Standardizing the <br /> Partnership Experience.</h2>
                <p className="text-[#007367]/70 text-lg font-medium leading-relaxed">
                   Unified membership tiers ensure fair visibility across the marketplace. Consistent pricing helps partners scale their operations with predictability.
                </p>
             </div>

             <div className="grid grid-cols-2 gap-6 w-full lg:w-auto">
                <div className="bg-white/60 backdrop-blur-md p-6 rounded-none border border-[#007367]/10 space-y-2">
                   <p className="text-[#007367]/80 text-base font-semibold uppercase ">Global ARPU</p>
                   <p className="text-3xl font-semibold tabular-nums er text-[#007367]">₹2,840</p>
                </div>
                <div className="bg-white/60 backdrop-blur-md p-6 rounded-none border border-[#007367]/10 space-y-2">
                   <p className="text-[#007367]/80 text-base font-semibold uppercase ">Churn Rate</p>
                   <p className="text-3xl font-semibold tabular-nums er text-[#007367]">4.2%</p>
                </div>
             </div>
          </div>
      </div>

      {/* Professional Package Editor Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               onClick={() => setIsModalOpen(false)}
               className="fixed inset-0 bg-black/50 backdrop-blur-sm z-90 h-screen overflow-hidden"
            />
            <motion.div 
               initial={{ x: '100%' }} 
               animate={{ x: 0 }} 
               exit={{ x: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="fixed right-0 top-0 h-screen w-full max-w-xl bg-white shadow-2xl z-100 p-10 overflow-y-auto"
            >
               <div className="flex items-center justify-between mb-10 pb-8 border-b border-gray-50">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 ">{currentPackage ? 'Revise Plan' : 'Define New Tier'}</h2>
                    <p className="text-base font-medium text-slate-700 mt-1">Configure service limits and commercial terms.</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                     <AlertCircle className="w-5 h-5 text-slate-500" />
                  </button>
               </div>

               <form onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const featuresRaw = formData.get('features') as string;
                  const payload = {
                    name:         formData.get('name'),
                    price:        parseFloat(formData.get('price') as string),
                    monthlyLeads: parseInt(formData.get('monthlyLeads') as string) || 0,
                    priority:     parseInt(formData.get('priority') as string) || 1,
                    description:  formData.get('description') || '',
                    features:     featuresRaw
                      ? featuresRaw.split(',').map((f: string) => f.trim()).filter(Boolean)
                      : [],
                  };

                  try {
                    if (currentPackage) {
                      await apiFetch(`/admin/packages/${currentPackage.id}`, {
                        method: 'PUT',
                        body: JSON.stringify(payload)
                      });
                    } else {
                      await apiFetch('/admin/packages', {
                        method: 'POST',
                        body: JSON.stringify(payload)
                      });
                    }
                    setIsModalOpen(false);
                    fetchPackages();
                  } catch (err) {
                    console.error('Failed to save package:', err);
                    alert('Failed to save plan. Please check all fields.');
                  }
               }} className="space-y-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-base font-semibold text-slate-500 uppercase  ml-1">Plan Identifier</label>
                       <input 
                          name="name"
                          defaultValue={currentPackage?.name}
                          placeholder="e.g. Platinum Plus"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-none focus:border-[#007367] focus:bg-white outline-none font-semibold text-slate-900 text-base transition-all"
                          required
                       />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-base font-semibold text-slate-500 uppercase  ml-1">Price (INR)</label>
                           <input
                              name="price"
                              type="number"
                              min="0"
                              defaultValue={currentPackage?.price}
                              placeholder="e.g. 999"
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-none focus:border-[#007367] focus:bg-white outline-none font-semibold text-slate-900 text-base transition-all"
                              required
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-base font-semibold text-slate-500 uppercase  ml-1">Monthly Leads</label>
                           <input
                              name="monthlyLeads"
                              type="number"
                              min="0"
                              defaultValue={currentPackage?.monthlyLeads ?? 0}
                              placeholder="e.g. 20"
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-none focus:border-[#007367] focus:bg-white outline-none font-semibold text-slate-900 text-base transition-all"
                           />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-base font-semibold text-slate-500 uppercase  ml-1">Priority (higher = better ranking)</label>
                        <input
                           name="priority"
                           type="number"
                           min="1"
                           defaultValue={currentPackage?.priority ?? 1}
                           placeholder="e.g. 5"
                           className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-none focus:border-[#007367] focus:bg-white outline-none font-semibold text-slate-900 text-base transition-all"
                        />
                     </div>

                     <div className="space-y-2">
                        <label className="text-base font-semibold text-slate-500 uppercase  ml-1">Features (comma-separated)</label>
                        <input
                           name="features"
                           type="text"
                           defaultValue={currentPackage?.features?.join(', ')}
                           placeholder="e.g. Verified Badge, Priority Leads, Analytics"
                           className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-none focus:border-[#007367] focus:bg-white outline-none font-medium text-slate-900 text-base transition-all"
                        />
                     </div>

                    <div className="space-y-2">
                       <label className="text-base font-semibold text-slate-500 uppercase  ml-1">Plan Narrative</label>
                       <textarea 
                          name="description"
                          defaultValue={currentPackage?.description}
                          rows={4}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-none focus:border-[#007367] focus:bg-white outline-none font-medium text-slate-800 text-base transition-all"
                       />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-50 flex gap-4">
                     <button 
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 py-4 bg-gray-50 text-slate-800 rounded-2xl font-semibold uppercase  text-base hover:bg-gray-100 transition-all"
                     >
                        Discard
                     </button>
                     <button 
                        type="submit"
                        className="flex-1 py-4 bg-[#007367] text-white rounded-none font-semibold uppercase  text-base shadow-lg shadow-[#007367]/20 hover:bg-[#005e54] transition-all"
                     >
                        Commit Changes
                     </button>
                  </div>
               </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}


