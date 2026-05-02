'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { 
  BarChart3, 
  Users, 
  Target, 
  Briefcase, 
  Zap, 
  ArrowUpRight, 
  Clock, 
  Activity,
  CheckCircle2,
  AlertCircle,
  Megaphone,
  ShieldAlert,
  ArrowRight,
  RefreshCcw,
  Send,
  Database,
  CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    fetchDashboardStats();
  }, [timeRange]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const url = timeRange === 'all' ? '/admin/analytics' : `/admin/analytics?timeRange=${timeRange}`;
      const data = await apiFetch(url);
      const summary = data.data?.summary || {};
      setStats({
        users: summary.totalUsers || 0,
        vendors: summary.totalVendors || 0,
        products: summary.totalProducts || 0,
        leads: summary.totalLeads || 0,
        revenue: summary.totalRevenue || 0,
        pendingVendors: summary.pendingVendors || 0,
        pendingOfferings: summary.pendingOfferings || 0,
        activeSubscribers: summary.activeSubscribers || 0,
        recentLeads: data.data?.recentLeads || []
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardCards = [
    { label: 'Platform Users', value: stats?.users || 0, icon: Users, color: 'blue', growth: 'Registered Users' },
    { label: 'Verified Vendors', value: stats?.vendors || 0, icon: Briefcase, color: 'emerald', growth: `${stats?.pendingVendors || 0} waiting review` },
    { label: 'Vendor Products', value: stats?.products || 0, icon: Database, color: 'amber', growth: 'Total Offerings' },
    { label: 'Market Inquiries', value: stats?.leads || 0, icon: Target, color: 'indigo', growth: 'Total Demand' }
  ];

  return (
    <div className="space-y-8 animate-simple-fade pb-20 p-2 md:p-0">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 max-w-7xl mx-auto">
        <div>
           <h1 className="text-3xl font-semibold text-slate-900  flex items-center gap-3">
             Super Admin Control Hub
             <div className="p-1.5 bg-gray-50 text-slate-500 rounded-none border border-gray-200">
                <ShieldAlert className="w-6 h-6" />
             </div>
           </h1>
           <p className="text-slate-700 font-medium mt-1 text-base md:text-base">Oversee platform health, verify new applications, and monitor market signals.</p>
        </div>

        <div className="flex items-center gap-4">
           <select 
             value={timeRange} 
             onChange={(e) => setTimeRange(e.target.value)}
             className="px-4 py-2 bg-white border border-gray-200 rounded-none text-base font-semibold text-slate-800 outline-none focus:border-[#007367]"
           >
             <option value="all">All Time</option>
             <option value="yearly">This Year</option>
             <option value="monthly">This Month</option>
             <option value="weekly">This Week</option>
           </select>
           <div className="bg-emerald-50 px-4 py-3 rounded-none border border-emerald-100 flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-base font-semibold text-emerald-700 uppercase  leading-none hidden sm:inline-block">System Operational</span>
           </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {dashboardCards.map((card, idx) => (
          <motion.div 
            key={card.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="group bg-white p-6 rounded-none border border-gray-200 hover:border-[#007367]/30 transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${
                card.color === 'blue' ? 'bg-[#007367]/10 text-[#007367]' :
                card.color === 'emerald' ? 'bg-[#e88c30]/10 text-[#e88c30]' :
                card.color === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-[#007367]/5 text-[#007367]'
              }`}>
                <card.icon className="w-6 h-6" />
              </div>
              <span className={`text-base font-semibold px-2.5 py-1 rounded-lg uppercase  ${
                card.color === 'blue' ? 'bg-[#007367]/10 text-[#007367]' :
                card.color === 'emerald' ? 'bg-[#e88c30]/10 text-[#e88c30]' :
                card.color === 'amber' ? 'bg-amber-50 text-amber-700' : 'bg-[#007367]/5 text-[#007367]'
              }`}>{card.growth}</span>
            </div>
            <p className="text-base font-semibold text-slate-700 ">{card.label}</p>
            <h3 className="text-3xl md:text-4xl font-semibold text-slate-900 mt-1 tabular-nums">{loading ? '...' : card.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
         {/* System Infrastructure Insights */}
         <div className="lg:col-span-8 bg-white rounded-none border border-gray-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
               <div className="flex items-center gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900  leading-none">Marketplace Hub Activity</h3>
                    <p className="text-base font-medium text-slate-700 mt-1">Real-time signal of inquiries and vendor performance.</p>
                  </div>
               </div>
               <button onClick={fetchDashboardStats} className="p-2 text-slate-500 hover:text-[#007367] hover:bg-[#007367]/10 rounded-none transition-colors">
                  <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
               </button>
            </div>

            <div className="space-y-4">
                {stats?.recentLeads?.length > 0 ? stats.recentLeads.map((lead: any) => (
                  <div key={lead.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-none border border-gray-100 hover:bg-white transition-all group">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-base md:text-base font-semibold text-slate-900 leading-none">
                           {lead.searchKeyword ? `Demand for "${lead.searchKeyword}"` : `Requirement from ${lead.buyerName}`}
                        </p>
                        <p className="text-base font-semibold text-black uppercase  mt-1.5 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-[#007367]/80" /> 
                          {lead.vendor?.businessName ? `Assigned to ${lead.vendor.businessName}` : 'Market Distribution'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-base font-semibold text-slate-900 capitalize">{lead.city}</p>
                       <p className="text-base font-semibold text-black uppercase  leading-none mt-1">{new Date(lead.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                )) : (
                  <div className="py-20 text-center space-y-4 bg-gray-50/50 rounded-none border border-dashed border-gray-200">
                     <Target className="w-12 h-12 text-gray-200 mx-auto" />
                     <p className="text-base font-semibold text-slate-500">Waiting for live marketplace signals...</p>
                  </div>
                )}
            </div>
         </div>

         {/* Shortcuts / Quick Actions */}
         <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#f0f9f8] border border-[#007367]/20 rounded-2xl p-8 relative overflow-hidden shadow-sm group">
               <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-[#007367] transform translate-x-4 -translate-y-4 transition-transform group-hover:translate-x-2 group-hover:-translate-y-2">
                  <Megaphone className="w-24 h-24" />
               </div>
               <div className="relative z-10 space-y-4">
                  <h3 className="text-xl md:text-2xl font-semibold text-[#007367] leading-tight pr-12">Broadcast platform-wide updates instantly.</h3>
                  <p className="text-base md:text-base text-[#007367]/70 leading-relaxed font-medium">Send announcements to all vendors and buyers on the marketplace in one click.</p>
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-[#007367] hover:bg-[#005e54] text-white rounded-none font-semibold text-base transition-all group/btn">
                    Go to Broadcast Hub
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
               </div>
            </div>

            <div className="bg-white rounded-none border border-gray-200 p-8 shadow-sm">
               <h3 className="text-base font-semibold text-slate-500 uppercase  mb-6 flex items-center gap-2">
                 <ShieldAlert className="w-5 h-5 text-amber-500" /> Administrative To-Do
               </h3>
                <div className="space-y-4">
                  {[
                    { label: `Verify ${stats?.pendingVendors || 0} new vendors`, urgency: 'High', count: stats?.pendingVendors },
                    { label: `Moderate ${stats?.pendingOfferings || 0} catalogue items`, urgency: 'High', count: stats?.pendingOfferings },
                    { label: 'Platform performance audit', urgency: 'Medium', count: 1 }
                  ].filter(t => t.count > 0 || t.urgency === 'Medium').map((todo) => (
                    <div key={todo.label} className="flex items-start justify-between gap-4 p-3 hover:bg-gray-50 rounded-none transition-all border border-transparent hover:border-gray-100">
                      <div className="flex gap-3">
                        <div className="w-5 h-5 bg-gray-50 border border-gray-200 rounded mt-0.5 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5 text-transparent" />
                        </div>
                        <span className="text-base font-semibold text-slate-900 leading-relaxed capitalize">{todo.label}</span>
                      </div>
                      <span className={`text-base px-2 py-1 rounded-md font-semibold uppercase  shrink-0 ${todo.urgency === 'High' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>{todo.urgency}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
