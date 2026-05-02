'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import {
  CheckCircle2, RefreshCw, ShieldCheck, Clock,
  AlertTriangle, Lock, Gem, Package2,
  Star, Zap, TrendingUp, Headphones,
  BadgeCheck, Eye, Crown, ChevronRight, CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';
import Script from 'next/script';

/* ─── helpers ─── */
function daysLeft(expiry: string | null): number {
  if (!expiry) return 0;
  return Math.max(0, Math.ceil((new Date(expiry).getTime() - Date.now()) / 86400000));
}
function cycleUsed(expiry: string | null): number {
  if (!expiry) return 0;
  const left = daysLeft(expiry);
  return Math.min(100, Math.round(((30 - left) / 30) * 100));
}

/* ─── per-plan visual config — works for ANY plan admin creates ─── */
const PALETTE = [
  { accent: '#2e7d32', bg: '#f1f8e9', border: '#c8e6c9' },  // green
  { accent: '#1565c0', bg: '#e3f2fd', border: '#90caf9' },  // blue
  { accent: '#6a1b9a', bg: '#f3e5f5', border: '#ce93d8' },  // purple
  { accent: '#e65100', bg: '#fff3e0', border: '#ffcc80' },  // orange
  { accent: '#00695c', bg: '#e0f2f1', border: '#80cbc4' },  // teal
  { accent: '#b71c1c', bg: '#ffebee', border: '#ef9a9a' },  // red
];
function getPlanStyle(pkg: any, idx: number = 0) {
  const n = (pkg?.name || '').toLowerCase();
  // pick color: keyword match first, else cycle through palette by card index
  let color = PALETTE[idx % PALETTE.length];
  if (n.includes('diamond'))  color = PALETTE[1];
  if (n.includes('platinum')) color = PALETTE[2];
  if (n.includes('gold'))     color = PALETTE[3];
  if (n.includes('basic') || n.includes('starter') || n.includes('free')) color = PALETTE[0];
  if (n.includes('premium') || n.includes('pro'))  color = PALETTE[4];

  // icon
  let icon = <Package2 className="w-5 h-5" />;
  if (n.includes('diamond'))  icon = <Gem className="w-5 h-5" />;
  if (n.includes('platinum') || n.includes('premium')) icon = <Crown className="w-5 h-5" />;
  if (n.includes('gold') || n.includes('star'))   icon = <Star className="w-5 h-5" />;
  if (n.includes('zap') || n.includes('pro'))     icon = <Zap className="w-5 h-5" />;

  // features: from DB features[] array first, then description, then defaults
  let features: string[] = [];
  if (Array.isArray(pkg?.features) && pkg.features.length > 0) {
    features = pkg.features;
  } else if (pkg?.description) {
    features = pkg.description
      .split(/[,\n]/)
      .map((f: string) => f.trim())
      .filter(Boolean);
  }
  if (features.length === 0) {
    // fallback features by tier keyword
    if (n.includes('diamond') || n.includes('premium'))
      features = ['Trusted Badge', 'Higher Ranking Priority', 'Advanced Visibility', 'Diamond Leads', 'Premium Exposure'];
    else if (n.includes('platinum'))
      features = ['Priority Listing', 'Verified Badge', 'Dedicated Leads', 'Priority Support'];
    else if (n.includes('gold'))
      features = ['Directory Listing', 'Verified Badge', 'Shared Leads', 'Email Support'];
    else
      features = ['Directory Listing', 'Verified Badge', 'Shared Leads', 'Standard Support'];
  }

  return {
    accentColor: color.accent,
    lightBg:     color.bg,
    borderColor: color.border,
    icon,
    features,
    note: (n.includes('diamond') || n.includes('platinum'))
      ? 'Higher plan does not guarantee top ranking.' : null,
    tagline: pkg?.description
      ? ''
      : n.includes('basic') || n.includes('starter')
        ? 'Get started on the marketplace'
        : 'Enhanced visibility for your business',
  };
}

