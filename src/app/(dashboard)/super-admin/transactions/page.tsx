'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import {
  CreditCard,
  Search,
  RefreshCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  Download,
  Building2,
  Calendar,
  Wallet,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchVendor, setSearchVendor] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState({ totalRev: 0, pending: 0, count: 0 });

  useEffect(() => {
    fetchTransactions();
  }, [statusFilter, page, limit]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      const data = await apiFetch(`/admin/transactions?${params.toString()}`);
      const list = data.data?.transactions || [];
      setTransactions(list);
      setTotal(data.data?.total || 0);
      
      // Basic stats
      const total = list.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);
      const pend = list.filter((t: any) => t.status === 'PENDING').length;
      setStats({ totalRev: total, pending: pend, count: list.length });
      
    } catch (error) {
      console.error('Failed to fetch ledger:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'FAILED': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const filteredTransactions = transactions.filter(t => 
    t.vendor?.businessName?.toLowerCase().includes(searchVendor.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-simple-fade pb-20 p-2 md:p-0">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 max-w-7xl mx-auto">
        <div className="flex items-center gap-5">
           <div className="w-12 h-12 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Wallet className="w-6 h-6" />
           </div>
           <div>
              <h1 className="text-xl font-semibold text-slate-900">Transactions</h1>
              <p className="text-sm text-gray-600 font-normal mt-1">Audit platform revenue and vendor subscriptions.</p>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
              <input 
                type="text" 
                placeholder="Search by vendor..."
                value={searchVendor}
                onChange={(e) => setSearchVendor(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium w-64 outline-none focus:border-blue-500 focus:bg-white transition-all focus:ring-2 focus:ring-blue-100"
              />
           </div>
           
           <button onClick={fetchTransactions} className="p-2 bg-white border border-gray-200 rounded-xl text-slate-700 hover:text-slate-800 hover:bg-gray-50 transition-all">
             <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
           </button>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
         {[
           { label: 'Total Volume', value: `₹${stats.totalRev.toLocaleString()}`, icon: Wallet, bg: 'bg-[#164e33]/5', text: 'text-[#164e33]' },
           { label: 'Total Transactions', value: stats.count, icon: CreditCard, bg: 'bg-[#164e33]/5', text: 'text-[#164e33]' },
           { label: 'Pending Settlement', value: stats.pending, icon: Clock, bg: 'bg-amber-50', text: 'text-amber-600' }
         ].map((s, i) => (
           <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 flex items-center justify-between">
              <div>
                 <p className="text-sm font-semibold text-slate-700 uppercase mb-1">{s.label}</p>
                 <h2 className="text-xl font-semibold text-slate-900">{s.value}</h2>
              </div>
              <div className={`p-3 rounded-xl ${s.bg} ${s.text}`}>
                 <s.icon className="w-6 h-6" />
              </div>
           </div>
         ))}
      </div>

      {/* Ledger Table */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden flex flex-col shadow-sm">
           <div className="overflow-x-auto overflow-y-auto w-full max-h-[calc(70vh-50px)] relative">
              <table className="w-full text-left border-collapse min-w-[800px]">
                 <thead className="sticky top-0 z-20 bg-white">
                    <tr className="bg-white border-b border-gray-100 shadow-sm">
                       <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-tight">Transaction ID</th>
                       <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-tight">Vendor</th>
                       <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-tight">Date & Method</th>
                       <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-tight">Amount</th>
                       <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-tight">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                    {loading && transactions.length === 0 ? (
                      [1,2,3,4,5].map(i => (
                        <tr key={i} className="animate-pulse">
                           <td colSpan={5} className="px-6 py-6 h-4">
                             <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                           </td>
                        </tr>
                      ))
                    ) : filteredTransactions.length > 0 ? filteredTransactions.map((t) => (
                      <tr key={t.id} className="hover:bg-gray-50 transition-colors group">
                         <td className="px-6 py-4">
                            <code className="text-sm font-medium text-slate-800 bg-gray-100 px-2.5 py-1 rounded inline-block">
                              {t.razorpayPaymentId || t.id.slice(0, 12)}
                            </code>
                         </td>
                         <td className="px-6 py-4">
                            <div>
                               <p className="text-sm font-semibold text-slate-900">{t.vendor?.businessName || 'Anonymous'}</p>
                               <p className="text-sm font-medium text-slate-500">{t.vendor?.ownerName}</p>
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <div className="flex flex-col">
                               <span className="text-sm font-medium text-slate-800 flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                  {new Date(t.createdAt).toLocaleDateString()}
                               </span>
                               <span className="text-sm font-medium text-slate-500 ml-5 mt-0.5">Razorpay</span>
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <span className="text-sm font-semibold text-slate-900">₹{t.amount}</span>
                         </td>
                         <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-md text-sm font-semibold uppercase border ${getStatusColor(t.status)}`}>
                               {t.status}
                            </span>
                         </td>
                      </tr>
                    )) : (
                     <tr>
                        <td colSpan={6} className="py-24 text-center">
                           <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                              <Wallet className="w-8 h-8 text-slate-600" />
                           </div>
                           <p className="text-sm font-semibold text-slate-500 uppercase tracking-tight">No transactions found matching criteria</p>
                        </td>
                     </tr>
                    )}
                 </tbody>
              </table>
           </div>

          {/* Pagination Footer */}
          <div className="px-8 py-6 bg-slate-50/30 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
             <p className="text-xs font-semibold text-slate-500 uppercase tracking-tight">
                Showing <span className="text-slate-900 font-bold">{Math.min(((page - 1) * limit) + 1, total)}</span> to <span className="text-slate-900 font-bold">{Math.min(page * limit, total)}</span> of <span className="text-slate-900 font-bold">{total}</span> records
             </p>

             <div className="flex items-center gap-6">
                <select
                   value={limit}
                   onChange={(e) => { setLimit(parseInt(e.target.value)); setPage(1); }}
                   className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-[10px] font-bold text-slate-700 outline-none hover:border-slate-300 transition-all cursor-pointer uppercase appearance-none pr-8"
                   style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23475569\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
                >
                   <option value={10}>10 per page</option>
                   <option value={25}>25 per page</option>
                   <option value={50}>50 per page</option>
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
                      {[...Array((Math.max(0, Math.ceil((total || 0) / (limit || 10)) || 0)))].slice(0, 5).map((_, i) => (
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
                      onClick={() => setPage(p => Math.min((limit > 0 ? Math.ceil(total / limit) : 0), p + 1))}
                      disabled={page >= (limit > 0 ? Math.ceil(total / limit) : 0)}
                      className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                   >
                      <ChevronRight size={18} />
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
