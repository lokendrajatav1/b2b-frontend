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

export default function VendorDashboard() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    closedLeads: 0,
    responseTime: 0,
    rankingScore: 0
  });
  const [analytics, setAnalytics] = useState<any>(null);
  const [leads, setLeads] = useState([]);
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
    { label: 'Success Stories', value: stats.closedLeads, icon: CheckCircle2, color: 'emerald', desc: 'Leads successfully closed' },
    { label: 'Avg. Reply Speed', value: `${stats.responseTime}h`, icon: Clock, color: 'amber', desc: 'Your average response time' },
    { label: 'Trust Index', value: stats.rankingScore.toFixed(1), icon: Star, color: 'indigo', desc: 'Your marketplace reputation' },
  ];

  if (loading) return (
    <div className="p-12 space-y-8">
       <div className="h-12 bg-slate-100 rounded-2xl w-1/4 animate-pulse"></div>
       <div className="grid grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-50 rounded-3xl animate-pulse"></div>)}
       </div>
       <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 h-96 bg-slate-50 rounded-3xl animate-pulse"></div>
          <div className="h-96 bg-slate-50 rounded-3xl animate-pulse"></div>
       </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-simple-fade pb-20 p-2 md:p-0">
      {/* Humanized Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
              Welcome back, {profile?.businessName?.split(' ')[0] || 'Partner'}!
              <div className={`p-1 rounded-lg border ${profile?.verified ? 'bg-[#007367]/10 border-[#007367]/20 text-[#007367]' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
                <ShieldCheck className="w-4 h-4" />
              </div>
            </h1>
            <p className="text-slate-700 font-medium text-base">
              {profile?.verified 
                ? "Your business is visible to thousands of buyers right now." 
                : "We're reviewing your profile to get you verified and ready."}
            </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
            <Link 
              href="/vendor/products" 
              className="px-5 py-2.5 bg-[#007367] text-white rounded-none font-semibold text-base flex items-center gap-2 hover:bg-[#005e54] transition-all shadow-sm"
            >
                <PlusCircle className="w-4 h-4" />
                Add New Listing
            </Link>
            <Link 
              href="/vendor/profile" 
              className="px-5 py-2.5 bg-white border border-gray-200 text-slate-800 rounded-none font-semibold text-base hover:bg-gray-50 transition-all"
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
            className="bg-white p-6 rounded-none border border-gray-100 group hover:border-blue-200 hover:shadow-md transition-all duration-300"
          >
            <div className={`w-10 h-10 ${
              stat.color === 'blue' ? 'bg-[#007367]/10 text-[#007367] border-[#007367]/20' :
              stat.color === 'emerald' ? 'bg-[#e88c30]/10 text-[#e88c30] border-[#e88c30]/20' :
              stat.color === 'amber' ? 'bg-amber-50 text-amber-600 border-amber-100/50' : 
              'bg-[#007367]/5 text-[#007367] border-[#007367]/10'
            } rounded-xl flex items-center justify-center mb-4 border group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-base font-semibold text-slate-700 mb-1">{stat.label}</p>
            <h3 className="text-2xl font-semibold text-slate-900">{stat.value}</h3>
            <p className="text-base font-medium text-slate-500 mt-1">{stat.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
               <Activity className="w-4 h-4 text-[#007367]" />
               Recent Activity
            </h3>
            <Link href="/vendor/leads" className="text-base font-semibold text-[#007367] hover:text-[#005e54] transition-colors">See All Leads</Link>
          </div>
          
          <div className="bg-white rounded-none border border-gray-100 overflow-hidden shadow-sm">
            {leads.length > 0 ? leads.map((lead: any, idx) => (
              <div key={lead.id} className={`p-6 ${idx !== leads.length - 1 ? 'border-b border-gray-50' : ''} hover:bg-gray-50/50 transition-all group`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-none flex items-center justify-center font-semibold text-lg text-slate-700 border border-gray-200 group-hover:bg-[#007367]/10 group-hover:text-[#007367] group-hover:border-[#007367]/20 transition-all">
                      {lead.buyerName.charAt(0)}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-semibold text-slate-900">{lead.buyerName}</h4>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-medium text-slate-700 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {lead.city}
                        </span>
                        <div className="px-2 py-0.5 bg-[#007367]/10 text-[#007367] rounded-none text-base font-semibold border border-[#007367]/20">
                          {lead.category?.name}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                       <p className="text-base font-medium text-slate-500">Received</p>
                       <p className="text-base font-semibold text-slate-800">{new Date(lead.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Link 
                      href={`/vendor/leads?id=${lead.id}`}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-none text-base font-semibold text-slate-800 hover:bg-gray-50 hover:text-slate-900 transition-all flex items-center gap-1.5"
                    >
                      Reply to Lead
                    </Link>
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-16 text-center space-y-3">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto border border-gray-100">
                  <LayoutGrid className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-base font-semibold text-slate-700">You don't have any leads yet.</p>
              </div>
            )}
          </div>

          {/* New Feature: Business Insights Snapshot */}
          <div className="bg-[#f0f9f8] rounded-2xl p-8 border border-[#007367]/20 relative overflow-hidden group">
             <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3">
                   <h3 className="text-lg font-semibold text-[#007367]">How You Compare</h3>
                   <p className="text-[#007367]/80 text-base font-medium max-w-md">
                     You are performing <span className="font-semibold text-[#007367]">12% better</span> than the category average. Keep your response speed low to maintain this lead.
                   </p>
                   <div className="flex items-center gap-6 pt-3">
                      <div>
                         <p className="text-base font-medium text-[#007367]/70 mb-1">Your Score</p>
                         <p className="text-xl font-semibold text-[#007367]">{stats.rankingScore.toFixed(1)}</p>
                      </div>
                      <div className="w-px h-8 bg-[#007367]/20"></div>
                      <div>
                         <p className="text-base font-medium text-[#007367]/70 mb-1">Category Avg</p>
                         <p className="text-xl font-semibold text-[#007367]/60">{(analytics?.categoryBenchmark || 0).toFixed(1)}</p>
                      </div>
                   </div>
                </div>
                <div className="hidden md:flex items-center justify-center p-4 bg-white/60 rounded-none border border-white">
                   <BarChart3 className="w-10 h-10 text-[#007367]" />
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar Context */}
        <div className="space-y-6">
           {/* Profile Connectivity */}
           <div className="bg-white rounded-none border border-gray-100 p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-base font-semibold text-slate-900">Social Links</h3>
                 <Globe className="w-4 h-4 text-slate-500" />
              </div>
              
              <div className="space-y-3">
                 {[
                   { id: 'linkedin', icon: Linkedin, color: 'text-[#007367]' },
                   { id: 'instagram', icon: Instagram, color: 'text-pink-600' },
                   { id: 'facebook', icon: Facebook, color: 'text-blue-800' }
                 ].map(social => (
                    <div key={social.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-none border border-gray-100 hover:border-[#007367]/30 transition-all">
                       <div className="flex items-center gap-2.5 shrink-0">
                          <social.icon className={`w-4 h-4 ${social.color}`} />
                          <span className="text-base font-semibold text-slate-800 capitalize">{social.id}</span>
                       </div>
                       <span className="text-base font-medium text-slate-700 truncate ml-2 text-right">
                          {profile?.socialLinks?.[social.id] ? `@${profile.socialLinks[social.id]}` : 'Not Linked'}
                       </span>
                    </div>
                 ))}
              </div>

              <div className="pt-4 border-t border-gray-50 space-y-2">
                 <div className="flex items-center justify-between text-base font-semibold text-slate-700">
                   <span>Business Location</span>
                   <MapPin className="w-3 h-3" />
                 </div>
                 <p className="text-base font-medium text-slate-800">
                   {profile?.address || "Address not provided"}
                   {profile?.city && <><br /><span className="text-slate-900 font-semibold">{profile.city}</span></>}
                 </p>
              </div>
           </div>

           {/* Quick Support / Feedback */}
           <div className="bg-gray-50 rounded-none p-6 border border-gray-100 space-y-4">
              <div className="w-10 h-10 bg-white rounded-none flex items-center justify-center text-slate-800 shadow-sm border border-gray-100">
                 <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                 <h4 className="text-base font-semibold text-slate-900 mb-1">Need some help?</h4>
                 <p className="text-base font-medium text-slate-800">
                   Our support team is always here to help you get the most out of your profile.
                 </p>
              </div>
              <button className="w-full py-2.5 bg-white border border-gray-200 rounded-none text-base font-semibold text-slate-800 hover:bg-gray-100 hover:text-slate-900 transition-all">
                Contact Support
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}


