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
           <h1 className="text-2xl font-semibold text-gray-900 tracking-tight flex items-center gap-3">
             Membership Tiers
             <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                <ShieldCheck className="w-5 h-5" />
             </div>
           </h1>
           <p className="text-gray-500 font-medium text-sm">Design and manage subscription plans for platform vendors.</p>
        </div>

        <button 
           onClick={() => { setCurrentPackage(null); setIsModalOpen(true); }}
           className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-50 hover:bg-blue-700 transition-all active:scale-95"
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
             <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full opacity-0 group-hover:opacity-50 transition-opacity"></div>
             
             <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                   <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                      <Zap className={`w-6 h-6 ${pkg.price > 0 ? 'text-blue-600' : 'text-gray-400'}`} />
                   </div>
                   <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setCurrentPackage(pkg); setIsModalOpen(true); }} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600 transition-all">
                         <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(pkg.id)} className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-all">
                         <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                </div>

                <div className="space-y-4 mb-10">
                   <h3 className="text-xl font-bold text-gray-900 tracking-tight capitalize">{pkg.name}</h3>
                   <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-gray-900 tracking-tighter">₹{pkg.price}</span>
                      <span className="text-sm font-semibold text-gray-400">/{pkg.durationDays === 30 ? 'mo' : pkg.durationDays + ' days'}</span>
                   </div>
                   <p className="text-sm font-medium text-gray-500 leading-relaxed line-clamp-2">
                       {pkg.description || `Full access to marketplace tools and prioritized listing within ${pkg.name} tier.`}
                   </p>
                </div>

                <div className="space-y-4 mb-8">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">Plan Core Features</p>
                   <div className="space-y-3">
                      <div className="flex items-center gap-3">
                         <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                         </div>
                         <span className="text-xs font-semibold text-gray-700">{pkg.leadLimit} Lead Unlocks</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                         </div>
                         <span className="text-xs font-semibold text-gray-700">{pkg.productLimit} Active Listings</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                         </div>
                         <span className="text-xs font-semibold text-gray-700">Priority Support</span>
                      </div>
                   </div>
                </div>

                <div className="pt-2">
                   <button className="w-full py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all shadow-sm">
                      Tier Performance
                   </button>
                </div>
             </div>
          </motion.div>
        ))}

        {/* Empty State / Quick Create */}
        <div className="bg-slate-50 rounded-4xl border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center text-center space-y-4 group hover:border-blue-300 transition-all">
           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8 text-gray-300 group-hover:text-blue-500" />
           </div>
           <div className="space-y-1">
              <h4 className="text-sm font-semibold text-gray-900">Define Membership</h4>
              <p className="text-xs font-medium text-gray-400">Launch a custom tier for specific vendor needs.</p>
           </div>
        </div>
      </div>

      {/* New Feature: Global Subscription Insight */}
      <div className="max-w-7xl mx-auto mt-16 bg-linear-to-br from-indigo-900 to-blue-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-blue-200">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
             <div className="space-y-5 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 text-[10px] font-bold uppercase tracking-widest">
                   <RefreshCcw className="w-3 h-3 text-blue-300" /> Performance Nominal
                </div>
                <h2 className="text-4xl font-bold leading-tight tracking-tight">Standardizing the <br /> Partnership Experience.</h2>
                <p className="text-blue-100/80 text-lg font-medium leading-relaxed">
                   Unified membership tiers ensure fair visibility across the marketplace. Consistent pricing helps partners scale their operations with predictability.
                </p>
             </div>

             <div className="grid grid-cols-2 gap-6 w-full lg:w-auto">
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 space-y-2">
                   <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">Global ARPU</p>
                   <p className="text-3xl font-black tabular-nums tracking-tighter">₹2,840</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 space-y-2">
                   <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">Churn Rate</p>
                   <p className="text-3xl font-black tabular-nums tracking-tighter">4.2%</p>
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
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">{currentPackage ? 'Revise Plan' : 'Define New Tier'}</h2>
                    <p className="text-xs font-medium text-gray-500 mt-1">Configure service limits and commercial terms.</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                     <AlertCircle className="w-5 h-5 text-gray-400" />
                  </button>
               </div>

               <form onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const payload = {
                    name: formData.get('name'),
                    price: parseFloat(formData.get('price') as string),
                    durationDays: parseInt(formData.get('durationDays') as string),
                    productLimit: parseInt(formData.get('productLimit') as string),
                    leadLimit: parseInt(formData.get('leadLimit') as string),
                    description: formData.get('description'),
                  };

                  try {
                    if (currentPackage) {
                      await apiFetch(`/admin/packages/${currentPackage.id}`, {
                        method: 'PATCH',
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
                  }
               }} className="space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Plan Identifier</label>
                       <input 
                          name="name"
                          defaultValue={currentPackage?.name}
                          placeholder="e.g. Platinum Plus"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:border-blue-500 focus:bg-white outline-none font-semibold text-gray-900 text-sm transition-all"
                          required
                       />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">License Fee (INR)</label>
                          <input 
                             name="price"
                             type="number"
                             defaultValue={currentPackage?.price}
                             className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:border-blue-500 focus:bg-white outline-none font-bold text-gray-900 text-sm transition-all"
                             required
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Validity (Days)</label>
                          <input 
                             name="durationDays"
                             type="number"
                             defaultValue={currentPackage?.durationDays || 30}
                             className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:border-blue-500 focus:bg-white outline-none font-bold text-gray-900 text-sm transition-all"
                             required
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Listing Capacity</label>
                          <input 
                             name="productLimit"
                             type="number"
                             defaultValue={currentPackage?.productLimit}
                             className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:border-blue-500 focus:bg-white outline-none font-bold text-gray-900 text-sm transition-all"
                             required
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Lead Unlock Quota</label>
                          <input 
                             name="leadLimit"
                             type="number"
                             defaultValue={currentPackage?.leadLimit}
                             className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:border-blue-500 focus:bg-white outline-none font-bold text-gray-900 text-sm transition-all"
                             required
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Plan Narrative</label>
                       <textarea 
                          name="description"
                          defaultValue={currentPackage?.description}
                          rows={4}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:border-blue-500 focus:bg-white outline-none font-medium text-gray-700 text-sm transition-all"
                       />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-50 flex gap-4">
                     <button 
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 py-4 bg-gray-50 text-gray-600 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-gray-100 transition-all"
                     >
                        Discard
                     </button>
                     <button 
                        type="submit"
                        className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-blue-50 hover:bg-blue-700 transition-all"
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
