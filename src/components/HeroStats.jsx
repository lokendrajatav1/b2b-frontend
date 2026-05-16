"use client";

import React from "react";
import { Users, Package, Building2, ShieldCheck } from "lucide-react";

const HeroStats = () => {
  return (
    <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-12 w-full pb-8 lg:pb-6 mt-6 lg:mt-0 shrink-0 hidden lg:block">
      <div className="bg-[#164e33] rounded-lg py-4 lg:py-5 px-4 lg:px-8 grid grid-cols-2 lg:flex lg:flex-nowrap items-center justify-around text-white gap-4 lg:gap-6 shadow-2xl border border-white/5">
        <StatBox icon={<Users size={16} className="text-[#4ade80]" />} num="2,50,000+" label="Verified Vendors" />
        <div className="h-8 w-px bg-white/10 hidden lg:block"></div>
        <StatBox icon={<Package size={16} className="text-[#fbbf24]" />} num="10,00,000+" label="Products Listed" />
        <div className="h-8 w-px bg-white/10 hidden lg:block"></div>
        <StatBox icon={<Building2 size={16} className="text-[#60a5fa]" />} num="50,000+" label="Cities Covered" />
        <div className="h-8 w-px bg-white/10 hidden lg:block"></div>
        <StatBox icon={<ShieldCheck size={16} className="text-[#a78bfa]" />} num="100%" label="Trusted Platform" />
      </div>
    </div>
  );
};

const StatBox = ({ icon, num, label }) => (
  <div className="flex items-center gap-2.5 sm:gap-3.5">
    <div className="bg-white/10 p-2 sm:p-3 rounded-lg shrink-0">{icon}</div>
    <div className="min-w-0">
      <p className="text-sm sm:text-base lg:text-xl font-bold leading-none text-white truncate">{num}</p>
      <p className="text-[8px] sm:text-[9px] text-white/70 mt-1 font-bold uppercase tracking-wider">{label}</p>
    </div>
  </div>
);

export default HeroStats;
