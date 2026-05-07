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
  Search,
  RefreshCcw,
  Info,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VendorRanking() {
  const [profile, setProfile] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, analyticsRes] = await Promise.all([
          apiFetch('/vendors/me'),
          apiFetch('/vendors/analytics')
        ]);
        setProfile(profileRes.data);
        setAnalytics(analyticsRes.data);
      } catch (error) {
        console.error('Failed to fetch ranking data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="p-12 space-y-8 animate-pulse">
       <div className="h-40 bg-gray-50 rounded-[2.5rem] w-full"></div>
       <div className="grid grid-cols-2 gap-8">
          <div className="h-96 bg-gray-50 rounded-[2.5rem]"></div>
          <div className="h-96 bg-gray-50 rounded-[2.5rem]"></div>
       </div>
    </div>
  );

  const scoreStats = [
    { 
      label: 'Total Score', 
      value: profile?.totalScore?.toFixed(1) || '0.0', 
      icon: Award, 
      color: '#164e33', 
      bg: '#f0f9f8',
      desc: 'Weighted algorithmic standing' 
    },
    { 
      label: 'Category Rank', 
      value: analytics?.categoryRank || 'N/A', 
      icon: Target, 
      color: '#f58220', 
      bg: '#fff7ed',
      desc: `Rank in ${profile?.categories?.[0]?.name || 'Category'}` 
    },
    { 
      label: 'Response Rate', 
      value: analytics?.responseRate || '100%', 
      icon: Zap, 
      color: '#164e33', 
      bg: '#f0f9f8',
      desc: 'Efficiency in lead handling' 
    },
    { 
      label: 'Trust Factor', 
      value: profile?.verified ? 'Platinum' : 'Standard', 
      icon: ShieldCheck, 
      color: '#f58220', 
      bg: '#fff7ed',
      desc: profile?.verified ? 'Verified Partner' : 'Verification Pending' 
    },
  ];

  const optimizationTasks = [
    { 
        title: 'Complete Verification', 
        desc: 'Verified vendors receive 2.5x more visibility in search results.', 
        status: profile?.verified, 
        impact: 'High' 
    },
    { 
        title: 'Keyword Optimization', 
        desc: 'Use high-intent search terms in your business keywords.', 
        status: (profile?.keywords?.length || 0) >= 5, 
        impact: 'Medium' 
    },
    { 
        title: 'Catalogue Richness', 
        desc: 'Add detailed descriptions and multiple images to all offerings.', 
        status: (profile?.products?.length || 0) >= 4, 
        impact: 'High' 
    },
    { 
        title: 'Profile Completion', 
        desc: 'Ensure your business address, working hours, and logo are set.', 
        status: (analytics?.profileCompleteness || 0) >= 80, 
        impact: 'Ultra' 
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-simple-fade pb-24 px-4 lg:px-8">
      {/* Dynamic Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-gray-100">
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-700 font-bold uppercase text-xs mb-1">
               <Sparkles className="w-4 h-4" /> Growth Engine v2.0
            </div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-4">
               Business Performance Analytics
               <div className="p-2 bg-[#164e33]/5 text-[#164e33] rounded-xl border border-[#164e33]/10 ">
                  <TrendingUp className="w-6 h-6" />
               </div>
            </h1>
            <p className="text-slate-700 font-medium text-base max-w-2xl leading-relaxed">
               Strategic insights to optimize your marketplace ranking and accelerate your lead conversion cycle.
            </p>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="px-6 py-3 bg-white text-slate-600 rounded-xl text-sm font-bold border border-slate-200 flex items-center gap-3 uppercase ">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                Live Indexing
            </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {scoreStats.map((stat, i) => (
             <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 border border-gray-100  hover:border-[#164e33]/20 transition-all hover: group rounded-2xl relative overflow-hidden"
             >
                <div className="w-14 h-14 flex items-center justify-center mb-6 border transition-all group-hover:scale-105 rounded-xl relative z-10"
                     style={{ backgroundColor: stat.bg, color: stat.color, borderColor: `${stat.color}15` }}
                >
                   <stat.icon className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-600 uppercase mb-2 relative z-10">{stat.label}</p>
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight relative z-10">{stat.value}</h2>
                <p className="text-sm font-medium text-slate-700 mt-4 leading-relaxed relative z-10">{stat.desc}</p>
             </motion.div>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Optimization Matrix */}
          <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-gray-100 overflow-hidden  rounded-2xl">
                  <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                     <div>
                        <h3 className="text-base font-bold text-slate-900 uppercase">Growth Acceleration Matrix</h3>
                        <p className="text-sm font-medium text-slate-700 mt-1">High-impact tasks to boost your visibility score</p>
                     </div>
                     <span className="text-xs font-bold text-slate-700 bg-slate-50 px-4 py-2 border border-slate-200 uppercase rounded-full">Rank Accelerator</span>
                  </div>
                  
                  <div className="divide-y divide-gray-50">
                      {optimizationTasks.map((task, idx) => (
                         <div key={idx} className="p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-8 hover:bg-gray-50/30 transition-colors group">
                            <div className="space-y-4 flex-1">
                               <div className="flex items-center flex-wrap gap-4">
                                  <div className={`p-2.5 rounded-xl border ${task.status ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                                     {task.status ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                  </div>
                                  <h4 className="text-base font-bold text-slate-900">{task.title}</h4>
                                  <span className={`text-xs font-bold px-3 py-1 rounded-full border uppercase ${task.impact === 'High' || task.impact === 'Ultra' ? 'bg-[#164e33] text-white border-[#164e33]' : 'bg-gray-100 text-slate-600 border-gray-200'}`}>
                                     {task.impact} IMPACT
                                  </span>
                               </div>
                               <p className="text-sm font-medium text-slate-600 max-w-xl leading-relaxed">{task.desc}</p>
                            </div>
                            
                            {!task.status ? (
                               <button className="px-6 py-3 bg-[#164e33] text-white rounded-xl text-sm font-bold uppercase  -[#164e33]/10 hover:bg-[#113f29] transition-all whitespace-nowrap">
                                  Action Required
                               </button>
                            ) : (
                               <div className="px-6 py-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold uppercase border border-emerald-100 whitespace-nowrap">
                                  Optimal Status
                               </div>
                            )}
                         </div>
                      ))}
                  </div>
              </div>
          </div>

          {/* Algorithm Context Sidebar */}
          <div className="space-y-10">
              {/* Search Visibility Analytics */}
              <div className="bg-white p-10 border border-gray-100 relative overflow-hidden  rounded-2xl group">
                 <div className="relative z-10 space-y-8">
                    <div className="w-14 h-14 bg-slate-50 flex items-center justify-center text-slate-900 rounded-xl border border-slate-200">
                       <BarChart3 className="w-8 h-8" />
                    </div>
                    
                    <div className="space-y-4">
                       <h3 className="text-lg font-bold text-slate-900 uppercase">Visibility Pulse</h3>
                       <p className="text-slate-700 text-sm font-semibold leading-relaxed">
                          Your brand appeared in <span className="text-slate-900 font-bold">{analytics?.searchAppearances?.toLocaleString() || '0'}</span> intent-driven searches with a <span className="text-[#164e33] font-bold">{analytics?.ctr || '0.0%'}</span> engagement velocity.
                       </p>
                    </div>
                    
                    <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                       <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-600 uppercase mb-1">Algorithmic Standing</span>
                          <span className="text-2xl font-bold text-slate-900">{(profile?.totalScore || 0).toFixed(1)}<span className="text-sm text-slate-600 font-bold ml-1">/100</span></span>
                       </div>
                       <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 border border-slate-200">
                          <ArrowUpRight className="w-6 h-6" />
                       </div>
                    </div>
                 </div>
              </div>

              {/* Engine Logic - Grey Theme */}
              <div className="bg-slate-50 p-10 border border-slate-200 text-slate-900 rounded-2xl relative overflow-hidden">
                 <div className="relative z-10 space-y-8">
                    <div className="w-14 h-14 bg-white flex items-center justify-center text-slate-900 shrink-0 rounded-xl border border-slate-200 ">
                       <Info className="w-7 h-7" />
                    </div>
                    <div className="space-y-4">
                       <h4 className="text-base font-bold uppercase">Ranking Protocol</h4>
                       <p className="text-slate-600 text-sm font-semibold leading-relaxed">
                          The India B2B engine prioritizes Verification Status, Response Velocity, and Data Depth. Complete high-impact tasks to secure top-tier visibility.
                       </p>
                    </div>
                    <button className="w-full py-4 bg-white text-slate-900 rounded-xl font-bold text-sm uppercase border border-slate-200 hover:bg-slate-100 transition-colors ">
                       Full Protocol View
                    </button>
                 </div>
              </div>
          </div>
      </div>
    </div>



  );
}




