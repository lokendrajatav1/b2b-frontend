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
      color: '#007367', 
      bg: '#f0f9f8',
      desc: 'Weighted algorithmic standing' 
    },
    { 
      label: 'Category Rank', 
      value: analytics?.categoryRank || 'N/A', 
      icon: Target, 
      color: '#e88c30', 
      bg: '#fff7ed',
      desc: `Rank in ${profile?.categories?.[0]?.name || 'Category'}` 
    },
    { 
      label: 'Response Rate', 
      value: analytics?.responseRate || '100%', 
      icon: Zap, 
      color: '#007367', 
      bg: '#f0f9f8',
      desc: 'Efficiency in lead handling' 
    },
    { 
      label: 'Trust Factor', 
      value: profile?.verified ? 'Platinum' : 'Standard', 
      icon: ShieldCheck, 
      color: '#e88c30', 
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
    <div className="space-y-8 animate-simple-fade pb-20 p-2 md:p-0 font-medium">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[#e88c30] font-semibold uppercase  text-base mb-1">
               <Sparkles className="w-3 h-3" /> ALGORITHMIC INSIGHTS
            </div>
            <h1 className="text-2xl font-semibold text-slate-900  flex items-center gap-3">
               Performance Index
               <div className="p-1.5 bg-[#007367]/5 text-[#007367] rounded-none border border-[#007367]/10">
                  <TrendingUp className="w-5 h-5" />
               </div>
            </h1>
            <p className="text-slate-700 font-medium text-base italic">Analyze your marketplace traction and optimize your business standing.</p>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-[#007367]/5 text-[#007367] rounded-none text-base font-semibold border border-[#007367]/10 flex items-center gap-2 uppercase ">
                <Activity className="w-3.5 h-3.5" />
                Live Indexing
            </div>
        </div>
      </div>

      {/* Core Ranking Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {scoreStats.map((stat, i) => (
             <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 border border-gray-100 shadow-sm hover:border-[#007367]/20 transition-all hover:shadow-md group rounded-none"
             >
                <div className="w-12 h-12 flex items-center justify-center mb-6 border transition-transform group-hover:scale-110 rounded-none"
                     style={{ backgroundColor: stat.bg, color: stat.color, borderColor: `${stat.color}15` }}
                >
                   <stat.icon className="w-6 h-6" />
                </div>
                <p className="text-base font-semibold text-slate-500 uppercase  mb-1.5">{stat.label}</p>
                <h2 className="text-3xl font-semibold text-slate-900 ">{stat.value}</h2>
                <p className="text-base font-medium text-slate-500 mt-2 leading-relaxed">{stat.desc}</p>
             </motion.div>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Optimization Checklist */}
          <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-gray-100 overflow-hidden shadow-sm rounded-none">
                  <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                     <h3 className="text-base font-semibold text-slate-900 uppercase ">Optimization Matrix</h3>
                     <span className="text-base font-semibold text-[#e88c30] bg-[#e88c30]/5 px-3 py-1.5 border border-[#e88c30]/10 uppercase rounded-none">Rank Accelerator</span>
                  </div>
                  
                  <div className="divide-y divide-gray-50">
                      {optimizationTasks.map((task, idx) => (
                         <div key={idx} className="p-8 flex items-start justify-between gap-6 hover:bg-gray-50/50 transition-colors group">
                            <div className="space-y-1.5">
                               <div className="flex items-center gap-3">
                                  <h4 className="text-base font-semibold text-slate-900">{task.title}</h4>
                                  <span className={`text-base font-semibold px-2 py-0.5 rounded-md border ${task.impact === 'High' || task.impact === 'Ultra' ? 'bg-[#007367]/5 text-[#007367] border-[#007367]/10' : 'bg-gray-50 text-slate-700 border-gray-100'}`}>{task.impact} IMPACT</span>
                               </div>
                               <p className="text-base font-medium text-slate-700 max-w-lg leading-relaxed">{task.desc}</p>
                            </div>
                            <div className={`p-3 rounded-2xl border transition-all ${task.status ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-500/10' : 'bg-gray-50 text-gray-300 border-gray-100 shadow-sm'}`}>
                               {task.status ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                            </div>
                         </div>
                      ))}
                  </div>
              </div>
          </div>

          {/* Algorithm Context Sidebar */}
          <div className="space-y-6">
              {/* Search Visibility - Replaced dark with soft brand card */}
              <div className="bg-white p-8 border border-[#007367]/10 relative overflow-hidden shadow-sm group rounded-none">
                 <div className="absolute top-0 right-0 p-12 bg-[#007367]/5 -translate-y-1/2 translate-x-1/2 blur-2xl rounded-none" />
                 
                 <div className="relative z-10 space-y-6">
                    <div className="w-14 h-14 bg-[#007367]/5 flex items-center justify-center border border-[#007367]/10 text-[#007367] rounded-none">
                       <BarChart3 className="w-7 h-7" />
                    </div>
                    
                    <div className="space-y-3">
                       <h3 className="text-lg font-semibold text-slate-900  uppercase tracking-wide">Search Visibility</h3>
                       <p className="text-slate-700 text-base font-medium leading-relaxed">
                          Your business appeared in <span className="text-[#007367] font-semibold">{analytics?.searchAppearances?.toLocaleString() || '0'}</span> targeted searches this cycle with a <span className="text-[#e88c30] font-semibold">{analytics?.ctr || '0.0%'}</span> engagement rate.
                       </p>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                       <div className="flex flex-col">
                          <span className="text-base font-semibold text-slate-500 uppercase ">Algorithm Score</span>
                          <span className="text-base font-semibold text-slate-900">{(profile?.totalScore || 0).toFixed(1)} <span className="text-base text-slate-500 font-medium">/ 100</span></span>
                       </div>
                       <div className="p-2 bg-emerald-50 rounded-none text-emerald-600">
                          <ArrowUpRight className="w-5 h-5" />
                       </div>
                    </div>
                 </div>
              </div>

              {/* Info Box */}
              <div className="bg-[#fff7ed] p-8 border border-[#e88c30]/10 flex items-start gap-4 rounded-none">
                 <div className="w-10 h-10 bg-white flex items-center justify-center text-[#e88c30] shrink-0 border border-[#e88c30]/10 shadow-sm rounded-none">
                    <Info className="w-5 h-5" />
                 </div>
                 <div className="space-y-1.5">
                    <h4 className="text-base font-semibold text-[#e88c30] uppercase ">Ranking Engine</h4>
                    <p className="text-base font-medium text-[#e88c30]/70 leading-relaxed">
                       Our algorithm rewards verification status, fast response times, and comprehensive product data to prioritize your business for buyers.
                    </p>
                 </div>
              </div>
          </div>
      </div>
    </div>
  );
}


