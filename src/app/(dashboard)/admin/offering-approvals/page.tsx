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

  const filteredOfferings = offerings.filter(offering => {
    const matchesSearch = 
      offering.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      offering.vendor?.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offering.vendor?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offering.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || offering.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || offering.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-8 animate-simple-fade pb-20 p-2 md:p-0">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 max-w-7xl mx-auto">
        <div>
           <h1 className="text-2xl font-semibold text-gray-900 tracking-tight flex items-center gap-3">
             Catalogue Review
             <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                <Briefcase className="w-5 h-5" />
             </div>
           </h1>
           <p className="text-gray-500 font-medium mt-1 text-sm">Moderate and verify product listings and service offerings before they go live.</p>
        </div>

        <div className="flex-1 max-w-2xl flex items-center gap-4">
           {/* Search */}
           <div className="relative group flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500" />
              <input 
                type="text" 
                placeholder="Search listing, vendor, category or city..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[13px] font-medium outline-none focus:bg-white focus:border-blue-500 focus:shadow-md transition-all"
              />
           </div>

           {/* Filters Group */}
           <div className="flex items-center gap-2 shrink-0">
              <div className="relative group">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-8 pr-6 py-2 bg-white border border-gray-200 rounded-lg text-[11px] font-bold text-gray-600 outline-none focus:border-blue-500 appearance-none cursor-pointer hover:bg-gray-50 transition-all shadow-sm"
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
                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-[11px] font-bold text-gray-600 outline-none focus:border-blue-500 appearance-none cursor-pointer hover:bg-gray-50 transition-all shadow-sm"
              >
                <option value="ALL">Type</option>
                <option value="PRODUCT">Products</option>
                <option value="SERVICE">Services</option>
              </select>

              <button onClick={fetchOfferings} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm">
                <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col">
          <div className="overflow-x-auto max-h-[calc(100vh-260px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
            <table className="w-full text-left border-collapse relative">
            <thead className="sticky top-0 z-20">
               <tr className="bg-gray-50 border-b border-gray-100 shadow-sm">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Listing Details</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Verification Node</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">City</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Public Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Submission</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Moderation</th>
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
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 text-[10px] uppercase font-bold overflow-hidden shadow-sm group-hover:border-blue-200 transition-all">
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
                           <p className="text-[10px] font-medium text-gray-500 mt-1">Verified Partner</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Warehouse className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs font-semibold uppercase">{offer.vendor?.city || 'N/A'}</span>
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
                        {offer.status === 'PENDING' ? 'Awaiting Review' : offer.status === 'APPROVED' ? 'Public' : 'Hidden'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-gray-500">
                      {new Date(offer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button 
                         onClick={() => { setSelectedOffering(offer); setIsModalOpen(true); }}
                         className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all inline-flex items-center gap-2 text-xs font-semibold"
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
                    <p className="text-sm font-semibold text-gray-400">Workspace clear. No pending reviews at this time.</p>
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
               className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-90"
            />
            <motion.div 
               initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-100 border-l border-gray-100 flex flex-col"
            >
               {/* Sidebar Header */}
               <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 tracking-tight">Review Listing</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Ref: {selectedOffering.id.slice(-8).toUpperCase()}</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400 hover:text-gray-900">
                     <AlertCircle className="w-5 h-5" />
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
                  {/* Hero Section */}
                  <div className="space-y-4">
                     <div className="aspect-video w-full bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden shadow-inner group relative">
                        {selectedOffering.imageUrl ? (
                           <img src={selectedOffering.imageUrl} className="w-full h-full object-cover" />
                        ) : (
                           <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                              <Package className="w-10 h-10 text-gray-200" />
                              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest text-center px-4">Image Not Available</span>
                           </div>
                        )}
                        <div className="absolute top-4 left-4 flex gap-1.5">
                           <span className="px-2 py-1 bg-white/90 backdrop-blur shadow-sm rounded-lg text-[9px] font-bold text-blue-600 uppercase tracking-wider border border-blue-100">{selectedOffering.type}</span>
                        </div>
                     </div>
                     
                     <div>
                        <h3 className="text-xl font-bold text-gray-900 leading-snug">{selectedOffering.name}</h3>
                        <div className="flex items-center gap-2 mt-2">
                           <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-500 uppercase tracking-wider">{selectedOffering.category || 'Unclassified'}</span>
                        </div>
                     </div>
                  </div>

                  {/* Quick Info Grid */}
                  <div className="grid grid-cols-2 gap-px bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                     <div className="bg-white p-4">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pricing</p>
                        <p className="text-sm font-bold text-gray-900">₹{selectedOffering.price?.toLocaleString() || 'Quote'}</p>
                     </div>
                     <div className="bg-white p-4">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">MOQ</p>
                        <p className="text-sm font-bold text-gray-900">{selectedOffering.moq || 1} Units</p>
                     </div>
                     <div className="bg-white p-4">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Vendor</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{selectedOffering.vendor?.businessName}</p>
                     </div>
                     <div className="bg-white p-4">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">City</p>
                        <p className="text-sm font-bold text-gray-900">{selectedOffering.vendor?.city || 'N/A'}</p>
                     </div>
                  </div>

                  {/* Detail Text */}
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Description</h4>
                        <p className="text-[13px] text-gray-600 leading-relaxed font-medium bg-gray-50 p-4 rounded-xl border border-gray-100 underline-offset-4 decoration-gray-100">
                           {selectedOffering.description || 'No description provided.'}
                        </p>
                     </div>

                     {selectedOffering.specifications && (
                        <div className="space-y-2">
                           <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Specifications</h4>
                           <div className="text-[12px] text-gray-700 bg-blue-50/30 p-4 rounded-xl border border-blue-50 whitespace-pre-wrap font-medium">
                              {selectedOffering.specifications}
                           </div>
                        </div>
                     )}
                  </div>
               </div>

               {/* Action Footer */}
               <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex flex-col gap-3 sticky bottom-0 z-20 backdrop-blur-md">
                  <div className="flex gap-3">
                     <button 
                        onClick={() => handleStatusUpdate(selectedOffering.id, 'APPROVED')}
                        disabled={!!processingId}
                        className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 shadow-lg shadow-emerald-200/50 transition-all disabled:opacity-50"
                     >
                        <ShieldCheck className="w-4 h-4" />
                        Approve
                     </button>
                     <button 
                        onClick={() => handleStatusUpdate(selectedOffering.id, 'REJECTED')}
                        disabled={!!processingId}
                        className="flex-1 py-3.5 bg-white border border-red-100 hover:bg-red-50 text-red-600 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                     >
                        <XCircle className="w-4 h-4" />
                        Reject
                     </button>
                  </div>
                  <p className="text-[9px] text-center text-gray-400 font-bold uppercase tracking-widest">Awaiting Moderator decision</p>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
