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
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SubAdminProducts() {
  const [offerings, setOfferings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffering, setSelectedOffering] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOfferings();
  }, []);

  const fetchOfferings = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/admin/offerings');
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
      setOfferings(offerings.map(o => o.id === id ? { ...o, status } : o));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-simple-fade pb-20 p-2 md:p-0">
      {/* Humanized Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 max-w-7xl mx-auto">
        <div className="space-y-1">
           <div className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-1">
              <Sparkles className="w-3 h-3" /> Team Workspace
           </div>
           <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
             New Listing Requests
             <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                <Briefcase className="w-5 h-5" />
             </div>
           </h1>
           <p className="text-gray-500 font-medium text-sm">Review product listings and service offerings before they appear on the marketplace.</p>
        </div>

        <div className="flex items-center gap-3">
           <button onClick={fetchOfferings} className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm group">
              <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
           </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product Details</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Business</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Visibility</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Requested on</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-8"><div className="h-10 bg-gray-50 rounded-xl"></div></td>
                  </tr>
                ))
              ) : offerings.length > 0 ? (
                offerings.map((offer) => (
                  <tr key={offer.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 text-[10px] uppercase font-bold overflow-hidden shadow-sm group-hover:border-blue-200 transition-all">
                          {offer.imageUrl ? <img src={offer.imageUrl} className="w-full h-full object-cover" /> : <Package className="w-6 h-6 opacity-30" />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 tracking-tight">{offer.name}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                             <Tag className="w-3 h-3 text-blue-400" />
                             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{offer.category || 'Unclassified'}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 text-[10px] font-bold">
                           {offer.vendor?.businessName?.charAt(0) || 'V'}
                        </div>
                        <div>
                           <p className="text-xs font-semibold text-gray-900 leading-none capitalize">{offer.vendor?.businessName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all ${
                        offer.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        offer.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-sm' :
                        'bg-red-50 text-red-700 border-red-100'
                      }`}>
                         <div className={`w-1 h-1 rounded-full ${
                             offer.status === 'PENDING' ? 'bg-amber-500' : 
                             offer.status === 'APPROVED' ? 'bg-emerald-500' : 'bg-red-500'
                          }`}></div>
                        {offer.status === 'PENDING' ? 'Held' : offer.status === 'APPROVED' ? 'Live' : 'Hidden'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-gray-500">
                      {new Date(offer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button 
                         onClick={() => { setSelectedOffering(offer); setIsModalOpen(true); }}
                         className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all inline-flex items-center gap-2 text-xs font-semibold"
                       >
                         Review Listing
                         <ChevronRight className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <CheckCheck className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <p className="text-sm font-semibold text-gray-400">All caught up. No new listings to review.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
               className="fixed inset-0 bg-black/50 backdrop-blur-sm z-100"
            />
            <motion.div 
               initial={{ x: '100%' }} 
               animate={{ x: 0 }} 
               exit={{ x: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="fixed right-0 top-0 h-screen w-full max-w-2xl bg-white shadow-2xl z-110 p-10 overflow-y-auto"
            >
               <div className="flex items-center justify-between mb-10 pb-8 border-b border-gray-50">
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">Listing Review</h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                     <AlertCircle className="w-5 h-5 text-gray-400" />
                  </button>
               </div>

               <div className="space-y-12">
                  <div className="flex gap-8 items-start">
                     <div className="w-40 h-40 bg-gray-50 rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-lg shrink-0 flex items-center justify-center">
                        {selectedOffering.imageUrl ? <img src={selectedOffering.imageUrl} className="w-full h-full object-cover" /> : <Package className="w-12 h-12 text-gray-200" />}
                     </div>
                     <div className="space-y-4 pt-2">
                        <div>
                           <h3 className="text-2xl font-bold text-gray-900 leading-tight">{selectedOffering.name}</h3>
                           <p className="text-sm font-medium text-gray-500 mt-2">Listing Ref: {selectedOffering.id.split('-')[0].toUpperCase()}</p>
                        </div>
                        <div className="flex gap-2">
                           <span className="px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-xl text-xs font-bold text-blue-600 uppercase tracking-widest">{selectedOffering.type}</span>
                           <span className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-bold text-indigo-600 uppercase tracking-widest">{selectedOffering.category || 'Unclassified'}</span>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-3">
                         <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Pricing details</h4>
                         <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100 space-y-3">
                            <div className="flex justify-between items-center">
                               <span className="text-[10px] font-bold text-gray-500 uppercase">Unit Price</span>
                               <span className="text-sm font-bold text-gray-900">₹{selectedOffering.price?.toLocaleString() || 'Quote Price'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                               <span className="text-[10px] font-bold text-gray-500 uppercase">Min. Order</span>
                               <span className="text-sm font-bold text-gray-900">{selectedOffering.moq || 1} Units</span>
                            </div>
                         </div>
                      </div>
                      <div className="space-y-3">
                         <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Source business</h4>
                         <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100 space-y-3">
                            <div className="flex items-center gap-2">
                               <Warehouse className="w-3.5 h-3.5 text-blue-400" />
                               <span className="text-xs font-semibold text-gray-900">{selectedOffering.vendor?.businessName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                               <Globe className="w-3.5 h-3.5 text-gray-400" />
                               <span className="text-xs font-medium text-gray-500">{selectedOffering.vendor?.city}</span>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-3">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Product Info</h4>
                      <div className="space-y-4">
                        <p className="p-6 bg-white border border-gray-100 rounded-3xl text-gray-600 leading-relaxed font-medium italic shadow-sm">
                           "{selectedOffering.description || 'No description provided.'}"
                        </p>
                      </div>
                   </div>

                  <div className="grid grid-cols-2 gap-8 pt-4">
                     <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Quality Checks</h4>
                        <div className="space-y-3">
                           <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-2xl shadow-sm">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              <span className="text-xs font-semibold text-gray-900">Content screening passed</span>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Decision</h4>
                        <div className="flex flex-col gap-3">
                           <button 
                             onClick={() => handleStatusUpdate(selectedOffering.id, 'APPROVED')}
                             disabled={processingId === selectedOffering.id}
                             className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-50 transition-all disabled:opacity-50"
                           >
                              <ShieldCheck className="w-5 h-5" />
                              Make it live
                           </button>
                           <button 
                             onClick={() => handleStatusUpdate(selectedOffering.id, 'REJECTED')}
                             disabled={processingId === selectedOffering.id}
                             className="w-full py-4 bg-white border border-red-100 hover:border-red-200 text-red-600 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                           >
                              <XCircle className="w-5 h-5" />
                              Keep hidden
                           </button>
                        </div>
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
