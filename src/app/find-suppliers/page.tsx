'use client';

import React from 'react';
import { Search, MapPin, ShieldCheck, Zap, Building2, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function FindSuppliersPage() {
  const categories = [
    { name: 'Industrial Supplies', count: '12k+' },
    { name: 'Building & Construction', count: '8k+' },
    { name: 'Electronics & Electrical', count: '15k+' },
    { name: 'Packaging & Printing', count: '5k+' },
  ];

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      {/* Hero */}
      <section className="pt-28 pb-16 bg-white border-b border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-[#007367]/[0.02] -translate-y-1/3 -translate-x-1/4 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#007367]/[0.08] text-[#007367] text-base font-semibold px-4 py-1.5 rounded-full tracking-wide uppercase">
              <Building2 className="w-3.5 h-3.5" /> For Buyers
            </div>
            <h1 className="text-3xl md:text-5xl font-semibold text-slate-900  leading-tight">
              Source from India's <br/> 
              <span className="text-[#007367]">Verified Sellers</span>
            </h1>
            <p className="text-base md:text-lg text-slate-500 leading-relaxed font-normal">
              Discover millions of products from thousands of verified manufacturers, 
              distributors, and wholesalers across 500+ cities.
            </p>
            
            <div className="p-2.5 bg-white border border-gray-200 rounded-2xl flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-[#f8faf9] rounded-xl">
                <Search className="w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="What are you looking for?"
                  className="bg-transparent outline-none w-full font-medium text-base text-slate-900 placeholder:text-slate-500"
                />
              </div>
              <Link href="/search" className="px-7 py-3 bg-[#007367] hover:bg-[#005e54] text-white rounded-xl font-medium text-base transition-all text-center">
                Search
              </Link>
            </div>
          </div>

          <div className="relative lg:block hidden">
             <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: ShieldCheck, title: 'Verified Only', color: '#007367' },
                  { icon: Zap, title: 'Instant Quote', color: '#e88c30' },
                  { icon: Package, title: 'Bulk Orders', color: '#007367' },
                  { icon: MapPin, title: 'Near Me', color: '#e88c30' },
                ].map((item, i) => (
                  <div 
                    key={i}
                    className="p-6 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-all group cursor-default"
                  >
                     <div 
                       className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform"
                       style={{ backgroundColor: `${item.color}10` }}
                     >
                        <item.icon className="w-5 h-5" style={{ color: item.color }} />
                     </div>
                     <h4 className="text-base font-semibold text-slate-900 ">{item.title}</h4>
                     <p className="text-base font-medium text-slate-500 uppercase tracking-wide mt-1">Quality Assured</p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 text-center mb-10">
           <h2 className="text-2xl md:text-3xl font-semibold text-slate-900  mb-2">Top Categories to Source</h2>
           <p className="text-slate-500 text-base font-normal">Explore the most demanded categories in the Indian market.</p>
        </div>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-5">
           {categories.map((cat, i) => (
              <div key={i} className="group p-6 bg-white border border-gray-100 rounded-2xl hover:border-[#007367]/20 hover:shadow-sm transition-all cursor-pointer">
                 <h4 className="text-base font-semibold text-slate-900 group-hover:text-[#007367] transition-colors">{cat.name}</h4>
                 <p className="text-[#007367] font-semibold text-base mt-1.5">{cat.count} <span className="text-slate-500 font-medium uppercase text-base tracking-wide ml-1">Suppliers</span></p>
                 <div className="mt-4 w-8 h-8 bg-[#f8faf9] rounded-full flex items-center justify-center group-hover:bg-[#007367] group-hover:text-white text-slate-500 transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />
                 </div>
              </div>
           ))}
        </div>
      </section>

      {/* Trust Banner - Soft instead of dark */}
      <section className="py-14 px-6">
        <div className="max-w-7xl mx-auto bg-[#007367]/[0.04] border border-[#007367]/10 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="max-w-xl text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-semibold text-slate-900  mb-2 leading-tight">Looking for something specific? <br/> Let our experts find it for you.</h2>
              <p className="text-slate-500 text-base font-normal">Post your requirement and get competitive quotes within 24 hours.</p>
           </div>
           <Link href="/post-requirement" className="px-7 py-3.5 bg-[#007367] text-white rounded-xl font-medium text-base hover:bg-[#005e54] transition-all shrink-0">Post Requirement</Link>
        </div>
      </section>
    </div>
  );
}
