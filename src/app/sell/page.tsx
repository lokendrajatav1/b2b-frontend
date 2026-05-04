'use client';

import React from 'react';
import { CheckCircle2, TrendingUp, Zap, ShieldCheck, PieChart, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SellWithUsPage() {
  const benefits = [
    { title: 'Hyper Local Reach', desc: 'Connect with buyers in your city and state with zero effort.', icon: TrendingUp, color: '#164e33' },
    { title: 'Verified Trust', desc: 'Get a TrustSeal and boost your business credibility.', icon: ShieldCheck, color: '#f58220' },
    { title: 'Sales Analytics', desc: 'Detailed insights into what buyers are looking for in your category.', icon: PieChart, color: '#164e33' },
    { title: 'Instant Inquiries', desc: 'Receive real-time leads directly on your dashboard.', icon: Zap, color: '#f58220' },
  ];

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      {/* Hero */}
      <section className="pt-28 pb-16 bg-white border-b border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-[#164e33]/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#f58220]/[0.08] text-[#f58220] text-base font-semibold px-4 py-1.5 rounded-full tracking-wide uppercase">
              <Users className="w-3.5 h-3.5" /> For Suppliers
            </div>
            <h1 className="text-3xl md:text-5xl font-semibold text-slate-900  leading-tight">
              Grow your business <br/> 
              with <span className="text-[#164e33]">Confidence</span>
            </h1>
            <p className="text-base md:text-lg text-slate-500 leading-relaxed font-normal max-w-lg">
              List your products on India's most trusted B2B marketplace and start 
              receiving verified inquiries from millions of buyers.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/(auth)/register" className="px-7 py-3.5 bg-[#164e33] hover:bg-[#113f29] text-white rounded-xl font-medium text-base transition-all flex items-center gap-2.5 active:scale-[0.98]">
                Register as Vendor <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="relative">
             <div className="aspect-video bg-[#f8faf9] rounded-2xl border border-gray-100 overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#164e33]/[0.03] to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg text-[#164e33] group-hover:scale-110 transition-transform">
                      <Zap className="w-8 h-8 fill-[#164e33]" />
                   </div>
                </div>
             </div>
             {/* Floating Badge */}
             <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-md flex items-center gap-3">
                <div className="w-9 h-9 bg-[#164e33]/10 text-[#164e33] rounded-xl flex items-center justify-center">
                   <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                   <p className="text-base font-semibold text-slate-500 uppercase  leading-none">Growth rate</p>
                   <p className="text-lg font-semibold text-slate-900 mt-0.5">+240%</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 space-y-2">
             <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 ">Why sell with us?</h2>
             <p className="text-slate-500 text-base font-normal">We provide the tools, you provide the products. Together we grow.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-md transition-all group">
                <div 
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-colors"
                  style={{ backgroundColor: `${benefit.color}10` }}
                >
                  <benefit.icon className="w-5 h-5" style={{ color: benefit.color }} />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2 ">{benefit.title}</h3>
                <p className="text-slate-500 text-base leading-relaxed font-normal">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-7">
                 <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 ">
                   Start selling in <br/><span className="text-[#164e33]">3 Easy Steps</span>
                 </h2>
                 <div className="space-y-5">
                    {[
                      { step: '01', title: 'Create Account', desc: 'Register with your GST and business details.' },
                      { step: '02', title: 'List Products', desc: 'Upload high-quality images and descriptions.' },
                      { step: '03', title: 'Get Leads', desc: 'Start receiving verified inquiries from buyers.' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-5 items-start group">
                         <div className="text-3xl font-semibold text-gray-100 group-hover:text-[#164e33]/20 transition-colors shrink-0 w-10">{item.step}</div>
                         <div>
                            <h4 className="text-base font-semibold text-slate-900 mb-0.5">{item.title}</h4>
                            <p className="text-slate-500 text-base font-normal">{item.desc}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="p-8 bg-[#f8faf9] rounded-2xl border border-gray-100 space-y-6">
                 <h3 className="text-lg font-semibold text-slate-900">Frequently Asked</h3>
                 <div className="space-y-3">
                    {[
                      'How much does it cost to list?',
                      'Is GST mandatory for selling?',
                      'How do I receive payments?',
                      'How are rankings calculated?'
                    ].map((q, i) => (
                      <div key={i} className="p-4 bg-white rounded-xl border border-gray-100 hover:border-[#164e33]/20 transition-colors cursor-pointer flex items-center justify-between group">
                         <span className="font-medium text-base text-slate-800 group-hover:text-slate-900 transition-colors">{q}</span>
                         <ArrowRight className="w-4 h-4 text-[#164e33] opacity-40 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
         <div className="max-w-7xl mx-auto p-10 md:p-14 bg-[#164e33]/[0.04] rounded-2xl text-center border border-[#164e33]/10">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900  leading-tight mb-3">Ready to scale your <br/> business with us?</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-base font-normal mb-6">Join 50,000+ verified suppliers and brands already growing on our platform.</p>
            <div className="flex justify-center gap-3">
               <Link href="/(auth)/register" className="px-8 py-3.5 bg-[#164e33] text-white rounded-xl font-medium text-base hover:bg-[#113f29] transition-all">Get Started Now</Link>
            </div>
         </div>
      </section>
    </div>
  );
}


