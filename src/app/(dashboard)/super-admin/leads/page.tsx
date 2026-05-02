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
      const data = await apiFetch(`/admin/users?role=VENDOR&limit=50`);
      // IMPORTANT: Vendors have a many-to-many relationship with categories (v.categories array),
      // they do NOT have a direct v.categoryId property. Checking v.categories is required.
      const matching = (data.data?.users || [])
        .map((u: any) => u.vendor)
        .filter((v: any) => 
           v && v.categories?.some((c: any) => c.id === catId || c.name === selectedLead?.category?.name)
        );
      
      setCategoryVendors(matching);
    } catch (error) {
      console.error('Failed to fetch vendors for category:', error);
    }
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/admin/leads');
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
    <div className="space-y-8 animate-simple-fade pb-20 p-2 md:p-0">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 max-w-7xl mx-auto">
        <div>
           <h1 className="text-2xl font-semibold text-slate-900  flex items-center gap-3">
             Market Demand Streams
             <div className="p-1.5 bg-[#007367]/5 text-[#007367] rounded-none border border-[#007367]/10">
                <TargetIcon className="w-5 h-5" />
             </div>
           </h1>
           <p className="text-slate-700 font-medium mt-1 text-base">Review incoming buyer requirements and curate their distribution to matching vendors.</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search leads, category or city..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-none text-base font-medium outline-none focus:bg-white focus:border-blue-500 focus:shadow-md transition-all"
              />
           </div>

           {/* Filters Group */}
           <div className="flex items-center gap-2 shrink-0">
              <div className="relative group">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-8 pr-6 py-2 bg-white border border-gray-200 rounded-none text-base font-semibold text-slate-800 outline-none focus:border-blue-500 appearance-none cursor-pointer hover:bg-gray-50 transition-all shadow-sm"
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
                className="px-3 py-2 bg-white border border-gray-200 rounded-none text-base font-semibold text-slate-800 outline-none focus:border-blue-500 appearance-none cursor-pointer hover:bg-gray-50 transition-all shadow-sm"
              >
                <option value="ALL">Type</option>
                <option value="DIRECT">Direct</option>
                <option value="MARKETPLACE">Marketplace</option>
              </select>

              <button onClick={fetchLeads} className="p-2 bg-white border border-gray-200 rounded-none text-slate-500 hover:text-[#007367] hover:bg-[#007367]/5 transition-all shadow-sm">
                <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-none border border-gray-200 overflow-hidden shadow-sm flex flex-col">
          <div className="overflow-x-auto max-h-[calc(100vh-260px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
            <table className="w-full text-left border-collapse relative whitespace-nowrap min-w-[800px]">
              <thead className="sticky top-0 z-20">
                <tr className="bg-gray-50 border-b border-gray-100 shadow-sm">
                  <th className="px-6 py-4 text-base font-semibold text-slate-500 uppercase ">Buyer Details</th>
                  <th className="px-6 py-4 text-base font-semibold text-slate-500 uppercase ">Inquiry Type</th>
                  <th className="px-6 py-4 text-base font-semibold text-slate-500 uppercase ">Location</th>
                  <th className="px-6 py-4 text-base font-semibold text-slate-500 uppercase ">Status</th>
                  <th className="px-6 py-4 text-base font-semibold text-slate-500 uppercase ">Matched Vendor</th>
                  <th className="px-6 py-4 text-base font-semibold text-slate-500 uppercase  text-right">Actions</th>
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
                    <td className="px-6 py-4">
                        <div className="flex flex-col">
                           <span className="text-base font-semibold text-slate-900  leading-tight group-hover:text-[#007367] transition-colors">
                             {lead.searchKeyword ? `Looking for "${lead.searchKeyword}"` : `Inquiry from ${lead.buyerName}`}
                           </span>
                           <div className="flex items-center gap-3 mt-1.5">
                              <span className="text-base font-semibold text-emerald-600 uppercase  flex items-center gap-1">
                                <Phone className="w-2.5 h-2.5" /> {lead.phone || 'N/A'}
                              </span>
                           </div>
                           <span className="text-base font-semibold text-black uppercase  mt-1 flex items-center gap-1.5">
                             <Clock className="w-2.5 h-2.5" /> Posted {new Date(lead.createdAt).toLocaleDateString()}
                           </span>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-base text-slate-800 font-medium">
                          <Package className="w-3 h-3 text-slate-500" /> {lead.category?.name || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-base text-slate-500 font-semibold uppercase ">
                           <MapPin className="w-3 h-3" /> {lead.city || 'Global Reach'}
                        </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-base font-semibold uppercase  ${
                         lead.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                         lead.status === 'DISTRIBUTED' ? 'bg-[#007367]/5 text-slate-800 border border-[#007367]/10' :
                         'bg-emerald-50 text-emerald-700 border border-emerald-100'
                       }`}>
                          <div className={`w-1 h-1 rounded-full ${
                             lead.status === 'PENDING' ? 'bg-amber-500' : 
                             lead.status === 'DISTRIBUTED' ? 'bg-[#007367]/50' : 'bg-emerald-500'
                          }`}></div>
                          {lead.status === 'PENDING' ? 'Open Market' : lead.status === 'DISTRIBUTED' ? 'Linked' : 'Closed'}
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       {lead.vendor ? (
                         <div className="flex items-center gap-3">
                            <div>
                               <p className="text-base font-semibold text-slate-900 leading-none capitalize truncate max-w-[150px]">{lead.vendor.businessName}</p>
                               <p className="text-base font-medium text-slate-700 mt-1">Verified Partner</p>
                            </div>
                         </div>
                       ) : (
                         <span className="text-base font-semibold text-slate-500 uppercase ">Unassigned</span>
                       )}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-3">
                          <button 
                            onClick={() => { setSelectedLead(lead); setIsDetailOpen(true); }}
                            className="px-4 py-2 bg-white border border-gray-200 text-slate-600 rounded-none font-semibold text-base uppercase  hover:bg-[#007367] hover:text-white transition-all shadow-sm flex items-center gap-2"
                          >
                             Review
                             <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                       </div>
                    </td>
                  </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-24 text-center">
                       <Activity className="w-20 h-20 text-gray-100 mx-auto mb-6" />
                       <h3 className="text-xl font-semibold text-slate-500 ">No Demand Stream Found</h3>
                       <p className="text-base font-medium text-gray-300 max-w-xs mx-auto mt-2">There are currently no active market inquiries matching your search criteria.</p>
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
                     <h4 className="text-base font-semibold text-slate-500 uppercase  pl-1">Transmission Message</h4>
                     <div className="p-8 bg-white border border-gray-100 rounded-none text-base text-slate-800 font-semibold leading-relaxed italic shadow-sm border-l-4 border-[#e88c30]">
                        "{selectedLead.message}"
                     </div>
                  </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                         <h4 className="text-base font-semibold text-slate-500 uppercase  pl-1">Buyer Credentials</h4>
                          <div className="space-y-3">
                             <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-none border border-gray-100">
                                <UserCheck className="w-5 h-5 text-[#007367] shrink-0" />
                                <span className="text-base font-semibold text-slate-900">{selectedLead.buyerName || 'Verification Needed'}</span>
                             </div>
                             <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-none border border-gray-100">
                                <Phone className="w-5 h-5 text-[#e88c30] shrink-0" />
                                <span className="text-base font-semibold text-slate-900">{selectedLead.phone || 'N/A'}</span>
                             </div>
                          </div>
                      </div>

                      <div className="space-y-4">
                         <h4 className="text-base font-semibold text-slate-500 uppercase  pl-1">Target Market</h4>
                         <div className="p-8 bg-[#007367]/5/50 border border-[#007367]/10 rounded-none flex flex-col items-center justify-center text-center gap-3">
                            <Layers className="w-8 h-8 text-[#007367]" />
                            <span className="text-base font-semibold text-indigo-700 uppercase ">{selectedLead.category?.name || 'General Hub'}</span>
                         </div>
                      </div>
                   </div>

                   <div className="pt-10 border-t border-gray-50 space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-semibold text-slate-500 uppercase  pl-1">Hub Distribution Center</h4>
                        <span className="text-base font-semibold text-[#007367] bg-[#007367]/5 px-3 py-1 rounded-full uppercase er">{categoryVendors.length} Hub Partners Available</span>
                      </div>
                      
                      <div className="space-y-4">
                          {categoryVendors.length > 0 ? (
                            categoryVendors.map(vendor => (
                              <div key={vendor.id} className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-none hover:border-[#007367]/30 hover:shadow-lg hover:shadow-[#007367]/5 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <span className="text-base font-semibold text-slate-900 block group-hover:text-[#007367] transition-colors">{vendor.businessName}</span>
                                        <span className="text-base font-semibold text-slate-500 uppercase er">{vendor.city} Hub</span>
                                    </div>
                                </div>
                                <button 
                                  onClick={() => handleAssign(selectedLead.id, vendor.id)}
                                  disabled={assigning === selectedLead.id || selectedLead.vendor?.id === vendor.id}
                                  className={`px-6 py-2.5 rounded-none text-base font-semibold uppercase  transition-all ${selectedLead.vendor?.id === vendor.id ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-[#007367] hover:bg-[#005e54] text-white shadow-lg shadow-[#007367]/10'}`}
                                >
                                  {assigning === selectedLead.id ? <RefreshCcw className="w-4 h-4 animate-spin" /> : selectedLead.vendor?.id === vendor.id ? 'Current Link' : 'Assign Lead'}
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
