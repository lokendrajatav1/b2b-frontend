'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { 
  Users, 
  Store, 
  Box, 
  Send, 
  ShieldCheck, 
  Calendar, 
  ChevronDown, 
  CheckCircle2, 
  TrendingUp,
  BarChart2,
  Clock,
  Bell,
  Layers,
  UserCheck,
  Package,
  BookOpen,
  Undo2,
  Settings,
  Headset,
  ArrowUpRight,
  RefreshCcw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';

export default function SuperAdminDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('monthly');
  const [customRange, setCustomRange] = useState({ start: '', end: '' });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState('07:10 PM');

  useEffect(() => {
    fetchDashboardStats();
    fetchCategories();
    const now = new Date();
    setLastUpdated(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, [timeRange, selectedCategory]);

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
      setDashboardData(data.data || {});
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      
      {/* Title and Date Filter */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <h2 className="text-base font-bold text-[#111827] leading-none">Super Admin Control Hub</h2>
            <ShieldCheck size={16} className="text-green-500" />
          </div>
          <p className="text-xs text-gray-900 font-bold">
            Monitor platform health, verify applications, and track marketplace performance.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-3 py-1.5 shadow-sm">
            <Calendar size={14} className="text-gray-500" />
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-xs font-bold text-gray-900 outline-none bg-transparent cursor-pointer"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="weekly">Last 7 Days</option>
              <option value="monthly">Last 30 Days</option>
              <option value="yearly">Last 12 Months</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {timeRange === 'custom' && (
            <div className="flex items-center gap-2">
              <input 
                type="date" 
                className="bg-white border border-gray-300 rounded-lg px-2 py-1 text-xs font-bold"
                onChange={(e) => setCustomRange(prev => ({ ...prev, start: e.target.value }))}
              />
              <span className="text-xs font-bold text-gray-500">to</span>
              <input 
                type="date" 
                className="bg-white border border-gray-300 rounded-lg px-2 py-1 text-xs font-bold"
                onChange={(e) => setCustomRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
          )}

          <button 
            onClick={fetchDashboardStats}
            className="p-2.5 bg-white border border-gray-300 rounded-xl text-black hover:text-[#0D824D] hover:border-[#0D824D] transition-all shadow-sm"
            title="Refresh Data"
          >
            <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="PLATFORM USERS" 
          value={dashboardData?.summary?.totalUsers || '0'} 
          growth="+12.5%" 
          color="#0D824D" 
          icon={<Users size={24} />} 
          bg="#F0FDF4"
          delay={0}
        />
        <StatCard 
          label="VERIFIED VENDORS" 
          value={dashboardData?.summary?.totalVendors || '0'} 
          growth="+8.2%" 
          color="#EA580C" 
          icon={<Store size={24} />} 
          bg="#FFF7ED"
          delay={0.1}
        />
        <StatCard 
          label="VENDOR PRODUCTS" 
          value={dashboardData?.summary?.totalProducts || '0'} 
          growth="+15.3%" 
          color="#2563EB" 
          icon={<Box size={24} />} 
          bg="#EFF6FF"
          delay={0.2}
        />
        <StatCard 
          label="MARKET INQUIRIES" 
          value={dashboardData?.summary?.totalLeads || '0'} 
          growth="+9.7%" 
          color="#9333EA" 
          icon={<Send size={24} />} 
          bg="#FAF5FF"
          delay={0.3}
        />
      </div>

      {/* Main Grid: Revenue & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Chart Placeholder */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 p-6 ">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-sm text-gray-900 mb-0.5">Platform Revenue Growth</h3>
              <p className="text-xs text-gray-900 font-bold">Monthly subscription and listing revenues.</p>
            </div>
            <select className="bg-gray-50 border border-gray-200 text-xs font-bold rounded-lg px-2 py-1.5 outline-none">
              <option>Monthly View</option>
            </select>
          </div>
          
          <div className="flex flex-col md:flex-row gap-10">
            {/* Fake Graph Area */}
            <div className="flex-1 h-64 relative flex items-end justify-between px-2">
              <div className="absolute inset-0 border-b border-gray-200 flex flex-col justify-between text-sm text-black font-bold">
                <span>₹20L</span><span>₹15L</span><span>₹10L</span><span>₹5L</span><span>₹0</span>
              </div>
              <svg className="absolute bottom-0 left-0 w-full h-full" preserveAspectRatio="none">
                <path d="M0,200 L100,150 L200,140 L300,135 L400,100 L500,50 L600,60" fill="none" stroke="#0D824D" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="600" cy="60" r="6" fill="#0D824D" />
                <circle cx="600" cy="60" r="10" stroke="#0D824D" strokeWidth="2" fill="none" className="animate-ping" />
              </svg>
              {['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(m => <span key={m} className="text-sm font-bold text-black mt-6">{m}</span>)}
            </div>
            
            {/* Revenue Stats */}
            <div className="w-full md:w-56 space-y-4 border-l border-gray-200 pl-6">
              <div>
                <p className="text-xs font-bold text-black uppercase mb-0.5">Total Revenue</p>
                <p className="text-base font-bold text-black leading-none mb-1">₹{dashboardData?.summary?.totalRevenue?.toLocaleString() || '0'}</p>
                <p className="text-xs text-green-700 font-bold flex items-center gap-1">+16.4% <span className="text-gray-950 font-bold">vs last month</span></p>
              </div>
              <div>
                <p className="text-xs font-bold text-black uppercase mb-0.5">Subscription Revenue</p>
                <p className="text-sm font-bold text-black leading-none mb-1">₹11,20,430</p>
                <p className="text-xs text-green-700 font-bold">+12.6%</p>
              </div>
              <div>
                <p className="text-xs font-bold text-black uppercase mb-0.5">Listing Revenue</p>
                <p className="text-sm font-bold text-black leading-none mb-1">₹7,55,000</p>
                <p className="text-xs text-green-700 font-bold">+21.3%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 p-6  flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-sm text-gray-900">Platform Activity</h3>
            <button className="text-xs font-bold bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg">View All</button>
          </div>
          <div className="space-y-6 flex-1 overflow-y-auto max-h-[400px] no-scrollbar">
            {dashboardData?.recentLeads?.length > 0 ? dashboardData.recentLeads.slice(0,5).map((lead: any, i: number) => (
              <ActivityItem 
                key={i}
                title={`New inquiry for ${lead.productName || 'Product'}`} 
                sub={lead.buyerName || 'Unknown Buyer'} 
                time={new Date(lead.createdAt).toLocaleDateString()} 
              />
            )) : (
              <p className="text-xs text-black font-bold">No recent activity found.</p>
            )}
          </div>
          <button className="w-full mt-6 py-2.5 border border-dashed border-gray-300 rounded-xl text-xs font-bold text-black">
             Generate Activity Report
          </button>
        </div>
      </div>

      {/* Footer Row Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-[14px] text-gray-900 uppercase">Top Cities by Vendors</h4>
            <BarChart2 size={18} className="text-gray-400" />
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dashboardData?.trends?.topLocations || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 800, color: '#1e293b' }}
                />
                <Line type="monotone" dataKey="count" stroke="#EA580C" strokeWidth={3} dot={{ r: 4, fill: '#EA580C' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col gap-1">
              <h4 className="font-bold text-[14px] text-gray-900 uppercase">Category Performance</h4>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-[10px] font-bold text-gray-500 bg-gray-50 border-none outline-none rounded-md px-2 py-0.5"
              >
                <option value="All">All Categories</option>
                {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
              </select>
            </div>
            <TrendingUp size={18} className="text-gray-400" />
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={dashboardData?.trends?.revenueTrends || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D824D" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0D824D" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 800, color: '#1e293b' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0D824D" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 ">
          <h4 className="font-bold text-[14px] text-gray-900 uppercase mb-6">Verification Overview</h4>
          <div className="flex items-center gap-6">
             <div className="w-20 h-20 rounded-full border-[10px] border-green-500 border-r-orange-400 relative rotate-45 "></div>
             <div className="text-sm space-y-2">
               <div className="flex items-center gap-2 font-bold text-slate-700"><span className="w-3 h-3 bg-green-500 rounded-sm"></span> Verified ({dashboardData?.summary?.totalVendors || 0})</div>
               <div className="flex items-center gap-2 font-bold text-slate-700"><span className="w-3 h-3 bg-orange-400 rounded-sm"></span> Pending ({dashboardData?.summary?.pendingVendors || 0})</div>
             </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100  flex flex-col justify-center">
          <div className="flex justify-between mb-3">
             <h4 className="font-bold text-xs text-gray-900 uppercase">System Health</h4>
             <span className="text-xs font-bold text-[#0D824D] cursor-pointer hover:underline">Details</span>
          </div>
          <div className="space-y-3">
            <HealthBar label="Server API" percent="100%" color="bg-green-500" />
            <HealthBar label="Database Cluster" percent="100%" color="bg-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

const StatCard = ({ label, value, growth, color, icon, bg, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white p-8 rounded-[2.5rem] border border-gray-100  relative overflow-hidden group hover: transition-all"
  >
    <div className="flex items-center justify-between mb-3">
      <div style={{ backgroundColor: bg }} className="p-2.5 rounded-xl">
        {React.cloneElement(icon as React.ReactElement<any>, { size: 16, style: { color } })}
      </div>
      <div className="text-right">
        <p className="text-xs font-bold text-black uppercase mb-0.5">{label}</p>
        <p className="text-base font-bold text-black leading-none">{value}</p>
      </div>
    </div>
    <div className="flex items-center gap-1.5">
      <span style={{ color: color }} className="text-xs font-bold">{growth}</span>
      <span className="text-xs text-black font-bold uppercase tracking-tighter">vs last 30d</span>
    </div>
    {/* Animated Sparkline Style SVG */}
    <div className="mt-6 h-12 w-full overflow-hidden opacity-20">
        <svg viewBox="0 0 100 20" className="w-full h-full" preserveAspectRatio="none">
            <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: delay + 0.5 }}
                d="M0,15 Q15,5 30,12 T60,10 T100,5" 
                fill="none" 
                stroke={color} 
                strokeWidth="3" 
                strokeLinecap="round"
            />
        </svg>
    </div>
  </motion.div>
);

const ActivityItem = ({ title, sub, time }: any) => (
  <div className="flex items-start gap-4 group cursor-pointer border-b border-gray-50 pb-4 last:border-0 last:pb-0">
    <div className="flex-1">
      <p className="text-sm font-bold text-black leading-tight mb-1 group-hover:text-[#0D824D] transition-colors">{title}</p>
      <div className="flex items-center gap-2">
        <p className="text-xs text-gray-500 font-bold">{sub}</p>
        <span className="w-1 h-1 rounded-full bg-gray-300" />
        <span className="text-xs text-gray-400 font-bold uppercase">{time}</span>
      </div>
    </div>
  </div>
);

const FooterWidget = ({ title, value, subtitle, color }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100  hover: transition-all">
    <div className="flex justify-between mb-6">
        <h4 className="font-bold text-[14px] text-gray-900 uppercase leading-tight pr-4">{title}</h4>
        <ArrowUpRight size={18} className="text-gray-500 cursor-pointer hover:text-blue-500 transition-colors" />
    </div>
    <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
             <TrendingUp size={20} className="text-gray-500" />
        </div>
        <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
               <span className="text-xs font-bold text-gray-600 truncate max-w-[100px]">{subtitle || "Monthly Avg"}</span>
               <span className="text-xs font-bold text-gray-800">{value}</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `75%` }}
                   transition={{ duration: 1, delay: 0.5 }}
                   className={`h-full ${color}`} 
                />
            </div>
        </div>
    </div>
  </div>
);

const HealthBar = ({ label, percent, color }: any) => (
  <div>
    <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
      <span>{label}</span>
      <span className="text-[#0D824D]">{percent}</span>
    </div>
    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
      <motion.div 
         initial={{ width: 0 }}
         animate={{ width: percent }}
         transition={{ duration: 1, delay: 0.8 }}
         className={`h-full ${color}`} 
      />
    </div>
  </div>
);
