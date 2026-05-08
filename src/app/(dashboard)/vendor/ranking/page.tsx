'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { 
  TrendingUp, 
  Award, 
  Target, 
  Zap, 
  Activity, 
  ShieldCheck, 
  BarChart3, 
  ArrowUpRight, 
  Star,
  Users,
  CheckCircle2,
  Clock,
  Info,
  ChevronRight,
  UserCircle2,
  Package,
  Wallet,
  Settings,
  Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, LineChart, Line
} from 'recharts';

// --- SparkLine Component ---
const SparkLine = ({ data, color }: { data: any[]; color: string }) => (
  <div className="h-8 w-20">
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

export default function VendorPerformance() {
  const [profile, setProfile] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock Spark Data
  const sparkData = [
    { value: 10 }, { value: 25 }, { value: 15 }, { value: 30 }, { value: 20 }, { value: 35 }
  ];

  // Mock Visibility Pulse Data
  const visibilityData = [
    { name: 'May 10', value: 25 },
    { name: 'May 12', value: 45 },
    { name: 'May 14', value: 35 },
    { name: 'May 16', value: 50 },
    { name: 'May 18', value: 42 },
  ];

  // Performance Overview Data
  const performanceData = [
    { name: 'Mon', r: 80, t: 24, l: 10 },
    { name: 'Tue', r: 90, t: 20, l: 15 },
    { name: 'Wed', r: 100, t: 18, l: 20 },
    { name: 'Thu', r: 95, t: 22, l: 18 },
    { name: 'Fri', r: 100, t: 24, l: 25 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileRes, analyticsRes] = await Promise.all([
          apiFetch('/vendors/me'),
          apiFetch('/vendors/analytics')
        ]);
        setProfile(profileRes.data);
        setAnalytics(analyticsRes.data);
      } catch (error) {
        console.error('Performance fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin"></div>
    </div>
  );

  const kpis = [
    { label: 'TOTAL SCORE', value: profile?.totalScore?.toFixed(1) || '0.2', sub: 'Weighted algorithmic standing', icon: Award, color: '#10b981', bg: 'bg-emerald-50' },
    { label: 'CATEGORY RANK', value: `#${analytics?.categoryRank || '7'}`, sub: `Rank in ${profile?.categories?.[0]?.name || 'Products'}`, icon: Target, color: '#f58220', bg: 'bg-orange-50' },
    { label: 'RESPONSE RATE', value: analytics?.responseRate || '100%', sub: 'Efficiency in lead handling', icon: Zap, color: '#3b82f6', bg: 'bg-blue-50' },
    { label: 'TRUST FACTOR', value: profile?.verified ? 'Platinum' : 'Verified', sub: 'Verified Partner', icon: ShieldCheck, color: '#8b5cf6', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 flex items-center justify-between group hover: shadow-sm transition-all">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                 <div className={`w-8 h-8 ${kpi.bg} rounded-lg flex items-center justify-center`} style={{ color: kpi.color }}>
                    <kpi.icon size={16} />
                 </div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{kpi.label}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 leading-none mb-1">{kpi.value}</h3>
              <p className="text-[10px] font-medium text-slate-400 truncate">{kpi.sub}</p>
            </div>
            <SparkLine data={sparkData} color={kpi.color} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Matrix & Overview */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Growth Acceleration Matrix */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
             <div className="flex items-center justify-between mb-6">
                <div>
                   <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">GROWTH ACCELERATION MATRIX</h3>
                   <p className="text-[11px] font-medium text-slate-400">High-impact tasks to boost your visibility score</p>
                </div>
                <button className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 uppercase">Rank Accelerator</button>
             </div>

             <div className="space-y-4">
                {[
                  { label: 'Complete Verification', sub: 'Verified vendors receive 2.5x more visibility in search results.', impact: 'HIGH IMPACT', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50', status: 'Optimal Status', sColor: 'text-emerald-700', sBg: 'bg-emerald-50' },
                  { label: 'Keyword Optimization', sub: 'Add trending keywords to improve product discoverability.', impact: 'MEDIUM IMPACT', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50', status: 'Action Required', sColor: 'text-orange-700', sBg: 'bg-orange-50' },
                  { label: 'Product Enrichment', sub: 'Add detailed specifications to build trust and rank higher.', impact: 'LOW IMPACT', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-50', status: 'Start Now', sColor: 'text-blue-700', sBg: 'bg-blue-50' },
                ].map((task, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-gray-50 rounded-xl group hover:bg-gray-50/50 transition-all cursor-pointer">
                     <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 ${task.bg} ${task.color} rounded-xl flex items-center justify-center border border-current opacity-20`}>
                           <task.icon size={20} className="opacity-100" />
                        </div>
                        <div className="w-10 h-10 absolute flex items-center justify-center">
                           <task.icon size={20} className={`${task.color}`} />
                        </div>
                        <div>
                           <div className="flex items-center gap-2 mb-0.5">
                              <h4 className="text-sm font-bold text-slate-800">{task.label}</h4>
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${i === 0 ? 'bg-emerald-100 text-emerald-700' : i === 1 ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>{task.impact}</span>
                           </div>
                           <p className="text-[11px] font-medium text-slate-400">{task.sub}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className={`hidden md:flex items-center gap-1.5 px-4 py-2 ${task.sBg} ${task.sColor} border border-current/10 rounded-xl text-[10px] font-bold uppercase`}>
                           {i === 0 ? <CheckCircle2 size={12} /> : i === 1 ? <Clock size={12} /> : <Zap size={12} />}
                           {task.status}
                        </div>
                        <ChevronRight size={16} className="text-slate-300" />
                     </div>
                  </div>
                ))}
             </div>
             
             <button className="w-full mt-6 text-xs font-bold text-emerald-700 flex items-center justify-center gap-1.5 hover:underline transition-all">
                See All Recommendations <ArrowUpRight size={14} />
             </button>
          </div>

          {/* Performance Overview */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">PERFORMANCE OVERVIEW</h3>
                <div className="text-[10px] font-bold text-slate-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 uppercase flex items-center gap-2 cursor-pointer">
                   Last 6 Months <ChevronRight size={10} className="rotate-90" />
                </div>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Response Rate', value: '100%', trend: '+ 8.5%', tColor: 'text-emerald-500' },
                  { label: 'Avg. Response Time', value: '24h', trend: '↓ 2h', tColor: 'text-emerald-500' },
                  { label: 'Total Leads', value: '15+', trend: '↑ 5', tColor: 'text-emerald-500' },
                  { label: 'Customer Rating', value: '4.8/5', trend: '↑ 0.3', tColor: 'text-emerald-500' },
                ].map((stat, i) => (
                  <div key={i}>
                     <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{stat.label}</p>
                     <div className="flex items-end gap-2">
                        <span className="text-lg font-bold text-slate-900 leading-none">{stat.value}</span>
                        <span className={`text-[10px] font-bold ${stat.tColor}`}>{stat.trend}</span>
                     </div>
                  </div>
                ))}
             </div>

             <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={performanceData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        labelStyle={{ fontWeight: 800, color: '#1e293b' }}
                      />
                      <Bar dataKey="r" fill="#164e33" radius={[4, 4, 0, 0]} barSize={12} />
                      <Bar dataKey="l" fill="#10b981" radius={[4, 4, 0, 0]} barSize={12} />
                      <Bar dataKey="t" fill="#f1f5f9" radius={[4, 4, 0, 0]} barSize={12} />
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

        </div>

        {/* Right: Visibility & Activity */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Visibility Pulse */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                      <BarChart3 size={16} />
                   </div>
                   <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">VISIBILITY PULSE</h3>
                </div>
                <span className="text-[10px] font-bold text-slate-400">Last 7 Days</span>
             </div>

             <p className="text-[11px] font-medium text-slate-400 leading-relaxed mb-4">
                Your brand appeared in <span className="text-slate-900 font-bold">42</span> intent-driven searches with a <span className="text-emerald-600 font-bold">4.0%</span> engagement velocity.
             </p>

             <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-[10px] mb-6">
                <ArrowUpRight size={14} /> 12.5%
             </div>

             <div className="h-40 w-full mb-6">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={visibilityData}>
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#10b981" 
                        strokeWidth={2} 
                        dot={{ r: 4, fill: '#10b981' }} 
                        activeDot={{ r: 6 }} 
                      />
                      <XAxis dataKey="name" hide />
                      <YAxis hide />
                      <Tooltip />
                   </LineChart>
                </ResponsiveContainer>
                <div className="flex justify-between mt-2 text-[8px] font-bold text-slate-400 uppercase px-1">
                   <span>May 10</span>
                   <span>May 12</span>
                   <span>May 14</span>
                   <span>May 16</span>
                </div>
             </div>

             <div className="pt-6 border-t border-gray-50">
                <div className="flex items-center justify-between mb-2">
                   <p className="text-[10px] font-bold text-slate-400 uppercase">ALGORITHMIC STANDING</p>
                   <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-slate-400 cursor-pointer hover:text-emerald-600 transition-colors">
                      <ArrowUpRight size={16} />
                   </div>
                </div>
                <div className="flex items-end gap-1.5 mb-2">
                   <span className="text-xl font-bold text-slate-900">0.2</span>
                   <span className="text-xs font-bold text-slate-400 pb-0.5">/100</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500" style={{ width: '20%' }}></div>
                </div>
             </div>
          </div>

          {/* Recent Activity (Compact) */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">RECENT ACTIVITY</h3>
                <button className="text-[10px] font-bold text-slate-400 border border-gray-100 px-3 py-1 rounded-lg hover:bg-gray-50 transition-all uppercase">View All</button>
             </div>

             <div className="space-y-6">
                {[
                  { user: 'R', title: 'New lead received from Indore', sub: 'Housekeeping', time: '2h ago', color: 'bg-purple-100 text-purple-700' },
                  { user: 'P', title: 'Parul Garg replied to your lead', sub: 'Housekeeping', time: '5h ago', color: 'bg-blue-100 text-blue-700' },
                  { user: 'S', title: 'Your profile was viewed', sub: 'By Shubham Enterprises', time: '1d ago', color: 'bg-emerald-100 text-emerald-700' },
                ].map((act, i) => (
                  <div key={i} className="flex items-start gap-3 relative">
                     <div className={`w-8 h-8 ${act.color} rounded-full flex items-center justify-center text-[10px] font-bold shrink-0`}>
                        {act.user}
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-slate-900 leading-tight mb-0.5 truncate">{act.title}</p>
                        <p className="text-[10px] font-medium text-slate-400">{act.sub}</p>
                     </div>
                     <div className="flex items-center gap-1.5 shrink-0 pt-1">
                        <span className="text-[9px] font-bold text-slate-400">{act.time}</span>
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
             <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight mb-6">QUICK ACTIONS</h3>
             <div className="space-y-2">
                {[
                  { label: 'Edit Business Profile', sub: 'Update your business details', icon: UserCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'Manage Products', sub: 'Add or update your products', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'View Leads', sub: 'Check and respond to leads', icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                  { label: 'Billing & Invoices', sub: 'View your invoices and payments', icon: Wallet, color: 'text-slate-600', bg: 'bg-slate-50' },
                ].map((action, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-gray-50 rounded-xl hover:bg-gray-50 transition-all cursor-pointer group">
                     <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${action.bg} ${action.color} rounded-lg flex items-center justify-center`}>
                           <action.icon size={16} />
                        </div>
                        <div>
                           <h4 className="text-[11px] font-bold text-slate-800 leading-none mb-1">{action.label}</h4>
                           <p className="text-[9px] font-medium text-slate-400">{action.sub}</p>
                        </div>
                     </div>
                     <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
                  </div>
                ))}
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}
