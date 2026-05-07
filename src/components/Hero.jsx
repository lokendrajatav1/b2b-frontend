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
      <section className="relative min-h-[850px] lg:min-h-[900px] flex flex-col overflow-hidden bg-[#f4f7f6]">
        
        {/* --- FIX: Background Image Logic --- */}
        <div className="absolute inset-0 z-0">
           <div className="absolute top-0 right-0 w-full lg:w-[60%] h-full overflow-hidden">
              <img 
                // Next.js mein public folder ki images ko direct "/" se access karte hain
                src="/Banner.png" 
                alt="B2B Hero Background" 
                className="w-full h-full object-cover object-right"
              />
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#f4f7f6] via-[#f4f7f6]/60 to-transparent lg:block hidden"></div>
           </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full pt-16 lg:pt-24 flex-1">
          {/* Top Content */}
          <div className="max-w-2xl mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-[72px] font-serif text-[#164e33] leading-[1.05] mb-8 tracking-tight">
              Find trusted partners <br /> to grow your business.
            </h1>
            <p className="text-slate-600 text-lg md:text-xl mb-10 max-w-lg leading-relaxed font-medium">
              India's most reliable B2B marketplace to connect, collaborate & grow with verified businesses.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <button 
                onClick={() => handleSearch('match')}
                className="bg-[#164e33] text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 shadow-2xl shadow-green-900/30 hover:bg-[#113f29] transition-all active:scale-95"
              >
                <Users size={22} /> Match me with vendors
              </button>
              <button 
                onClick={() => handleSearch('browse')}
                className="bg-white border border-slate-200 px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:bg-slate-50 transition-all active:scale-95 text-slate-700 shadow-sm"
              >
                <Building2 size={22} /> Explore the directory
              </button>
            </div>

            {/* Search Bar Capsule */}
            <div className="bg-white p-2.5 rounded-[24px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col md:flex-row gap-2 max-w-4xl">
               <div className="flex-[1.5] flex items-center px-5 gap-3 bg-white">
                  <Search size={22} className="text-slate-400" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What product or service do you need?" 
                    className="w-full bg-transparent py-4 focus:outline-none text-base font-medium text-slate-800 placeholder:text-slate-400" 
                  />
               </div>
               <div className="w-px h-10 bg-slate-100 self-center hidden md:block"></div>
               <div className="flex-1 flex items-center px-5 gap-3 bg-white">
                  <MapPin size={22} className="text-slate-400" />
                  <input 
                    type="text" 
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    placeholder="Your City..." 
                    className="w-full bg-transparent py-4 focus:outline-none text-base font-medium text-slate-800 placeholder:text-slate-400" 
                  />
               </div>
               <button 
                 onClick={() => handleSearch('match')}
                 className="bg-[#164e33] text-white px-10 py-4 rounded-[13px] font-bold flex items-center justify-center gap-3 hover:bg-[#113f29] transition-all"
               >
                  <Sparkles size={20} /> Get Matched
               </button>
            </div>
          </div>
          
          {/* Floating Verified Badge */}
          <div className="absolute right-6 top-32 lg:right-16 lg:top-48 bg-white/90 backdrop-blur-md p-6 rounded-[20px] shadow-2xl border border-white/50 max-w-[260px] hidden lg:block">
             <div className="flex items-start gap-4">
                <div className="bg-[#164e33] p-3 rounded-xl text-white shadow-lg">
                   <ShieldCheck size={28} />
                </div>
                <div>
                   <p className="font-bold text-[17px] leading-tight text-[#164e33]">Verified & Trusted Businesses</p>
                   <p className="text-xs text-slate-500 mt-2 font-semibold">Quality you can rely on every time.</p>
                </div>
             </div>
          </div>

          {/* Popular Industries Section */}
          <div className="mt-16 mb-16">
            <div className="flex justify-between items-center mb-8">
              <div className="space-y-1">
                <h2 className="text-[19px] font-bold text-[#164e33] tracking-tight">Popular Industries</h2>
                <div className="w-12 h-1 bg-[#164e33] rounded-full"></div>
              </div>
              <Link href="/suppliers" className="text-[#164e33] font-bold text-sm flex items-center gap-2 text-[#164e33] transition-colors">
                View all industries <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-5">
              {[
                { icon: <Settings size={28} />, name: "Machine Parts" },
                { icon: <Factory size={28} />, name: "Industrial Machines" },
                { icon: <Box size={28} />, name: "Industrial Supplies" },
                { icon: <HardHat size={28} />, name: "Construction" },
                { icon: <PlusSquare size={28} />, name: "Hospitals & Labs" },
                { icon: <Pill size={28} />, name: "Drugs & Pharma" },
                { icon: <Cpu size={28} />, name: "Electronics" },
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => { setSearchQuery(item.name); handleSearch('browse', item.name); }}
                  className="group bg-white p-7 rounded-[28px] shadow-sm border border-transparent hover:border-[#164e33]/10 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 text-center"
                >
                  <div className="text-[#164e33] group-hover:text-[#164e33] transition-all">
                    {item.icon}
                  </div>
                  <span className="text-[13px] font-bold text-slate-700 group-hover:text-[#164e33] leading-tight">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Bar at Bottom */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full pb-12 mt-auto">
          <div className="bg-[#164e33] rounded-[32px] p-8 lg:p-10 flex flex-wrap lg:flex-nowrap items-center justify-around text-white gap-8 shadow-2xl">
            <StatBox icon={<Users className="text-[#4ade80]" />} num="2,50,000+" label="Verified Vendors" />
            <div className="h-12 w-px bg-white/10 hidden lg:block"></div>
            <StatBox icon={<Package className="text-[#fbbf24]" />} num="10,00,000+" label="Products Listed" />
            <div className="h-12 w-px bg-white/10 hidden lg:block"></div>
            <StatBox icon={<Building2 className="text-[#60a5fa]" />} num="50,000+" label="Cities Covered" />
            <div className="h-12 w-px bg-white/10 hidden lg:block"></div>
            <StatBox icon={<ShieldCheck className="text-[#a78bfa]" />} num="100%" label="Trusted Platform" />
          </div>
        </div>
      </section>
    </div>
  );
};

const StatBox = ({ icon, num, label }) => (
  <div className="flex items-center gap-5">
    <div className="bg-white/10 p-4 rounded-2xl">{icon}</div>
    <div>
      <p className="text-2xl font-bold leading-none text-white">{num}</p>
      <p className="text-[11px] text-white mt-1.5 font-bold uppercase ">{label}</p>
    </div>
  </div>
);

export default Hero;