'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import {
   Users,
   MapPin,
   Calendar,
   CheckCircle,
   RefreshCcw,
   Phone,
   MessageSquare,
   MoreVertical,
   ChevronRight,
   Clock,
   LayoutDashboard,
   Layers,
   Search,
   Filter,
   ArrowUpRight,
   ShieldCheck,
   Building2,
   BadgeCheck,
   Star,
   Activity,
   History,
   ChevronLeft,
   ChevronDown,
   Download,
   CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VendorLeads() {
   const [leads, setLeads] = useState([]);
   const [loading, setLoading] = useState(true);
   const [filter, setFilter] = useState('ALL');

   useEffect(() => {
      const fetchLeads = async () => {
         try {
            const data = await apiFetch('/leads/my-leads');
            setLeads(data.data);
         } catch (error) {
            console.error('Failed to fetch leads:', error);
         } finally {
            setLoading(false);
         }
      };
      fetchLeads();
   }, []);

   const handleUpdateStatus = async (leadId: string, status: 'CLOSED' | 'REDISTRIBUTE') => {
      const originalLeads = [...leads];
      if (status === 'REDISTRIBUTE') {
         setLeads(leads.filter((l: any) => l.id !== leadId));
      }
      try {
         await apiFetch(`/leads/${leadId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
         });
         if (status === 'CLOSED') {
            const data = await apiFetch('/leads/my-leads');
            setLeads(data.data);
         }
      } catch (error) {
         console.error('Status update failed:', error);
         setLeads(originalLeads);
      }
   };

   const filteredLeads = filter === 'ALL' ? leads : leads.filter((l: any) => {
      if (filter === 'DISTRIBUTED') return l.status === 'DISTRIBUTED' || l.status === 'PENDING';
      return l.status === filter;
   });

   if (loading) return (
      <div className="flex items-center justify-center min-h-[60vh]">
         <div className="w-10 h-10 border-4 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin"></div>
      </div>
   );

   return (
      <div className="space-y-6 animate-fade-in pb-10">

         {/* Header Row */}
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
               <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  My Leads
                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100">
                     <Activity size={12} /> Receiving Leads
                  </span>
               </h1>
               <p className="text-sm font-medium text-slate-400">Review and respond to inquiries from potential buyers.</p>
            </div>
            <button className="px-6 py-2.5 bg-white border border-gray-100 text-slate-700 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-gray-50 transition-all">
               <Download size={16} /> Export Leads
            </button>
         </div>
 
         {/* Analytics Overview */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
            <VendorLeadStatCard 
               label="Total Inquiries" 
               value={leads.length} 
               sub="Lifetime requirements"
               icon={MessageSquare} 
               iconBg="bg-slate-50" 
               iconColor="text-slate-600" 
            />
            <VendorLeadStatCard 
               label="Active Deals" 
               value={leads.filter((l: any) => l.status === 'DISTRIBUTED' || l.status === 'PENDING').length} 
               sub="In review phase"
               icon={Clock} 
               iconBg="bg-amber-50" 
               iconColor="text-amber-600" 
            />
            <VendorLeadStatCard 
               label="Won Leads" 
               value={leads.filter((l: any) => l.status === 'CLOSED').length} 
               sub="Successfully closed"
               icon={CheckCircle2} 
               iconBg="bg-emerald-50" 
               iconColor="text-emerald-600" 
            />
            <VendorLeadStatCard 
               label="Market Velocity" 
               value={leads.filter((l: any) => new Date(l.createdAt).toDateString() === new Date().toDateString()).length} 
               sub="New leads today"
               icon={ArrowUpRight} 
               iconBg="bg-blue-50" 
               iconColor="text-blue-600" 
            />
         </div>

         {/* Filter Tabs & Sort Row */}
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4">
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-gray-100 w-fit">
               {[
                  { id: 'ALL', label: 'All Leads' },
                  { id: 'DISTRIBUTED', label: 'Active' },
                  { id: 'CLOSED', label: 'Won' },
                  { id: 'EXPIRED', label: 'Expired' }
               ].map((tab) => (
                  <button
                     key={tab.id}
                     onClick={() => setFilter(tab.id)}
                     className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${filter === tab.id ? 'bg-[#062d1d] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                     {tab.label}
                  </button>
               ))}
            </div>

            <div className="flex items-center gap-3">
               <button className="px-4 py-2.5 bg-white border border-gray-100 text-slate-600 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-gray-50 transition-all">
                  <Filter size={14} /> Filter
               </button>
               <div className="px-4 py-2.5 bg-white border border-gray-100 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-4 hover:bg-gray-50 transition-all cursor-pointer group">
                  <span>Sort: Newest</span>
                  <ChevronDown size={14} className="text-slate-400" />
               </div>
            </div>
         </div>

         {/* Leads List */}
         <div className="space-y-6 pt-4">
            {filteredLeads.length > 0 ? filteredLeads.map((lead: any, idx: number) => {
               const isWon = lead.status === 'CLOSED';
               const isNew = lead.status === 'DISTRIBUTED' || lead.status === 'PENDING';
               const date = new Date(lead.createdAt);
               const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
               const dateStr = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

               return (
                  <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: idx * 0.05 }}
                     key={lead.id}
                     className="bg-white rounded-lg border border-gray-100 overflow-hidden flex flex-col md:flex-row group"
                  >
                     {/* Left Column: Status */}
                     <div className={`md:w-32 shrink-0 p-6 flex flex-col items-center justify-center text-center gap-3 border-b md:border-b-0 md:border-r border-gray-50 ${isNew ? 'bg-emerald-50/20' : isWon ? 'bg-orange-50/20' : 'bg-gray-50/20'}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${isNew ? 'bg-white text-emerald-600 border-emerald-100' : isWon ? 'bg-white text-orange-500 border-orange-100' : 'bg-white text-slate-400 border-gray-100'}`}>
                           {isNew ? <Users size={20} /> : isWon ? <ShieldCheck size={20} /> : <Clock size={20} />}
                        </div>
                        <div>
                           <p className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${isNew ? 'text-emerald-600' : isWon ? 'text-orange-600' : 'text-slate-400'}`}>
                              {isNew ? 'NEW LEAD' : isWon ? 'WON' : lead.status}
                           </p>
                           <div className="space-y-0.5">
                              <p className="text-[10px] font-bold text-slate-400 flex items-center justify-center gap-1.5"><Calendar size={10} /> {dateStr}</p>
                              <p className="text-[10px] font-bold text-slate-400 flex items-center justify-center gap-1.5"><Clock size={10} /> {timeStr}</p>
                           </div>
                        </div>
                     </div>

                     {/* Middle Column: Info */}
                     <div className="flex-1 p-6 md:p-8 space-y-6">
                        <div className="space-y-4">
                           <div className="flex flex-wrap items-center gap-3">
                              <h3 className="text-xl font-bold text-slate-900">{lead.buyerName}</h3>
                              <span className="text-[10px] font-bold text-slate-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100 uppercase">ID #{lead.id.slice(0, 8)}</span>
                           </div>

                           <div className="flex flex-wrap items-center gap-3">
                              <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-slate-500 text-[10px] font-bold rounded-lg border border-gray-100">
                                 <MapPin size={12} /> {lead.city}
                              </div>
                              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-100/50">
                                 <Layers size={12} /> {lead.category?.name || 'General'}
                              </div>
                              <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-slate-500 text-[10px] font-bold rounded-lg border border-gray-100">
                                 <Phone size={12} /> {lead.phone}
                              </div>
                           </div>
                        </div>

                        <div className={`p-5 rounded-lg border relative overflow-hidden group/msg ${isWon ? 'bg-orange-50/30 border-orange-100/50' : 'bg-emerald-50/30 border-emerald-100/50'}`}>
                           <div className={`absolute top-0 left-0 w-1 h-full opacity-30 ${isWon ? 'bg-orange-500' : 'bg-emerald-500'}`} />
                           <div className="flex gap-4">
                              <MessageSquare size={18} className={`shrink-0 mt-1 ${isWon ? 'text-orange-300' : 'text-emerald-300'}`} />
                              <div className="space-y-2">
                                 <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
                                    "{lead.message || (lead.searchKeyword ? `Buyer was searching for '${lead.searchKeyword}' and your business matched.` : `Inquiry for ${lead.category?.name} in ${lead.city}.`)}"
                                 </p>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                    Source: {lead.source || 'Search Page'} &nbsp;•&nbsp; 2 min ago
                                 </p>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Right Column: Actions */}
                     <div className="md:w-64 shrink-0 p-6 md:p-8 flex flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-gray-50 bg-gray-50/20">
                        <div className="grid grid-cols-2 gap-3">
                           <a href={`tel:${lead.phone}`} className="h-11 bg-white border border-gray-100 text-slate-700 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-all shadow-sm">
                              <Phone size={14} className="text-emerald-600" /> Call
                           </a>
                           <a href={`https://wa.me/${lead.phone}`} target="_blank" className="h-11 bg-white border border-gray-100 text-slate-700 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-all shadow-sm">
                              <MessageSquare size={14} className="text-emerald-600" /> Chat
                           </a>
                        </div>

                        {isWon ? (
                           <div className="w-full h-12 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider">
                              <CheckCircle2 size={16} /> Deal Successfully Closed
                           </div>
                        ) : (
                           <div className="flex flex-col gap-2">
                              <button
                                 onClick={() => handleUpdateStatus(lead.id, 'CLOSED')}
                                 className="w-full h-12 bg-[#164e33] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#113f29] transition-all shadow-lg shadow-emerald-900/10"
                              >
                                 Mark as Won
                              </button>
                              <button
                                 onClick={() => handleUpdateStatus(lead.id, 'REDISTRIBUTE')}
                                 className="w-full py-2 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase "
                              >
                                 Pass
                              </button>
                           </div>
                        )}
                     </div>
                  </motion.div>
               );
            }) : (
               <div className="p-20 text-center space-y-4 bg-white rounded-lg border border-gray-100">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto border border-gray-100">
                     <History size={24} className="text-slate-300" />
                  </div>
                  <div className="space-y-1">
                     <h3 className="text-base font-bold text-slate-900">No leads found</h3>
                     <p className="text-sm font-medium text-slate-400">Your potential customer inquiries will appear here.</p>
                  </div>
               </div>
            )}
         </div>

         {/* Pagination Footer */}
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-10 px-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
               Showing 1 to {filteredLeads.length} of {leads.length} leads
            </p>
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-1">
                  <button className="w-8 h-8 flex items-center justify-center bg-white border border-gray-100 rounded-lg text-slate-400 hover:bg-gray-50 transition-all">
                     <ChevronLeft size={16} />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center bg-[#164e33] text-white rounded-lg font-bold text-xs">1</button>
                  <button className="w-8 h-8 flex items-center justify-center bg-white border border-gray-100 rounded-lg text-slate-600 font-bold text-xs hover:bg-gray-50 transition-all">2</button>
                  <button className="w-8 h-8 flex items-center justify-center bg-white border border-gray-100 rounded-lg text-slate-600 font-bold text-xs hover:bg-gray-50 transition-all">3</button>
                  <button className="w-8 h-8 flex items-center justify-center bg-white border border-gray-100 rounded-lg text-slate-600 hover:bg-gray-50 transition-all">
                     <ChevronRight size={16} />
                  </button>
               </div>
               <div className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer">
                  <span className="text-[10px] font-bold text-slate-700 uppercase">10 / page</span>
                  <ChevronDown size={10} className="text-slate-400" />
               </div>
            </div>
         </div>

      </div>
   );
}

const VendorLeadStatCard = ({ label, value, sub, icon: Icon, iconColor, iconBg }: any) => (
  <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
     <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
        <p className="text-[10px] font-medium text-slate-400 mt-0.5">{sub}</p>
     </div>
     <div className={`w-12 h-12 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center`}>
        <Icon size={20} />
     </div>
  </div>
);
