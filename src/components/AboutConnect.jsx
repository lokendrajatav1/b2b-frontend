"use client";

import React from "react";
import { Star, ShieldCheck, MessageCircle } from "lucide-react";

const AboutConnect = () => {
  return (
    <div className="lg:flex-3 space-y-8">
      <div className="space-y-4 text-left">
        <h2 className="text-3xl md:text-5xl font-semibold text-[#333333] leading-tight font-outfit">
          We connect <br />
          <span className="text-[#333333]/90">Buyers & Sellers</span>
        </h2>
        <p className="text-slate-900 text-lg font-medium leading-relaxed max-w-xl font-inter">
          B2B Community is India&apos;s largest online B2B marketplace,
          connecting buyers with vendors across the nation.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4">
        <div className="flex flex-col items-center text-center space-y-3 group">
          <div className="w-10 md:w-14 h-10 md:h-14 rounded-full border-2 border-blue-200 flex items-center justify-center bg-blue-50 group-hover:bg-blue-100 transition-colors">
            <Star className="w-6 h-6 md:w-7 md:h-7 text-blue-500" />
          </div>
          <span className="font-semibold text-[#333333] text-sm md:text-base leading-tight">
            Trusted
            <br />
            Platform
          </span>
        </div>

        <div className="flex flex-col items-center text-center space-y-3 group">
          <div className="w-10 md:w-14 h-10 md:h-14 rounded-full border-2 border-emerald-200 flex items-center justify-center bg-emerald-50 group-hover:bg-emerald-100 transition-colors">
            <ShieldCheck className="w-6 h-6 md:w-7 md:h-7 text-emerald-500" />
          </div>
          <span className="font-semibold text-[#333333] text-sm md:text-base leading-tight">
            Safe &<br />
            Secure
          </span>
        </div>

        <div className="flex flex-col items-center text-center space-y-3 group">
          <div className="w-10 md:w-14 h-10 md:h-14 rounded-full border-2 border-amber-200 flex items-center justify-center bg-amber-50 group-hover:bg-amber-100 transition-colors">
            <MessageCircle className="w-6 h-6 md:w-7 md:h-7 text-amber-500" />
          </div>
          <span className="font-semibold text-[#333333] text-sm md:text-base leading-tight">
            Quick
            <br />
            Assistance
          </span>
        </div>
      </div>
    </div>
  );
};

export default AboutConnect;
