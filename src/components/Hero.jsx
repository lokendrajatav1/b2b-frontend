"use client";

import React, { useState } from "react";
import { Sparkles, Search, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const Hero = () => {
  const [activeTab, setActiveTab] = useState("match");
  return (
    <section className="hero-container relative w-full min-h-[600px] flex items-center overflow-hidden bg-[#ffffff]">
      {/* Background Image on Right */}
      <div className="hero-image-wrapper absolute right-0 top-0 w-3/4 h-full hidden lg:block">
        {/* <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#f5f3f3] via-[#f5f3f3]/80 to-transparent"></div> */}
        <Image
          src="/hero2.png"
          alt="B2B Marketplace"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="container mx-auto px-8 md:px-12 lg:px-16 relative z-20">
        <div className="max-w-2xl w-full">
          {/* Headline */}
          <h2 className="text-[35px] md:text-[56px] lg:text-[60px] leading-[1.1] mt-10 md:mt-0 font-bold text-[#05252e] mb-10 tracking-tight">
            Your gateway to trusted partnerships.
          </h2>

          
          {/* Toggle Buttons */}
          <div className="hero-toggle relative inline-flex items-center bg-white/40 border border-[#05252e]/10 p-1 rounded-full mb-10 overflow-hidden backdrop-blur-sm">
            {/* Sliding Background */}
            <motion.div
              layoutId="toggle-bg"
              className="absolute bg-[#05252e] rounded-full"
              initial={false}
              animate={{
                left: activeTab === "match" ? "4px" : "154px", // Adjust these values based on actual widths
                width: activeTab === "match" ? "150px" : "165px",
                height: "calc(100% - 8px)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
            />

            <button
              onClick={() => setActiveTab("match")}
              className={`relative z-10 hero-toggle-btn flex items-center justify-center w-[150px] py-2.5 rounded-full font-bold transition-colors duration-200 text-sm ${
                activeTab === "match"
                  ? "text-white"
                  : "text-[#05252e] hover:bg-black/5"
              }`}
            >
              <Sparkles
                className={`w-3.5 h-3.5 mr-2 transition-colors ${activeTab === "match" ? "text-white" : "text-[#05252e]"}`}
              />
              Let us match you
            </button>
            <button
              onClick={() => setActiveTab("browse")}
              className={`relative z-10 hero-toggle-btn flex items-center justify-center w-[165px] py-2.5 rounded-full font-bold transition-colors duration-200 text-sm ${
                activeTab === "browse"
                  ? "text-white"
                  : "text-[#05252e] hover:bg-black/5"
              }`}
            >
              Browse on your own
            </button>
          </div>

          {/* Search Bars */}
          <div className="hero-search-wrapper relative min-h-[70px]">
            <AnimatePresence mode="wait">
              {activeTab === "match" ? (
                <motion.div
                  key="match-search"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="hero-search-container flex flex-col md:flex-row gap-4 mb-3"
                >
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      placeholder="What do you need help with?"
                      className="hero-search-input w-full px-6 py-4 bg-white border border-[#05252e]/10 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-[#05252e]/5 focus:border-[#05252e]/30 transition-all text-lg placeholder:text-gray-400"
                    />
                  </div>
                  <button className="hero-btn-match bg-[#05252e] text-white px-7 py-2.5 rounded-2xl font-bold text-base shadow-lg hover:bg-[#031c24] transition-all transform hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap">
                    Get Matched
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="browse-search"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="hero-browse-container flex flex-col md:flex-row items-stretch gap-4 mb-3"
                >
                  <div className="group relative flex-[1.5] flex items-center px-6 py-4 md:py-0 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#05252e]/10 hover:border-[#05252e]/20 transition-all">
                    <Search className="w-5 h-5 text-gray-400 mr-3 group-hover:text-[#05252e] transition-colors" />
                    <input
                      type="text"
                      placeholder="Search web developers, SEO, UX..."
                      className="w-full bg-transparent outline-none text-base text-[#05252e] placeholder:text-gray-400"
                    />
                  </div>
                  <div className="group relative flex-1 flex items-center px-6 py-4 md:py-0 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#05252e]/10 hover:border-[#05252e]/20 transition-all">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3 group-hover:text-[#05252e] transition-colors" />
                    <input
                      type="text"
                      placeholder="Any location"
                      className="w-full bg-transparent outline-none text-base text-[#05252e] placeholder:text-gray-400"
                    />
                  </div>
                  <button className="bg-[#05252e] text-white px-9 py-3.5 rounded-2xl font-bold text-base shadow-lg hover:bg-[#031c24] transition-all transform hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap">
                    Search
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Popular Searches */}
          <div className="mt-6">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">
              Popular Searches
            </p>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {[
                "Web Development",
                "App Development",
                "Electronics",
              ].map((tag, idx) => (
                <div
                  key={idx}
                  className="hero-tag shrink-0 flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-white/50 border border-[#05252e]/10 rounded-xl shadow-sm cursor-pointer hover:border-[#05252e]/30 hover:bg-white transition-all text-[11px] md:text-[13px] font-medium text-gray-700"
                >
                  <Search className="w-3.5 h-3.5 mr-2 text-gray-400" />
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
