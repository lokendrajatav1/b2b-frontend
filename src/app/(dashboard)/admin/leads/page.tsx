'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { 
  Building2, 
  Search, 
  Filter, 
  ShieldCheck, 
  XCircle, 
  Clock, 
  MapPin, 
  Globe, 
  FileText, 
  CheckCircle2, 
  RefreshCcw, 
  AlertCircle,
  MoreVertical,
  ArrowRight,
  UserCheck,
  ChevronRight,
  ExternalLink,
  Zap,
  CheckCheck,
  Mail,
  Smartphone,
  ShieldAlert,
  X,
  Linkedin,
  Instagram,
  Facebook,
  MessageSquare,
  Package,
  Layers,
  Activity,
  Target as TargetIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLeads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [assigning, setAssigning] = useState<string | null>(null);
  const [categoryVendors, setCategoryVendors] = useState<any[]>([]);

  useEffect(() => {
    fetchLeads();
  }, []);

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
      // 1. Try fetching directly by categoryId
      let data = await apiFetch(`/vendors?categoryId=${catId}&limit=100&verified=true`);
      let matching = data.data?.vendors || [];
      
      // 2. Fallback: If no vendors found by ID, try searching by the category name
      if (matching.length === 0 && selectedLead?.category?.name) {
        const searchData = await apiFetch(`/vendors?search=${encodeURIComponent(selectedLead.category.name)}&limit=100&verified=true`);
        matching = searchData.data?.vendors || [];
      }

      // 3. Ultra-Fallback: If still empty, show all verified vendors (General Hub Partners)
      if (matching.length === 0) {
        const allData = await apiFetch(`/vendors?limit=20&verified=true`);
        matching = allData.data?.vendors || [];
      }
      
      setCategoryVendors(matching);
    } catch (error) {
      console.error('Failed to fetch vendors for category:', error);
    }
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/admin/leads');
      const fetchedLeads = data.data?.leads || [];
      setLeads(fetchedLeads);
      
      // Update selected lead if it's currently open to reflect latest status/vendor
      if (selectedLead) {
        const updated = fetchedLeads.find((l: any) => l.id === selectedLead.id);
        if (updated) setSelectedLead(updated);
      }
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
      // Refresh all leads and the selected lead state
      await fetchLeads();
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
      lead.category?.name?.toLowerCase().includes(searchLow) ||
      lead.city?.toLowerCase().includes(searchLow);
    
    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-simple-fade pb-20 p-2 md:p-0 font-medium">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 max-w-7xl mx-auto">
        <div>
           <h1 className="text-2xl font-semibold text-slate-900  flex items-center gap-3">
             Hub Demand Stream
             <div className="p-1.5 bg-[#007367]/5 text-[#007367] rounded-none border border-[#007367]/10">
                <TargetIcon className="w-5 h-5" />
             </div>
           </h1>
           <p className="text-slate-700 font-medium mt-1 text-base">Distribute incoming inquiries to your verified regional hub partners.</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search leads..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-none text-base font-semibold outline-none focus:bg-white focus:border-[#007367] transition-all"
              />
           </div>

           <select 
             value={statusFilter}
             onChange={(e) => setStatusFilter(e.target.value)}
             className="px-4 py-2.5 bg-white border border-gray-200 rounded-none text-base font-semibold text-slate-800 outline-none focus:border-[#007367] appearance-none cursor-pointer shadow-sm min-w-[140px]"
           >
             <option value="ALL">All Signals</option>
             <option value="PENDING">Pending Check</option>
             <option value="DISTRIBUTED">Assigned Hub</option>
           </select>

           <button onClick={fetchLeads} className="p-2.5 bg-white border border-gray-200 rounded-none text-slate-500 hover:text-[#007367] transition-all shadow-sm">
             <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
           </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-none border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap min-w-[800px]">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-50">
                  <th className="px-8 py-5 text-base font-semibold text-slate-500 uppercase ">Inquiry Intelligence</th>
                  <th className="px-8 py-5 text-base font-semibold text-slate-500 uppercase  text-center">Signal Status</th>
                  <th className="px-8 py-5 text-base font-semibold text-slate-500 uppercase ">Assigned Partner</th>
                  <th className="px-8 py-5 text-base font-semibold text-slate-500 uppercase  text-right">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  [1,2,3,4,5].map(i => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={4} className="px-8 py-8"><div className="h-10 bg-gray-50 rounded-xl"></div></td>
                    </tr>
                  ))
                ) : filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                  <tr key={lead.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5">
                        <div className="flex flex-col">
                            <span className="text-base font-semibold text-slate-900 leading-tight group-hover:text-[#007367] transition-colors">
                                {lead.searchKeyword ? `Demand: ${lead.searchKeyword}` : `Requirement: ${lead.buyerName}`}
                            </span>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-base font-semibold text-black uppercase  flex items-center gap-1.5">
                                    <MapPin className="w-3 h-3 text-[#007367]" /> {lead.city}
                                </span>
                                <span className="w-1 h-1 bg-gray-200 rounded-full" />
                                <span className="text-base font-semibold text-black uppercase ">
                                    {new Date(lead.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-base font-semibold uppercase  border transition-all ${
                            lead.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                            'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm'
                        }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${
                                lead.status === 'PENDING' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                            }`}></div>
                            {lead.status === 'PENDING' ? 'Awaiting Hub Distribution' : 'Successfully Assigned'}
                        </div>
                    </td>
                    <td className="px-8 py-5">
                    {lead.vendor ? (
                        <div className="flex items-center gap-3">
                            <span className="text-base font-semibold text-slate-900 truncate max-w-[150px]">{lead.vendor.businessName}</span>
                        </div>
                    ) : (
                        <span className="text-base font-semibold text-black uppercase  italic">No Link Established</span>
                    )}
                    </td>
                    <td className="px-8 py-5 text-right">
                        <button 
                            onClick={() => { setSelectedLead(lead); setIsDetailOpen(true); }}
                            className="px-5 py-2.5 bg-white border border-gray-100 text-[#007367] rounded-none font-semibold text-base uppercase  hover:bg-[#007367] hover:text-white transition-all shadow-sm flex items-center gap-2 ml-auto"
                        >
                            Manage
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </td>
                  </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-32 text-center bg-gray-50/20">
                        <CheckCheck className="w-20 h-20 text-gray-200 mx-auto mb-6" />
                        <h3 className="text-xl font-semibold text-slate-500 ">Queue Optimized</h3>
                        <p className="text-base font-medium text-black max-w-xs mx-auto mt-2 uppercase">All market inquiries in your hub have been processed and distributed.</p>
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
                className="fixed right-0 top-0 h-screen w-full max-w-xl bg-white shadow-2xl z-[110] flex flex-col overflow-hidden"
             >
               <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-white shrink-0">
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-10 bg-[#007367] rounded-full" />
                     <h2 className="text-2xl font-semibold text-slate-900  uppercase">Inquiry Intelligence</h2>
                  </div>
                  <button onClick={() => setIsDetailOpen(false)} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-none transition-all">
                     <X className="w-6 h-6 text-slate-500" />
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-10 space-y-10">
                   <div className="bg-gray-50/50 p-8 rounded-none border border-gray-100 flex gap-6 items-center shadow-inner">
                      <div className="w-16 h-16 bg-white rounded-none flex items-center justify-center text-[#007367] border border-[#007367]/10 shrink-0 shadow-lg">
                         <MessageSquare className="w-8 h-8" />
                      </div>
                      <div>
                         <h3 className="text-xl font-semibold text-slate-900 leading-tight">
                            {selectedLead.searchKeyword ? `Requirement: ${selectedLead.searchKeyword}` : `Inquiry from ${selectedLead.buyerName}`}
                         </h3>
                         <p className="text-base font-semibold text-slate-500 uppercase  mt-2">Reference: {selectedLead.id.split('-')[0].toUpperCase()}</p>
                      </div>
                   </div>

                  <div className="space-y-4">
                     <h4 className="text-base font-semibold text-black uppercase  pl-1 border-b border-gray-50 pb-2">Transmission Message</h4>
                     <div className="p-8 bg-white border border-gray-100 rounded-none text-base text-slate-800 font-semibold leading-relaxed italic shadow-sm border-l-4 border-[#e88c30]">
                        "{selectedLead.message}"
                     </div>
                  </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                         <h4 className="text-base font-semibold text-black uppercase  pl-1 border-b border-gray-50 pb-2">Buyer Credentials</h4>
                          <div className="space-y-3">
                             <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-none border border-gray-100">
                                <UserCheck className="w-5 h-5 text-[#007367] shrink-0" />
                                <span className="text-base font-semibold text-slate-900">{selectedLead.buyerName || 'Verification Needed'}</span>
                             </div>
                             <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-none border border-gray-100">
                                <Smartphone className="w-5 h-5 text-[#e88c30] shrink-0" />
                                <span className="text-base font-semibold text-slate-900">{selectedLead.phone || 'N/A'}</span>
                             </div>
                          </div>
                      </div>

                      <div className="space-y-4">
                         <h4 className="text-base font-semibold text-black uppercase  pl-1 border-b border-gray-50 pb-2">Target Market</h4>
                         <div className="p-8 bg-[#007367]/5/50 border border-[#007367]/10 rounded-none flex flex-col items-center justify-center text-center gap-3">
                            <Layers className="w-8 h-8 text-[#007367]" />
                            <span className="text-base font-semibold text-indigo-700 uppercase ">{selectedLead.category?.name || 'General Hub'}</span>
                         </div>
                      </div>
                   </div>

                   <div className="pt-10 border-t border-gray-50 space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-semibold text-black uppercase  pl-1">Hub Distribution Center</h4>
                        <span className="text-base font-semibold text-[#007367] bg-[#007367]/5 px-3 py-1 rounded-full uppercase er">{categoryVendors.length} Hub Partners Available</span>
                      </div>
                      
                      <div className="space-y-4">
                          {categoryVendors.length > 0 ? (
                            categoryVendors.map(vendor => (
                              <div key={vendor.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-none hover:border-[#007367]/30 hover:shadow-md transition-all group">
                                <div className="flex items-center gap-4">
                                    {vendor.logoUrl ? (
                                      <img src={vendor.logoUrl} alt={vendor.businessName} className="w-14 h-14 object-cover border border-gray-100 shrink-0" />
                                    ) : (
                                      <div className="w-14 h-14 bg-gray-50 flex items-center justify-center text-slate-300 border border-gray-100 shrink-0">
                                        <Building2 className="w-7 h-7" />
                                      </div>
                                    )}
                                    <div>
                                        <span className="text-base font-semibold text-slate-900 block group-hover:text-[#007367] transition-colors">{vendor.businessName}</span>
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-tight">{vendor.city} Hub Partner</span>
                                    </div>
                                </div>
                                <button 
                                  onClick={() => handleAssign(selectedLead.id, vendor.id)}
                                  disabled={assigning === selectedLead.id || selectedLead.vendor?.id === vendor.id}
                                  className={`px-5 py-2.5 rounded-none text-sm font-semibold uppercase tracking-wide transition-all ${selectedLead.vendor?.id === vendor.id ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-default' : 'bg-[#007367] hover:bg-[#005e54] text-white shadow-sm'}`}
                                >
                                  {assigning === selectedLead.id ? <RefreshCcw className="w-4 h-4 animate-spin" /> : selectedLead.vendor?.id === vendor.id ? 'Active Link' : 'Connect'}
                                </button>
                              </div>
                            ))
                          ) : (
                            <div className="flex flex-col items-center justify-center py-12 px-8 text-center bg-gray-50/50 rounded-none border-2 border-dashed border-gray-100">
                                <Activity className="w-12 h-12 text-gray-200 mb-4" />
                                <h5 className="text-base font-semibold text-slate-500 uppercase ">No matching partners</h5>
                                <p className="text-base font-medium text-slate-500 mt-2 max-w-[200px]">No verified vendors in this category were found within your hub registry.</p>
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
