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
  CheckCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OfferingApprovals() {
  const [offerings, setOfferings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffering, setSelectedOffering] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  useEffect(() => {
    fetchOfferings();
  }, [searchTerm, statusFilter, typeFilter]);

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
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (typeFilter !== 'ALL') params.append('type', typeFilter);
      
      const data = await apiFetch(`/admin/offerings?${params.toString()}`);
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

  const filteredOfferings = offerings;

  return (
    <div className="space-y-8 animate-simple-fade pb-20 p-2 md:p-0">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 max-w-7xl mx-auto">
        <div>
           <h1 className="text-2xl font-semibold text-slate-900  flex items-center gap-3">
             Catalogue Review
             <div className="p-1.5 bg-[#164e33]/5 text-[#164e33] rounded-xl border border-[#164e33]/10">
                <Briefcase className="w-5 h-5" />
             </div>
           </h1>
           <p className="text-slate-700 font-medium mt-1 text-base">Moderate and verify product listings and service offerings before they go live.</p>
        </div>

        <div className="flex-1 max-w-2xl flex items-center gap-4">
           {/* Search */}
           <div className="relative group flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-slate-600" />
              <input 
                type="text" 
                placeholder="Search listing, vendor, category or city..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-base font-medium outline-none focus:bg-white focus:border-blue-500 focus:shadow-md transition-all"
              />
           </div>

           {/* Filters Group */}
           <div className="flex items-center gap-2 shrink-0">
              <div className="relative group">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-8 pr-6 py-2 bg-white border border-gray-200 rounded-xl text-base font-semibold text-slate-800 outline-none focus:border-blue-500 appearance-none cursor-pointer hover:bg-gray-50 transition-all shadow-sm"
                >
                  <option value="ALL">Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Live</option>
                  <option value="REJECTED">Hidden</option>
                </select>
              </div>

              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-base font-semibold text-slate-800 outline-none focus:border-blue-500 appearance-none cursor-pointer hover:bg-gray-50 transition-all shadow-sm"
              >
                <option value="ALL">Type</option>
                <option value="PRODUCT">Products</option>
                <option value="SERVICE">Services</option>
              </select>

              <button onClick={fetchOfferings} className="p-2 bg-white border border-gray-200 rounded-xl text-slate-500 hover:text-[#164e33] hover:bg-[#164e33]/5 transition-all shadow-sm">
                <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
         <div className="bg-white rounded-xl border border-gray-200 shadow-sm relative w-full">
            <div className="overflow-x-auto w-full no-scrollbar">
               <table className="w-full text-left whitespace-nowrap min-w-[800px]">
                  <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                     <th className="px-4 sm:px-6 py-4 text-base font-semibold text-slate-500 uppercase ">Listing Details</th>
                     <th className="px-6 py-4 text-base font-semibold text-slate-500 uppercase ">Verification Node</th>
                     <th className="px-6 py-4 text-base font-semibold text-slate-500 uppercase ">City</th>
                     <th className="px-6 py-4 text-base font-semibold text-slate-500 uppercase ">Public Status</th>
                     <th className="px-6 py-4 text-base font-semibold text-slate-500 uppercase ">Submission</th>
                     <th className="px-4 sm:px-6 py-4 text-base font-semibold text-slate-500 uppercase  text-right">Moderation</th>
                  </tr>
               </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [1,2,6,4,5].map(i => (
                  <tr key={i} className="animate-pulse px-6 py-4">
                    <td colSpan={6} className="px-6 py-8"><div className="h-10 bg-gray-50 rounded-xl"></div></td>
                   </tr>
                ))
              ) : filteredOfferings.length > 0 ? (
                filteredOfferings.map((offer) => (
                  <tr key={offer.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-4">
<div>
                          <p className="text-base font-semibold text-slate-900 ">{offer.name}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                             <Tag className="w-3 h-3 text-blue-400" />
                             <span className="text-base font-semibold text-slate-500 uppercase ">{offer.category || 'Unclassified'}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#164e33]/5 flex items-center justify-center text-[#164e33] border border-[#164e33]/10 text-base font-semibold">
                           {offer.vendor?.businessName?.charAt(0) || 'V'}
                        </div>
                        <div>
                           <p className="text-base font-semibold text-slate-900 leading-none capitalize">{offer.vendor?.businessName}</p>
                           <p className="text-base font-medium text-slate-700 mt-1">Verified Partner</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Warehouse className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-base font-semibold uppercase">{offer.vendor?.city || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-base font-semibold uppercase  border transition-all ${
                        offer.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        offer.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-sm' :
                        'bg-red-50 text-red-700 border-red-100'
                      }`}>
                         <div className={`w-1 h-1 rounded-full ${
                             offer.status === 'PENDING' ? 'bg-amber-500' : 
                             offer.status === 'APPROVED' ? 'bg-emerald-500' : 'bg-red-500'
                          }`}></div>
                        {offer.status === 'PENDING' ? 'Awaiting Review' : offer.status === 'APPROVED' ? 'Public' : 'Hidden'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-base font-semibold text-slate-700">
                      {new Date(offer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                       <button 
                         onClick={() => { setSelectedOffering(offer); setIsModalOpen(true); }}
                         className="p-2 text-slate-500 hover:text-[#164e33] hover:bg-[#164e33]/5 rounded-xl transition-all inline-flex items-center gap-2 text-base font-semibold"
                       >
                         Moderate Listing
                         <ChevronRight className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-24 text-center">
                    <CheckCheck className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <p className="text-base font-semibold text-slate-500">Workspace clear. No pending reviews at this time.</p>
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
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setIsModalOpen(false)}
               className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[100]"
            />
            <motion.div 
               initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="fixed right-0 top-0 h-screen w-full max-w-xl bg-white shadow-2xl z-[110] border-l border-gray-100 flex flex-col overflow-hidden"
            >
               {/* Sidebar Header */}
               <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 ">Review Listing</h2>
                    <p className="text-base font-semibold text-slate-500 uppercase  mt-0.5">Ref: {selectedOffering.id.slice(-8).toUpperCase()}</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2.5 hover:bg-gray-50 rounded-xl transition-colors text-slate-500 hover:text-slate-900 border border-transparent hover:border-gray-200">
                     <AlertCircle className="w-5 h-5" />
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-8 space-y-8">
                  {/* Image Gallery Section */}
                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                         <h4 className="text-base font-semibold text-slate-500 uppercase  pl-1 border-b border-gray-50 pb-2 flex-1">Product Visuals</h4>
                        <span className="px-3 py-1.5 bg-[#164e33]/10 text-[#164e33] rounded-lg text-base font-semibold uppercase  ml-4">{selectedOffering.type}</span>
                     </div>
                     
                     <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x">
                        {selectedOffering.images && selectedOffering.images.length > 0 ? (
                           selectedOffering.images.map((img: string, idx: number) => (
                              <div key={idx} className="aspect-square w-[280px] shrink-0 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden shadow-sm snap-center">
                                 <img src={img} className="w-full h-full object-cover" alt={`${selectedOffering.name} ${idx + 1}`} />
                              </div>
                           ))
                        ) : selectedOffering.imageUrl ? (
                           <div className="aspect-square w-full bg-gray-50 rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                              <img src={selectedOffering.imageUrl} className="w-full h-full object-cover" alt={selectedOffering.name} />
                           </div>
                        ) : (
                           <div className="aspect-video w-full bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center justify-center gap-3">
                              <Package className="w-12 h-12 text-gray-200" />
                              <span className="text-base font-semibold text-gray-300 uppercase ">No Visuals Provided</span>
                           </div>
                        )}
                     </div>
                  </div>

                  {/* Header Info */}
                  <div className="space-y-3">
                     <h3 className="text-3xl font-semibold text-[#164e33] leading-tight ">{selectedOffering.name}</h3>
                     <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100">
                           <Tag className="w-4 h-4 text-slate-500" />
                           <span className="text-base font-semibold text-slate-800 uppercase ">{selectedOffering.category || 'General Listing'}</span>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-base font-semibold uppercase  ${selectedOffering.status === 'APPROVED' ? 'bg-[#164e33]/10 text-[#164e33]' : 'bg-amber-50 text-amber-700'}`}>
                           <div className={`w-1.5 h-1.5 rounded-full ${selectedOffering.status === 'APPROVED' ? 'bg-[#164e33]' : 'bg-amber-500'}`}></div>
                           {selectedOffering.status}
                        </div>
                     </div>
                  </div>

                  {/* Core Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-6 bg-gray-50/80 rounded-xl border border-gray-100">
                        <p className="text-base font-semibold text-slate-700 uppercase  mb-3 flex items-center gap-2">
                           <Zap className="w-4 h-4 text-amber-500" /> List Price
                        </p>
                        <p className="text-2xl font-semibold text-slate-900">₹{selectedOffering.price?.toLocaleString() || 'N/A'}</p>
                     </div>
                     <div className="p-6 bg-gray-50/80 rounded-xl border border-gray-100">
                        <p className="text-base font-semibold text-slate-700 uppercase  mb-3 flex items-center gap-2">
                           <CheckCheck className="w-4 h-4 text-[#164e33]" /> Minimum Order
                        </p>
                        <p className="text-2xl font-semibold text-slate-900">{selectedOffering.moq || 1} <span className="text-base font-medium text-slate-700 ml-1">Units</span></p>
                     </div>
                  </div>

                  {/* Context Sections */}
                  <div className="space-y-8">
                     <section className="space-y-4">
                        <h4 className="text-base font-semibold text-slate-500 uppercase  pl-1 border-b border-gray-50 pb-2">Business Context</h4>
                        <div className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
                           <div className="w-14 h-14 rounded-xl bg-[#164e33]/10 border border-[#164e33]/20 flex items-center justify-center text-[#164e33] text-xl font-semibold">
                              {selectedOffering.vendor?.businessName?.charAt(0)}
                           </div>
                           <div className="flex-1">
                              <p className="text-base font-semibold text-slate-900">{selectedOffering.vendor?.businessName}</p>
                              <p className="text-base font-medium text-slate-700 flex items-center gap-1.5 mt-1">
                                 <Globe className="w-3.5 h-3.5" /> {selectedOffering.vendor?.city || 'India'}
                              </p>
                           </div>
                        </div>
                     </section>

                     <section className="space-y-4">
                        <h4 className="text-base font-semibold text-slate-500 uppercase  pl-1 border-b border-gray-50 pb-2">Technical Description</h4>
                        <div className="p-6 bg-gray-50/80 rounded-xl border border-gray-100">
                           <p className="text-base text-slate-800 leading-relaxed font-medium">
                              {selectedOffering.description || 'Applicant provided no written summary.'}
                           </p>
                        </div>
                     </section>

                     {selectedOffering.specifications && (
                        <section className="space-y-4">
                           <h4 className="text-base font-semibold text-slate-500 uppercase  pl-1 border-b border-gray-50 pb-2">Product DNA</h4>
                           <div className="p-6 bg-[#164e33]/5 rounded-xl border border-[#164e33]/10">
                              <pre className="text-base text-slate-900 whitespace-pre-wrap font-medium font-sans">
                                 {selectedOffering.specifications}
                              </pre>
                           </div>
                        </section>
                     )}
                  </div>
               </div>

               {/* Action Footer */}
               <div className="p-6 border-t border-gray-100 bg-white flex flex-col gap-3 shrink-0 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
                  <div className="flex gap-4">
                     <button 
                        onClick={() => handleStatusUpdate(selectedOffering.id, 'APPROVED')}
                        disabled={!!processingId}
                        className="flex-1 py-4 bg-[#164e33] hover:bg-[#113f29] text-white rounded-xl font-semibold text-base flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
                     >
                        <ShieldCheck className="w-5 h-5" />
                        Approve Listing
                     </button>
                     <button 
                        onClick={() => handleStatusUpdate(selectedOffering.id, 'REJECTED')}
                        disabled={!!processingId}
                        className="flex-1 py-4 bg-white border border-red-200 hover:bg-red-50 text-red-600 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                     >
                        <XCircle className="w-5 h-5" />
                        Reject Listing
                     </button>
                  </div>
                  <p className="text-base text-center text-slate-500 font-medium tracking-wide mt-1">Awaiting Moderator Decision</p>
               </div>


            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}