export default function VendorBilling() {
  const [vendor,    setVendor]   = useState<any>(null);
  const [packages,  setPackages] = useState<any[]>([]);
  const [loading,   setLoading]  = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [success,   setSuccess]  = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [p, pkgs] = await Promise.all([
          apiFetch('/vendors/me'),
          apiFetch('/vendors/packages'),
        ]);
        setVendor(p.data);
        // Show ALL plans from admin, sorted by price
        const sorted = (pkgs.data || []).sort((a: any, b: any) => a.price - b.price);
        setPackages(sorted);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const currentPkg = vendor?.package;
  const days       = daysLeft(vendor?.planExpiry);
  const used       = cycleUsed(vendor?.planExpiry);
  const isExpired  = vendor?.planExpiry && days === 0;
  const isSoon     = days > 0 && days <= 7;

  const handleSubscribe = async (pkg: any) => {
    try {
      setUpgrading(pkg.id);
      // FREE ACTIVATION — no payment required (demo/test mode)
      await apiFetch('/payments/free-activate', {
        method: 'POST',
        body: JSON.stringify({ packageId: pkg.id }),
      });
      setSuccess(true);
      setTimeout(() => window.location.reload(), 1800);
    } catch (err: any) {
      alert(err.message || 'Failed to activate subscription. Please try again.');
    } finally {
      setUpgrading(null);
    }
  };

  /* ── skeleton ── */
  if (loading) return (
    <div className="space-y-5 animate-pulse">
      <div className="h-8 w-52 bg-gray-200/70 rounded-xl" />
      <div className="h-36 bg-gray-200/70 rounded-2xl" />
      <div className="grid grid-cols-3 gap-4">
        <div className="h-80 bg-gray-200/70 rounded-2xl" />
        <div className="h-80 bg-gray-200/70 rounded-2xl" />
        <div className="h-80 bg-gray-200/70 rounded-2xl" />
      </div>
    </div>
  );

  /* ── success ── */
  if (success) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
        <CheckCircle2 className="w-10 h-10 text-green-600" />
      </div>
      <h2 className="text-xl font-semibold text-slate-900">Payment Successful!</h2>
      <p className="text-slate-700 text-base">Your subscription is now active. Reloading...</p>
    </div>
  );

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="max-w-5xl space-y-7 pb-20">

        {/* ── page title ── */}
        <div>
          <h1 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-slate-700" />
            Billing
          </h1>
          <p className="text-base text-slate-500 mt-0.5">Manage your subscription plan</p>
        </div>

        {/* ── expiry alert ── */}
        {(isExpired || isSoon) && (
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-base ${
            isExpired
              ? 'bg-red-50 border-red-200 text-red-600'
              : 'bg-amber-50 border-amber-200 text-amber-600'
          }`}>
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {isExpired
              ? 'Your subscription has expired. Choose a plan below to renew.'
              : `Plan expires in ${days} day${days > 1 ? 's' : ''}. Renew soon to keep your listing active.`}
          </div>
        )}

        {/* ── current plan card ── */}
        <div className="bg-white rounded-none border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <span className="text-base font-medium text-slate-800">Current Subscription</span>
            <span className={`text-base px-2.5 py-0.5 rounded-full font-medium ${
              isExpired ? 'bg-red-100 text-red-600'
              : isSoon  ? 'bg-amber-100 text-amber-600'
              : currentPkg ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-slate-700'
            }`}>
              {isExpired ? 'Expired' : isSoon ? 'Expiring Soon' : currentPkg ? 'Active' : 'No Plan'}
            </span>
          </div>

          <div className="px-6 py-5">
            {currentPkg ? (() => {
              const style = getPlanStyle(currentPkg.name);
              return (
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center border"
                        style={{ background: style.lightBg, color: style.accentColor, borderColor: style.borderColor }}>
                        {style.icon}
                      </div>
                      <div>
                        <p className="text-base font-semibold text-slate-900">{currentPkg.name} Plan</p>
                        <p className="text-base text-slate-500">₹{currentPkg.price?.toLocaleString()}/month</p>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-base text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {vendor?.planExpiry
                            ? `Expires ${new Date(vendor.planExpiry).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
                            : 'No expiry set'}
                        </span>
                        <span className={isExpired ? 'text-red-500' : isSoon ? 'text-amber-500' : 'text-green-600'}>
                          {isExpired ? 'Expired' : `${days} days left`}
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${used}%`, background: isExpired ? '#ef4444' : isSoon ? '#f59e0b' : style.accentColor }} />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:w-52">
                    <div className="bg-gray-50 rounded-none px-3 py-3 text-center border border-gray-100">
                      <p className="text-base text-slate-500 mb-1">Monthly Leads</p>
                      <p className="text-base font-semibold text-slate-900">{currentPkg.monthlyLeads ?? currentPkg.leadLimit ?? '—'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-none px-3 py-3 text-center border border-gray-100">
                      <p className="text-base text-slate-500 mb-1">Priority</p>
                      <p className="text-base font-semibold text-slate-900">{currentPkg.priority ?? '—'}</p>
                    </div>
                  </div>
                </div>
              );
            })() : (
              <div className="flex items-center gap-3 text-slate-500 text-base py-2">
                <Package2 className="w-5 h-5 opacity-40" />
                No active subscription. Choose a plan below to get started.
              </div>
            )}
          </div>
        </div>

        {/* ── available plans ── */}
        <div>
          <h2 className="text-base font-medium text-slate-700 mb-3 uppercase tracking-wide">
            Available Plans
          </h2>

          {packages.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-gray-200 rounded-2xl text-slate-500 text-base">
              No plans available. Please contact admin.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {packages.map((pkg: any, idx: number) => {
                const isCurrent = vendor?.packageId === pkg.id;
                const style     = getPlanStyle(pkg, idx);

                return (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all flex flex-col ${
                      isCurrent
                        ? 'ring-1'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow'
                    }`}
                    style={isCurrent ? { borderColor: style.accentColor, boxShadow: `0 0 0 1px ${style.accentColor}30` } : {}}
                  >
                    {/* color bar */}
                    <div className="h-0.5 w-full" style={{ background: style.accentColor }} />

                    <div className="p-6 space-y-4 flex flex-col flex-1">
                      {/* top row: icon + name + active badge */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: style.lightBg, color: style.accentColor }}>
                            <span className="scale-90">{style.icon}</span>
                          </div>
                          <p className="text-base font-semibold text-slate-900">{pkg.name}</p>
                        </div>
                        {isCurrent && (
                          <span className="text-base px-1.5 py-0.5 rounded-full font-medium"
                            style={{ background: style.lightBg, color: style.accentColor }}>
                            Active
                          </span>
                        )}
                      </div>

                      {/* price */}
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-semibold text-slate-900">₹{pkg.price?.toLocaleString()}</span>
                          <span className="text-base text-slate-500">/month</span>
                        </div>
                        {pkg.description && (
                          <p className="text-base text-slate-500 mt-1">{pkg.description}</p>
                        )}
                      </div>

                      {/* plan details */}
                      <div className="flex flex-col gap-2 flex-1">
                        <p className="text-base font-semibold text-slate-500 uppercase ">Plan Details</p>
                        <div className="flex items-center gap-2 text-base text-slate-800">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-[#007367]/50" />
                          {pkg.monthlyLeads ?? 0} Monthly Leads
                        </div>
                        <div className="flex items-center gap-2 text-base text-slate-800">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-amber-500" />
                          {pkg.leadLimit ?? 0} Lead Limit
                        </div>
                        <div className="flex items-center gap-2 text-base text-slate-800">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-[#007367]/50" />
                          Priority: {pkg.priority ?? 1}
                        </div>
                        <div className="flex items-center gap-2 text-base text-slate-800">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-purple-500" />
                          Ranking Weight: {pkg.rankingWeight ?? 0}
                        </div>

                        {/* features from DB */}
                        {Array.isArray(pkg.features) && pkg.features.length > 0 && (
                          <>
                            <p className="text-base font-semibold text-slate-500 uppercase  mt-2">Features</p>
                            {pkg.features.map((f: string) => (
                              <div key={f} className="flex items-center gap-2 text-base text-slate-800">
                                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: style.accentColor }} />
                                {f}
                              </div>
                            ))}
                          </>
                        )}
                      </div>

                      {/* CTA */}
                      <button
                        disabled={isCurrent || upgrading !== null}
                        onClick={() => handleSubscribe(pkg)}
                        className="w-full py-2.5 rounded-xl text-base font-medium transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                        style={
                          isCurrent || upgrading !== null
                            ? { background: '#f3f4f6', color: '#9ca3af' }
                            : { background: style.accentColor, color: '#fff' }
                        }
                      >
                        {upgrading === pkg.id ? (
                          <><RefreshCw className="w-4 h-4 animate-spin" /> Processing...</>
                        ) : isCurrent ? (
                          <><ShieldCheck className="w-4 h-4" /> Current Plan</>
                        ) : !currentPkg ? (
                          <>Get Started <ChevronRight className="w-4 h-4" /></>
                        ) : (
                          <>Switch Plan <ChevronRight className="w-4 h-4" /></>
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>


        {/* ── how it works ── */}
        <div className="bg-white border border-gray-200 rounded-none shadow-sm p-5">
          <p className="text-base font-medium text-slate-800 mb-4">How It Works</p>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Select Plan',               color: '#2e7d32', icon: <Package2 className="w-4 h-4" /> },
              { label: 'Secure Payment',             color: '#1565c0', icon: <Lock className="w-4 h-4" /> },
              { label: 'Instant Activation',         color: '#e65100', icon: <Zap className="w-4 h-4" /> },
              { label: 'Ranking & Expiry Update',    color: '#6a1b9a', icon: <TrendingUp className="w-4 h-4" /> },
              { label: 'Email & WhatsApp Alert',     color: '#00695c', icon: <BadgeCheck className="w-4 h-4" /> },
            ].map((s, i) => (
              <div key={s.label} className="flex items-center gap-2">
                {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-300" />}
                <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-none px-3 py-1.5">
                  <span style={{ color: s.color }}>{s.icon}</span>
                  <span className="text-base text-slate-800">{s.label}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-base text-slate-500 mt-4 flex items-center gap-1.5">
            <Lock className="w-3 h-3" />
            All transactions secured and encrypted by Razorpay
          </p>
        </div>

      </div>
    </>
  );
}


