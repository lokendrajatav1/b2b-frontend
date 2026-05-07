'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { 
  Target as TargetIcon, 
  Search, 
  Filter, 
  ChevronRight, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  Activity,
  Zap,
  ArrowRight,
  MessageSquare,
  RefreshCcw,
  UserCheck,
  ShieldCheck,
  Package,
  Layers,
  Briefcase,
  X,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLeads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [timeRange, setTimeRange] = useState('ALL');
  const [customRange, setCustomRange] = useState({ start: '', end: '' });
  const [assigning, setAssigning] = useState<string | null>(null);
  const [categoryVendors, setCategoryVendors] = useState<any[]>([]);
  const [vendorsLoading, setVendorsLoading] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, [timeRange, customRange]);

  useEffect(() => {
    const header = document.getElementById('main-dashboard-header');
    if (header) {
      if (isDetailOpen) {
        header.style.opacity = '0';
        header.style.pointerEvents = 'none';
      } else {
        header.style.opacity = '1';
        header.style.pointerEvents = 'auto';
      }
    }
  }, [isDetailOpen]);

  useEffect(() => {
    if (selectedLead?.categoryId) {
      fetchVendorsByCategory(selectedLead.categoryId);
    }
  }, [selectedLead]);

  const fetchVendorsByCategory = async (catId: string) => {
    try {
      setVendorsLoading(true);
      // Run the primary check and a few fallbacks in parallel to speed up UI
      const [verifiedData, allCatData, cityData] = await Promise.all([
        apiFetch(`/vendors?categoryId=${catId}&limit=50&verified=true`),
        apiFetch(`/vendors?categoryId=${catId}&limit=50`),
        selectedLead?.city ? apiFetch(`/vendors?city=${encodeURIComponent(selectedLead.city)}&limit=50&verified=true`) : Promise.resolve({ data: { vendors: [] } })
      ]);

      let verifiedMatching = verifiedData.data?.vendors || [];
      let allMatchingInCategory = allCatData.data?.vendors || [];
      let cityMatching = cityData.data?.vendors || [];

      // Combine and deduplicate
      const combinedMap = new Map();
      verifiedMatching.forEach((v: any) => combinedMap.set(v.id, v));
      allMatchingInCategory.forEach((v: any) => { if (!combinedMap.has(v.id)) combinedMap.set(v.id, v); });
      cityMatching.forEach((v: any) => { if (!combinedMap.has(v.id)) combinedMap.set(v.id, v); });

      const finalVendors = Array.from(combinedMap.values());

      if (finalVendors.length === 0) {
        const fallbackData = await apiFetch(`/vendors?limit=20&verified=true`);
        setCategoryVendors(fallbackData.data?.vendors || []);
      } else {
        setCategoryVendors(finalVendors);
      }
    } catch (error) {
      console.error('Failed to fetch vendors for category:', error);
    } finally {
      setVendorsLoading(false);
    }
  };


  const fetchLeads = async () => {
    try {
      setLoading(true);
      let url = '/admin/leads?';
      const params = new URLSearchParams();
      if (timeRange !== 'ALL') params.append('timeRange', timeRange);
      if (timeRange === 'custom' && customRange.start && customRange.end) {
        params.append('startDate', customRange.start);
        params.append('endDate', customRange.end);
      }
      const data = await apiFetch(url + params.toString());
      setLeads(data.data?.leads || []);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (leadId: string, vendorId: string) => {
    setAssigning(leadId);
    try {
      await apiFetch(`/admin/leads/${leadId}/reassign`, {
        method: 'PATCH',
        body: JSON.stringify({ vendorId })
      });
      fetchLeads();
      setLeads(leads.map(l => l.id === leadId ? { ...l, status: 'DISTRIBUTED' } : l));
    } catch (error) {
      console.error('Failed to assign lead:', error);
    } finally {
      setAssigning(null);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const searchLow = searchTerm.toLowerCase();
    const matchesSearch = 
      lead.buyerName?.toLowerCase().includes(searchLow) || 
      lead.phone?.toLowerCase().includes(searchLow) ||
      lead.buyerEmail?.toLowerCase().includes(searchLow) ||
      lead.category?.name?.toLowerCase().includes(searchLow) ||
      lead.city?.toLowerCase().includes(searchLow);
    
    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || lead.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-simple-fade pb-20 px-4 lg:px-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 max-w-7xl mx-auto">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Market Demand Streams</h1>
           <p className="text-slate-600 font-medium mt-1 text-sm">Review incoming buyer requirements and curate their distribution to matching vendors.</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="relative w-full md:w-80 lg:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search leads, category or city..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all shadow-sm"
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
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-700" />
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-8 pr-6 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 appearance-none cursor-pointer hover:bg-gray-50 transition-all "
                >
                  <option value="ALL">Status</option>
                  <option value="PENDING">Pending (New)</option>
                  <option value="DISTRIBUTED">Distributed</option>
                  <option value="CLOSED">Closed/Converted</option>
                  <option value="EXPIRED">Expired</option>
                </select>
              </div>

              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 appearance-none cursor-pointer hover:bg-gray-50 transition-all "
              >
                <option value="ALL">Type</option>
                <option value="DIRECT">Direct</option>
                <option value="MARKETPLACE">Marketplace</option>
              </select>

              <button onClick={fetchLeads} className="p-3 bg-white border border-gray-200 rounded-xl text-slate-600 hover:text-slate-900 transition-all shadow-sm">
                <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden min-h-[500px] flex flex-col shadow-sm">
          <div className="overflow-x-auto max-h-[calc(100vh-260px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
            <table className="w-full text-left border-collapse relative whitespace-nowrap min-w-[800px]">
              <thead className="sticky top-0 z-20">
                <tr className="bg-slate-50/30 border-b border-gray-100 ">
                  <th className="px-8 py-5 text-xs font-bold text-slate-600 uppercase  ">Buyer Details</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-600 uppercase  ">Inquiry Type</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-600 uppercase  ">Location</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-600 uppercase  ">Status</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-600 uppercase  ">Matched Vendor</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-600 uppercase   text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  [1,2,3,4,5].map(i => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="px-6 py-8"><div className="h-10 bg-gray-50 rounded-xl"></div></td>
                    </tr>
                  ))
                ) : filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                  <tr key={lead.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5">
                        <div className="flex flex-col">
                           <span className="text-[15px] font-bold text-slate-900  leading-tight group-hover:text-[#0D824D] transition-colors">
                             {lead.searchKeyword ? `Looking for "${lead.searchKeyword}"` : `Inquiry from ${lead.buyerName}`}
                           </span>
                           <div className="flex items-center gap-3 mt-1.5">
                              <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                                 {lead.phone || 'N/A'}
                              </span>
                           </div>
                           <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter mt-1 flex items-center gap-1.5">
                             Posted {new Date(lead.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                           </span>
                        </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-bold text-slate-500 uppercase ">
                           {lead.category?.name || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                        <div className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                           {lead.city || 'Global Reach'}
                        </div>
                    </td>
                    <td className="px-8 py-5">
                       <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-bold uppercase  border transition-all ${
                         lead.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                         lead.status === 'DISTRIBUTED' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                         'bg-emerald-50 text-emerald-600 border-emerald-100'
                       }`}>
                          <div className={`w-1 h-1 rounded-full ${
                             lead.status === 'PENDING' ? 'bg-amber-500' : 
                             lead.status === 'DISTRIBUTED' ? 'bg-blue-500' : 'bg-emerald-500'
                          }`}></div>
                          {lead.status === 'PENDING' ? 'Open Market' : lead.status === 'DISTRIBUTED' ? 'Assigned' : 'Closed'}
                       </div>
                    </td>
                    <td className="px-8 py-5">
                       {lead.vendor ? (
                         <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 border border-gray-100 overflow-hidden flex items-center justify-center text-slate-400 text-xs font-bold shrink-0">
                               {(lead.vendor.logo || lead.vendor.logoUrl) ? (
                                 <img src={lead.vendor.logo || lead.vendor.logoUrl} className="w-full h-full object-cover" />
                               ) : lead.vendor.businessName?.charAt(0)}
                            </div>
                            <div>
                               <p className="text-[14px] font-bold text-slate-900 leading-none capitalize truncate max-w-[150px]">{lead.vendor.businessName}</p>
                               <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Verified Partner</p>
                            </div>
                         </div>
                       ) : (
                         <span className="text-[11px] font-bold text-slate-400 uppercase  ">Unassigned</span>
                       )}
                    </td>
                    <td className="px-8 py-5 text-right">
                       <button 
                         onClick={() => { setSelectedLead(lead); setIsDetailOpen(true); }}
                         className="px-5 py-2 bg-slate-900 text-white rounded-xl text-[12px] font-bold uppercase tracking-tight hover:bg-black transition-all"
                       >
                          Review
                       </button>
                    </td>
                  </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-24 text-center">
                       <Activity className="w-20 h-20 text-gray-100 mx-auto mb-6" />
                       <h3 className="text-lg font-semibold text-slate-700 ">No Demand Stream Found</h3>
                       <p className="text-sm font-medium text-gray-500 max-w-xs mx-auto mt-2">There are currently no active market inquiries matching your search criteria.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isDetailOpen && selectedLead && (
          <>
             <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => setIsDetailOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
             />
             <motion.div 
                initial={{ x: '100%' }} 
                animate={{ x: 0 }} 
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 h-screen w-full max-w-xl bg-white  z-[110] flex flex-col overflow-hidden"
             >
               <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-white shrink-0">
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-10 bg-[#164e33] rounded-full" />
                     <h2 className="text-2xl font-semibold text-slate-900  uppercase">Inquiry Intelligence</h2>
                  </div>
                  <button onClick={() => setIsDetailOpen(false)} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all">
                     <X className="w-6 h-6 text-slate-700" />
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-10 space-y-10">
                   <div className="bg-white p-8 rounded-xl border border-gray-100  flex items-start gap-8">
                      <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center text-[#164e33] border border-[#164e33]/10 shrink-0 ">
                         <MessageSquare className="w-8 h-8" />
                      </div>
                      <div>
                         <h3 className="text-lg font-semibold text-slate-900 leading-tight">
                            {selectedLead.searchKeyword ? `Requirement: ${selectedLead.searchKeyword}` : `Inquiry from ${selectedLead.buyerName}`}
                         </h3>
                         <p className="text-sm font-semibold text-slate-700 uppercase  mt-2">Reference: {selectedLead.id.split('-')[0].toUpperCase()}</p>
                      </div>
                   </div>

                  <div className="space-y-4">
                     <h4 className="text-sm font-semibold text-slate-700 uppercase  pl-1">Transmission Message</h4>
                     <div className="p-8 bg-white border border-gray-100 rounded-xl text-sm text-slate-800 font-semibold leading-relaxed italic  border-l-4 border-[#f58220]">
                        "{selectedLead.message}"
                     </div>
                  </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                         <h4 className="text-sm font-semibold text-slate-700 uppercase  pl-1">Buyer Credentials</h4>
                          <div className="space-y-3">
                             <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <UserCheck className="w-5 h-5 text-[#164e33] shrink-0" />
                                <span className="text-sm font-semibold text-slate-900">{selectedLead.buyerName || 'Verification Needed'}</span>
                             </div>
                             <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <Phone className="w-5 h-5 text-[#f58220] shrink-0" />
                                <span className="text-sm font-semibold text-slate-900">{selectedLead.phone || 'N/A'}</span>
                             </div>
                          </div>
                      </div>

                      <div className="space-y-4">
                         <h4 className="text-sm font-semibold text-slate-700 uppercase  pl-1">Target Market</h4>
                         <div className="p-8 bg-[#164e33]/5/50 border border-[#164e33]/10 rounded-xl flex flex-col items-center justify-center text-center gap-3">
                            <Layers className="w-8 h-8 text-[#164e33]" />
                            <span className="text-sm font-semibold text-indigo-700 uppercase ">{selectedLead.category?.name || 'General Hub'}</span>
                         </div>
                      </div>
                   </div>

                   <div className="pt-10 border-t border-gray-50 space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-slate-700 uppercase  pl-1">Hub Distribution Center</h4>
                        <span className="text-sm font-semibold text-[#164e33] bg-[#164e33]/5 px-3 py-1 rounded-full uppercase er">{categoryVendors.length} Hub Partners Available</span>
                      </div>
                      
                       <div className="space-y-4">
                          {vendorsLoading ? (
                             [1,2,3].map(i => (
                               <div key={i} className="h-20 bg-slate-50 border border-gray-100 rounded-xl animate-pulse" />
                             ))
                          ) : categoryVendors.length > 0 ? (
                            categoryVendors.map(vendor => (
                               <div key={vendor.id} className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-xl hover:border-emerald-200 hover:shadow-md transition-all group">
                                   <div className="flex items-center gap-4">
                                       <div className="w-10 h-10 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-center text-slate-400 text-sm font-bold shrink-0">
                                          {(vendor.logo || vendor.logoUrl) ? <img src={vendor.logo || vendor.logoUrl} className="w-full h-full object-cover" /> : vendor.businessName?.charAt(0)}
                                       </div>
                                       <div>
                                           <div className="flex items-center gap-2">
                                             <span className="text-sm font-bold text-slate-900 block group-hover:text-emerald-700 transition-colors">{vendor.businessName}</span>
                                             {vendor.verified && (
                                               <ShieldCheck size={14} className="text-emerald-500" />
                                             )}
                                           </div>
                                           <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{vendor.city} Hub</span>
                                       </div>
                                   </div>
                                 <button 
                                   onClick={() => handleAssign(selectedLead.id, vendor.id)}
                                   disabled={assigning === selectedLead.id || selectedLead.vendor?.id === vendor.id}
                                   className={`px-5 py-2.5 rounded-xl text-[12px] font-bold uppercase transition-all ${selectedLead.vendor?.id === vendor.id ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-900 hover:bg-black text-white'}`}
                                 >
                                   {assigning === selectedLead.id ? <RefreshCcw className="w-4 h-4 animate-spin" /> : selectedLead.vendor?.id === vendor.id ? 'Current' : 'Assign'}
                                 </button>
                               </div>
                             ))
                          ) : (
                            <div className="flex flex-col items-center justify-center py-12 px-8 text-center bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-100">
                                <Activity className="w-12 h-12 text-gray-200 mb-4" />
                                <h5 className="text-sm font-bold text-slate-700 uppercase ">No matching partners</h5>
                                <p className="text-xs font-medium text-slate-500 mt-2 max-w-[200px]">No verified vendors in this category were found within your hub registry.</p>
                            </div>
                          )}
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


