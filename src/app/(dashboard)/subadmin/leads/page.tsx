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
  Briefcase,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SubAdminLeads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [assigning, setAssigning] = useState<string | null>(null);
  const [categoryVendors, setCategoryVendors] = useState<any[]>([]);

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    if (selectedLead?.categoryId) {
      fetchVendorsByCategory(selectedLead.categoryId);
    }
  }, [selectedLead]);

  const fetchVendorsByCategory = async (catId: string) => {
    try {
      const data = await apiFetch(`/admin/users?role=VENDOR&limit=10`);
      const matching = (data.data?.users || [])
        .map((u: any) => u.vendor)
        .filter((v: any) => v && v.categoryId === catId);
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

  const filteredLeads = leads.filter(l => 
    l.buyerName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-simple-fade pb-20 p-2 md:p-0">
      {/* Humanized Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 max-w-7xl mx-auto">
        <div className="space-y-1">
           <div className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-1">
              <Sparkles className="w-3 h-3" /> Team Workspace
           </div>
           <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
             Buyer Inquiries
             <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                <MessageSquare className="w-5 h-5" />
             </div>
           </h1>
           <p className="text-gray-500 font-medium text-sm">Review incoming requirements and connect buyers with the right vendors.</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Find an inquiry..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-medium outline-none focus:border-blue-500 transition-all w-64 shadow-sm"
              />
           </div>
           <button onClick={fetchLeads} className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm group">
              <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
           </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Requirement</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category & City</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Assigned To</th>
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
              ) : filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                       <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900 tracking-tight leading-tight">
                            {lead.searchKeyword ? `Looking for "${lead.searchKeyword}"` : `Inquiry from ${lead.buyerName}`}
                          </span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-blue-500" /> Received {new Date(lead.createdAt).toLocaleDateString()}
                          </span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                          <Package className="w-3 h-3 text-gray-400" /> {lead.category?.name || 'N/A'}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                           <MapPin className="w-3 h-3" /> {lead.city || 'Global'}
                        </div>
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
                          {lead.status === 'PENDING' ? 'New' : lead.status === 'DISTRIBUTED' ? 'Handled' : 'Closed'}
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       {lead.vendor ? (
                         <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                             <ShieldCheck className="w-3 h-3" />
                           </div>
                           <span className="text-xs font-semibold text-gray-900 truncate max-w-[120px]">{lead.vendor.businessName}</span>
                         </div>
                       ) : (
                         <span className="text-xs font-medium text-gray-400 italic">Not assigned</span>
                       )}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button 
                         onClick={() => { setSelectedLead(lead); setIsDetailOpen(true); }}
                         className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all inline-flex items-center gap-2 text-xs font-semibold"
                       >
                         Manage
                         <ChevronRight className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl mx-auto flex items-center justify-center mb-4">
                       <Target className="w-8 h-8 text-gray-200" />
                    </div>
                    <p className="text-sm font-semibold text-gray-500">No inquiries found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-100"
             />
             <motion.div 
                initial={{ x: '100%' }} 
                animate={{ x: 0 }} 
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 h-screen w-full max-w-xl bg-white shadow-2xl z-110 p-10 overflow-y-auto"
             >
               <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-50">
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">Manage Inquiry</h2>
                  <button onClick={() => setIsDetailOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                     <AlertCircle className="w-5 h-5 text-gray-400" />
                  </button>
               </div>

               <div className="space-y-8">
                   <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100 shrink-0">
                         <MessageSquare className="w-6 h-6" />
                      </div>
                      <div>
                         <h3 className="text-lg font-bold text-gray-900 leading-tight">
                            {selectedLead.searchKeyword ? `Requirement: ${selectedLead.searchKeyword}` : `Inquiry from ${selectedLead.buyerName}`}
                         </h3>
                         <p className="text-sm font-medium text-gray-500 mt-1">Ref: {selectedLead.id.split('-')[0].toUpperCase()}</p>
                      </div>
                   </div>

                  <div className="space-y-3">
                     <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">The message</h4>
                     <div className="p-5 bg-white border border-gray-100 rounded-2xl text-sm text-gray-600 font-medium leading-relaxed italic shadow-sm">
                        "{selectedLead.message}"
                     </div>
                  </div>

                   <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-3">
                         <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Buyer contact</h4>
                          <div className="space-y-4">
                             <div className="flex gap-3">
                                <UserCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                                <span className="text-sm font-semibold text-gray-900 leading-none">{selectedLead.buyerName || 'N/A'}</span>
                             </div>
                             <div className="flex gap-3">
                                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                <span className="text-sm font-semibold text-gray-900 leading-none">{selectedLead.phone || 'N/A'}</span>
                             </div>
                          </div>
                      </div>

                      <div className="space-y-3">
                         <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Category</h4>
                         <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-bold text-indigo-700">
                            <Layers className="w-3.5 h-3.5" />
                            {selectedLead.category?.name || 'General'}
                         </div>
                      </div>
                   </div>

                   <div className="pt-8 border-t border-gray-50 space-y-4">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Assign to Vendor</h4>
                      <div className="space-y-3">
                          {categoryVendors.length > 0 ? (
                            categoryVendors.map(vendor => (
                              <div key={vendor.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-2xl hover:border-blue-200 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                      <Briefcase className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-semibold text-gray-900">{vendor.businessName}</span>
                                </div>
                                <button 
                                  onClick={() => handleAssign(selectedLead.id, vendor.id)}
                                  disabled={assigning === selectedLead.id || selectedLead.vendor?.id === vendor.id}
                                  className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${selectedLead.vendor?.id === vendor.id ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-50'}`}
                                >
                                  {assigning === selectedLead.id ? 'Linking...' : selectedLead.vendor?.id === vendor.id ? 'Current' : 'Assign'}
                                </button>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs font-medium text-gray-400 px-4 py-6 italic bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-center">
                              No matching vendors found in this category hub.
                            </p>
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
