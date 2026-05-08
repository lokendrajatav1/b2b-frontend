"use client";

import React, { useState } from "react";
import { Sparkles, Search, MapPin, ShieldCheck, ArrowRight, Users, Building2, Factory, Settings, Box, HardHat, PlusSquare, Pill, Cpu, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Hero = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  const handleSearch = (type = 'browse', specificQuery = null) => {
    const query = specificQuery !== null ? specificQuery.trim() : searchQuery.trim();
    const city = locationQuery.trim();
    if (type === 'match') {
      router.push(`/post-requirement?q=${encodeURIComponent(query)}&city=${encodeURIComponent(city)}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(query)}&city=${encodeURIComponent(city)}`);
    }
  };

  return (
    <div className="bg-white font-sans text-[#1a1a1a]">
      <section className="relative h-[calc(100vh-72px)] min-h-[500px] lg:min-h-[700px] flex flex-col bg-[#f4f7f6] overflow-x-hidden">
        
        {/* --- Desktop Background Image --- */}
        <div className="absolute inset-0 z-0 overflow-hidden lg:block hidden">
           <div className="absolute top-0 right-0 w-[60%] h-full">
              <img 
                src="/Banner.png" 
                alt="B2B Hero Background" 
                className="w-full h-full object-cover object-right"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#f4f7f6] via-[#f4f7f6]/80 to-transparent"></div>
           </div>
        </div>

        {/* --- Mobile Background Image (Clearer, Full Screen height for section) --- */}
        <div className="lg:hidden absolute inset-0 z-0 overflow-hidden">
          <img 
            src="/Banner.png" 
            alt="B2B Hero Background Mobile" 
            className="w-full h-full object-cover object-right opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#f4f7f6]/60 via-[#f4f7f6]/20 to-[#f4f7f6]/80"></div>
        </div>

        {/* Main Content Area */}
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-12 w-full flex-1 flex flex-col justify-center py-6 lg:py-0">
          
          {/* Central Section Wrapper */}
          <div className="flex flex-col justify-center lg:flex-1">
            {/* Top Content (Inside Banner Area) */}
            <div className="max-w-2xl mb-4 lg:mb-8 shrink-0">
              <h1 className="text-[32px] sm:text-3xl lg:text-[42px] xl:text-[48px] font-serif text-[#164e33] leading-[1.1] mb-4 tracking-tight">
                Find trusted partners <br className="hidden sm:block" /> to grow your business.
              </h1>
              <p className="text-slate-900 lg:text-slate-600 text-[12px] sm:text-sm lg:text-base mb-6 max-w-md leading-relaxed font-bold lg:font-medium">
                India's most reliable B2B marketplace to connect, collaborate & grow with verified businesses.
              </p>

              <div className="flex flex-col sm:flex-row gap-2.5 mb-6">
                <button 
                  onClick={() => handleSearch('match')}
                  className="bg-[#164e33] text-white px-5 py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 hover:bg-[#113f29] transition-all active:scale-95"
                >
                  <Users size={16} /> Match me with vendors
                </button>
                <button 
                  onClick={() => handleSearch('browse')}
                  className="bg-white border border-slate-200 px-5 py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95 text-slate-700 shadow-sm"
                >
                  <Building2 size={16} /> Explore the directory
                </button>
              </div>

              {/* Search Bar Capsule */}
              <div className="bg-white p-1 rounded-xl border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.12)] flex flex-col md:flex-row gap-1 lg:max-w-2xl shrink-0">
                 <div className="flex-[1.5] flex items-center px-4 gap-2 bg-white">
                    <Search size={16} className="text-slate-400" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products or services..." 
                      className="w-full bg-transparent py-2.5 md:py-2 focus:outline-none text-[13px] font-medium text-slate-800 placeholder:text-slate-500" 
                    />
                 </div>
                 <div className="hidden md:block w-px h-6 bg-slate-100 self-center"></div>
                 <div className="flex-1 flex items-center px-4 gap-2 bg-white">
                    <MapPin size={16} className="text-slate-400" />
                    <input 
                      type="text" 
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      placeholder="Your City..." 
                      className="w-full bg-transparent py-2.5 md:py-2 focus:outline-none text-[13px] font-medium text-slate-800 placeholder:text-slate-500" 
                    />
                 </div>
                 <button 
                   onClick={() => handleSearch('match')}
                   className="bg-[#164e33] text-white px-6 py-2.5 rounded-lg md:rounded-[7px] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#113f29] transition-all"
                 >
                    <Sparkles size={16} /> Get Matched
                 </button>
              </div>
            </div>
            
            {/* Floating Verified Badge (Desktop Only) */}
            <div className="absolute right-6 top-6 lg:right-12 lg:top-20 xl:top-24 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-2xl border border-white/50 max-w-[180px] hidden lg:block">
               <div className="flex items-start gap-2.5">
                  <div className="bg-[#164e33] p-2 rounded-lg text-white shadow-lg shrink-0">
                     <ShieldCheck size={18} />
                  </div>
                  <div>
                     <p className="font-bold text-[13px] leading-tight text-[#164e33]">Verified & Trusted</p>
                     <p className="text-[9px] text-slate-500 mt-0.5 font-semibold leading-normal">Quality you can rely on.</p>
                  </div>
               </div>
            </div>

            {/* Popular Industries Section (Hidden on Mobile) */}
            <div className="mt-4 lg:mt-6 z-10 hidden lg:block">
              <div className="flex justify-between items-center mb-3 lg:mb-4">
                <div className="space-y-0.5">
                  <h2 className="text-sm sm:text-[15px] font-bold text-[#164e33] tracking-tight">Popular Industries</h2>
                  <div className="w-6 h-0.5 bg-[#164e33] rounded-full"></div>
                </div>
                <Link href="/suppliers" className="text-[#164e33] font-bold text-[10px] lg:text-[11px] flex items-center gap-1.5 hover:translate-x-1 transition-transform">
                  View all <ArrowRight size={12} />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 xl:gap-3.5">
                {[
                  { icon: <Settings size={30} />, name: "Machine Parts" },
                  { icon: <Factory size={30} />, name: "Industrial Machines" },
                  { icon: <Box size={30} />, name: "Industrial Supplies" },
                  { icon: <HardHat size={30} />, name: "Construction" },
                  { icon: <PlusSquare size={30} />, name: "Hospitals & Labs" },
                  { icon: <Pill size={30} />, name: "Drugs & Pharma" },
                  { icon: <Cpu size={30} />, name: "Electronics" },
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => { setSearchQuery(item.name); handleSearch('browse', item.name); }}
                    className="group bg-white p-3 lg:p-3.5 rounded-xl shadow-sm border border-slate-100 lg:border-transparent lg:hover:border-[#164e33]/10 hover:shadow-lg transition-all cursor-pointer flex flex-col items-center justify-center gap-2 text-center min-h-[85px] lg:min-h-[110px]"
                  >
                    <div className="text-[#164e33]/60 group-hover:text-[#164e33] transition-all shrink-0">
                      {item.icon}
                    </div>
                    <span className="text-[9px] lg:text-[10px] font-bold text-slate-700 group-hover:text-[#164e33] leading-tight truncate w-full px-1">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar at Bottom (Hidden on Mobile) */}
        <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-12 w-full pb-8 lg:pb-6 mt-6 lg:mt-0 shrink-0 hidden lg:block">
          <div className="bg-[#164e33] rounded-xl py-4 lg:py-5 px-4 lg:px-8 grid grid-cols-2 lg:flex lg:flex-nowrap items-center justify-around text-white gap-4 lg:gap-6 shadow-2xl border border-white/5">
            <StatBox icon={<Users size={16} className="text-[#4ade80]" />} num="2,50,000+" label="Verified Vendors" />
            <div className="h-8 w-px bg-white/10 hidden lg:block"></div>
            <StatBox icon={<Package size={16} className="text-[#fbbf24]" />} num="10,00,000+" label="Products Listed" />
            <div className="h-8 w-px bg-white/10 hidden lg:block"></div>
            <StatBox icon={<Building2 size={16} className="text-[#60a5fa]" />} num="50,000+" label="Cities Covered" />
            <div className="h-8 w-px bg-white/10 hidden lg:block"></div>
            <StatBox icon={<ShieldCheck size={16} className="text-[#a78bfa]" />} num="100%" label="Trusted Platform" />
          </div>
        </div>
      </section>
    </div>
  );
};

const StatBox = ({ icon, num, label }) => (
  <div className="flex items-center gap-2.5 sm:gap-3.5">
    <div className="bg-white/10 p-2 sm:p-3 rounded-xl shrink-0">{icon}</div>
    <div className="min-w-0">
      <p className="text-sm sm:text-base lg:text-xl font-bold leading-none text-white truncate">{num}</p>
      <p className="text-[8px] sm:text-[9px] text-white/70 mt-1 font-bold uppercase tracking-wider">{label}</p>
    </div>
  </div>
);

export default Hero;