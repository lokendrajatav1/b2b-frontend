'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
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
  MapPin,
  Building2,
  Package,
  TrendingUp,
  Search,
  Filter
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hubInfo, setHubInfo] = useState<any>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/admin/analytics'); 
      const summary = data.data?.summary || {};
      
      setHubInfo(data.data?.hubInfo);
      setStats({
        totalLeads: summary.totalLeads || 0,
        totalVendors: summary.totalVendors || 0,
        pendingApprovals: summary.pendingVendors || 0,
        activeSubscribers: summary.activeSubscribers || 0,
        recentActivity: data.data?.recentLeads || []
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentZone = hubInfo?.name || "Regional Hub";

  const dashboardCards = [
    { label: 'Active Vendors', value: stats?.totalVendors || 0, icon: Building2, color: '#007367', desc: 'Verified in ' + currentZone },
    { label: 'Market Demand', value: stats?.totalLeads || 0, icon: Target, color: '#e88c30', desc: 'Live hub inquiries' },
    { label: 'Pending Verification', value: stats?.pendingApprovals || 0, icon: ShieldAlert, color: '#007367', desc: 'Action required' },
    { label: 'Active Subscribers', value: stats?.activeSubscribers || 0, icon: Zap, color: '#e88c30', desc: 'Premium vendors' }
  ];

  return (
    <div className="space-y-8 animate-simple-fade pb-20 font-medium">
      {/* Regional Banner */}
      <div className="relative h-32 md:h-40 bg-[#f0f9f8] border border-[#007367]/20 rounded-3xl overflow-hidden shadow-sm p-8 flex items-center justify-between text-slate-900 group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-[#007367]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
         <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#e88c30]/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
         
         <div className="relative z-10 flex items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-none flex items-center justify-center border border-[#007367]/10 shadow-sm">
               <MapPin className="w-8 h-8 text-[#007367]" />
            </div>
            <div>
               <p className="text-base font-semibold uppercase  text-[#007367]/70 leading-none mb-1.5">Regional Command Center</p>
               <h1 className="text-2xl md:text-3xl font-semibold  text-[#007367]">{currentZone}</h1>
            </div>
         </div>
         
         <div className="relative z-10 hidden md:flex items-center gap-4">
            <div className="text-right">
               <p className="text-base font-semibold uppercase  text-[#007367]/70">Local Time</p>
               <p className="text-base font-semibold text-[#007367]">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST</p>
            </div>
            <div className="w-px h-10 bg-[#007367]/20 mx-2" />
            <button className="p-3 bg-white hover:bg-gray-50 rounded-none border border-[#007367]/20 shadow-sm transition-all text-[#007367]">
               <Filter className="w-5 h-5" />
            </button>
         </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card, idx) => (
          <motion.div 
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-none border border-gray-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-colors" style={{ backgroundColor: `${card.color}10`, color: card.color }}>
                <card.icon className="w-6 h-6" />
              </div>
              <div className="flex flex-col items-end">
                 <div className="flex items-center gap-1 text-emerald-500 font-semibold text-base">
                    <ArrowUpRight className="w-3.5 h-3.5" /> +12%
                 </div>
                 <span className="text-base text-slate-500 font-semibold uppercase ">Since Monday</span>
              </div>
            </div>
            <div>
               <h3 className="text-3xl font-semibold text-slate-900 tabular-nums">{loading ? '...' : card.value}</h3>
               <p className="text-base font-semibold text-slate-900 mt-0.5">{card.label}</p>
               <p className="text-base text-slate-500 font-medium mt-1">{card.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Live Market Pulse (Zone) */}
         <div className="lg:col-span-8 bg-white rounded-none border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 pb-4 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900  leading-none">Live Regional Demand</h3>
                    <p className="text-base font-medium text-slate-500 mt-1.5 flex items-center gap-2">
                       Real-time signals from buyers in your hub
                       <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    </p>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <button className="px-4 py-2 text-base font-semibold text-slate-500 uppercase  hover:text-[#007367] transition-colors">Daily</button>
                  <button className="px-4 py-2 text-base font-semibold text-[#007367] uppercase  bg-[#007367]/5 rounded-none border border-[#007367]/10">Weekly</button>
               </div>
            </div>

            <div className="p-8 pt-4 space-y-3">
                {stats?.recentActivity?.length > 0 ? stats.recentActivity.slice(0, 6).map((lead: any, i: number) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={lead.id} 
                    className="flex items-center justify-between p-5 bg-gray-50/50 rounded-none border border-transparent hover:border-[#007367]/10 hover:bg-white hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-center gap-5">
                      <div>
                        <p className="text-base font-semibold text-slate-900 leading-none group-hover:text-[#007367] transition-colors">
                           {lead.searchKeyword ? lead.searchKeyword : `Requirement from ${lead.buyerName}`}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                           <p className="text-base font-semibold text-black uppercase  flex items-center gap-1.5">
                             <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 
                             Verified Buyer
                           </p>
                           <span className="w-1 h-1 bg-gray-200 rounded-full" />
                           <p className="text-base font-semibold text-[#e88c30] uppercase ">{lead.city}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <div className="text-right hidden sm:block">
                          <p className="text-base font-semibold text-slate-900 tabular-nums">Just now</p>
                          <p className="text-base font-semibold text-black uppercase  mt-1">Market Match</p>
                       </div>
                       <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-300 border border-gray-100 hover:text-[#007367] hover:border-[#007367]/30 cursor-pointer transition-all">
                          <ArrowRight className="w-5 h-5" />
                       </div>
                    </div>
                  </motion.div>
                )) : (
                  <div className="py-24 text-center space-y-4 bg-gray-50/30 rounded-none border border-dashed border-gray-200">
                     <Target className="w-16 h-16 text-gray-200 mx-auto" />
                     <p className="text-base font-semibold text-slate-500">Scanning for regional trade signals...</p>
                  </div>
                )}
            </div>
         </div>

         {/* Right Sidebar - Actions & Compliance */}
         <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#f0f9f8] border border-[#007367]/20 rounded-[2.5rem] p-8 relative overflow-hidden shadow-sm group">
               <div className="absolute top-0 right-0 p-8 opacity-[0.05] transform translate-x-4 -translate-y-4 transition-transform group-hover:translate-x-2 group-hover:-translate-y-2">
                  <Megaphone className="w-24 h-24 text-[#007367]" />
               </div>
               <div className="relative z-10 space-y-5">
                  <div className="w-12 h-12 bg-white rounded-none flex items-center justify-center border border-[#007367]/10">
                     <Users className="w-6 h-6 text-[#e88c30]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#007367] leading-tight pr-8">Broadcast Hub.</h3>
                  <p className="text-base text-[#007367]/80 leading-relaxed font-medium">Reach all verified suppliers in the {currentZone.split(' ')[0]} region with one announcement.</p>
                  <button className="flex items-center gap-2 px-6 py-3 bg-[#007367] hover:bg-[#005e54] text-white rounded-none font-semibold text-base transition-all shadow-lg shadow-[#007367]/20 active:scale-95 group/btn">
                    Notify Zone
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
               </div>
            </div>

            <div className="bg-white rounded-none border border-gray-100 p-8 shadow-sm">
               <h3 className="text-base font-semibold text-slate-500 uppercase  mb-8 flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-[#e88c30]" /> Regional Compliance
               </h3>
                <div className="space-y-5">
                  {[
                    { label: `Verify ${stats?.pendingApprovals || 0} New Listings`, urgency: 'Critical', count: stats?.pendingApprovals },
                    { label: 'Check Supplier Documents', urgency: 'Urgent', count: stats?.pendingApprovals > 0 ? 1 : 0 },
                    { label: 'Platform Terms Audit', urgency: 'Review', count: 1 }
                  ].filter(t => t.count > 0 || t.urgency === 'Review').map((todo) => (
                    <div key={todo.label} className="flex items-start justify-between gap-4 group cursor-pointer">
                      <div className="flex gap-4">
                        <div className="w-6 h-6 bg-gray-50 border border-gray-200 rounded-none mt-0.5 flex items-center justify-center shrink-0 group-hover:border-[#007367]/30 transition-colors">
                           <div className="w-2 h-2 bg-transparent group-hover:bg-[#007367]/40 rounded-full transition-all" />
                        </div>
                        <div>
                           <p className="text-base font-semibold text-slate-900 leading-none group-hover:text-[#007367] transition-colors">{todo.label}</p>
                           <p className="text-base text-black mt-1 font-semibold uppercase ">{todo.urgency}</p>
                        </div>
                      </div>
                    </div>
                  ))}
               </div>
               
               <div className="mt-10 p-5 bg-gray-50 rounded-none border border-gray-100 flex items-center justify-between">
                  <div>
                     <p className="text-base font-semibold text-black uppercase  leading-none mb-1">Zone Status</p>
                     <p className="text-base font-semibold text-emerald-600">Compliant</p>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
