'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  ShieldCheck, 
  RefreshCcw,
  AlertCircle
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
    if (!confirm('Are you sure you want to retire this membership tier?')) return;
    try {
      await apiFetch(`/admin/packages/${id}`, { method: 'DELETE' });
      setPackages(packages.filter((p: any) => p.id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  if (loading) return <div className="p-12 animate-pulse bg-slate-50 rounded-xl h-[400px] border border-gray-100"></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-simple-fade pb-24 px-4 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 max-w-7xl mx-auto">
        <div className="space-y-1.5">
           <h1 className="text-2xl font-semibold text-slate-900  flex items-center gap-3">
             Membership Tiers
             <div className="p-1.5 bg-[#164e33]/10 text-[#164e33] rounded-xl border border-[#164e33]/20">
                <ShieldCheck className="w-5 h-5" />
             </div>
           </h1>
           <p className="text-slate-700 font-medium text-sm">Design and manage subscription plans for platform vendors.</p>
        </div>

        <button 
           onClick={() => { setCurrentPackage(null); setIsModalOpen(true); }}
           className="px-5 py-2.5 bg-[#164e33] text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2  -[#164e33]/20 hover:bg-[#113f29] transition-all active:scale-95"
        >
           <Plus className="w-4 h-4" />
           Create New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {packages.map((pkg: any, idx) => {
          const isPopular = pkg.priority >= 3 || idx === 1;

          return (
            <motion.div 
               key={pkg.id}
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
               className={`relative bg-white rounded-xl border border-gray-100 transition-all duration-500 flex flex-col group hover:-translate-y-4 hover: hover:-[#164e33]/10 overflow-hidden ${
                 isPopular ? 'scale-105 z-10  ' : ' '
               }`}
            >
               {isPopular && (
                <div className="absolute top-4 -right-12 rotate-45 bg-[#f58220] text-white text-xs font-bold uppercase  px-12 py-1.5  z-20">
                  Pro
                </div>
               )}

               <div className="p-8 flex flex-col items-center text-center">
                  <div className="mb-6 relative w-full">
                     <h3 className="text-[26px] font-black text-[#164e33] uppercase tracking-tighter">{pkg.name}</h3>
                     <p className="text-xs font-bold text-slate-600 uppercase tracking-[0.2em] mt-1">Per Month</p>
                     
                     <div className="absolute right-0 top-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setCurrentPackage(pkg); setIsModalOpen(true); }} className="p-2 bg-gray-50 hover:bg-[#164e33]/10 rounded-lg text-slate-700 hover:text-[#164e33] transition-all">
                           <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(pkg.id)} className="p-2 bg-gray-50 hover:bg-red-50 rounded-lg text-slate-700 hover:text-red-500 transition-all">
                           <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                  </div>

                  <div className="relative w-[calc(100%+4rem)] -mx-8 mb-8">
                     <div className="bg-gradient-to-r from-[#164e33] via-[#2d9d68] to-[#164e33] py-5  relative z-10">
                        <span className="text-4xl font-bold text-white tracking-tight">₹{pkg.price?.toLocaleString()}</span>
                     </div>
                     <div className="absolute left-0 -bottom-2 w-2 h-2 bg-[#0d3120] rounded-bl-full z-0"></div>
                     <div className="absolute right-0 -bottom-2 w-2 h-2 bg-[#0d3120] rounded-br-full z-0"></div>
                  </div>

                  <div className="w-full mb-10">
                     <div className="flex flex-col items-start w-fit mx-auto space-y-4">
                        <div className="flex items-center gap-3">
                           <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                           <span className="text-base font-semibold text-slate-700 tracking-tight">{pkg.monthlyLeads ?? 0} Monthly Leads</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                           <span className="text-base font-semibold text-slate-700 tracking-tight">Priority Hub Distribution</span>
                        </div>
                        {Array.isArray(pkg.features) && pkg.features.slice(0, 3).map((f: string) => (
                           <div key={f} className="flex items-center gap-3">
                              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                              <span className="text-base font-semibold text-slate-700 tracking-tight truncate max-w-[200px]">{f}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  <button 
                     onClick={() => { setCurrentPackage(pkg); setIsModalOpen(true); }}
                     className="px-10 py-3.5 rounded-full text-xs font-black uppercase  bg-gradient-to-r from-[#164e33] to-[#2d9d68] text-white  -[#164e33]/20 hover: hover:scale-105 transition-all duration-300"
                  >
                     Configure Plan
                  </button>
               </div>
            </motion.div>
          );
        })}

        <div className="bg-slate-50 rounded-4xl border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center text-center space-y-4 group hover:border-[#164e33]/30 transition-all">
           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center  border border-gray-100 group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8 text-gray-500 group-hover:text-[#164e33]" />
           </div>
           <div className="space-y-1">
              <h4 className="text-sm font-semibold text-slate-900">Define Membership</h4>
              <p className="text-sm font-medium text-slate-700">Launch a custom tier for specific vendor needs.</p>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 bg-[#f0f9f8] border border-[#164e33]/20 rounded-xl p-10 text-slate-900 relative overflow-hidden ">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/50 rounded-full blur-3xl"></div>
          <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-[#164e33]/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
             <div className="space-y-5 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 rounded-full border border-[#164e33]/10 text-sm font-semibold uppercase  text-[#164e33]">
                   <RefreshCcw className="w-3 h-3 text-[#164e33]" /> Performance Nominal
                </div>
                <h2 className="text-4xl font-semibold leading-tight  text-[#164e33]">Standardizing the Partnership Experience.</h2>
                <p className="text-[#164e33]/70 text-base font-medium leading-relaxed">
                   Unified membership tiers ensure fair visibility across the marketplace. Consistent pricing helps partners scale their operations with predictability.
                </p>
             </div>

             <div className="grid grid-cols-2 gap-6 w-full lg:w-auto">
                <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl border border-[#164e33]/10 space-y-2">
                   <p className="text-[#164e33]/80 text-sm font-semibold uppercase ">Global ARPU</p>
                   <p className="text-3xl font-semibold tabular-nums er text-[#164e33]">₹2,840</p>
                </div>
                <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl border border-[#164e33]/10 space-y-2">
                   <p className="text-[#164e33]/80 text-sm font-semibold uppercase ">Churn Rate</p>
                   <p className="text-3xl font-semibold tabular-nums er text-[#164e33]">4.2%</p>
                </div>
             </div>
          </div>
      </div>

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
               className="fixed right-0 top-0 h-screen w-full max-w-xl bg-white  z-100 p-10 overflow-y-auto"
            >
               <div className="flex items-center justify-between mb-10 pb-8 border-b border-gray-50">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 ">{currentPackage ? 'Revise Plan' : 'Define New Tier'}</h2>
                    <p className="text-sm font-medium text-slate-700 mt-1">Configure service limits and commercial terms.</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                     <AlertCircle className="w-5 h-5 text-slate-700" />
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
                       <label className="text-sm font-semibold text-slate-700 uppercase  ml-1">Plan Identifier</label>
                       <input 
                          name="name"
                          defaultValue={currentPackage?.name}
                          placeholder="e.g. Platinum Plus"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#164e33] focus:bg-white outline-none font-semibold text-slate-900 text-sm transition-all"
                          required
                       />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-sm font-semibold text-slate-700 uppercase  ml-1">Price (INR)</label>
                           <input
                              name="price"
                              type="number"
                              min="0"
                              defaultValue={currentPackage?.price}
                              placeholder="e.g. 999"
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#164e33] focus:bg-white outline-none font-semibold text-slate-900 text-sm transition-all"
                              required
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-semibold text-slate-700 uppercase  ml-1">Monthly Leads</label>
                           <input
                              name="monthlyLeads"
                              type="number"
                              min="0"
                              defaultValue={currentPackage?.monthlyLeads ?? 0}
                              placeholder="e.g. 20"
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#164e33] focus:bg-white outline-none font-semibold text-slate-900 text-sm transition-all"
                           />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 uppercase  ml-1">Priority (higher = better ranking)</label>
                        <input
                           name="priority"
                           type="number"
                           min="1"
                           defaultValue={currentPackage?.priority ?? 1}
                           placeholder="e.g. 5"
                           className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#164e33] focus:bg-white outline-none font-semibold text-slate-900 text-sm transition-all"
                        />
                     </div>

                     <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 uppercase  ml-1">Features (comma-separated)</label>
                        <input
                           name="features"
                           type="text"
                           defaultValue={currentPackage?.features?.join(', ')}
                           placeholder="e.g. Verified Badge, Priority Leads, Analytics"
                           className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#164e33] focus:bg-white outline-none font-medium text-slate-900 text-sm transition-all"
                        />
                     </div>

                    <div className="space-y-2">
                       <label className="text-sm font-semibold text-slate-700 uppercase  ml-1">Plan Narrative</label>
                       <textarea 
                          name="description"
                          defaultValue={currentPackage?.description}
                          rows={4}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#164e33] focus:bg-white outline-none font-medium text-slate-800 text-sm transition-all"
                       />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-50 flex gap-4">
                     <button 
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 py-4 bg-gray-50 text-slate-800 rounded-xl font-semibold uppercase  text-sm hover:bg-gray-100 transition-all"
                     >
                        Discard
                     </button>
                     <button 
                        type="submit"
                        className="flex-1 py-4 bg-[#164e33] text-white rounded-xl font-semibold uppercase  text-sm  -[#164e33]/20 hover:bg-[#113f29] transition-all"
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
