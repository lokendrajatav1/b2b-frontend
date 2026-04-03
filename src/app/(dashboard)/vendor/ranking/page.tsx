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
  Info
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
       <div className="h-40 bg-slate-100 rounded-3xl w-full"></div>
       <div className="grid grid-cols-2 gap-8">
          <div className="h-96 bg-slate-50 rounded-3xl"></div>
          <div className="h-96 bg-slate-50 rounded-3xl"></div>
       </div>
    </div>
  );

  const scoreStats = [
    { label: 'Total Score', value: profile?.totalScore?.toFixed(1) || '0.0', icon: Award, color: 'blue', desc: 'Weighted average of your standing' },
    { label: 'Category Rank', value: '#12', icon: Target, color: 'indigo', desc: 'Your position in ' + (profile?.category?.name || 'Category') },
    { label: 'Response Rate', value: '98%', icon: Zap, color: 'amber', desc: 'Speed and quality of lead handling' },
    { label: 'Trust Factor', value: 'High', icon: ShieldCheck, color: 'emerald', desc: 'Based on verification & reviews' },
  ];

  return (
    <div className="space-y-8 animate-simple-fade pb-20 p-2 md:p-0">
      {/* Humanized Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight flex items-center gap-3">
               Visibility & Ranking
               <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
                  <TrendingUp className="w-5 h-5" />
               </div>
            </h1>
            <p className="text-gray-500 font-medium text-sm">Understand how your business performs in the marketplace algorithm.</p>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold border border-blue-100 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5" />
                Live Monitoring
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
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-100 transition-all hover:shadow-md"
             >
                <div className={`w-10 h-10 bg-${stat.color}-50 text-${stat.color}-600 rounded-xl flex items-center justify-center mb-4 border border-${stat.color}-100/50`}>
                   <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{stat.value}</h2>
                <p className="text-xs font-medium text-gray-400 mt-1">{stat.desc}</p>
             </motion.div>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Optimization Checklist */}
          <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                  <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                     <h3 className="text-sm font-semibold text-gray-900">Optimization Matrix</h3>
                     <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wider">Algorithmic Tips</span>
                  </div>
                  
                  <div className="divide-y divide-gray-50">
                      {[
                        { title: 'Complete Verification', desc: 'Verified vendors receive 2.5x more visibility in search results.', status: profile?.verified, impact: 'High' },
                        { title: 'Keyword Optimization', desc: 'Use high-intent search terms in your business keywords.', status: (profile?.keywords?.length || 0) > 3, impact: 'Medium' },
                        { title: 'Catalogue Richness', desc: 'Add detailed descriptions and multiple images to all offerings.', status: (profile?.products?.length || 0) > 3, impact: 'High' },
                        { title: 'Response Efficiency', desc: 'Replying to leads within 2 hours boosts your trust score.', status: profile?.responseTime < 5, impact: 'Ultra' }
                      ].map((task, idx) => (
                         <div key={idx} className="p-6 flex items-start justify-between gap-6 hover:bg-gray-50/50 transition-colors">
                            <div className="space-y-1">
                               <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-semibold text-gray-900">{task.title}</h4>
                                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${task.impact === 'High' || task.impact === 'Ultra' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-gray-100 text-gray-600'}`}>{task.impact} Impact</span>
                               </div>
                               <p className="text-xs font-medium text-gray-500 max-w-lg leading-relaxed">{task.desc}</p>
                            </div>
                            <div className={`p-2 rounded-lg border ${task.status ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-300 border-gray-200'}`}>
                               {task.status ? <ShieldCheck className="w-4 h-4" /> : <RefreshCcw className="w-4 h-4" />}
                            </div>
                         </div>
                      ))}
                  </div>
              </div>
          </div>

          {/* Algorithm Context Sidebar */}
          <div className="space-y-6">
              <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                 <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
                 <div className="relative z-10 space-y-6">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                       <BarChart3 className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-lg font-bold">Search Visibility</h3>
                       <p className="text-indigo-100/60 text-xs font-medium leading-relaxed">
                          Your profile appeared in <span className="text-white font-bold">1,240</span> relevant searches this week. You have a <span className="text-blue-400 font-bold">4.8%</span> click-through rate.
                       </p>
                    </div>
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Efficiency</span>
                          <span className="text-sm font-bold text-white">92nd Percentile</span>
                       </div>
                       <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                    </div>
                 </div>
              </div>

              <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100 flex items-start gap-4">
                 <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-indigo-600 shrink-0 border border-indigo-100">
                    <Info className="w-4 h-4" />
                 </div>
                 <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-widest">Ranking Engine</h4>
                    <p className="text-xs font-medium text-indigo-800/70 leading-relaxed">
                       Our engine weights verification, category relevance, and response time to determine your position. Updated every 24 hours.
                    </p>
                 </div>
              </div>
          </div>
      </div>
    </div>
  );
}
