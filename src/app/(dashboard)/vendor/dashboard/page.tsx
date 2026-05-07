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
  Mail,
  Phone,
  ShieldCheck,
  Star,
  Activity,
  Zap,
  Box,
  MapPin,
  Globe,
  Instagram,
  Linkedin,
  Facebook,
  PlusCircle,
  LayoutGrid,
  BarChart3,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Dynamic Chart Data Generator
const generateChartData = (allLeads: any[]) => {
  const last6Months: any[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthName = d.toLocaleString('default', { month: 'short' });
    const monthYear = d.getFullYear();
    last6Months.push({ name: monthName, year: monthYear, received: 0, closed: 0 });
  }

  allLeads.forEach(lead => {
    const leadDate = new Date(lead.createdAt);
    const leadMonth = leadDate.toLocaleString('default', { month: 'short' });
    const leadYear = leadDate.getFullYear();
    
    const monthData = last6Months.find(m => m.name === leadMonth && m.year === leadYear);
    if (monthData) {
      monthData.received++;
      if (lead.status === 'CLOSED') monthData.closed++;
    }
  });

  return last6Months;
};


export default function VendorDashboard() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    closedLeads: 0,
    responseTime: 0,
    rankingScore: 0
  });
  const [analytics, setAnalytics] = useState<any>(null);
  const [leads, setLeads] = useState([]);
  const [allLeadsForChart, setAllLeadsForChart] = useState([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [leadsData, vendorProfile, analyticsData] = await Promise.all([
          apiFetch('/leads/my-leads'),
          apiFetch('/vendors/me'),
          apiFetch('/vendors/analytics')
        ]);
        setLeads(leadsData.data?.slice(0, 5) || []);
        setAllLeadsForChart(leadsData.data || []);
        setProfile(vendorProfile.data);
        setAnalytics(analyticsData.data);
        setStats({
          totalLeads: leadsData.data?.length || 0,
          closedLeads: leadsData.data?.filter((l: any) => l.status === 'CLOSED').length || 0,
          responseTime: vendorProfile.data?.responseTime || 0,
          rankingScore: vendorProfile.data?.totalScore || 0
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }

    };
    fetchDashboardData();
  }, []);

  const statCards = [
    { label: 'Customer Inquiries', value: stats.totalLeads, icon: Users, color: 'blue', desc: 'Total interest received' },
    { label: 'Qualified Leads', value: stats.closedLeads, icon: CheckCircle2, color: 'emerald', desc: 'Leads successfully closed' },
    { label: 'Response Rate', value: analytics?.responseRate || '0%', icon: Clock, color: 'amber', desc: 'Efficiency in replying' },
    { label: 'Trust Index', value: stats.rankingScore.toFixed(1), icon: Star, color: 'indigo', desc: 'Your marketplace reputation' },
  ];


  if (loading) return (
    <div className="space-y-8 animate-simple-fade p-6 lg:p-0">
      {/* Skeleton Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-3">
          <div className="h-8 bg-slate-100 rounded-lg w-64 animate-pulse"></div>
          <div className="h-5 bg-slate-50 rounded-lg w-96 animate-pulse"></div>
        </div>
        <div className="flex gap-4">
          <div className="h-11 bg-slate-100 rounded-2xl w-32 animate-pulse"></div>
          <div className="h-11 bg-slate-50 rounded-2xl w-32 animate-pulse"></div>
        </div>
      </div>

      {/* Skeleton Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4">
            <div className="w-10 h-10 bg-slate-100 rounded-xl animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-100 rounded-md w-1/2 animate-pulse"></div>
              <div className="h-8 bg-slate-100 rounded-md w-3/4 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Skeleton Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-6 bg-slate-100 rounded-md w-40 animate-pulse"></div>
          <div className="bg-white rounded-2xl border border-gray-100 h-[400px] flex items-center justify-center relative overflow-hidden">
             {/* Center Spinner for Visual Feedback */}
             <div className="flex flex-col items-center gap-4 z-10">
                <div className="w-12 h-12 border-4 border-[#164e33]/10 border-t-[#164e33] rounded-full animate-spin"></div>
                <p className="text-[#164e33] font-semibold text-sm uppercase  animate-pulse">Synchronizing Data...</p>
             </div>
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/30 to-transparent animate-shimmer"></div>
          </div>
          <div className="h-72 bg-slate-50 border border-gray-100 rounded-2xl animate-pulse"></div>
        </div>
        <div className="space-y-6">
          <div className="h-[400px] bg-slate-50 border border-gray-100 rounded-2xl animate-pulse"></div>
          <div className="h-40 bg-slate-50 border border-gray-100 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    </div>
  );


  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-simple-fade pb-20 px-4 lg:px-8">
      {/* Humanized Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
              Welcome back, {profile?.businessName?.split(' ')[0] || 'Partner'}!
              <div className={`p-1 rounded-lg border ${profile?.verified ? 'bg-[#164e33]/10 border-[#164e33]/20 text-[#164e33]' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
                <ShieldCheck className="w-4 h-4" />
              </div>
            </h1>
            <p className="text-slate-700 font-medium text-sm">
              {profile?.verified 
                ? "Your business is visible to thousands of buyers right now." 
                : "We're reviewing your profile to get you verified and ready."}
            </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
            <Link 
              href="/vendor/products" 
              className="px-5 py-2.5 bg-[#164e33] text-white rounded-2xl font-semibold text-sm flex items-center gap-2 hover:bg-[#113f29] transition-all "
            >
                <PlusCircle className="w-4 h-4" />
                Add New Listing
            </Link>
            <Link 
              href="/vendor/profile" 
              className="px-5 py-2.5 bg-white border border-gray-200 text-slate-800 rounded-2xl font-semibold text-sm hover:bg-gray-50 transition-all"
            >
                Update Profile
            </Link>
        </div>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 group hover:border-blue-200 hover: transition-all duration-300"
          >
            <div className={`w-10 h-10 ${
              stat.color === 'blue' ? 'bg-[#164e33]/10 text-[#164e33] border-[#164e33]/20' :
              stat.color === 'emerald' ? 'bg-[#f58220]/10 text-[#f58220] border-[#f58220]/20' :
              stat.color === 'amber' ? 'bg-amber-50 text-amber-600 border-amber-100/50' : 
              'bg-[#164e33]/5 text-[#164e33] border-[#164e33]/10'
            } rounded-xl flex items-center justify-center mb-4 border group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-slate-700 mb-1">{stat.label}</p>
            <h3 className="text-2xl font-semibold text-slate-900">{stat.value}</h3>
            <p className="text-sm font-medium text-slate-700 mt-1">{stat.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
               <Activity className="w-4 h-4 text-[#164e33]" />
               Recent Activity
            </h3>
            <Link href="/vendor/leads" className="text-sm font-semibold text-[#164e33] hover:text-[#113f29] transition-colors">See All Leads</Link>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden ">
            {leads.length > 0 ? leads.map((lead: any, idx) => (
              <div key={lead.id} className={`p-6 ${idx !== leads.length - 1 ? 'border-b border-gray-50' : ''} hover:bg-gray-50/50 transition-all group`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center font-semibold text-base text-slate-700 border border-gray-200 group-hover:bg-[#164e33]/10 group-hover:text-[#164e33] group-hover:border-[#164e33]/20 transition-all">
                      {lead.buyerName.charAt(0)}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-slate-900">{lead.buyerName}</h4>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-slate-700 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {lead.city}
                        </span>
                        <div className="px-2 py-0.5 bg-[#164e33]/10 text-[#164e33] rounded-2xl text-sm font-semibold border border-[#164e33]/20">
                          {lead.category?.name}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                       <p className="text-sm font-medium text-slate-700">Received</p>
                       <p className="text-sm font-semibold text-slate-800">{new Date(lead.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Link 
                      href={`/vendor/leads?id=${lead.id}`}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm font-semibold text-slate-800 hover:bg-gray-50 hover:text-slate-900 transition-all flex items-center gap-1.5"
                    >
                      Reply to Lead
                    </Link>
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-16 text-center space-y-3">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto border border-gray-100">
                  <LayoutGrid className="w-6 h-6 text-gray-500" />
                </div>
                <p className="text-sm font-semibold text-slate-700">You don't have any leads yet.</p>
              </div>
            )}
          </div>

          {/* Lead Analytics Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6  group">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                   <BarChart3 className="w-5 h-5 text-[#164e33]" />
                   Lead Performance Analytics
                </h3>
                <span className="text-sm font-medium text-slate-700">Last 6 Months</span>
             </div>
             
             <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={generateChartData(allLeadsForChart)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13 }} />
                      <Tooltip 
                         cursor={{ fill: '#f8fafc' }}
                         contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="received" name="Leads Received" fill="#164e33" radius={[4, 4, 0, 0]} barSize={28} />
                      <Bar dataKey="closed" name="Leads Closed" fill="#f58220" radius={[4, 4, 0, 0]} barSize={28} />
                   </BarChart>
                </ResponsiveContainer>
             </div>

             
             <div className="mt-6 flex items-center gap-6 pt-4 border-t border-gray-50">
                 <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full bg-[#164e33]"></div>
                     <span className="text-sm font-medium text-slate-600">Leads Received</span>
                 </div>
                 <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full bg-[#f58220]"></div>
                     <span className="text-sm font-medium text-slate-600">Leads Closed</span>
                 </div>
             </div>
          </div>

          {/* Business Insights Snapshot - Refined */}
          <div className="bg-[#164e33] rounded-2xl p-6 relative overflow-hidden group  mt-6">
             <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl group-hover:bg-[#ffca28] transition-all duration-700"></div>
             <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3">
                    <h3 className="text-base font-semibold text-white flex items-center gap-2">
                      <Zap className="w-5 h-5 text-[#ffca28]" />
                      Category Ranking: {analytics?.categoryRank || '#--'}
                    </h3>
                    <p className="text-emerald-50 text-sm font-medium max-w-md">
                      You are currently ranked <span className="font-bold text-white">{analytics?.categoryRank}</span> in your primary category. Maintain a high <span className="text-white font-bold">{analytics?.responseRate}</span> response rate to climb higher.
                    </p>

                </div>
                <div className="flex items-center gap-6 bg-[#113f29] p-4 rounded-2xl border border-emerald-600/50">
                    <div className="text-center">
                        <p className="text-xs font-semibold text-emerald-200 uppercase  mb-1">Your Score</p>
                        <p className="text-lg font-bold text-white">{stats.rankingScore.toFixed(1)}</p>
                    </div>
                    <div className="w-px h-8 bg-emerald-600/50"></div>
                    <div className="text-center">
                        <p className="text-xs font-semibold text-emerald-200 uppercase  mb-1">Category Avg</p>
                        <p className="text-lg font-bold text-emerald-100">{(analytics?.categoryBenchmark || 0).toFixed(1)}</p>
                    </div>
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar Context */}
        <div className="space-y-6">
           {/* Profile Connectivity */}
           <div className="bg-white rounded-2xl border border-gray-100 p-6  space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-sm font-semibold text-slate-900">Social Links</h3>
                 <Globe className="w-4 h-4 text-slate-700" />
              </div>
              
              <div className="space-y-3">
                 {[
                   { id: 'linkedin', icon: Linkedin, color: 'text-[#164e33]' },
                   { id: 'instagram', icon: Instagram, color: 'text-pink-600' },
                   { id: 'facebook', icon: Facebook, color: 'text-blue-800' }
                 ].map(social => (
                    <div key={social.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#164e33]/30 transition-all">
                       <div className="flex items-center gap-2.5 shrink-0">
                          <social.icon className={`w-4 h-4 ${social.color}`} />
                          <span className="text-sm font-semibold text-slate-800 capitalize">{social.id}</span>
                       </div>
                       <span className="text-sm font-medium text-slate-700 truncate ml-2 text-right">
                          {profile?.socialLinks?.[social.id] ? `@${profile.socialLinks[social.id]}` : 'Not Linked'}
                       </span>
                    </div>
                 ))}
              </div>

              <div className="pt-4 border-t border-gray-50 space-y-2">
                 <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                   <span>Business Location</span>
                   <MapPin className="w-3 h-3" />
                 </div>
                 <p className="text-sm font-medium text-slate-800">
                   {profile?.address || "Address not provided"}
                   {profile?.city && <><br /><span className="text-slate-900 font-semibold">{profile.city}</span></>}
                 </p>
              </div>
           </div>

           {/* Quick Support / Feedback */}
           <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">
              <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-slate-800  border border-gray-100">
                 <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                 <h4 className="text-sm font-semibold text-slate-900 mb-1">Need some help?</h4>
                 <p className="text-sm font-medium text-slate-800">
                   Our support team is always here to help you get the most out of your profile.
                 </p>
              </div>
              <button className="w-full py-2.5 bg-white border border-gray-200 rounded-2xl text-sm font-semibold text-slate-800 hover:bg-gray-100 hover:text-slate-900 transition-all">
                Contact Support
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}




