'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { 
  Users, 
  Target, 
  Briefcase, 
  ArrowUpRight, 
  Activity,
  CheckCircle2,
  RefreshCcw,
  Calendar,
  Wallet,
  PieChart as PieIcon,
  TrendingUp,
  Gem,
  Wrench,
  Package,
  Zap,
  Monitor,
  ChevronDown,
  BarChart3,
  Headphones,
  Clock
,
  BarChart2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar
} from 'recharts';

const COLORS = ['#f58220', '#3b82f6', '#10b981', '#a855f7', '#64748b'];

const SparkLine = ({ data, color }: { data: any[]; color: string }) => (
  <div className="h-12 w-full max-w-[120px]">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          fill={color} 
          fillOpacity={0.1} 
          strokeWidth={2} 
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default function SuperAdminAnalytics() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('monthly');
  const [customRange, setCustomRange] = useState({ start: '', end: '' });
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState('07:10 PM');

  useEffect(() => {
    fetchDashboardStats();
    fetchCategories();
    const now = new Date();
    setLastUpdated(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, [timeRange, customRange, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const data = await apiFetch('/vendors/categories');
      setCategories(data.success ? data.data : []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      let url = `/admin/analytics?timeRange=${timeRange}`;
      if (timeRange === 'custom' && customRange.start && customRange.end) {
        url += `&startDate=${customRange.start}&endDate=${customRange.end}`;
      }
      if (selectedCategory !== 'All') {
        url += `&category=${selectedCategory}`;
      }
      const data = await apiFetch(url);
      setStats(data.data?.summary || {});
      setCategoryData(data.data?.trends?.revenueTrends || []);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const leadPipelineData = [
    { name: 'Open / Pending', value: 18, color: '#f58220' },
    { name: 'Distributed', value: 5, color: '#3b82f6' },
    { name: 'Closed / Won', value: 5, color: '#10b981' },
  ];

  const subscriptionPlans = [
    { name: 'Platinum', vendors: 61, leads: 0, color: '#10b981' },
    { name: 'Gold', vendors: 35, leads: 1, color: '#3b82f6' },
    { name: 'Basic', vendors: 1, leads: 2, color: '#a855f7' },
    { name: 'Diamond', vendors: 61, leads: 3, color: '#a855f7' },
    { name: 'Golden Plane', vendors: 1, leads: 3, color: '#a855f7' },
  ];



  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Platform Insights Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
           <div className="w-14 h-14 bg-white rounded-xl  border border-gray-100 flex items-center justify-center text-slate-600">
              <TrendingUp className="w-8 h-8" />
           </div>
           <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-center text-blue-600">
                 <BarChart2 className="w-6 h-6" />
              </div>
              <div>
              <h1 className="text-xl font-semibold text-slate-900">Detailed Analytics</h1>
              <p className="text-sm text-gray-600 font-normal mt-1">
                 In-depth performance metrics • Updated today, {lastUpdated}
              </p>
              </div>
           </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-3 py-1.5 shadow-sm">
              <Clock size={14} className="text-slate-600" />
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="text-xs font-semibold text-slate-900 outline-none bg-transparent cursor-pointer"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="weekly">Last 7 Days</option>
                <option value="monthly">Last 30 Days</option>
                <option value="yearly">Last 12 Months</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            <button 
              onClick={fetchDashboardStats}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all border border-gray-100 "
            >
               <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
               Refresh
            </button>
          </div>

          {/* Custom Date Range Sub-row */}
          <AnimatePresence>
            {timeRange === 'custom' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <Clock size={13} className="text-slate-600 shrink-0" />
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider shrink-0">Custom Range:</span>
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <input
                      type="date"
                      className="flex-1 md:flex-none bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[11px] font-semibold text-slate-700 outline-none focus:border-emerald-400 transition-all shadow-sm cursor-pointer"
                      onChange={(e) => setCustomRange(prev => ({ ...prev, start: e.target.value }))}
                    />
                    <span className="text-[11px] font-semibold text-slate-600">→</span>
                    <input
                      type="date"
                      className="flex-1 md:flex-none bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[11px] font-semibold text-slate-700 outline-none focus:border-emerald-400 transition-all shadow-sm cursor-pointer"
                      onChange={(e) => setCustomRange(prev => ({ ...prev, end: e.target.value }))}
                    />
                  </div>
                  {customRange.start && customRange.end && (
                    <span className="md:ml-auto text-center md:text-left text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 shrink-0">Range Active</span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Verified Vendors', value: stats?.totalVendors || 159, sub: `${stats?.pendingVendors || 0} pending approval.`, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Platform Revenue', value: stats?.totalRevenue ? `₹${stats.totalRevenue}` : '₹0', sub: `${stats?.activeSubscribers || 159} active subscribers`, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Total Leads', value: stats?.totalLeads || 28, sub: '18 open • 5 closed', icon: Target, color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'Platform Users', value: stats?.totalUsers || 171, sub: `${stats?.pendingOfferings || 0} products pending review`, icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-50' },
        ].map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white p-4 rounded-xl border border-gray-100  flex items-center gap-3"
          >
            <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center ${card.color}`}>
               <card.icon className="w-5 h-5" />
            </div>
            <div>
               <p className="text-xs font-semibold text-slate-700 uppercase mb-0.5">{card.label}</p>
               <h3 className="text-lg font-bold text-slate-800 leading-none mb-1">{card.value}</h3>
               <p className="text-xs font-semibold text-slate-600">{card.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Pipeline */}
        <div className="bg-white rounded-xl p-6 border border-gray-100  flex flex-col">
           <div className="flex items-center gap-2 mb-6">
              <Users className="w-4 h-4 text-slate-600" />
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-tight">Lead Pipeline</h3>
           </div>

           <div className="flex items-center justify-between flex-1 gap-4">
              <div className="w-28 h-28 relative shrink-0">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie
                          data={leadPipelineData}
                          innerRadius={40}
                          outerRadius={55}
                          paddingAngle={5}
                          dataKey="value"
                       >
                          {leadPipelineData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                       </Pie>
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-slate-800">28</span>
                    <span className="text-xs font-semibold text-slate-600 uppercase">Total</span>
                 </div>
              </div>

              <div className="flex-1 space-y-3">
                 {leadPipelineData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between group">
                       <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">{item.name}</span>
                       </div>
                       <div className="text-right">
                          <span className="text-xs font-bold text-slate-800 block">{item.value}</span>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <button className="w-full mt-6 pt-4 border-t border-gray-50 text-xs font-bold text-emerald-600 flex items-center justify-center gap-2 hover:text-emerald-700 transition-all">
              View Full Pipeline <ArrowUpRight className="w-3 h-3" />
           </button>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white rounded-xl p-6 border border-gray-100  flex flex-col">
           <div className="flex items-center gap-2 mb-6">
              <Activity className="w-4 h-4 text-slate-600" />
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-tight">Conversion Rate</h3>
           </div>

           <div className="flex flex-col items-center justify-center flex-1 space-y-6">
              <div className="text-center">
                 <h2 className="text-4xl font-bold text-slate-800 leading-none mb-1">17.86%</h2>
                 <p className="text-xs font-semibold text-slate-600 uppercase">Lead Closure Rate</p>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full">
                 <div className="bg-slate-50 rounded-xl p-3 text-center border border-gray-100">
                    <span className="text-base font-bold text-slate-800 block mb-0.5">28</span>
                    <span className="text-xs font-semibold text-slate-600 uppercase">Total</span>
                 </div>
                 <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100/50">
                    <span className="text-base font-bold text-emerald-700 block mb-0.5">5</span>
                    <span className="text-xs font-semibold text-emerald-600 uppercase">Closed</span>
                 </div>
              </div>
           </div>

           <button className="w-full mt-6 pt-4 border-t border-gray-50 text-xs font-bold text-emerald-600 flex items-center justify-center gap-2 hover:text-emerald-700 transition-all">
              View Conversion Report <ArrowUpRight className="w-3 h-3" />
           </button>
        </div>

        {/* Subscription Plans */}
        <div className="bg-white rounded-xl p-6 border border-gray-100  flex flex-col">
           <div className="flex items-center gap-2 mb-6">
              <PieIcon className="w-4 h-4 text-slate-600" />
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-tight">Subscription Plans</h3>
           </div>

           <div className="flex-1 space-y-2">
              {subscriptionPlans.map((plan, i) => (
                 <div key={i} className="flex items-center justify-between group cursor-pointer p-2 rounded-xl hover:bg-gray-100 transition-all">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: plan.color }} />
                       <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">{plan.name}</span>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-semibold text-slate-800">{plan.vendors} vendors</p>
                    </div>
                 </div>
              ))}
           </div>

           <button className="w-full mt-6 pt-4 border-t border-gray-50 text-xs font-bold text-emerald-600 flex items-center justify-center gap-2 hover:text-emerald-700 transition-all">
              View All Plans <ArrowUpRight className="w-3 h-3" />
           </button>
        </div>
      </div>

      {/* Category Performance Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-8 border border-gray-100 flex flex-col shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <div>
                 <h3 className="text-[16px] font-bold text-slate-900 uppercase tracking-tight">Category Distribution</h3>
                 <p className="text-[11px] font-bold text-slate-600 mt-1 uppercase ">Market share by vendor count</p>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl">
                 <BarChart3 className="w-5 h-5 text-slate-600" />
              </div>
           </div>

           <div className="flex-1 w-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={categories.slice(0, 8).map(c => ({ name: c.name, vendors: c.vendorCount || 10 }))}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#475569' }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#475569' }}
                    />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ fontWeight: 800, color: '#1e293b' }}
                    />
                    <Bar dataKey="vendors" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white rounded-xl p-8 border border-gray-100 flex flex-col shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <div>
                 <h3 className="text-[16px] font-bold text-slate-900 uppercase tracking-tight">Performance Trend</h3>
                 <div className="mt-2 flex items-center gap-2">
                    <select 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-1.5 outline-none cursor-pointer uppercase  appearance-none"
                    >
                      <option value="All">All Categories</option>
                      {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                    </select>
                 </div>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl">
                 <TrendingUp className="w-5 h-5 text-slate-600" />
              </div>
           </div>

           <div className="flex-1 w-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#475569' }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#475569' }}
                    />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ fontWeight: 800, color: '#1e293b' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#f58220" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#f58220' }} 
                      activeDot={{ r: 6 }} 
                    />
                 </LineChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
}
