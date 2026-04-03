"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Search, MapPin, ShieldCheck, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import Link from "next/link";

const Hero = () => {
  const router = useRouter();
  const dropdownRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState("match");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  
  // Inline Search State
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async () => {
    if (activeTab === "match") {
      router.push(`/post-requirement?q=${encodeURIComponent(searchQuery)}`);
    } else {
      // Perform Inline Search
      setIsSearching(true);
      setShowDropdown(true);
      
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append("search", searchQuery);
        if (locationQuery) params.append("city", locationQuery);
        
        const res = await apiFetch(`/vendors?${params.toString()}&limit=5`);
        setSearchResults(Array.isArray(res.data?.vendors) ? res.data.vendors : []);
      } catch (error) {
        console.error("Inline search failed:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <section className="hero-container relative w-full min-h-[600px] flex items-center overflow-hidden bg-[#ffffff]">
      {/* Background Image on Right */}
      <div className="hero-image-wrapper absolute right-0 top-0 w-3/4 h-full hidden lg:block">
        <Image
          src="/hero2.png"
          alt="B2B Marketplace"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-20">
        <div className="max-w-2xl w-full">
          {/* Headline */}
          <h2 className="text-[35px] md:text-[56px] lg:text-[60px] leading-[1.1] mt-10 md:mt-0 font-bold text-[#05252e] mb-10 tracking-tight">
            Find trusted partners to grow your business.
          </h2>

          {/* Toggle Buttons */}
          <div className="relative inline-flex items-center bg-gray-100/80 backdrop-blur-sm p-1.5 rounded-full mb-10 w-fit">
            {/* Sliding Background */}
            <div
              className={`absolute top-1.5 bottom-1.5 rounded-full bg-[#05252e] transition-all duration-300 ease-out shadow-sm ${
                activeTab === "match" ? "left-1.5 w-[150px]" : "left-[156px] w-[165px]"
              }`}
            />

            <button
              onClick={() => { setActiveTab("match"); setShowDropdown(false); }}
              className={`relative z-10 flex items-center justify-center w-[150px] py-2 rounded-full font-semibold text-sm transition-colors duration-300 ${
                activeTab === "match" ? "text-white" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Sparkles
                className={`w-4 h-4 mr-2 ${
                  activeTab === "match" ? "text-white" : "text-gray-500"
                }`}
              />
              Match me with suppliers
            </button>
            <button
              onClick={() => setActiveTab("browse")}
              className={`relative z-10 flex items-center justify-center w-[165px] py-2 rounded-full font-semibold text-sm transition-colors duration-300 ${
                activeTab === "browse" ? "text-white" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Explore the directory
            </button>
          </div>

          {/* Search Bars */}
          <div className="hero-search-wrapper relative min-h-[70px]" ref={dropdownRef}>
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
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="What product or service do you need?"
                      className="hero-search-input w-full h-[60px] px-6 bg-white border border-gray-200 rounded-2xl outline-none text-lg placeholder:text-gray-400 shadow-sm focus:border-[#007367]/30 transition-colors"
                    />
                  </div>
                  <button 
                    onClick={handleSearch}
                    className="hero-btn-match h-[60px] bg-[#05252e] hover:bg-[#0a3f4e] text-white px-8 rounded-2xl font-semibold text-base whitespace-nowrap shadow-md transition-colors"
                  >
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
                  className="relative mb-3"
                >
                  <div className="hero-browse-container flex flex-col md:flex-row items-stretch gap-4 relative z-20">
                      <div className="relative flex-[1.5] flex items-center px-6 py-4 md:py-0 bg-white rounded-2xl border border-[#05252e]/10 shadow-sm focus-within:border-[#007367]/30 transition-colors">
                        <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Search for products, services, or companies..."
                          className="w-full bg-transparent outline-none text-base text-[#05252e] placeholder:text-gray-400"
                        />
                      </div>
                      <div className="relative flex-1 flex items-center px-6 py-4 md:py-0 bg-white rounded-2xl border border-[#05252e]/10 shadow-sm focus-within:border-[#007367]/30 transition-colors">
                        <MapPin className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                        <input
                          type="text"
                          value={locationQuery}
                          onChange={(e) => setLocationQuery(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Any location"
                          className="w-full bg-transparent outline-none text-base text-[#05252e] placeholder:text-gray-400"
                        />
                      </div>
                      <button 
                        onClick={handleSearch}
                        className="bg-[#05252e] hover:bg-[#0a3f4e] transition-colors text-white px-9 py-3.5 rounded-2xl font-bold text-base whitespace-nowrap shadow-md"
                      >
                        Search
                      </button>
                  </div>

                  {/* Inline Search Results Dropdown */}
                  <AnimatePresence>
                      {showDropdown && (
                          <motion.div
                             initial={{ opacity: 0, y: 5 }}
                             animate={{ opacity: 1, y: 0 }}
                             exit={{ opacity: 0, y: 5 }}
                             className="absolute top-full left-0 right-0 mt-4 bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden z-50 flex flex-col"
                          >
                             {/* Header Row */}
                             <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                                 <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                     {isSearching ? 'Searching our directory...' : 'Top Matches'}
                                 </h4>
                                 <button onClick={() => setShowDropdown(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                     <X className="w-4 h-4" />
                                 </button>
                             </div>

                             {/* Results List */}
                             <div className="p-2 max-h-[400px] overflow-y-auto w-full">
                                 {isSearching ? (
                                    <div className="py-12 flex justify-center w-full">
                                        <div className="w-8 h-8 border-4 border-[#007367]/20 border-t-[#007367] rounded-full animate-spin"></div>
                                    </div>
                                 ) : searchResults.length > 0 ? (
                                     <div className="space-y-1 w-full">
                                         {searchResults.map((vendor) => (
                                             <Link 
                                                href={`/supplier/${vendor.id}`} 
                                                key={vendor.id}
                                                className="w-full flex items-center p-4 hover:bg-gray-50 rounded-2xl transition-colors group"
                                             >
                                                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 mr-4 overflow-hidden border border-gray-200">
                                                    {vendor.gallery?.[0]?.url ? (
                                                        <img src={vendor.gallery[0].url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-lg font-bold text-gray-400">{vendor.businessName.charAt(0)}</span>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h5 className="font-bold text-gray-900 truncate group-hover:text-[#007367] transition-colors">{vendor.businessName}</h5>
                                                        {vendor.verified && <ShieldCheck className="w-3.5 h-3.5 text-[#007367]" />}
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                                                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {vendor.city}</span>
                                                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                        <span className="truncate">{vendor.category?.name || 'Business'}</span>
                                                    </div>
                                                </div>
                                                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#007367] transform group-hover:translate-x-1 transition-all ml-4 shrink-0" />
                                             </Link>
                                         ))}
                                     </div>
                                 ) : (
                                     <div className="py-12 text-center w-full">
                                        <Search className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                                        <p className="text-sm font-bold text-gray-900">We couldn't find any suppliers matching your search.</p>
                                        <p className="text-xs text-gray-500 mt-1">Try broadening your search terms or location.</p>
                                     </div>
                                 )}
                             </div>

                             {/* Footer Action */}
                             {!isSearching && searchResults.length > 0 && (
                                 <Link 
                                    href={`/search?q=${encodeURIComponent(searchQuery)}&city=${encodeURIComponent(locationQuery)}`}
                                    onClick={() => setShowDropdown(false)}
                                    className="w-full py-4 bg-gray-50 hover:bg-gray-100 text-[#007367] font-bold text-sm text-center transition-colors border-t border-gray-100 block"
                                 >
                                     See all matching results
                                 </Link>
                             )}
                          </motion.div>
                      )}
                  </AnimatePresence>

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
                "SEO",
              ].map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSearchQuery(tag);
                    setActiveTab("browse");
                    router.push(`/search?q=${encodeURIComponent(tag)}`);
                  }}
                  className="hero-tag shrink-0 flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-[11px] md:text-[13px] font-medium text-gray-700 transition-colors cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5 mr-2 text-gray-400" />
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
