'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';
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
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';


export default function SuperAdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all');
  const [revenueData, setRevenueData] = useState<any>([]);
  const [trendData, setTrendData] = useState([{ name: 'Open', value: 10 }]);
  const [pieData, setPieData] = useState([{ name: 'New', value: 1, color: '#e5e7eb' }]);

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

      if (data.data?.trends?.revenueTrends) {
        setRevenueData(data.data.trends.revenueTrends);
      }

      const topLocations = data.data?.trends?.topLocations;
      if (topLocations && topLocations.length > 0) {
         setTrendData(topLocations.map((item: any) => ({
            name: item.city || item.name,
            value: item.count || item.queries
         })));
      }

      const statusMap = summary.leadsByStatus;
       if (statusMap && statusMap.length > 0) {
         const colors = ['#164e33', '#f58220', '#10b981', '#3b82f6'];
         setPieData(statusMap.map((item: any, idx: number) => ({
            name: item.status,
            value: item._count.id,
            color: colors[idx % colors.length]
         })));
      }
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
    <div className="max-w-7xl mx-auto space-y-12 animate-simple-fade pb-24 px-4 lg:px-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 pb-8 border-b border-gray-100">
        <div className="space-y-3">
           <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-4">
             Super Admin Control Hub
             <div className="p-2 bg-gray-50 text-slate-500 rounded-2xl border border-gray-200">
                <ShieldAlert className="w-7 h-7" />
             </div>
           </h1>
           <p className="text-slate-600 font-medium text-lg leading-relaxed max-w-3xl">Oversee platform health, verify new applications, and monitor marketplace signals in real-time.</p>
        </div>

        <div className="flex items-center gap-4">
           <select 
             value={timeRange} 
             onChange={(e) => setTimeRange(e.target.value)}
             className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-base font-bold text-slate-800 outline-none focus:border-[#164e33] cursor-pointer shadow-sm"
           >
             <option value="all">All Time</option>
             <option value="yearly">This Year</option>
             <option value="monthly">This Month</option>
             <option value="weekly">This Week</option>
           </select>
           <div className="bg-emerald-50 px-5 py-3 rounded-xl border border-emerald-100 flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold text-emerald-700 uppercase tracking-wider hidden sm:inline-block">System Operational</span>
           </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {dashboardCards.map((card, idx) => (
          <motion.div 
            key={card.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group bg-white p-7 rounded-[2rem] border border-gray-100 hover:border-[#164e33]/20 transition-all hover:shadow-xl shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className={`p-3.5 rounded-2xl ${
                  card.color === 'blue' ? 'bg-[#164e33]/5 text-[#164e33]' :
                  card.color === 'emerald' ? 'bg-[#f58220]/5 text-[#f58220]' :
                  card.color === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-[#164e33]/5 text-[#164e33]'
                }`}>
                  <card.icon className="w-6 h-6" />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{card.label}</p>
                <h3 className="text-4xl font-bold text-slate-800 tabular-nums">{loading ? '...' : card.value}</h3>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-gray-50 flex items-center">
               <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${
                card.color === 'blue' ? 'bg-[#164e33]/10 text-[#164e33]' :
                card.color === 'emerald' ? 'bg-[#f58220]/10 text-[#f58220]' :
                card.color === 'amber' ? 'bg-amber-50 text-amber-700' : 'bg-[#164e33]/5 text-[#164e33]'
              }`}>{card.growth}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-7xl mx-auto">
         {/* System Infrastructure Insights */}
         <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 p-10 shadow-sm">
            <div className="flex items-center justify-between mb-0 pb-6 border-b border-gray-50">
               <div className="flex items-center gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 leading-none">Platform Revenue Growth</h3>
                    <p className="text-base font-medium text-slate-500 mt-2">Monthly subscription and listing revenues.</p>
                  </div>
               </div>
               <button onClick={fetchDashboardStats} className="p-2.5 text-slate-400 hover:text-[#164e33] hover:bg-[#164e33]/5 rounded-xl transition-all">
                  <RefreshCcw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
               </button>
            </div>

            {/* Super Admin Chart Addition */}
            <div className="pt-8 pb-8 border-b border-gray-50">
               <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={revenueData} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#164e33" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#164e33" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 14, fontWeight: 600 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 14, fontWeight: 600 }} tickFormatter={(val) => `₹${val/1000}k`} />
                        <Tooltip 
                           cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                           contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                           formatter={(value) => [`₹${value}`, 'Revenue']}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#164e33" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="flex items-center justify-between mb-6 mt-10">
               <h3 className="text-xl font-bold text-slate-900 leading-none">Marketplace Hub Activity</h3>
            </div>

            <div className="space-y-4">
                {stats?.recentLeads?.length > 0 ? stats.recentLeads.map((lead: any) => (
                  <div key={lead.id} className="flex items-center justify-between p-6 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all group">
                    <div className="flex items-center gap-5">
                      <div>
                        <p className="text-lg font-bold text-slate-900 leading-none">
                           {lead.searchKeyword ? `Demand for "${lead.searchKeyword}"` : `Requirement from ${lead.buyerName}`}
                        </p>
                        <p className="text-base font-semibold text-slate-500 mt-2 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" /> 
                          {lead.vendor?.businessName ? `Assigned to ${lead.vendor.businessName}` : 'Global Distribution'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-lg font-bold text-slate-900">{lead.city}</p>
                       <p className="text-sm font-bold text-slate-400 uppercase mt-1">{new Date(lead.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                )) : (
                  <div className="py-24 text-center space-y-6 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                     <Target className="w-16 h-16 text-gray-200 mx-auto" />
                     <p className="text-lg font-bold text-slate-500">Waiting for live marketplace signals...</p>
                  </div>
                )}
            </div>
         </div>

         {/* Shortcuts / Quick Actions */}
         <div className="lg:col-span-4 space-y-8">
            <div className="bg-[#f0f9f8] border border-[#164e33]/10 rounded-[2.5rem] p-10 relative overflow-hidden shadow-sm group">
               <div className="absolute top-0 right-0 p-12 opacity-[0.03] text-[#164e33] transform translate-x-4 -translate-y-4 transition-transform group-hover:translate-x-2 group-hover:-translate-y-2">
                  <Megaphone className="w-32 h-32" />
               </div>
               <div className="relative z-10 space-y-6">
                  <h3 className="text-2xl font-bold text-[#164e33] leading-tight pr-12">Broadcast platform updates instantly.</h3>
                  <p className="text-base text-[#164e33]/70 leading-relaxed font-semibold">Reach every vendor and buyer in the ecosystem with one click.</p>
                  <button className="flex items-center gap-3 px-6 py-3.5 bg-[#164e33] hover:bg-[#113f29] text-white rounded-xl font-bold text-sm uppercase shadow-lg shadow-[#164e33]/20 transition-all group/btn">
                    Go to Broadcast Hub
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
               </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
               <h3 className="text-sm font-bold text-slate-400 uppercase mb-8 flex items-center justify-between gap-2">
                 <div className="flex items-center gap-2">
                   <ShieldAlert className="w-5 h-5 text-amber-500" /> Administrative To-Do
                 </div>
                 <span className="px-2 py-1 bg-gray-50 text-slate-400 text-[10px] font-bold rounded uppercase">Action Required</span>
               </h3>
               <div className="space-y-4">
                  {[
                    { label: `Verify ${stats?.pendingVendors || 0} new vendors`, urgency: 'High', count: stats?.pendingVendors, href: '/super-admin/vendor-approvals' },
                    { label: `Moderate ${stats?.pendingOfferings || 0} catalogue items`, urgency: 'High', count: stats?.pendingOfferings, href: '/super-admin/offering-approvals' },
                    { label: 'Platform performance audit', urgency: 'Medium', count: 1, href: '/super-admin/analytics' }
                  ].filter(t => (t.count && t.count > 0) || t.urgency === 'Medium').map((todo, idx) => (
                    <div 
                      key={idx}
                      onClick={() => router.push(todo.href)}
                      className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 hover:border-[#164e33]/20 hover:bg-[#164e33]/5 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-6 h-6 rounded-lg border-2 border-gray-100 group-hover:border-[#164e33] group-hover:bg-[#164e33]/10 transition-all flex items-center justify-center shrink-0">
                           <ArrowRight className="w-3.5 h-3.5 text-transparent group-hover:text-[#164e33] transition-all" />
                        </div>
                        <span className="text-base font-bold text-slate-700 leading-tight">{todo.label}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${todo.urgency === 'High' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-amber-50 text-amber-600 border-amber-100'} ${todo.urgency === 'High' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                          {todo.urgency}
                        </span>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Shifted Charts block */}
            <div className="bg-white rounded-2xl border border-gray-100 p-10 shadow-sm space-y-10">
               <div className="h-64 w-full">
                  <h4 className="text-xs font-bold text-slate-400 mb-6 uppercase">Top Regions (Demand)</h4>
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={trendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#94a3b8', fontWeight: 600 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#94a3b8', fontWeight: 600 }} />
                        <Tooltip cursor={{ fill: 'transparent' }} />
                        <Bar dataKey="value" fill="#f58220" barSize={36} radius={[6, 6, 0, 0]} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
               
               <div className="h-80 w-full relative flex flex-col items-center pt-10 border-t border-gray-50 mt-4">
                  <h4 className="text-xs font-bold self-start text-slate-400 mb-4 uppercase w-full">Leads by Status</h4>
                  <div className="flex-1 w-full min-h-[180px]">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                           <Pie
                             data={pieData}
                             cx="50%"
                             cy="50%"
                             innerRadius={50}
                             outerRadius={75}
                             paddingAngle={3}
                             dataKey="value"
                           >
                             {pieData.map((entry: any, index: number) => (
                               <Cell key={`cell-${index}`} fill={entry.color} />
                             ))}
                           </Pie>
                           <Tooltip />
                        </PieChart>
                     </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
                     {pieData.map((item: any) => (
                       <div key={item.name} className="flex items-center gap-2">
                         <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                         <span className="text-xs font-bold text-slate-500">{item.name}</span>
                       </div>
                     ))}
                   </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
