'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import {
   History,
   Search,
   Filter,
   User,
   ShieldCheck,
   Calendar,
   Layers,
   ArrowRight,
   RefreshCcw,
   Clock,
   ChevronDown,
   MoreVertical,
   ChevronLeft,
   Database,
   Users as UsersIcon,
   Briefcase,
   Target,
   FileText,
   ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

export default function AdminActivityLogs() {
   const [logs, setLogs] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [total, setTotal] = useState(0);
   const [page, setPage] = useState(1);
   const [limit, setLimit] = useState(10);
   const [module, setModule] = useState('');
   const [timeRange, setTimeRange] = useState('ALL');
   const [customRange, setCustomRange] = useState({ start: '', end: '' });

   const fetchLogs = async () => {
      try {
         setLoading(true);
         const params = new URLSearchParams();
         params.append('page', page.toString());
         params.append('limit', limit.toString());
         if (module) params.append('module', module);
         if (timeRange !== 'ALL') params.append('timeRange', timeRange);
         if (timeRange === 'custom' && customRange.start && customRange.end) {
            params.append('startDate', customRange.start);
            params.append('endDate', customRange.end);
         }
         const res = await apiFetch(`/admin/activity?${params.toString()}`);
         setLogs(res.data.logs || []);
         setTotal(res.data.total || 0);
      } catch (err) {
         console.error('Failed to fetch activity logs:', err);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchLogs();
   }, [page, limit, module, timeRange, customRange]);

   const getActionColor = (action: string) => {
      if (action.includes('DELETE') || action.includes('REJECT')) return 'bg-rose-50 text-rose-500 border-rose-100';
      if (action.includes('APPROVE') || action.includes('CREATE')) return 'bg-emerald-50 text-emerald-500 border-emerald-100';
      if (action.includes('UPDATE') || action.includes('REASSIGN')) return 'bg-emerald-50 text-emerald-500 border-emerald-100';
      return 'bg-blue-50 text-blue-500 border-blue-100';
   };

   return (
      <div className="space-y-10 animate-fade-in pb-20">

         {/* --- HEADER & FILTERS --- */}
         <div className="flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
               <div className="flex items-center gap-6">
                  <div>
                     <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-center text-emerald-600">
                           <History className="w-6 h-6" />
                        </div>
                        <div>
                        <h1 className="text-xl font-semibold text-slate-900">System Activity Audit</h1>
                        </div>
                     </div>
                     <p className="text-sm text-gray-600 font-normal mt-1">
                        Chronological secure logs of all administrative team movements.
                     </p>
                  </div>
               </div>

               <div className="flex items-center gap-4">
                  {/* Date Range Selector */}
                  <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-sm">
                     <Clock size={14} className="text-gray-500" />
                     <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="text-xs font-semibold text-gray-900 outline-none bg-transparent cursor-pointer"
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
                     <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-2 w-full">
                           <input
                              type="date"
                              className="flex-1 bg-white border border-gray-100 rounded-lg px-2 py-1.5 text-[10px] font-semibold outline-none"
                              onChange={(e) => setCustomRange(prev => ({ ...prev, start: e.target.value }))}
                           />
                           <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-tighter shrink-0">to</span>
                           <input
                              type="date"
                              className="flex-1 bg-white border border-gray-100 rounded-lg px-2 py-1.5 text-[10px] font-semibold outline-none"
                              onChange={(e) => setCustomRange(prev => ({ ...prev, end: e.target.value }))}
                           />
                        </div>
                     </div>
                  )}

                  {/* Module Selector */}
                  <div className="relative group min-w-[180px]">
                     <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Filter className="w-4 h-4 text-slate-600 group-focus-within:text-emerald-600 transition-colors" />
                     </div>
                     <select
                        value={module}
                        onChange={(e) => { setModule(e.target.value); setPage(1); }}
                        className="w-full pl-10 pr-10 py-3 bg-white border border-gray-100 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-emerald-600/50 focus:ring-4 focus:ring-emerald-50 transition-all appearance-none cursor-pointer shadow-sm"
                     >
                        <option value="">All Modules</option>
                        <option value="VENDOR">Vendors</option>
                        <option value="USER">Users</option>
                        <option value="ADMIN">Admins</option>
                        <option value="OFFERING">Offering</option>
                        <option value="LEAD">Leads</option>
                     </select>
                     <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
                  </div>

                  {/* Refresh Button */}
                  <button 
             onClick={() => fetchLogs()} 
             className="p-4 bg-white border border-gray-100 rounded-xl text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all group active:scale-95 shadow-sm"
           >
                     <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  </button>
               </div>
            </div>
         </div>

         {/* Analytics Overview */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
            <ActivityStatCard
               label="Total Operational Traces"
               value={total}
               sub="Global audit trail"
               icon={Database}
               iconBg="bg-slate-50"
               iconColor="text-slate-600" 
        />
        <ActivityStatCard 
          label="Security Events" 
          value={logs.filter(l => l.action.includes('REJECT') || l.action.includes('DELETE') || l.action.includes('REVOKE')).length} 
          sub="In current view"
          icon={ShieldCheck} 
          iconBg="bg-rose-50" 
          iconColor="text-rose-600" 
        />
        <ActivityStatCard 
          label="Productive Movements" 
          value={logs.filter(l => l.action.includes('CREATE') || l.action.includes('APPROVE') || l.action.includes('AUTHENTICATE')).length} 
          sub="In current view"
          icon={Target} 
          iconBg="bg-emerald-50" 
          iconColor="text-emerald-600" 
        />
        <ActivityStatCard 
          label="Active Registry" 
          value={module || 'All Hubs'} 
          sub="Selected Focus"
          icon={Layers} 
          iconBg="bg-blue-50" 
          iconColor="text-blue-600" 
        />
         </div>

         {/* --- ACTIVITY TABLE --- */}
         <div className="bg-white border border-gray-100 rounded-xl overflow-hidden flex flex-col shadow-sm">
            <div className="overflow-x-auto overflow-y-auto w-full max-h-[calc(70vh-50px)] relative">
               <table className="w-full text-left border-collapse min-w-[1200px]">
                  <thead className="sticky top-0 z-20 bg-white">
                     <tr className="bg-white border-b border-gray-100 shadow-sm">
                        <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-tight">Time Trace</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-tight">Team Member</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-tight">Module</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-tight">Execution</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-tight">Transaction Details</th>
                        <th className="px-6 py-4"></th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50/60">
                     {loading ? (
                        [1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                           <tr key={i} className="animate-pulse">
                              <td colSpan={6} className="px-10 py-8 h-24 bg-gray-50/10"></td>
                           </tr>
                        ))
                     ) : logs.length > 0 ? (
                        logs.map((log, idx) => (
                           <tr key={log.id} className="hover:bg-slate-50/50 transition-all duration-300 group cursor-default">
                              {/* Time Trace */}
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <div className="flex items-center gap-4">
                                    <div className="flex flex-col">
                                       <span className="text-sm font-semibold text-slate-900 leading-none mb-1">{format(new Date(log.createdAt), 'MMM dd, yyyy')}</span>
                                       <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                                          {format(new Date(log.createdAt), 'HH:mm:ss')}
                                       </span>
                                    </div>
                                 </div>
                              </td>

                              {/* Team Member */}
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white  flex items-center justify-center text-slate-700 overflow-hidden shrink-0">
                                       {log.user.avatar ? (
                                          <img src={log.user.avatar} alt={log.user.name} className="w-full h-full object-cover" />
                                       ) : (
                                          <User size={18} />
                                       )}
                                    </div>
                                    <div className="flex flex-col">
                                       <span className="text-sm font-semibold text-slate-900 capitalize">{log.user.name}</span>
                                       <span className={`text-xs font-semibold uppercase tracking-tight mt-0.5 ${log.user.role === 'SUPERADMIN' ? 'text-emerald-600' : 'text-slate-600'}`}>
                                          {log.user.role === 'SUPERADMIN' ? 'SUPER ADMIN' : log.user.role}
                                       </span>
                                    </div>
                                 </div>
                              </td>

                              {/* Module */}
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-700 rounded-xl border border-gray-100 w-fit">
                                    <span className="text-sm font-semibold uppercase tracking-tight">{log.module}</span>
                                 </div>
                              </td>

                              {/* Execution */}
                              <td className="px-6 py-4">
                                 <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border w-fit  ${getActionColor(log.action)}`}>
                                    <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                    <span className="text-xs font-semibold uppercase whitespace-nowrap">{log.action.replace(/_/g, ' ')}</span>
                                 </div>
                              </td>

                              {/* Transaction Details */}
                              <td className="px-6 py-4 max-w-md">
                                 <div className="text-sm font-medium text-slate-600 leading-relaxed transition-colors">
                                    {(() => {
                                      const text = log.details || 'Administrative movement logged and verified successfully.';
                                       if (text.includes('Reason:')) {
                                          const parts = text.split('Reason:');
                                          return (
                                             <div className="flex flex-col gap-1">
                                                <span className="text-slate-900 font-medium">{parts[0]}</span>
                                                <div className="flex items-center gap-2">
                                                   <span className="text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-100 px-1.5 py-0.5 rounded uppercase">Reason</span>
                                                   <span className="text-slate-900 font-semibold italic">{parts[1]}</span>
                                                </div>
                                             </div>
                                          );
                                       }
                                       return (
                                          <p className="group-hover:text-slate-900 font-medium">
                                             {text.split(' ').map((word, i) => {
                                                const l = word.toLowerCase();
                                                const s = ['vendor', 'user:', 'lead', 'offering:', 'deleted', 'approved', 'rejected', 'reassigned'].some(k => l.includes(k));
                                                return <span key={i} className={s ? 'text-slate-900 font-semibold' : ''}>{word} </span>;
                                             })}
                                          </p>
                                       );
                                   })()}
                                 </div>
                              </td>

                              {/* Action Dots */}
                              <td className="px-8 py-4 text-right">
                                 <button className="p-2 text-slate-600 hover:text-slate-600 transition-colors">
                                    <MoreVertical size={18} />
                                 </button>
                              </td>
                           </tr>
                        ))
                     ) : (
                        <tr>
                           <td colSpan={6} className="px-10 py-24 text-center">
                              <History className="w-16 h-16 text-slate-100 mx-auto mb-6" />
                              <h3 className="text-lg font-bold text-slate-600">No activity logs found</h3>
                              <p className="text-slate-600 font-medium mt-2">Try adjusting your filters or time range.</p>
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>

            {/* Pagination Footer */}
            <div className="px-8 py-6 bg-slate-50/30 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
               <p className="text-xs font-semibold text-slate-500 uppercase tracking-tight">
                  Showing <span className="text-slate-900 font-bold">{Math.min(((page - 1) * limit) + 1, total)}</span> to <span className="text-slate-900 font-bold">{Math.min(page * limit, total)}</span> of <span className="text-slate-900 font-bold">{total}</span> entries
               </p>

               <div className="flex items-center gap-6">
                  <select
                     value={limit}
                     onChange={(e) => { setLimit(parseInt(e.target.value)); setPage(1); }}
                     className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-[10px] font-bold text-slate-700 outline-none hover:border-slate-300 transition-all cursor-pointer uppercase appearance-none pr-8"
                     style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23475569\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
                  >
                     <option value={10}>10 entries</option>
                     <option value={25}>25 entries</option>
                     <option value={50}>50 entries</option>
                  </select>

                  <div className="flex items-center gap-2">
                     <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                     >
                        <ChevronLeft size={18} />
                     </button>
                     
                     <div className="flex items-center gap-1">
                        {[...Array(Math.ceil(total / limit))].slice(0, 5).map((_, i) => (
                           <button
                              key={i}
                              onClick={() => setPage(i + 1)}
                              className={`w-9 h-9 rounded-xl text-[11px] font-bold transition-all ${page === i + 1 ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}
                           >
                              {i + 1}
                           </button>
                        ))}
                     </div>

                     <button
                        onClick={() => setPage(p => Math.min(Math.ceil(total / limit), p + 1))}
                        disabled={page >= Math.ceil(total / limit)}
                        className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                     >
                        <ChevronRight size={18} />
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

const ActivityStatCard = ({ label, value, sub, icon: Icon, iconColor, iconBg }: any) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
     <div>
        <p className="text-xs font-semibold text-slate-700 mb-1">{label}</p>
        <h4 className="text-xl font-semibold text-slate-900">{value}</h4>
        <p className="text-xs font-medium text-slate-600 mt-1">{sub}</p>
     </div>
     <div className={`w-12 h-12 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center`}>
        <Icon size={20} />
     </div>
  </div>
);
