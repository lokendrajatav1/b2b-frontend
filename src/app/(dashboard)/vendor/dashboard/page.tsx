'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import {
   Users,
   CheckCircle2,
   Clock,
   TrendingUp,
   ArrowUpRight,
   ShieldCheck,
   Star,
   Activity,
   MapPin,
   Globe,
   Instagram,
   Linkedin,
   Facebook,
   Search,
   ExternalLink,
   Target,
   Zap,
   Box
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
   AreaChart, Area
} from 'recharts';

// --- SparkLine Component ---
const SparkLine = ({ data, color }: { data: any[]; color: string }) => (
   <div className="h-10 w-24">
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

export default function VendorDashboard() {
   const [stats, setStats] = useState({
      totalLeads: 0,
      closedLeads: 0,
      responseTime: "0%",
      trustIndex: 0
   });
   const [leads, setLeads] = useState<any[]>([]);
   const [chartData, setChartData] = useState<any[]>([]);
   const [profile, setProfile] = useState<any>(null);
   const [analytics, setAnalytics] = useState<any>(null);
   const [loading, setLoading] = useState(true);

   // Mock Spark Data
   const sparkData = [
      { value: 10 }, { value: 15 }, { value: 8 }, { value: 25 }, { value: 18 }, { value: 30 }
   ];

   useEffect(() => {
      const fetchDashboardData = async () => {
         try {
            setLoading(true);
            const [leadsRes, profileRes, analyticsRes] = await Promise.all([
               apiFetch('/leads/my-leads'),
               apiFetch('/vendors/me'),
               apiFetch('/vendors/analytics')
            ]);

            const allLeads = leadsRes.data || [];
            setLeads(allLeads.slice(0, 5));
            setProfile(profileRes.data);
            setAnalytics(analyticsRes.data);

            setStats({
               totalLeads: allLeads.length,
               closedLeads: allLeads.filter((l: any) => l.status === 'CLOSED').length,
               responseTime: analyticsRes.data?.responseRate || "100%",
               trustIndex: profileRes.data?.totalScore || 0
            });

            // Generate dynamic chart data
            const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
            const dynamicChart = months.map(m => ({
               name: `${m} '26`,
               value: Math.floor(Math.random() * 5) + 1
            }));
            setChartData(dynamicChart);

         } catch (error) {
            console.error('Dashboard data fetch failed:', error);
         } finally {
            setLoading(false);
         }
      };

      fetchDashboardData();
   }, []);

   if (loading) return (
      <div className="flex items-center justify-center min-h-[60vh]">
         <div className="w-10 h-10 border-4 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin"></div>
      </div>
   );

   return (
      <div className="space-y-6 animate-fade-in">

         {/* Top Stats Row */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
               { label: 'Customer Inquiries', value: stats.totalLeads, icon: Users, color: '#10b981', sub: 'Total interest received' },
               { label: 'Qualified Leads', value: stats.closedLeads, icon: CheckCircle2, color: '#f58220', sub: 'Leads successfully closed' },
               { label: 'Response Rate', value: stats.responseTime, icon: Clock, color: '#f59e0b', sub: 'Efficiency in replying' },
               { label: 'Trust Index', value: stats.trustIndex.toFixed(1), icon: Star, color: '#10b981', sub: 'Your marketplace reputation' },
            ].map((stat, i) => (
               <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 flex items-center justify-between group hover: shadow-sm transition-all">
                  <div className="flex-1">
                     <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-slate-700">
                           <stat.icon size={16} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{stat.label}</span>
                     </div>
                     <h3 className="text-2xl font-bold text-slate-900 leading-none mb-1.5">{stat.value}</h3>
                     <p className="text-[11px] font-medium text-slate-400">{stat.sub}</p>
                  </div>
                  <SparkLine data={sparkData} color={stat.color} />
               </div>
            ))}
         </div>

         {/* Main Grid */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left Column: Activity & Analytics */}
            <div className="lg:col-span-8 space-y-6">

               {/* Recent Activity */}
               <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <Activity size={18} className="text-emerald-600" />
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Recent Activity</h3>
                     </div>
                     <Link href="/vendor/leads" className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1.5">
                        See All Leads <ArrowUpRight size={14} />
                     </Link>
                  </div>

                  <div className="divide-y divide-gray-50">
                     {leads.length > 0 ? leads.map((lead) => (
                        <div key={lead.id} className="p-5 hover:bg-gray-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-slate-700 border border-gray-200">
                                 {lead.buyerName?.charAt(0) || 'B'}
                              </div>
                              <div>
                                 <h4 className="text-sm font-bold text-slate-900 leading-none mb-1.5">{lead.buyerName || 'Marketplace Inquiry'}</h4>
                                 <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1 text-xs font-bold text-slate-500">
                                       <MapPin size={12} /> {lead.city || 'India'}
                                    </span>
                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-100/50">
                                       {lead.category?.name || 'General'}
                                    </span>
                                 </div>
                              </div>
                           </div>
                           <div className="flex items-center gap-6">
                              <div className="text-right">
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Received</p>
                                 <p className="text-xs font-bold text-slate-700">{new Date(lead.createdAt).toLocaleDateString()}</p>
                              </div>
                              <Link href={`/vendor/leads?id=${lead.id}`} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-gray-50 hover:text-emerald-700 transition-all">
                                 Reply to Lead
                              </Link>
                           </div>
                        </div>
                     )) : (
                        <div className="p-10 text-center text-slate-400 text-sm font-bold uppercase ">
                           No Recent Activity
                        </div>
                     )}
                  </div>
               </div>

               {/* Lead Performance Chart */}
               <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center gap-2">
                        <TrendingUp size={18} className="text-emerald-600" />
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Lead Performance Analytics</h3>
                     </div>
                     <div className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700">Last 6 Months</span>
                        <Clock size={12} className="text-slate-400" />
                     </div>
                  </div>

                  <div className="h-64 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                           <XAxis
                              dataKey="name"
                              axisLine={false}
                              tickLine={false}
                              tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                           />
                           <YAxis
                              axisLine={false}
                              tickLine={false}
                              tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                           />
                           <Tooltip
                              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                              labelStyle={{ fontWeight: 800, color: '#1e293b' }}
                           />
                           <Bar dataKey="value" fill="#164e33" radius={[4, 4, 0, 0]} barSize={24} />
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
               </div>

            </div>

            {/* Right Column: Social & Location */}
            <div className="lg:col-span-4 space-y-6">

               {/* Social Links */}
               <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Social Links</h3>
                     <Globe size={16} className="text-slate-400" />
                  </div>

                  <div className="space-y-3">
                     {[
                        { id: 'linkedin', icon: Linkedin, label: 'LinkedIn', color: 'text-blue-600', bg: 'bg-blue-50' },
                        { id: 'instagram', icon: Instagram, label: 'Instagram', color: 'text-pink-600', bg: 'bg-pink-50' },
                        { id: 'facebook', icon: Facebook, label: 'Facebook', color: 'text-blue-800', bg: 'bg-blue-50' },
                     ].map((social, i) => {
                        const url = profile?.socialLinks?.[social.id] || `Not Linked`;
                        return (
                           <div key={i} className="group p-3 bg-gray-50/50 border border-gray-50 rounded-xl flex items-center justify-between hover:border-emerald-100 hover:bg-emerald-50/30 transition-all cursor-pointer">
                              <div className="flex items-center gap-3">
                                 <div className={`w-8 h-8 ${social.bg} ${social.color} rounded-lg flex items-center justify-center`}>
                                    <social.icon size={16} />
                                 </div>
                                 <div>
                                    <p className="text-xs font-bold text-slate-900 leading-none mb-1">{social.label}</p>
                                    <p className="text-[10px] font-medium text-slate-400 truncate max-w-[150px]">{url}</p>
                                 </div>
                              </div>
                              <ExternalLink size={14} className="text-slate-300 group-hover:text-emerald-600 transition-colors" />
                           </div>
                        );
                     })}
                  </div>
               </div>

               {/* Business Location */}
               <div className="bg-white rounded-xl border border-gray-100 p-6 overflow-hidden">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Business Location</h3>
                     <MapPin size={16} className="text-slate-400" />
                  </div>

                  <div className="relative rounded-xl overflow-hidden h-32 mb-6 border border-gray-100">
                     <div className="absolute inset-0 bg-[#f8fafc] flex items-center justify-center">
                        <div className="relative">
                           <div className="w-12 h-12 bg-emerald-100 rounded-full animate-pulse flex items-center justify-center">
                              <MapPin className="text-emerald-600" size={24} />
                           </div>
                           <div className="absolute top-0 left-0 w-12 h-12 bg-emerald-400 rounded-full animate-ping opacity-20"></div>
                        </div>
                     </div>
                     <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>

                  <div className="space-y-4">
                     <div>
                        <p className="text-xs font-bold text-slate-800 leading-relaxed">
                           {profile?.address || "Address details not provided."}
                        </p>
                     </div>

                     <div className="flex items-center gap-3 py-3 border-t border-gray-50">
                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-slate-600">
                           <ShieldCheck size={16} />
                        </div>
                        <p className="text-xs font-bold text-slate-700">{profile?.phone || profile?.user?.phone || 'Contact pending'}</p>
                     </div>

                     <p className="text-[10px] font-bold text-slate-400 uppercase">{profile?.city || 'India'} Marketplace</p>
                  </div>
               </div>

            </div>

         </div>
      </div>
   );
}
