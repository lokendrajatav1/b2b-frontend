'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { 
  Users, 
  Target, 
  Briefcase, 
  Zap, 
  CheckCircle2, 
  Activity,
  ShieldAlert,
  ArrowRight,
  RefreshCcw,
  MonitorCheck,
  UserCheck2,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SubAdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const dept = user?.subAdmin?.department || 'GENERAL';

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
        vendors: summary.totalVendors || 0,
        leads: summary.totalLeads || 0,
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

  const departmentConfigs = {
    DATA_ENTRY: [
      { label: 'Unverified Vendors', value: stats?.pendingVendors, icon: UserCheck2, color: 'blue' },
      { label: 'Product Reviews', value: stats?.pendingOfferings, icon: MonitorCheck, color: 'indigo' },
      { label: 'Total Database', value: stats?.vendors, icon: CheckCircle2, color: 'emerald' },
      { label: 'Active Categories', value: 14, icon: Briefcase, color: 'amber' }
    ],
    SALES: [
      { label: 'Total Demands', value: stats?.leads, icon: Target, color: 'amber' },
      { label: 'Active Leads', value: stats?.recentLeads?.length, icon: Activity, color: 'blue' },
      { label: 'Target Vendors', value: stats?.vendors, icon: Briefcase, color: 'emerald' },
      { label: 'Revenue Pulse', value: (stats?.revenue || 0).toLocaleString(), icon: Zap, color: 'indigo' }
    ],
    GENERAL: [
      { label: 'Member Count', value: stats?.users, icon: Users, color: 'blue' },
      { label: 'Active Vendors', value: stats?.vendors, icon: Briefcase, color: 'emerald' },
      { label: 'Market Leads', value: stats?.leads, icon: Target, color: 'amber' },
      { label: 'Verified Slots', value: stats?.pendingOfferings, icon: Zap, color: 'indigo' }
    ]
  };

  const currentCards = departmentConfigs[dept as keyof typeof departmentConfigs] || departmentConfigs.GENERAL;

  return (
    <div className="space-y-6 animate-simple-fade pb-10">
      {/* Refined Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-semibold uppercase tracking-wider text-[10px] mb-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Team Workspace
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Welcome back, {user?.name || 'Administrative Member'}
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-1">
            Monitoring <span className="text-blue-600 font-semibold">{dept.replace('_', ' ')}</span> operations for today.
          </p>
        </div>

        <button 
          onClick={fetchDashboardStats} 
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50/50 transition-all text-xs font-semibold shadow-sm disabled:opacity-50"
        >
          <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Syncing...' : 'Refresh Data'}
        </button>
      </div>

      {/* Simplified Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {currentCards.map((card) => (
          <div key={card.label} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center ${
              card.color === 'blue' ? 'bg-blue-50 text-blue-600' :
              card.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
              card.color === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'
            }`}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest leading-none mb-2">{card.label}</p>
            <h3 className="text-2xl font-semibold text-gray-900 tracking-tight">{loading ? '...' : card.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simplified Task List */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="p-2 bg-amber-50 rounded-lg">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">Action Items</h3>
          </div>
          
          <div className="space-y-3">
            {[
              { label: `Review ${stats?.pendingVendors} vendors`, show: dept === 'DATA_ENTRY' || dept === 'GENERAL' },
              { label: `Sync ${stats?.pendingOfferings} products`, show: dept === 'DATA_ENTRY' || dept === 'GENERAL' },
              { label: 'Audit recent inquiries', show: true },
              { label: 'Check team broadcasts', show: true }
            ].filter(t => t.show).map((todo) => (
              <div key={todo.label} className="flex items-center gap-3 p-3.5 bg-gray-50/50 border border-transparent hover:border-gray-100 hover:bg-white rounded-2xl transition-all group">
                <CheckCircle2 className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                <span className="text-[13px] font-medium text-gray-600 group-hover:text-gray-900">{todo.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Simplified Recent Feed */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Activity className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">Live Feed</h3>
            </div>
            <button className="text-[11px] font-bold text-blue-600 uppercase tracking-widest hover:underline">View All</button>
          </div>

          <div className="space-y-2">
            {stats?.recentLeads?.length > 0 ? stats.recentLeads.slice(0, 4).map((lead: any) => (
              <div key={lead.id} className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 rounded-2xl border border-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 font-semibold text-xs">
                    {lead.buyerName?.charAt(0) || 'B'}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-gray-900">{lead.searchKeyword || lead.buyerName}</p>
                    <p className="text-[11px] font-medium text-gray-400">{lead.city}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300" />
              </div>
            )) : (
              <div className="py-20 text-center border-2 border-dashed border-gray-50 rounded-2xl">
                 <p className="text-sm font-medium text-gray-400">Neutral state. No activity recorded.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
