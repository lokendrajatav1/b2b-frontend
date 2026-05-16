"use client";
import React from "react";
import { Search, MapPin, Sparkles } from "lucide-react";

const HeroSearchBar = ({
  searchQuery,
  setSearchQuery,
  locationQuery,
  setLocationQuery,
  onSearch,
}) => {
  return (
    <div className="bg-white p-1 rounded-lg border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.12)] flex flex-col md:flex-row gap-1 lg:max-w-2xl shrink-0">
      <div className="flex-[1.5] flex items-center px-4 gap-2 bg-white rounded-lg">
        <Search size={16} className="text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products or services..."
          className="w-full bg-transparent py-2.5 md:py-3 focus:outline-none text-[13px] font-medium text-slate-800 placeholder:text-slate-500"
        />
      </div>

      <div className="hidden md:block w-px h-6 bg-slate-100 self-center"></div>

      <div className="flex-1 flex items-center px-4 gap-2 bg-white rounded-lg">
        <MapPin size={16} className="text-slate-400" />
        <input
          type="text"
          value={locationQuery}
          onChange={(e) => setLocationQuery(e.target.value)}
          placeholder="Your City..."
          className="w-full bg-transparent py-2.5 md:py-3 focus:outline-none text-[13px] font-medium text-slate-800 placeholder:text-slate-500"
        />
      </div>

      <button
        onClick={() => onSearch()}
        className="bg-[#164e33] text-white px-6 py-2.5 rounded-lg md:rounded-[7px] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#113f29] transition-all cursor-pointer shadow-md"
      >
        <Sparkles size={16} /> Get Matched
      </button>
    </div>
  );
};

export default HeroSearchBar;
