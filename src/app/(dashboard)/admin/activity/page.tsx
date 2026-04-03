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
  ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function AdminActivityLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [module, setModule] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const query = `?page=${page}${module ? `&module=${module}` : ''}`;
      const res = await apiFetch(`/admin/activity${query}`);
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
  }, [page, module]);

  const getActionColor = (action: string) => {
    if (action.includes('DELETE') || action.includes('REJECT')) return 'bg-rose-50 text-rose-600 border-rose-100';
    if (action.includes('APPROVE') || action.includes('CREATE')) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    if (action.includes('UPDATE')) return 'bg-amber-50 text-amber-600 border-amber-100';
    return 'bg-blue-50 text-blue-600 border-blue-100';
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6 animate-simple-fade p-4 md:p-0 overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-gray-100 shrink-0">
        <div>
           <h1 className="text-xl font-semibold text-gray-900 tracking-tight flex items-center gap-3">
             System Activity Audit
             <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                <History className="w-4 h-4" />
             </div>
           </h1>
           <p className="text-gray-500 font-medium mt-1 text-[13px]">Chronological secure logs of all administrative team movements.</p>
        </div>

        <div className="flex items-center gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select 
                value={module}
                onChange={(e) => { setModule(e.target.value); setPage(1); }}
                className="pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
              >
                 <option value="">All Modules</option>
                 <option value="VENDOR">Vendors</option>
                 <option value="USER">Users</option>
                 <option value="SUBADMIN">Sub-Admins</option>
                 <option value="OFFERING">Products/Services</option>
                 <option value="LEAD">Leads</option>
                 <option value="CATEGORY">Categories</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
           <button onClick={() => fetchLogs()} className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm">
              <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
           </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto custom-scrollbar">
             <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead className="sticky top-0 z-20">
                   <tr className="bg-gray-50/95 backdrop-blur-md border-b border-gray-100">
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Time Trace</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Team Member</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Module</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Execution</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Transaction Details</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {loading ? (
                      [1,2,3,4,5,6,7,8].map(i => (
                         <tr key={i} className="animate-pulse">
                            <td colSpan={5} className="px-6 py-6 h-20 bg-gray-50/20"></td>
                         </tr>
                      ))
                   ) : logs.length > 0 ? (
                      logs.map(log => (
                         <tr key={log.id} className="hover:bg-blue-50/20 transition-all duration-300 group cursor-default">
                            <td className="px-6 py-5 whitespace-nowrap">
                               <div className="flex flex-col text-[11px]">
                                  <span className="font-bold text-gray-900 leading-tight">{format(new Date(log.createdAt), 'MMM dd, yyyy')}</span>
                                  <span className="font-semibold text-gray-500 flex items-center gap-1.5 mt-1">
                                     <Clock className="w-3.5 h-3.5" />
                                     {format(new Date(log.createdAt), 'HH:mm:ss')}
                                  </span>
                               </div>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap">
                               <div className="flex flex-col">
                                  <span className="text-[13px] font-bold text-gray-900 capitalize tracking-tight">{log.user.name}</span>
                                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{log.user.role}</span>
                               </div>
                            </td>
                            <td className="px-6 py-5">
                               <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-xl border border-gray-100 w-fit">
                                  <Layers className="w-3 h-3 opacity-40" />
                                  <span className="text-[10px] font-bold uppercase tracking-wider">{log.module}</span>
                               </div>
                            </td>
                            <td className="px-6 py-5">
                               <div className={`flex items-center gap-2 px-4 py-1.5 rounded-xl border w-fit shadow-sm transition-all duration-300 ${getActionColor(log.action)}`}>
                                  <div className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                                  <span className="text-[10px] font-bold uppercase tracking-widest">{log.action.replace(/_/g, ' ')}</span>
                               </div>
                            </td>
                            <td className="px-6 py-5 max-w-sm">
                               <p className="text-[13px] font-semibold text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors">
                                  {log.details || 'System operation executed successfully.'}
                                </p>
                            </td>
                         </tr>
                      ))
                   ) : (
                      <tr>
                         <td colSpan={5} className="px-6 py-24 text-center">
                            <History className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                            <p className="text-sm font-semibold text-gray-400">Vault empty. No administrative logs found.</p>
                         </td>
                      </tr>
                   )}
                </tbody>
             </table>
          </div>
      </div>
    </div>
  );
}
