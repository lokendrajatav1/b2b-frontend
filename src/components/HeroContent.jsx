"use client";
import React from 'react';
import { Users, Building2 } from "lucide-react";

const HeroContent = ({ onMatch, onExplore }) => {
  return (
    <div className="max-w-2xl mb-4 lg:mb-8 shrink-0">
      <h1 className="text-[32px] sm:text-3xl lg:text-[42px] xl:text-[48px] font-sans font-extrabold text-[#164e33] leading-[1.1] mb-4 tracking-tight">
        Find trusted partners <br className="hidden sm:block" /> to grow your business.
      </h1>
      <p className="text-slate-900 lg:text-slate-600 text-[12px] sm:text-sm lg:text-base mb-6 max-w-md leading-relaxed font-bold lg:font-medium">
        India&apos;s most reliable B2B marketplace to connect, collaborate & grow with verified businesses.
      </p>

      <div className="flex flex-col sm:flex-row gap-2.5 mb-6">
        <button
          onClick={onMatch}
          className="bg-[#164e33] text-white px-5 py-3.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 hover:bg-[#113f29] transition-all active:scale-95 cursor-pointer"
        >
          <Users size={16} /> Match me with vendors
        </button>
        <button
          onClick={onExplore}
          className="bg-white border border-slate-200 px-5 py-3.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95 text-slate-700 shadow-sm cursor-pointer"
        >
          <Building2 size={16} /> Explore the directory
        </button>
      </div>
    </div>
  );
};

export default HeroContent;
