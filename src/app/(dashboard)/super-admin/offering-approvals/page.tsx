'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { 
  Briefcase, 
  Search, 
  Filter, 
  XCircle, 
  RefreshCcw, 
  ShieldCheck,
  ChevronRight,
  Zap,
  CheckCheck,
  AlertCircle,
  Package,
  Clock,
  ChevronDown
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
  const [timeRange, setTimeRange] = useState('ALL');
  const [customRange, setCustomRange] = useState({ start: '', end: '' });

  useEffect(() => {
    fetchOfferings();
  }, [searchTerm, statusFilter, typeFilter, timeRange, customRange]);

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
      if (timeRange !== 'ALL') params.append('timeRange', timeRange);
      if (timeRange === 'custom' && customRange.start && customRange.end) {
        params.append('startDate', customRange.start);
        params.append('endDate', customRange.end);
      }
      
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

  return (
    <div className="space-y-8 animate-simple-fade pb-20 p-2 md:p-0">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 max-w-7xl mx-auto">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Catalogue Review</h1>
           <p className="text-slate-600 font-medium mt-1 text-sm">Moderate and verify product listings and service offerings before they go live.</p>
        </div>

        <div className="flex-1 max-w-2xl flex items-center gap-4">
           {/* Search */}
           <div className="relative group flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600" />
              <input 
                type="text" 
                placeholder="Search listing, vendor, category or city..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-emerald-500 transition-all shadow-sm"
              />
           </div>

           {/* Filters Group */}
           <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-3 py-1.5 shadow-sm">
                <Clock size={14} className="text-gray-500" />
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="text-xs font-bold text-gray-900 outline-none bg-transparent cursor-pointer"
                >
                  <option value="ALL">Lifetime</option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="weekly">Last 7 Days</option>
                  <option value="monthly">Last 30 Days</option>
                  <option value="yearly">Last 12 Months</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              {timeRange === 'custom' && (
                <div className="flex items-center gap-2">
                  <input 
                    type="date" 
                    className="bg-white border border-gray-300 rounded-xl px-2 py-1 text-xs font-bold"
                    onChange={(e) => setCustomRange(prev => ({ ...prev, start: e.target.value }))}
                  />
                  <span className="text-xs font-bold text-gray-500">to</span>
                  <input 
                    type="date" 
                    className="bg-white border border-gray-300 rounded-xl px-2 py-1 text-xs font-bold"
                    onChange={(e) => setCustomRange(prev => ({ ...prev, end: e.target.value }))}
                  />
                </div>
              )}

              <div className="relative group">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-8 pr-6 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-emerald-500 appearance-none cursor-pointer hover:bg-gray-50 transition-all shadow-sm"
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
                className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-emerald-500 appearance-none cursor-pointer hover:bg-gray-50 transition-all shadow-sm"
              >
                <option value="ALL">Type</option>
                <option value="PRODUCT">Products</option>
                <option value="SERVICE">Services</option>
              </select>

              <button onClick={fetchOfferings} className="p-2.5 bg-white border border-gray-200 rounded-xl text-slate-600 hover:text-emerald-600 transition-all shadow-sm">
                <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
              </button>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
         <div className="bg-white rounded-xl border border-gray-100 overflow-hidden relative w-full">
            <div className="overflow-x-auto w-full no-scrollbar">
               <table className="w-full text-left whitespace-nowrap min-w-[800px]">
                  <thead>
                  <tr className="bg-slate-50/30 border-b border-gray-100">
                      <th className="px-8 py-5 text-xs font-bold text-slate-600 uppercase  ">Listing Details</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-600 uppercase  ">Verification Node</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-600 uppercase  ">City</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-600 uppercase  ">Public Status</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-600 uppercase  ">Submission</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-600 uppercase   text-right">Moderation</th>
                   </tr>
               </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-8 py-8 h-20 bg-gray-50/10"></td>
                   </tr>
                ))
              ) : offerings.length > 0 ? (
                offerings.map((offer) => (
                  <tr key={offer.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-5">
                        <div>
                           <p className="text-[15px] font-bold text-slate-900 leading-tight">{offer.name}</p>
                           <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">{offer.category || 'Unclassified'}</p>
                        </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-gray-100 overflow-hidden flex items-center justify-center text-slate-400 text-sm font-bold shrink-0">
                           {(offer.vendor?.logo || offer.vendor?.logoUrl) ? (
                             <img src={offer.vendor?.logo || offer.vendor?.logoUrl} className="w-full h-full object-cover" />
                           ) : offer.vendor?.businessName?.charAt(0) || 'V'}
                        </div>
                        <div>
                           <p className="text-[14px] font-bold text-slate-900 leading-none capitalize">{offer.vendor?.businessName}</p>
                           <p className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">Verified Partner</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                        {offer.vendor?.city || 'N/A'}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-bold uppercase  border transition-all ${
                        offer.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        offer.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 ' :
                        'bg-red-50 text-red-600 border-red-100'
                      }`}>
                         <div className={`w-1 h-1 rounded-full ${
                             offer.status === 'PENDING' ? 'bg-amber-500' : 
                             offer.status === 'APPROVED' ? 'bg-emerald-500' : 'bg-red-500'
                          }`}></div>
                        {offer.status === 'PENDING' ? 'Review Required' : offer.status === 'APPROVED' ? 'Publicly Live' : 'Hidden'}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-700">
                      {new Date(offer.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-5 text-right">
                       <button 
                         onClick={() => { setSelectedOffering(offer); setIsModalOpen(true); }}
                         className="px-5 py-2 bg-slate-900 text-white rounded-xl text-[12px] font-bold uppercase tracking-tight hover:bg-black transition-all"
                       >
                         Moderate
                       </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-24 text-center">
                    <CheckCheck className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <p className="text-sm font-bold text-slate-700">Workspace clear. No pending reviews at this time.</p>
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
               className="fixed right-0 top-0 h-screen w-full max-w-xl bg-[#F8FAFC]  z-[110] flex flex-col overflow-hidden"
            >
               {/* Sidebar Header */}
               <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight">Review Listing</h2>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-slate-600">
                     <AlertCircle className="w-5 h-5" />
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-8 space-y-8">
                  {/* Image Gallery Section */}
                  <div className="space-y-4">
                     <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x">
                        {selectedOffering.images && selectedOffering.images.length > 0 ? (
                           selectedOffering.images.map((img: string, idx: number) => (
                              <div key={idx} className="aspect-square w-[300px] shrink-0 bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm snap-center">
                                 <img src={img} className="w-full h-full object-cover" alt={`${selectedOffering.name} ${idx + 1}`} />
                              </div>
                           ))
                        ) : selectedOffering.imageUrl ? (
                           <div className="aspect-square w-full bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                              <img src={selectedOffering.imageUrl} className="w-full h-full object-cover" alt={selectedOffering.name} />
                           </div>
                        ) : (
                           <div className="aspect-video w-full bg-white rounded-xl border border-gray-100 flex flex-col items-center justify-center gap-3 shadow-sm">
                              <Package className="w-12 h-12 text-gray-100" />
                              <span className="text-xs font-bold text-gray-400 uppercase ">No Visuals Provided</span>
                           </div>
                        )}
                     </div>
                  </div>

                  {/* Header Info */}
                  <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-4">
                     <h3 className="text-3xl font-bold text-slate-900 leading-tight">{selectedOffering.name}</h3>
                     <div className="flex flex-wrap items-center gap-3">
                        <span className="px-3 py-1.5 bg-slate-50 text-slate-600 border border-gray-100 rounded-xl text-[11px] font-bold uppercase ">{selectedOffering.category || 'General Listing'}</span>
                        <span className={`px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase  border ${selectedOffering.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                           {selectedOffering.status}
                        </span>
                     </div>
                     <p className="text-sm text-slate-600 leading-relaxed font-medium bg-slate-50/50 p-4 rounded-xl border border-gray-50 italic">
                        "{selectedOffering.description || 'Applicant provided no written summary.'}"
                     </p>
                  </div>

                  {/* Core Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-[10px] font-bold text-slate-500 uppercase  mb-2 flex items-center gap-2">
                           <Zap className="w-3 h-3 text-amber-500" /> List Price
                        </p>
                        <p className="text-2xl font-bold text-slate-900">₹{selectedOffering.price?.toLocaleString() || 'N/A'}</p>
                     </div>
                     <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-[10px] font-bold text-slate-500 uppercase  mb-2 flex items-center gap-2">
                           <CheckCheck className="w-3 h-3 text-emerald-500" /> MOQ
                        </p>
                        <p className="text-2xl font-bold text-slate-900">{selectedOffering.moq || 1} <span className="text-xs font-bold text-slate-400 ml-1">UNITS</span></p>
                     </div>
                  </div>

                  {/* Business Context */}
                  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                     <div className="w-14 h-14 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-center text-slate-400 text-lg font-bold overflow-hidden shrink-0">
                        {(selectedOffering.vendor?.logo || selectedOffering.vendor?.logoUrl) ? (
                          <img src={selectedOffering.vendor?.logo || selectedOffering.vendor?.logoUrl} className="w-full h-full object-cover" />
                        ) : selectedOffering.vendor?.businessName?.charAt(0)}
                     </div>
                     <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900">{selectedOffering.vendor?.businessName}</p>
                        <p className="text-[11px] font-bold text-slate-500 mt-1 uppercase ">
                           {selectedOffering.vendor?.city || 'India'} • Verified Partner
                        </p>
                     </div>
                  </div>

                  {selectedOffering.specifications && (
                    <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase  pl-2">Technical Specifications</h4>
                        <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
                           <pre className="text-sm text-slate-700 whitespace-pre-wrap font-bold font-sans">
                              {selectedOffering.specifications}
                           </pre>
                        </div>
                    </div>
                  )}
               </div>

               {/* Action Footer */}
               <div className="p-8 border-t border-gray-100 bg-white flex items-center gap-4 shrink-0">
                  <button 
                     onClick={() => handleStatusUpdate(selectedOffering.id, 'APPROVED')}
                     disabled={!!processingId}
                     className="flex-1 py-4 bg-[#06392D] hover:bg-[#0D824D] text-white rounded-xl font-bold text-[13px] uppercase  flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                     <ShieldCheck className="w-5 h-5" />
                     Approve
                  </button>
                  <button 
                     onClick={() => handleStatusUpdate(selectedOffering.id, 'REJECTED')}
                     disabled={!!processingId}
                     className="flex-1 py-4 bg-white border border-red-100 hover:bg-red-50 text-red-600 rounded-xl font-bold text-[13px] uppercase  flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                     <XCircle className="w-5 h-5" />
                     Reject
                  </button>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
