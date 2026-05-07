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
  History
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
    // Optimistic Update: Remove from list immediately if passing or closing
    const originalLeads = [...leads];
    if (status === 'REDISTRIBUTE') {
       setLeads(leads.filter((l: any) => l.id !== leadId));
    }

    try {
      await apiFetch(`/leads/${leadId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      
      // If closing, we keep the state from the server to show "Won"
      if (status === 'CLOSED') {
        const data = await apiFetch('/leads/my-leads');
        setLeads(data.data);
      }
    } catch (error) {
      console.error('Status update failed:', error);
      // Rollback on error
      setLeads(originalLeads);
    }
  };

  const filteredLeads = filter === 'ALL' ? leads : leads.filter((l: any) => l.status === filter);

  if (loading) return <div className="p-10 animate-pulse bg-slate-50 rounded-2xl h-80 border border-slate-100"></div>;

  return (
    <div className="space-y-6 animate-simple-fade pb-20 p-2 md:p-0">
      {/* Clean Leads Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
            <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
              My Leads
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-600">Receiving Leads</span>
              </div>
            </h1>
            <p className="text-slate-700 font-medium mt-1 text-sm">Review and respond to inquiries from potential buyers.</p>
        </div>
        
        <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-slate-800 font-semibold text-sm hover:bg-gray-50 transition-all flex items-center gap-2">
                Export Leads
            </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6 bg-white p-2 rounded-2xl  border border-gray-100 inline-flex">
           {['ALL', 'DISTRIBUTED', 'CLOSED', 'EXPIRED'].map(st => (
                <button 
                    key={st}
                    onClick={() => setFilter(st)}
                    className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${ filter === st ? 'bg-[#164e33] text-white ' : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-gray-100' }`}
                >
                    {st === 'ALL' ? 'All Leads' : st === 'DISTRIBUTED' ? 'Active' : st === 'CLOSED' ? 'Won' : 'Expired'}
                </button>
           ))}
      </div>

      <div className="space-y-4">
        {filteredLeads.length > 0 ? filteredLeads.map((lead: any, idx) => (
            <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={lead.id} 
            className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-[#164e33]/30 transition-all duration-300  hover:"
          >
            <div className="flex flex-col md:flex-row">
                {/* Status Column */}
                <div className="md:w-40 shrink-0 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 bg-gradient-to-b from-gray-50/50 to-transparent relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#164e33]/20 to-[#f58220]/20 hidden md:block"></div>
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3  ${
                      lead.status === 'DISTRIBUTED' ? 'bg-[#164e33]/10 text-[#164e33]' : 
                      lead.status === 'CLOSED' ? 'bg-[#f58220]/10 text-[#f58220]' : 'bg-gray-100 text-gray-600'
                    }`}>
                        {lead.status === 'CLOSED' ? <ShieldCheck className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                    </div>
                    <div className="text-center">
                        <p className={`text-sm font-bold uppercase  mb-1 ${
                          lead.status === 'DISTRIBUTED' ? 'text-[#164e33]' : 
                          lead.status === 'CLOSED' ? 'text-[#f58220]' : 'text-slate-600'
                        }`}>
                           {lead.status === 'DISTRIBUTED' ? 'New Lead' : lead.status === 'CLOSED' ? 'Won' : lead.status}
                        </p>
                        <p className="text-sm font-semibold text-slate-700 flex items-center justify-center gap-1.5">
                           <Calendar className="w-3.5 h-3.5" />
                           {new Date(lead.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Main Lead Details */}
                <div className="flex-1 p-6 md:p-8 flex flex-col xl:flex-row xl:items-start justify-between gap-8">
                    <div className="space-y-5 flex-1">
                        <div className="space-y-2.5">
                             <div className="flex flex-wrap items-center gap-3">
                                 <h3 className="text-lg md:text-2xl font-bold text-slate-900">{lead.buyerName}</h3>
                                 <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">ID #{lead.id.slice(0,8)}</span>
                             </div>
                             <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                                    <MapPin className="w-4 h-4 text-slate-600" />
                                    {lead.city}
                                </div>
                                <div className="flex items-center gap-1.5 text-sm font-semibold text-[#164e33] bg-[#164e33]/5 px-3 py-1 rounded-full border border-[#164e33]/20">
                                    <Layers className="w-4 h-4 text-[#164e33]/70" />
                                    {lead.category?.name || 'Inquiry'}
                                </div>
                                <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-[#164e33] transition-colors bg-gray-50 px-3 py-1 rounded-full border border-gray-200 cursor-default">
                                    <Phone className="w-4 h-4 text-emerald-600" />
                                    {lead.phone || 'N/A'}
                                </div>
                             </div>
                        </div>

                        <div className="p-5 bg-gradient-to-r from-emerald-50/50 to-white rounded-2xl border border-emerald-100/60  relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#164e33]/20 group-hover:bg-[#164e33]/80 transition-all duration-300 rounded-l-2xl"></div>
                            <div className="flex gap-3">
                                <MessageSquare className="w-5 h-5 text-[#164e33]/40 shrink-0 mt-0.5" />
                                <p className="text-base text-slate-700 font-medium leading-relaxed italic">
                                   "{lead.message || (lead.searchKeyword ? `Buyer was searching for '${lead.searchKeyword}' and your business matched their criteria.` : `Buyer submitted a request for ${lead.category?.name} in ${lead.city}.`)}"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions Column */}
                    <div className="flex flex-col gap-3 min-w-[260px] shrink-0 pt-1">
                        <div className="grid grid-cols-2 gap-3">
                            <a 
                                href={`tel:${lead.phone}`}
                                className="h-11 bg-white border border-gray-200 text-slate-800 rounded-xl font-bold text-sm uppercase  flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition-all  hover: group/btn"
                            >
                                <Phone className="w-4 h-4 text-emerald-500 transition-transform group-hover/btn:scale-110" />
                                Call
                            </a>
                            <a 
                                href={`https://wa.me/${lead.phone?.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-11 bg-white border border-emerald-200 text-[#164e33] rounded-xl font-bold text-sm uppercase  flex items-center justify-center gap-2 hover:bg-emerald-50  transition-all  hover: group/btn"
                            >
                                <MessageSquare className="w-4 h-4 text-[#164e33] transition-transform group-hover/btn:scale-110" />
                                Chat
                            </a>
                        </div>

                        <div className="flex items-center gap-3">
                           {(lead.status === 'DISTRIBUTED' || lead.status === 'PENDING') && (
                                <>
                                <button 
                                    onClick={() => handleUpdateStatus(lead.id, 'CLOSED')}
                                    className="flex-1 h-12 bg-gradient-to-r from-[#164e33] to-[#147a67] text-white rounded-xl font-bold text-sm uppercase  hover: hover:-translate-y-0.5 transition-all w-full flex items-center justify-center gap-2"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    Mark as Won
                                </button>
                                <button 
                                    onClick={() => handleUpdateStatus(lead.id, 'REDISTRIBUTE')}
                                    className="px-5 h-12 bg-white border border-gray-200 text-slate-600 rounded-xl font-bold text-sm uppercase hover:bg-gray-50 transition-all hover:text-red-600 hover:border-red-200"
                                >
                                    Pass
                                </button>
                                </>
                           )}
                           {lead.status === 'CLOSED' && (
                               <div className="w-full h-12 bg-gradient-to-r from-emerald-50 to-white text-emerald-700 border border-emerald-200 rounded-xl font-bold text-sm uppercase  flex items-center justify-center gap-2 ">
                                   <ShieldCheck className="w-5 h-5" />
                                   Deal Successfully Closed
                                </div>
                           )}
                        </div>
                    </div>
                </div>
            </div>
          </motion.div>
        )) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100 space-y-3 ">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto border border-gray-100">
                 <History className="w-6 h-6 text-gray-500" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">No leads found</h3>
              <p className="text-slate-700 font-medium text-sm">When buyers reach out to you, their inquiries will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}



