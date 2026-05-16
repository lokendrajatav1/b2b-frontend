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
  Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchVendor, setSearchVendor] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [stats, setStats] = useState({ totalRev: 0, pending: 0, count: 0 });

  useEffect(() => {
    fetchTransactions();
  }, [statusFilter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      let url = '/admin/transactions';
      if (statusFilter !== 'ALL') url += `?status=${statusFilter}`;
      
      const data = await apiFetch(url);
      const list = data.data?.transactions || [];
      setTransactions(list);
      
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
        <div>
          <h1 className="text-2xl font-semibold text-slate-900  flex items-center gap-3">
            Transactions
            <div className="p-1.5 bg-[#164e33]/5 text-[#164e33] rounded-lg border border-[#164e33]/10">
              <CreditCard className="w-5 h-5" />
            </div>
          </h1>
          <p className="text-slate-700 font-medium mt-1 text-sm">Audit platform revenue and vendor subscriptions.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
              <input 
                type="text" 
                placeholder="Search by vendor..."
                value={searchVendor}
                onChange={(e) => setSearchVendor(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium w-64 outline-none focus:border-blue-500 focus:bg-white transition-all focus:ring-2 focus:ring-blue-100"
              />
           </div>
           
           <button onClick={fetchTransactions} className="p-2 bg-white border border-gray-200 rounded-lg text-slate-700 hover:text-slate-800 hover:bg-gray-50 transition-all ">
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
           <div key={i} className="bg-white p-6 rounded-lg border border-gray-200  flex items-center justify-between">
              <div>
                 <p className="text-sm font-semibold text-slate-700 uppercase  mb-1">{s.label}</p>
                 <h2 className="text-2xl font-semibold text-slate-900 ">{s.value}</h2>
              </div>
              <div className={`p-3 rounded-lg ${s.bg} ${s.text}`}>
                 <s.icon className="w-6 h-6" />
              </div>
           </div>
         ))}
      </div>

      {/* Ledger Table */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden ">
           <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap min-w-[800px]">
                 <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100">
                       <th className="px-6 py-4 text-sm font-semibold text-slate-700 uppercase ">Transaction ID</th>
                       <th className="px-6 py-4 text-sm font-semibold text-slate-700 uppercase ">Vendor</th>
                       <th className="px-6 py-4 text-sm font-semibold text-slate-700 uppercase ">Date & Method</th>
                       <th className="px-6 py-4 text-sm font-semibold text-slate-700 uppercase ">Amount</th>
                       <th className="px-6 py-4 text-sm font-semibold text-slate-700 uppercase ">Status</th>
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
                    ) : filteredTransactions.map((t) => (
                      <tr key={t.id} className="hover:bg-gray-50 transition-colors group">
                         <td className="px-6 py-4">
                            <code className="text-sm font-medium text-slate-800 bg-gray-100 px-2.5 py-1 rounded inline-block">
                              {t.razorpayPaymentId || t.id.slice(0, 12)}
                            </code>
                         </td>
                         <td className="px-6 py-4">
                            <div>
                               <p className="text-sm font-semibold text-slate-900">{t.vendor?.businessName || 'Anonymous'}</p>
                               <p className="text-sm font-medium text-slate-700">{t.vendor?.ownerName}</p>
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <div className="flex flex-col">
                               <span className="text-sm font-medium text-slate-800 flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5 text-slate-700" />
                                  {new Date(t.createdAt).toLocaleDateString()}
                               </span>
                               <span className="text-sm font-medium text-slate-700 ml-5 mt-0.5">Razorpay</span>
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <span className="text-sm font-semibold text-slate-900">₹{t.amount}</span>
                         </td>
                         <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-md text-sm font-semibold uppercase  border ${getStatusColor(t.status)}`}>
                               {t.status}
                            </span>
                         </td>
                      </tr>
                    ))}
                    
                    {!loading && filteredTransactions.length === 0 && (
                      <tr>
                         <td colSpan={5} className="py-16 text-center text-slate-700">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-gray-100">
                              <CreditCard className="w-8 h-8 text-gray-500" />
                            </div>
                            <p className="text-sm font-semibold text-slate-900">No transactions found</p>
                         </td>
                      </tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
}



