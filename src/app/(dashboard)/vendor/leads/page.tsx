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
    try {
      await apiFetch(`/leads/${leadId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      // Refresh list
      const data = await apiFetch('/leads/my-leads');
      setLeads(data.data);
    } catch (error) {
      console.error('Status update failed:', error);
    }
  };

  const filteredLeads = filter === 'ALL' ? leads : leads.filter((l: any) => l.status === filter);

  if (loading) return <div className="p-10 animate-pulse bg-slate-50 rounded-2xl h-80 border border-slate-100"></div>;

  return (
    <div className="space-y-6 animate-simple-fade pb-20 p-2 md:p-0">
      {/* Clean Leads Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
              My Leads
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-600">Receiving Leads</span>
              </div>
            </h1>
            <p className="text-gray-500 font-medium mt-1 text-sm">Review and respond to inquiries from potential buyers.</p>
        </div>
        
        <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-all flex items-center gap-2">
                Export Leads
            </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
           {['ALL', 'DISTRIBUTED', 'CLOSED', 'EXPIRED'].map(st => (
                <button 
                    key={st}
                    onClick={() => setFilter(st)}
                    className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all border ${ filter === st ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50' }`}
                >
                    {st === 'ALL' ? 'All Leads' : st === 'DISTRIBUTED' ? 'Active' : st === 'CLOSED' ? 'Won' : 'Expired'}
                </button>
           ))}
      </div>

      <div className="space-y-4">
        {filteredLeads.length > 0 ? filteredLeads.map((lead: any, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={lead.id} 
            className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-blue-100 transition-all shadow-sm"
          >
            <div className="flex flex-col md:flex-row">
                {/* Status Column */}
                <div className="md:w-32 shrink-0 bg-gray-50/50 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
                    <div className="w-10 h-10 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-blue-500 mb-2">
                        <Users className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                        <p className="text-xs font-semibold text-gray-700 mb-0.5">
                           {lead.status === 'DISTRIBUTED' ? 'New' : lead.status === 'CLOSED' ? 'Won' : lead.status}
                        </p>
                        <p className="text-xs font-medium text-gray-400">{new Date(lead.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Main Lead Details */}
                <div className="flex-1 p-6 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                    <div className="space-y-4 flex-1">
                        <div className="space-y-1.5">
                             <div className="flex flex-wrap items-center gap-3">
                                 <h3 className="text-lg font-semibold text-gray-900">{lead.buyerName}</h3>
                                 <span className="text-xs font-medium text-gray-400">ID #{lead.id.slice(0,8)}</span>
                             </div>
                             <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {lead.city}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100/50">
                                    <Layers className="w-3.5 h-3.5" />
                                    {lead.category?.name || 'Inquiry'}
                                </div>
                             </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
                            <div className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors cursor-default">
                                <Phone className="w-3.5 h-3.5" />
                                {lead.phone || 'N/A'}
                            </div>
                            <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100/50">
                                <Layers className="w-3.5 h-3.5" />
                                {lead.category?.name || 'Hub Inquiry'}
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-[13px] text-gray-600 font-medium leading-relaxed italic relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/10 group-hover:bg-blue-500 transition-all"></div>
                            "{lead.message || (lead.searchKeyword ? `Buyer was searching for '${lead.searchKeyword}' and your business matched their criteria.` : `Buyer submitted a request for ${lead.category?.name} in ${lead.city}.`)}"
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 min-w-[240px]">
                        <div className="grid grid-cols-2 gap-2">
                            <a 
                                href={`tel:${lead.phone}`}
                                className="h-10 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                            >
                                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                                Call
                            </a>
                            <a 
                                href={`https://wa.me/${lead.phone?.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-10 bg-white border border-gray-200 text-blue-600 rounded-xl font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm"
                            >
                                <MessageSquare className="w-3.5 h-3.5" />
                                WhatsApp
                            </a>
                        </div>

                        <div className="flex items-center gap-2">
                           {lead.status === 'DISTRIBUTED' && (
                                <>
                                <button 
                                    onClick={() => handleUpdateStatus(lead.id, 'CLOSED')}
                                    className="flex-1 h-10 bg-blue-600 text-white rounded-xl font-semibold text-xs hover:bg-blue-700 transition-all shadow-sm"
                                >
                                    Mark as Won
                                </button>
                                <button 
                                    onClick={() => handleUpdateStatus(lead.id, 'REDISTRIBUTE')}
                                    className="px-4 h-10 bg-white border border-gray-200 text-gray-500 rounded-xl font-semibold text-xs hover:bg-gray-50 transition-all"
                                >
                                    Pass
                                </button>
                                </>
                           )}
                           {lead.status === 'CLOSED' && (
                               <div className="w-full h-10 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl font-semibold text-xs flex items-center justify-center gap-2">
                                   <ShieldCheck className="w-4 h-4" />
                                   Deal Won
                                </div>
                           )}
                        </div>
                    </div>
                </div>
            </div>
          </motion.div>
        )) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 space-y-3 shadow-sm">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto border border-gray-100">
                 <History className="w-6 h-6 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No leads found</h3>
              <p className="text-gray-500 font-medium text-sm">When buyers reach out to you, their inquiries will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
