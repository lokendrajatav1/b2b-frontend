'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  Target, 
  Zap, 
  ArrowUpRight, 
  Clock, 
  Activity,
  CheckCircle2,
  AlertCircle,
  Megaphone,
  LayoutGrid,
  RefreshCcw,
  BarChart4,
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminAnalytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await apiFetch(`/admin/analytics?timeframe=${timeframe}`);
      setData(data.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-simple-fade pb-20 p-2 md:p-0">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 max-w-7xl mx-auto">
        <div>
           <h1 className="text-2xl font-semibold text-gray-900 tracking-tight flex items-center gap-3">
             Platform Intelligence
             <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                <BarChart4 className="w-5 h-5" />
             </div>
           </h1>
           <p className="text-gray-500 font-medium mt-1 text-sm">Deep dive into market dynamics, conversion funnels, and infrastructure performance.</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="flex p-1 bg-gray-100 rounded-xl">
             {['7d', '30d', '90d'].map((t) => (
               <button 
                 key={t}
                 onClick={() => setTimeframe(t)}
                 className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${timeframe === t ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
               >
                 {t}
               </button>
             ))}
           </div>
           <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm">
              <Download className="w-4 h-4" />
           </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Core Metrics Grid */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Verified Partners', value: data?.summary?.totalVendors || 0, growth: `${data?.summary?.pendingVendors || 0} Pending`, icon: Users, color: 'blue' },
              { label: 'Market Revenue', value: `₹${(data?.summary?.totalRevenue / 100000).toFixed(1)}L`, growth: 'Total Hub', icon: Zap, color: 'indigo' },
              { label: 'Total Inquiries', value: data?.summary?.totalLeads || 0, growth: 'Direct Demand', icon: Target, color: 'amber' },
              { label: 'Active Pipeline', value: data?.summary?.leadsByStatus?.find((s:any) => s.status === 'PENDING')?._count?.id || 0, growth: 'Open Leads', icon: Activity, color: 'emerald' }
            ].map((card, idx) => (
              <motion.div 
                key={card.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${card.color === 'blue' ? 'bg-blue-50 text-blue-600' : card.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' : card.color === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    <card.icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-widest leading-none">
                     {card.growth}
                  </div>
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{card.label}</p>
                <h3 className="text-2xl font-black text-gray-900 mt-2 tracking-tight group-hover:text-blue-600 transition-colors tabular-nums">{card.value}</h3>
              </motion.div>
            ))}
         </div>

        {/* Charts & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-8 bg-white rounded-4xl border border-gray-100 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-50">
                 <div>
                    <h3 className="text-lg font-semibold text-gray-900 tracking-tight leading-none">Engagement Trends</h3>
                    <p className="text-sm font-medium text-gray-500 mt-2">Aggregated user activity across all marketplace touchpoints.</p>
                 </div>
                 <button className="flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">
                    View Full Feed <ArrowUpRight className="w-3.5 h-3.5" />
                 </button>
              </div>

              <div className="h-80 flex flex-col justify-end gap-2">
                 <div className="flex items-end justify-between h-64 gap-3 px-4">
                    {[45, 60, 40, 75, 55, 90, 70, 85, 50, 40, 65, 80].map((h, i) => (
                       <div key={i} className="flex-1 space-y-2 group flex flex-col items-center">
                          <div 
                             className="w-full bg-gray-50 rounded-lg group-hover:bg-blue-500 transition-all cursor-pointer relative"
                             style={{ height: `${h}%` }}
                          >
                             <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                {h * 12}
                             </div>
                          </div>
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{i + 1}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="lg:col-span-4 space-y-6">
              <div className="bg-indigo-600 rounded-4xl p-8 text-white shadow-xl relative overflow-hidden group">
                 <div className="absolute -right-4 -top-4 opacity-10 transform scale-150 group-hover:scale-125 transition-transform">
                    <TrendingUp className="w-32 h-32" />
                 </div>
                 <div className="relative z-10 space-y-4">
                    <h3 className="text-xl font-semibold leading-tight pr-6">Performance is consistently nominal.</h3>
                    <p className="text-sm text-indigo-100 leading-relaxed font-medium">All platform benchmarks are currently within expected ranges. No critical action required.</p>
                    <div className="pt-2">
                       <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest backdrop-blur-sm transition-all">
                          Global Status Report
                       </button>
                    </div>
                 </div>
              </div>

               <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Opportunity Hotspots</h4>
                  <div className="space-y-5">
                     {data?.trends?.topLocations?.length > 0 ? data.trends.topLocations.map((loc: any) => (
                       <div key={loc.name} className="space-y-2">
                          <div className="flex items-center justify-between text-xs font-semibold">
                             <span className="text-gray-900 capitalize">{loc.name}</span>
                             <span className="text-blue-600 uppercase tracking-tight tabular-nums">{loc.count} Leads</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                             <div className="h-full bg-blue-500" style={{ width: `${(loc.count / (data.summary.totalLeads || 1)) * 100}%` }}></div>
                          </div>
                       </div>
                     )) : (
                       <p className="text-[10px] font-bold text-gray-400 text-center py-4">No regional data yet</p>
                     )}
                  </div>
               </div>

               <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Keyword Dominance</h4>
                  <div className="flex flex-wrap gap-2">
                     {data?.trends?.topKeywords?.length > 0 ? data.trends.topKeywords.map((kw: any) => (
                       <div key={kw.name} className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-xl text-[10px] font-bold text-indigo-700 uppercase tracking-tight">
                          #{kw.name} <span className="ml-1 opacity-50 tabular-nums">({kw.count})</span>
                       </div>
                     )) : (
                        <p className="text-[10px] font-bold text-gray-400 text-center py-4 w-full">No keywords indexed</p>
                     )}
                  </div>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
}
