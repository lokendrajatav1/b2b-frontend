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

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/admin/analytics');
      const summary = data.data?.summary || {};
      setStats({
        users: summary.totalUsers || 0,
        vendors: summary.totalVendors,
        leads: summary.totalLeads,
        revenue: summary.totalRevenue || 0,
        pendingVendors: summary.pendingVendors || 0,
        pendingOfferings: summary.pendingOfferings || 0,
        recentLeads: data.data?.recentLeads || []
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardCards = [
    { label: 'Total Members', value: stats?.users || 0, icon: Users, color: 'blue', growth: '+12% active' },
    { label: 'Verified Vendors', value: stats?.vendors || 0, icon: Briefcase, color: 'emerald', growth: '4 waiting review' },
    { label: 'Market Inquiries', value: stats?.leads || 0, icon: Target, color: 'amber', growth: '+18.2% from last month' },
    { label: 'Total Revenue', value: '₹' + (stats?.revenue || 0).toLocaleString(), icon: Zap, color: 'indigo', growth: 'Subscription targets met' }
  ];

  return (
    <div className="space-y-8 animate-simple-fade pb-20 p-2 md:p-0">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 max-w-7xl mx-auto">
        <div>
           <h1 className="text-2xl font-semibold text-gray-900 tracking-tight flex items-center gap-3">
             Global Marketplace Command Hub
             <div className="p-1.5 bg-gray-50 text-gray-400 rounded-lg border border-gray-200">
                <BarChart3 className="w-5 h-5" />
             </div>
           </h1>
           <p className="text-gray-500 font-medium mt-1 text-sm">Oversee platform health, verify new applications, and monitor market signals.</p>
        </div>

        <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 flex items-center gap-3">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
           <span className="text-xs font-semibold text-emerald-700 uppercase tracking-widest leading-none">Everything is running smoothly</span>
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
            className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-200 transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${
                card.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                card.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                card.color === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'
              }`}>
                <card.icon className="w-6 h-6" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-widest ${
                card.color === 'blue' ? 'bg-blue-50 text-blue-700' :
                card.color === 'emerald' ? 'bg-emerald-50 text-emerald-700' :
                card.color === 'amber' ? 'bg-amber-50 text-amber-700' : 'bg-indigo-50 text-indigo-700'
              }`}>{card.growth}</span>
            </div>
            <p className="text-sm font-semibold text-gray-500 tracking-tight">{card.label}</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1 tabular-nums">{loading ? '...' : card.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
         {/* System Infrastructure Insights */}
         <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 text-gray-400">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 tracking-tight leading-none">Marketplace Hub Activity</h3>
                    <p className="text-sm font-medium text-gray-500 mt-1">Real-time signal of inquiries and vendor performance.</p>
                  </div>
               </div>
               <button onClick={fetchDashboardStats} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
               </button>
            </div>

            <div className="space-y-4">
                {stats?.recentLeads?.length > 0 ? stats.recentLeads.map((lead: any) => (
                  <div key={lead.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm text-blue-600 font-bold group-hover:bg-blue-600 group-hover:text-white transition-all">
                        {lead.buyerName?.charAt(0) || 'B'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 leading-none">
                           {lead.searchKeyword ? `Demand for "${lead.searchKeyword}"` : `Requirement from ${lead.buyerName}`}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-blue-500" /> 
                          {lead.vendor?.businessName ? `Assigned to ${lead.vendor.businessName}` : 'Market Distribution'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-bold text-gray-900 capitalize">{lead.city}</p>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">{new Date(lead.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                )) : (
                  <div className="py-20 text-center space-y-4 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                     <Target className="w-12 h-12 text-gray-200 mx-auto" />
                     <p className="text-sm font-semibold text-gray-400">Waiting for live marketplace signals...</p>
                  </div>
                )}
            </div>
         </div>

         {/* Shortcuts / Quick Actions */}
         <div className="lg:col-span-4 space-y-6">
            <div className="bg-gray-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg group">
               <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 transition-transform group-hover:translate-x-2 group-hover:-translate-y-2">
                  <Megaphone className="w-24 h-24" />
               </div>
               <div className="relative z-10 space-y-4">
                  <h3 className="text-xl font-semibold leading-tight pr-12">Broadcast platform-wide updates instantly.</h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-medium">Send announcements to all vendors and buyers on the marketplace in one click.</p>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-all group/btn">
                    Go to Broadcast Hub
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
               </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
               <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-amber-500" /> Administrative To-Do
               </h3>
                <div className="space-y-4">
                  {[
                    { label: `Verify ${stats?.pendingVendors || 0} new vendors`, urgency: 'High', count: stats?.pendingVendors },
                    { label: `Moderate ${stats?.pendingOfferings || 0} catalogue items`, urgency: 'High', count: stats?.pendingOfferings },
                    { label: 'Platform performance audit', urgency: 'Medium', count: 1 }
                  ].filter(t => t.count > 0 || t.urgency === 'Medium').map((todo) => (
                    <div key={todo.label} className="flex items-start justify-between gap-4 p-3 hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-gray-100">
                      <div className="flex gap-3">
                        <div className="w-5 h-5 bg-gray-50 border border-gray-200 rounded mt-0.5 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5 text-transparent" />
                        </div>
                        <span className="text-xs font-semibold text-gray-900 leading-relaxed capitalize">{todo.label}</span>
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-widest shrink-0 ${todo.urgency === 'High' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>{todo.urgency}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}


