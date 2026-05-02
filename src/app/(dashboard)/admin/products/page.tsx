'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { 
  Briefcase, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MoreVertical, 
  Eye, 
  Trash2, 
  Package, 
  Tag, 
  Warehouse, 
  Globe, 
  AlertCircle,
  RefreshCcw,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Zap,
  CheckCheck,
  Sparkles,
  Layers,
  IndianRupee,
  ShieldAlert,
  ExternalLink,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminProducts() {
  const [offerings, setOfferings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffering, setSelectedOffering] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('PENDING');

  useEffect(() => {
    fetchOfferings();
  }, [statusFilter]);

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

  const fetchOfferings = async () => {
    try {
      setLoading(true);
      const data = await apiFetch(`/admin/offerings?status=${statusFilter}`);
      setOfferings(data.data?.offerings || []);
    } catch (error) {
      console.error('Failed to fetch offerings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setProcessingId(id);
    try {
      const endpoint = status === 'APPROVED' ? 'approve' : 'reject';
      await apiFetch(`/admin/offerings/${id}/${endpoint}`, {
        method: 'PATCH',
        body: JSON.stringify({})
      });
      setOfferings(offerings.filter(o => o.id !== id));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-simple-fade pb-20 p-2 md:p-0 font-medium">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 max-w-7xl mx-auto">
        <div className="space-y-1">
           <div className="flex items-center gap-2 text-[#e88c30] font-semibold uppercase  text-base mb-1">
              <Sparkles className="w-3 h-3" /> HUB QUALITY CONTROL
           </div>
           <h1 className="text-2xl font-semibold text-slate-900  flex items-center gap-3">
             Listing Approvals
             <div className="p-1.5 bg-[#007367]/5 text-[#007367] rounded-none border border-[#007367]/10">
                <Briefcase className="w-5 h-5" />
             </div>
           </h1>
           <p className="text-slate-700 font-medium text-base">Verify and approve product listings from your hub's vendors.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
            <div className="flex p-1 bg-gray-100 rounded-xl overflow-hidden">
                {['PENDING', 'APPROVED', 'REJECTED'].map((status) => (
                    <button 
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-2 text-base font-semibold uppercase  transition-all rounded-lg ${statusFilter === status ? 'bg-white text-[#007367] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        {status}
                    </button>
                ))}
            </div>

           <button onClick={fetchOfferings} className="p-2.5 bg-white border border-gray-200 rounded-none text-slate-500 hover:text-[#007367] hover:bg-[#007367]/5 transition-all shadow-sm group">
              <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
           </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
         <div className="bg-white rounded-none border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50/50">
                        <th className="px-8 py-5 text-base font-semibold text-slate-500 uppercase ">Product Information</th>
                        <th className="px-8 py-5 text-base font-semibold text-slate-500 uppercase ">Supplier Hub</th>
                        <th className="px-8 py-5 text-base font-semibold text-slate-500 uppercase  text-center">Market Visibility</th>
                        <th className="px-8 py-5 text-base font-semibold text-slate-500 uppercase ">Listing Date</th>
                        <th className="px-8 py-5 text-base font-semibold text-slate-500 uppercase  text-right">Review</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {loading ? (
                        [1,2,3,4,5].map(i => (
                            <tr key={i} className="animate-pulse">
                            <td colSpan={5} className="px-8 py-8"><div className="h-12 bg-gray-50 rounded-2xl"></div></td>
                            </tr>
                        ))
                    ) : offerings.length > 0 ? (
                        offerings.map((offer) => (
                            <tr key={offer.id} className="group hover:bg-gray-50/30 transition-all">
                            <td className="px-8 py-5">
                                <div className="flex items-center gap-5">
<div>
                                        <p className="text-base font-semibold text-slate-900  group-hover:text-[#007367] transition-colors leading-tight">{offer.name}</p>
                                        <div className="flex items-center gap-1.5 mt-2">
                                            <Tag className="w-3.5 h-3.5 text-[#e88c30]" />
                                            <span className="text-base font-semibold text-slate-500 uppercase ">{offer.category || 'Unclassified'}</span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-none bg-[#007367]/5 flex items-center justify-center text-[#007367] border border-[#007367]/10 text-base font-semibold">
                                        {offer.vendor?.businessName?.charAt(0) || 'V'}
                                    </div>
                                    <div>
                                        <p className="text-base font-semibold text-slate-900 leading-none capitalize">{offer.vendor?.businessName}</p>
                                        <p className="text-base font-semibold text-slate-500 uppercase  mt-1.5">{offer.vendor?.city}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-5 text-center">
                                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-base font-semibold uppercase  border transition-all ${
                                    offer.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                    offer.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm' :
                                    'bg-red-50 text-red-600 border-red-100'
                                }`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${
                                        offer.status === 'PENDING' ? 'bg-amber-500 animate-pulse' : 
                                        offer.status === 'APPROVED' ? 'bg-emerald-500' : 'bg-red-500'
                                    }`}></div>
                                    {offer.status === 'PENDING' ? 'Reviewing' : offer.status === 'APPROVED' ? 'Market Live' : 'Hidden'}
                                </div>
                            </td>
                            <td className="px-8 py-5 text-base font-semibold text-slate-700">
                                {new Date(offer.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                            </td>
                            <td className="px-8 py-5 text-right">
                                <button 
                                    onClick={() => { setSelectedOffering(offer); setIsModalOpen(true); }}
                                    className="px-5 py-2.5 bg-white border border-gray-100 text-[#007367] rounded-none font-semibold text-base uppercase  hover:bg-[#007367] hover:text-white transition-all shadow-sm flex items-center gap-2 ml-auto"
                                >
                                    Review
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="py-32 text-center bg-gray-50/20">
                            <CheckCheck className="w-20 h-20 text-gray-200 mx-auto mb-6" />
                            <h3 className="text-xl font-semibold text-slate-500 ">Queue Cleared</h3>
                            <p className="text-base font-medium text-gray-300 max-w-xs mx-auto mt-2">All listing requests in your hub have been processed.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
                </table>
            </div>
         </div>
      </div>

      <AnimatePresence>
        {isModalOpen && selectedOffering && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               onClick={() => setIsModalOpen(false)}
               className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
               initial={{ x: '100%' }} 
               animate={{ x: 0 }} 
               exit={{ x: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="fixed right-0 top-0 h-screen w-full max-w-2xl bg-white shadow-2xl z-[110] p-12 overflow-y-auto"
            >
               <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-10 bg-[#007367] rounded-full" />
                     <h2 className="text-2xl font-semibold text-slate-900  uppercase">Listing Verification</h2>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-none transition-all">
                     <X className="w-6 h-6 text-slate-500" />
                  </button>
               </div>

               <div className="space-y-12 pb-10">
                  <div className="flex gap-10 items-start bg-gray-50/50 p-8 rounded-none border border-gray-100">
                     <div className="w-48 h-48 bg-white rounded-none border border-gray-100 overflow-hidden shadow-2xl shrink-0 flex items-center justify-center relative group/img">
                        {selectedOffering.images && selectedOffering.images.length > 0 ? (
                           <img src={selectedOffering.images[0]} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" />
                        ) : (
                           <Package className="w-16 h-16 text-gray-200" />
                        )}
                        <div className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur shadow-sm rounded-none">
                            <Sparkles className="w-4 h-4 text-[#e88c30]" />
                        </div>
                     </div>
                     <div className="space-y-6 pt-2">
                        <div>
                           <h3 className="text-3xl font-semibold text-slate-900 leading-tight">{selectedOffering.name}</h3>
                           <p className="text-base font-semibold text-slate-500 uppercase  mt-3 flex items-center gap-2">
                             <div className="w-1.5 h-1.5 bg-[#e88c30] rounded-full" />
                             UID: {selectedOffering.id.split('-')[0].toUpperCase()}
                           </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                           <span className="px-4 py-2 bg-[#007367]/5 border border-[#007367]/10 rounded-none text-base font-semibold text-[#007367] uppercase ">{selectedOffering.type}</span>
                           <span className="px-4 py-2 bg-[#007367]/5 border border-[#007367]/10 rounded-none text-base font-semibold text-[#007367] uppercase ">{selectedOffering.category || 'Industry Asset'}</span>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-6">
                         <h4 className="text-base font-semibold text-slate-500 uppercase  flex items-center gap-2">
                             <IndianRupee className="w-4 h-4 text-[#e88c30]" /> Commercial Structure
                         </h4>
                         <div className="p-8 bg-white rounded-none border border-gray-100 shadow-sm space-y-5">
                            <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                               <span className="text-base font-semibold text-slate-500 uppercase ">Market Price</span>
                               <span className="text-xl font-semibold text-slate-900">₹{selectedOffering.price?.toLocaleString() || 'Quote'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                               <span className="text-base font-semibold text-slate-500 uppercase ">Minimum Order</span>
                               <span className="text-base font-semibold text-slate-900 bg-gray-50 px-4 py-1.5 rounded-none border border-gray-100">{selectedOffering.moq || 1} Units</span>
                            </div>
                         </div>
                      </div>
                      <div className="space-y-6">
                         <h4 className="text-base font-semibold text-slate-500 uppercase  flex items-center gap-2">
                             <Warehouse className="w-4 h-4 text-[#007367]" /> Source Entity
                         </h4>
                         <div className="p-8 bg-white rounded-none border border-gray-100 shadow-sm space-y-5">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-none bg-gray-50 flex items-center justify-center text-slate-500 font-semibold border border-gray-100">
                                  {selectedOffering.vendor?.businessName?.charAt(0)}
                               </div>
                               <div>
                                  <p className="text-base font-semibold text-slate-900 leading-none">{selectedOffering.vendor?.businessName}</p>
                                  <p className="text-base font-semibold text-[#e88c30] uppercase  mt-1.5">{selectedOffering.vendor?.city}</p>
                               </div>
                            </div>
                            <button className="w-full py-3 bg-gray-50 hover:bg-[#007367]/5 text-slate-700 hover:text-[#007367] rounded-none text-base font-semibold uppercase  transition-all flex items-center justify-center gap-2">
                               <ExternalLink className="w-3.5 h-3.5" />
                               View Profile
                            </button>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <h4 className="text-base font-semibold text-slate-500 uppercase  flex items-center gap-2 pl-1">
                          <AlertCircle className="w-4 h-4 text-[#e88c30]" /> Product Intelligence
                      </h4>
                      <div className="p-8 bg-gray-50/50 border border-gray-100 rounded-none shadow-inner relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                            <Package className="w-32 h-32" />
                        </div>
                        <p className="text-base text-slate-800 font-semibold leading-relaxed relative z-10 border-l-4 border-[#007367] pl-8 py-2">
                           "{selectedOffering.description || 'No detailed technical specifications or description provided for this listing.'}"
                        </p>
                      </div>
                   </div>

                  <div className="flex flex-col gap-4 pt-6">
                     <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => handleStatusUpdate(selectedOffering.id, 'APPROVED')}
                            disabled={processingId === selectedOffering.id}
                            className="py-5 bg-[#007367] hover:bg-[#005e54] text-white rounded-none font-semibold flex items-center justify-center gap-3 shadow-xl shadow-[#007367]/20 transition-all disabled:opacity-50 active:scale-95"
                        >
                            {processingId === selectedOffering.id ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-6 h-6 text-emerald-400" />}
                            Approve for Market
                        </button>
                        <button 
                            onClick={() => handleStatusUpdate(selectedOffering.id, 'REJECTED')}
                            disabled={processingId === selectedOffering.id}
                            className="py-5 bg-white border border-red-100 hover:border-red-500 hover:text-red-600 text-red-400 rounded-none font-semibold flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                        >
                            <ShieldAlert className="w-6 h-6" />
                            Decline Request
                        </button>
                     </div>
                  </div>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}


