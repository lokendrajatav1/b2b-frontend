'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { 
  Target, 
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
  Briefcase
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
           <h1 className="text-2xl font-semibold text-gray-900 tracking-tight flex items-center gap-3">
             Market Demand Streams
             <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                <MessageSquare className="w-5 h-5" />
             </div>
           </h1>
           <p className="text-gray-500 font-medium mt-1 text-sm">Review incoming buyer requirements and curate their distribution to matching vendors.</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search leads, category or city..." 
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
                  <option value="PENDING">Pending (New)</option>
                  <option value="DISTRIBUTED">Distributed</option>
                  <option value="CLOSED">Closed/Converted</option>
                  <option value="EXPIRED">Expired</option>
                </select>
              </div>

              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-[11px] font-bold text-gray-600 outline-none focus:border-blue-500 appearance-none cursor-pointer hover:bg-gray-50 transition-all shadow-sm"
              >
                <option value="ALL">Type</option>
                <option value="DIRECT">Direct</option>
                <option value="MARKETPLACE">Marketplace</option>
              </select>

              <button onClick={fetchLeads} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm">
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
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Buyer Details</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Inquiry Type</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Matched Vendor</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
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
                           <span className="text-sm font-semibold text-gray-900 tracking-tight leading-tight">
                             {lead.searchKeyword ? `Looking for "${lead.searchKeyword}"` : `Inquiry from ${lead.buyerName}`}
                           </span>
                           <div className="flex items-center gap-3 mt-1.5">
                              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                                <Phone className="w-2.5 h-2.5" /> {lead.phone || 'N/A'}
                              </span>
                           </div>
                           <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-1 flex items-center gap-1.5">
                             <Clock className="w-2.5 h-2.5" /> Posted {new Date(lead.createdAt).toLocaleDateString()}
                           </span>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                          <Package className="w-3 h-3 text-gray-400" /> {lead.category?.name || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                           <MapPin className="w-3 h-3" /> {lead.city || 'Global Reach'}
                        </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                         lead.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                         lead.status === 'DISTRIBUTED' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                         'bg-emerald-50 text-emerald-700 border border-emerald-100'
                       }`}>
                          <div className={`w-1 h-1 rounded-full ${
                             lead.status === 'PENDING' ? 'bg-amber-500' : 
                             lead.status === 'DISTRIBUTED' ? 'bg-blue-500' : 'bg-emerald-500'
                          }`}></div>
                          {lead.status === 'PENDING' ? 'Open Market' : lead.status === 'DISTRIBUTED' ? 'Linked' : 'Closed'}
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       {lead.vendor ? (
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 text-[10px] font-bold shadow-sm">
                              {lead.vendor.businessName?.charAt(0) || 'V'}
                            </div>
                            <div>
                               <p className="text-xs font-semibold text-gray-900 leading-none capitalize truncate max-w-[150px]">{lead.vendor.businessName}</p>
                               <p className="text-[10px] font-medium text-gray-500 mt-1">Verified Partner</p>
                            </div>
                         </div>
                       ) : (
                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unassigned</span>
                       )}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button 
                         onClick={() => { setSelectedLead(lead); setIsDetailOpen(true); }}
                         className={`p-2 rounded-lg transition-all inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest ${
                           !lead.vendor 
                             ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20' 
                             : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                         }`}
                       >
                         {lead.vendor ? 'Review Details' : 'Assign Vendor'}
                         <ArrowRight className="w-3.5 h-3.5" />
                       </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-24 text-center">
                     <Layers className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                     <p className="text-sm font-semibold text-gray-400">Workspace clear. No leads found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>

      {/* Side Detail Sheet */}
      <AnimatePresence>
        {isDetailOpen && selectedLead && (
          <>
             <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => setIsDetailOpen(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-90 h-screen overflow-hidden"
             />
             <motion.div 
                initial={{ x: '100%' }} 
                animate={{ x: 0 }} 
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-100 border-l border-gray-100 flex flex-col"
             >
                {/* Sidebar Header */}
                <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
                         <Target className="w-5 h-5" />
                      </div>
                      <div>
                         <h2 className="text-sm font-bold text-gray-900 tracking-tight">Lead Intelligence</h2>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Ref: {selectedLead.id.split('-')[0].toUpperCase()}</p>
                      </div>
                   </div>
                   <button 
                     onClick={() => setIsDetailOpen(false)}
                     className="p-2 hover:bg-gray-100 rounded-lg transition-all group"
                   >
                     <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900" />
                   </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                   {/* Main Requirement Title */}
                   <div>
                      <h3 className="text-xl font-bold text-gray-900 leading-tight tracking-tight">
                         {selectedLead.searchKeyword ? `Looking for "${selectedLead.searchKeyword}"` : `Requirement via ${selectedLead.buyerName}`}
                      </h3>
                      <div className="flex items-center gap-2 mt-3">
                         <span className="px-2 py-0.5 bg-gray-100 text-[10px] font-bold text-gray-500 rounded-md uppercase tracking-wider">Inquiry</span>
                         <span className="px-2 py-0.5 bg-blue-50 text-[10px] font-bold text-blue-600 rounded-md uppercase tracking-wider border border-blue-100">{selectedLead.type || 'Standard'}</span>
                      </div>
                   </div>

                   {/* Quick Info Grid */}
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-sm">
                         <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Buyer Identity</p>
                         <p className="text-xs font-bold text-gray-900 truncate flex items-center gap-1.5">
                            <UserCheck className="w-3 h-3 text-blue-500" /> {selectedLead.buyerName || 'Private User'}
                         </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-sm">
                         <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Phone Contact</p>
                         <p className="text-xs font-bold text-gray-900 truncate flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-emerald-500" /> {selectedLead.phone || 'N/A'}
                         </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-sm">
                         <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Target Location</p>
                         <p className="text-xs font-bold text-gray-900 truncate flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-gray-400" /> {selectedLead.city || 'Global Reach'}
                         </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-sm">
                         <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Category Hub</p>
                         <p className="text-xs font-bold text-gray-900 truncate flex items-center gap-1.5">
                            <Package className="w-3 h-3 text-indigo-400" /> {selectedLead.category?.name || 'General'}
                         </p>
                      </div>
                   </div>

                   {/* Message Content */}
                   <div className="space-y-3">
                      <div className="flex items-center justify-between px-1">
                         <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Inquiry Message</h4>
                         <MessageSquare className="w-3 h-3 text-gray-300" />
                      </div>
                      <div className="p-5 bg-white border border-gray-100 rounded-2xl text-[13px] text-gray-600 font-medium leading-relaxed italic shadow-sm relative overflow-hidden group">
                         <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/10 group-hover:bg-blue-500 transition-all"></div>
                         "{selectedLead.message}"
                      </div>
                   </div>

                   {/* Assignment Workflow */}
                   <div className="space-y-4 pt-4 border-t border-gray-50">
                      <div className="flex items-center justify-between px-1">
                         <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-blue-600">Opportunity Matching</h4>
                         <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                      </div>
                      
                      {selectedLead.vendor && (
                        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between mb-2">
                           <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-white rounded-xl text-emerald-600 shadow-sm border border-emerald-100 flex items-center justify-center font-bold text-sm">
                                 {selectedLead.vendor.businessName?.charAt(0)}
                              </div>
                              <div>
                                 <p className="text-xs font-bold text-emerald-900">{selectedLead.vendor.businessName}</p>
                                 <p className="text-[10px] font-medium text-emerald-700">Matched Partner</p>
                              </div>
                           </div>
                           <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-white" />
                        </div>
                      )}

                      <div className="space-y-2">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1 mb-2">
                            {selectedLead.vendor ? 'Re-Route to Hub Vendor:' : 'Select Target Vendor:'}
                          </p>
                          {categoryVendors.length > 0 ? (
                            categoryVendors.map(vendor => (
                              <div key={vendor.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5 transition-all group cursor-default">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors font-bold text-[11px]">
                                      {vendor.businessName?.charAt(0)}
                                    </div>
                                    <div>
                                       <span className="text-[11px] font-bold text-gray-900 block leading-none">{vendor.businessName}</span>
                                       <span className="text-[9px] font-medium text-gray-400 mt-1 block">Verified Vendor</span>
                                    </div>
                                </div>
                                <button 
                                  onClick={() => handleAssign(selectedLead.id, vendor.id)}
                                  disabled={assigning === selectedLead.id || selectedLead.vendor?.id === vendor.id}
                                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-50 ${selectedLead.vendor?.id === vendor.id ? 'bg-gray-100 text-gray-400' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'}`}
                                >
                                  {assigning === selectedLead.id ? '...' : selectedLead.vendor?.id === vendor.id ? 'Linked' : 'Assign'}
                                </button>
                              </div>
                            ))
                          ) : (
                            <div className="p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">
                               <AlertCircle className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                               <p className="text-[11px] font-medium text-gray-500 italic px-4">
                                 No verified vendors found in this category hub yet.
                               </p>
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
