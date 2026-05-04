'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import {
  Users, Briefcase, Target, Zap, ArrowUpRight,
  Activity, CheckCircle2, AlertCircle, TrendingUp,
  BarChart4, RefreshCw, MapPin, Tag, Package,
  ShoppingBag, CreditCard, Star
} from 'lucide-react';
import { motion } from 'framer-motion';

/* ─── helpers ─── */
function fmt(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000)   return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
}
function pct(a: number, b: number) {
  if (!b) return '0%';
  return ((a / b) * 100).toFixed(1) + '%';
}

export default function AdminAnalytics() {
  const [data,        setData]        = useState<any>(null);
  const [perf,        setPerf]        = useState<any>(null);
  const [locs,        setLocs]        = useState<any>(null);
  const [kws,         setKws]         = useState<any>(null);
  const [loading,     setLoading]     = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => { load(); }, []);

  const load = async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      const [a, p, l, k] = await Promise.all([
        apiFetch('/admin/analytics'),
        apiFetch('/admin/analytics/performance'),
        apiFetch('/admin/analytics/locations'),
        apiFetch('/admin/analytics/keywords'),
      ]);
      setData(a.data);
      setPerf(p.data);
      setLocs(l.data);
      setKws(k.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Analytics fetch failed:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* ── skeleton ── */
  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-64 bg-gray-200 rounded-xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-gray-200 rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => <div key={i} className="h-48 bg-gray-200 rounded-2xl" />)}
      </div>
    </div>
  );

  const s   = data?.summary   || {};
  const tr  = data?.trends    || {};
  const con = perf?.conversion || {};
  const cat = perf?.categoryPerformance || [];
  const pln = perf?.planComparison || [];
  const vLoc = locs?.vendorLocations || [];
  const lLoc = locs?.leadLocations   || [];
  const vKw  = kws?.vendorKeywords   || [];
  const lKw  = kws?.leadKeywords     || [];

  const leadStatuses: any[] = s.leadsByStatus || [];
  const pendingLeads  = leadStatuses.find((x: any) => x.status === 'PENDING')?._count?.id || 0;
  const closedLeads   = leadStatuses.find((x: any) => x.status === 'CLOSED')?._count?.id  || 0;
  const distLeads     = leadStatuses.find((x: any) => x.status === 'DISTRIBUTED')?._count?.id || 0;

  const statCards = [
    {
      label: 'Verified Vendors',
      value: s.totalVendors ?? 0,
      sub: `${s.pendingVendors ?? 0} pending approval`,
      icon: Users,
      color: 'blue',
    },
    {
      label: 'Platform Revenue',
      value: fmt(s.totalRevenue ?? 0),
      sub: `${s.activeSubscribers ?? 0} active subscribers`,
      icon: CreditCard,
      color: 'green',
    },
    {
      label: 'Total Leads',
      value: s.totalLeads ?? 0,
      sub: `${pendingLeads} open · ${closedLeads} closed`,
      icon: Target,
      color: 'amber',
    },
    {
      label: 'Platform Users',
      value: s.totalUsers ?? 0,
      sub: `${s.pendingOfferings ?? 0} products pending review`,
      icon: Activity,
      color: 'purple',
    },
  ];

  const colorMap: any = {
    blue:   { bg: 'bg-[#164e33]/5',   text: 'text-[#164e33]',   bar: 'bg-[#164e33]/50'   },
    green:  { bg: 'bg-green-50',  text: 'text-green-600',  bar: 'bg-green-500'  },
    amber:  { bg: 'bg-amber-50',  text: 'text-amber-600',  bar: 'bg-amber-500'  },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', bar: 'bg-purple-500' },
    indigo: { bg: 'bg-[#164e33]/5', text: 'text-[#164e33]', bar: 'bg-[#164e33]/50' },
  };

  return (
    <div className="space-y-6 pb-20">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <BarChart4 className="w-5 h-5 text-slate-600" />
            Platform Insights
          </h1>
          <p className="text-base text-slate-500 mt-0.5">
            Live data from your marketplace
            {lastUpdated && (
              <span className="ml-2 text-base">· Updated {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
            )}
          </p>
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-base text-slate-800 hover:bg-gray-50 transition-all shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const c = colorMap[card.color];
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
            >
              <div className={`w-9 h-9 rounded-xl ${c.bg} ${c.text} flex items-center justify-center mb-3`}>
                <card.icon className="w-4 h-4" />
              </div>
              <p className="text-base text-slate-500">{card.label}</p>
              <p className="text-2xl font-semibold text-slate-900 mt-0.5 tabular-nums">{card.value}</p>
              <p className="text-base text-slate-500 mt-1">{card.sub}</p>
            </motion.div>
          );
        })}
      </div>

      {/* ── Lead Pipeline + Conversion ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Lead Status Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <p className="text-base font-medium text-slate-800 mb-4">Lead Pipeline</p>
          <div className="space-y-3">
            {[
              { label: 'Open / Pending',   value: pendingLeads, color: 'amber',  total: s.totalLeads },
              { label: 'Distributed',      value: distLeads,    color: 'blue',   total: s.totalLeads },
              { label: 'Closed / Won',     value: closedLeads,  color: 'green',  total: s.totalLeads },
            ].map(item => {
              const c = colorMap[item.color];
              const w = s.totalLeads > 0 ? Math.round((item.value / s.totalLeads) * 100) : 0;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-base text-slate-800 mb-1">
                    <span>{item.label}</span>
                    <span className="tabular-nums font-medium">{item.value} <span className="text-slate-500">({w}%)</span></span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${c.bar} rounded-full transition-all`} style={{ width: `${w}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Conversion Metrics */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <p className="text-base font-medium text-slate-800 mb-4">Conversion Rate</p>
          <div className="flex items-center justify-center py-4">
            <div className="text-center">
              <p className="text-4xl font-semibold text-slate-900 tabular-nums">
                {con.closureRate || '0%'}
              </p>
              <p className="text-base text-slate-500 mt-1">Lead Closure Rate</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-lg font-semibold text-slate-900 tabular-nums">{con.totalLeads ?? 0}</p>
              <p className="text-base text-slate-500">Total Leads</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-lg font-semibold text-green-700 tabular-nums">{con.closedLeads ?? 0}</p>
              <p className="text-base text-slate-500">Closed</p>
            </div>
          </div>
        </div>

        {/* Plan Comparison */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <p className="text-base font-medium text-slate-800 mb-4">Subscription Plans</p>
          <div className="space-y-3">
            {pln.length > 0 ? pln.map((plan: any, i: number) => (
              <div key={plan.name} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-green-400' : i === 1 ? 'bg-blue-400' : 'bg-purple-400'}`} />
                  <span className="text-base text-slate-800">{plan.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-base font-medium text-slate-900 tabular-nums">{plan.vendorCount} vendors</p>
                  <p className="text-base text-slate-500">{plan.totalLeads} leads</p>
                </div>
              </div>
            )) : (
              <p className="text-base text-slate-500 text-center py-4">No plan data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Top Categories ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <p className="text-base font-medium text-slate-800 mb-4">Category Performance</p>
        {cat.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {cat.slice(0, 10).map((c: any) => (
              <div key={c.id} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                <p className="text-base font-medium text-slate-900 truncate">{c.name}</p>
                <p className="text-base text-slate-500 mt-1">{c._count.vendors} vendors</p>
                <p className="text-base text-[#164e33] font-medium">{c._count.leads} leads</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-base text-slate-500 text-center py-6">No category data yet</p>
        )}
      </div>

      {/* ── Location + Keywords ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Vendor Locations */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-slate-600" />
            <p className="text-base font-medium text-slate-800">Vendor Locations</p>
          </div>
          <div className="space-y-2">
            {vLoc.length > 0 ? vLoc.slice(0, 6).map((loc: any, i: number) => {
              const max = vLoc[0]?._count?.id || 1;
              const w   = Math.round((loc._count.id / max) * 100);
              return (
                <div key={loc.city || i}>
                  <div className="flex justify-between text-base text-slate-800 mb-1">
                    <span className="capitalize">{loc.city || 'Unknown'}</span>
                    <span className="tabular-nums text-slate-500">{loc._count.id}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full" style={{ width: `${w}%` }} />
                  </div>
                </div>
              );
            }) : <p className="text-base text-slate-500 text-center py-4">No location data yet</p>}
          </div>
        </div>

        {/* Lead Locations */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-amber-500" />
            <p className="text-base font-medium text-slate-800">Lead Hotspots</p>
          </div>
          <div className="space-y-2">
            {lLoc.length > 0 ? lLoc.slice(0, 6).map((loc: any, i: number) => {
              const max = lLoc[0]?._count?.id || 1;
              const w   = Math.round((loc._count.id / max) * 100);
              return (
                <div key={loc.city || i}>
                  <div className="flex justify-between text-base text-slate-800 mb-1">
                    <span className="capitalize">{loc.city || 'Unknown'}</span>
                    <span className="tabular-nums text-slate-500">{loc._count.id} leads</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${w}%` }} />
                  </div>
                </div>
              );
            }) : <p className="text-base text-slate-500 text-center py-4">No lead location data yet</p>}
          </div>
        </div>
      </div>

      {/* ── Keywords ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Vendor Keywords */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-4 h-4 text-purple-500" />
            <p className="text-base font-medium text-slate-800">Top Vendor Keywords</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {vKw.length > 0 ? vKw.map((kw: any) => (
              <span key={kw.name}
                className="px-2.5 py-1 bg-purple-50 border border-purple-100 rounded-lg text-base text-purple-700">
                #{kw.name}
                <span className="ml-1 text-purple-400">({kw._count?.vendors ?? kw.count ?? 0})</span>
              </span>
            )) : <p className="text-base text-slate-500 text-center py-4 w-full">No keywords yet</p>}
          </div>
        </div>

        {/* Lead Search Keywords */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-4 h-4 text-green-500" />
            <p className="text-base font-medium text-slate-800">Buyer Search Terms</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {lKw.length > 0 ? lKw.map((kw: any) => (
              <span key={kw.searchKeyword}
                className="px-2.5 py-1 bg-green-50 border border-green-100 rounded-lg text-base text-green-700">
                {kw.searchKeyword}
                <span className="ml-1 text-green-400">({kw._count?.id ?? 0})</span>
              </span>
            )) : <p className="text-base text-slate-500 text-center py-4 w-full">No search data yet</p>}
          </div>
        </div>
      </div>

      {/* ── Recent Leads ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <p className="text-base font-medium text-slate-800 mb-4">Recent Leads</p>
        {(data?.recentLeads?.length ?? 0) > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-base whitespace-nowrap min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-base text-slate-500 font-medium py-2 pr-4">Buyer</th>
                  <th className="text-left text-base text-slate-500 font-medium py-2 pr-4">City</th>
                  <th className="text-left text-base text-slate-500 font-medium py-2 pr-4">Vendor</th>
                  <th className="text-left text-base text-slate-500 font-medium py-2 pr-4">Status</th>
                  <th className="text-left text-base text-slate-500 font-medium py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.recentLeads.map((lead: any) => (
                  <tr key={lead.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-2.5 pr-4 text-slate-900">{lead.buyerName || '—'}</td>
                    <td className="py-2.5 pr-4 text-slate-700 capitalize">{lead.city || '—'}</td>
                    <td className="py-2.5 pr-4 text-slate-700">{lead.vendor?.businessName || '—'}</td>
                    <td className="py-2.5 pr-4">
                      <span className={`px-2 py-0.5 rounded-md text-base font-medium ${
                        lead.status === 'CLOSED'       ? 'bg-green-100 text-green-700' :
                        lead.status === 'PENDING'      ? 'bg-amber-100 text-amber-700' :
                        lead.status === 'DISTRIBUTED'  ? 'bg-blue-100 text-slate-800'   :
                        'bg-gray-100 text-slate-700'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-base text-slate-500">
                      {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-base text-slate-500 text-center py-6">No leads recorded yet</p>
        )}
      </div>

    </div>
  );
}



