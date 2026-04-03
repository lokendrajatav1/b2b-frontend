'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { 
  CreditCard, 
  CheckCircle2, 
  Star, 
  Zap, 
  Layers, 
  Calendar, 
  TrendingUp, 
  Database, 
  ShieldCheck, 
  ArrowUpRight, 
  LayoutDashboard,
  ShieldAlert,
  Clock,
  Briefcase,
  Globe,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import Script from 'next/script';

export default function VendorBilling() {
  const [vendor, setVendor] = useState<any>(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        const [profile, allPackages] = await Promise.all([
          apiFetch('/vendors/me'),
          apiFetch('/vendors/packages')
        ]);
        setVendor(profile.data);
        setPackages(allPackages.data);
      } catch (error) {
        console.error('Failed to fetch billing data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBillingData();
  }, []);

  const handleUpgrade = async (pkgId: string) => {
    try {
      setLoading(true);
      const res = await apiFetch('/payments/create-order', {
        method: 'POST',
        body: JSON.stringify({ packageId: pkgId })
      });
      const order = res.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_yourkey', // Ensure this is set in .env.local
        amount: order.amount,
        currency: order.currency,
        name: 'B2B Marketplace',
        description: 'Subscription Upgrade',
        order_id: order.id,
        handler: async function (response: any) {
          try {
            const verifyRes = await apiFetch('/payments/verify-payment', {
              method: 'POST',
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              })
            });
            alert('Payment Successful!');
            window.location.reload();
          } catch (err) {
            alert('Payment verification failed.');
          }
        },
        prefill: {
          name: vendor?.businessName,
          email: vendor?.email,
          contact: vendor?.phone
        },
        theme: {
          color: '#2563EB'
        }
      };
      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
    } catch (err) {
      console.error(err);
      alert('Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 animate-pulse bg-slate-50 rounded-2xl h-80 border border-slate-100"></div>;

  return (
    <div className="space-y-8 animate-simple-fade pb-20 p-2 md:p-0">
      {/* Clean Billing Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 mb-8">
        <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight flex items-center gap-3">
              Subscription
              <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
                  <Layers className="w-4 h-4" />
              </div>
            </h1>
            <p className="text-gray-500 font-medium text-sm">Manage your billing and upgrade your plan.</p>
        </div>
        
        <div className="bg-white border border-gray-200 px-6 py-3 rounded-xl text-gray-800 flex items-center gap-4 group shadow-sm">
            <div className="text-right">
                <p className="text-xs font-semibold text-gray-500 mb-0.5">Next Billing</p>
                <div className="text-sm font-semibold text-gray-900">{vendor?.planExpiry ? new Date(vendor.planExpiry).toLocaleDateString() : 'N/A'}</div>
            </div>
            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
                <CreditCard className="w-5 h-5 text-gray-600" />
            </div>
        </div>
      </div>

      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* Active Plan Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/20 rounded-full blur-[60px]"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between gap-10">
                <div className="space-y-8">
                    <div className="space-y-2">
                        <div className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold w-fit mb-4 border border-blue-500/20">
                           Current Plan
                        </div>
                        <h2 className="text-4xl font-bold tracking-tight capitalize">{vendor?.package?.name || 'Starter'}</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-10 text-center md:text-left">
                        <div className="space-y-1">
                            <p className="text-white/60 text-xs font-medium">Lead Limit</p>
                            <p className="text-xl font-bold flex items-center gap-2">
                               {vendor?.package?.leadLimit || 'Unlimited'} <span className="text-sm font-medium text-white/50">/ month</span>
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-white/60 text-xs font-medium">Ranking Boost</p>
                            <p className="text-xl font-bold text-blue-400">+{vendor?.package?.rankingWeight?.toFixed(1) || '0.0'}x</p>
                        </div>
                    </div>
                </div>

                <div className="md:w-64 space-y-4 bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
                   <h4 className="text-xs font-semibold text-white/50 border-b border-white/5 pb-3">Included Features</h4>
                   <div className="space-y-3 pt-1">
                      {vendor?.package?.features?.slice(0, 4).map((f: string) => (
                          <div key={f} className="flex items-center gap-2.5">
                             <CheckCircle2 className="w-4 h-4 text-blue-400" />
                             <span className="text-sm font-medium text-white/80">{f}</span>
                          </div>
                      )) || (
                          <div className="text-white/50 text-sm">Standard analytics</div>
                      )}
                   </div>
                </div>
            </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                   <Clock className="w-4 h-4 text-amber-500" />
                   Renewal Status
                </h3>
                
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-gray-500">Current Cycle</span>
                        <span className="font-bold text-gray-900">{vendor?.planExpiry ? new Date(vendor.planExpiry).toLocaleDateString('default', { month: 'long', year: 'numeric' }) : 'No active cycle'}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 w-[65%] rounded-full"></div>
                    </div>
                    <p className="text-xs font-medium text-gray-500">Your subscription will automatically renew.</p>
                </div>
            </div>
        </div>
      </div>

      {/* Upgrade Matrix: Clean Columns */}
      <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                 Upgrade Your Plan
                 <Award className="w-4 h-4 text-blue-500" />
              </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg: any) => (
                  <div key={pkg.id} className={`p-6 rounded-2xl border relative flex flex-col ${ vendor?.packageId === pkg.id ? 'bg-blue-50/30 border-blue-200' : 'bg-white border-gray-200 hover:border-blue-100 transition-colors' }`}>
                      {vendor?.packageId === pkg.id && (
                          <div className="absolute top-4 right-4 bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-bold">Current Plan</div>
                      )}
                      
                      <div className="space-y-6 flex-1 flex flex-col">
                          <div className="space-y-1">
                              <h4 className="text-lg font-bold text-gray-900 capitalize">{pkg.name}</h4>
                              <p className="text-sm font-medium text-gray-500">For growing businesses</p>
                          </div>

                          <div className="flex items-end gap-1.5">
                              <span className="text-3xl font-bold text-gray-900">₹{pkg.price.toLocaleString()}</span>
                              <span className="text-sm font-medium text-gray-500 pb-1">/ month</span>
                          </div>

                          <div className="space-y-3 pt-6 border-t border-gray-100 flex-1">
                                <div className="flex items-center gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm font-medium text-gray-700">{pkg.leadLimit || 'Unlimited'} Marketplace Leads</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm font-medium text-gray-700">{pkg.rankingWeight || '1.0'}x Search Ranking Boost</span>
                                </div>
                          </div>

                          <button 
                            disabled={vendor?.packageId === pkg.id}
                            onClick={() => handleUpgrade(pkg.id)}
                            className={`w-full py-3 mt-6 rounded-xl font-semibold text-sm transition-all ${ vendor?.packageId === pkg.id ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm' }`}
                          >
                             {vendor?.packageId === pkg.id ? 'Current' : 'Select Plan'}
                          </button>
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
}
