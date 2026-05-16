"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import HeroContent from "./HeroContent";
import HeroSearchBar from "./HeroSearchBar";
import PopularIndustries from "./PopularIndustries";
import HeroStats from "./HeroStats";

const Hero = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  const handleSearch = (type = "browse", specificQuery = null) => {
    const query =
      specificQuery !== null ? specificQuery.trim() : searchQuery.trim();
    const city = locationQuery.trim();
    if (type === "match") {
      router.push(
        `/post-requirement?q=${encodeURIComponent(query)}&city=${encodeURIComponent(city)}`,
      );
    } else {
      router.push(
        `/search?q=${encodeURIComponent(query)}&city=${encodeURIComponent(city)}`,
      );
    }
  };

  return (
    <div className="bg-white font-sans text-[#1a1a1a]">
      <section className="relative h-[calc(100vh-72px)] min-h-[500px] lg:min-h-[700px] flex flex-col bg-[#f4f7f6] overflow-x-hidden">
        {/* --- Background Images --- */}
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
          <div className="flex flex-col justify-center lg:flex-1">
            <HeroContent
              onMatch={() => handleSearch("match")}
              onExplore={() => handleSearch("browse")}
            />

            <HeroSearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              locationQuery={locationQuery}
              setLocationQuery={setLocationQuery}
              onSearch={() => handleSearch("match")}
            />

            {/* Floating Verified Badge (Desktop Only) */}
            <div className="absolute right-6 top-6 lg:right-12 lg:top-20 xl:top-24 bg-white/90 backdrop-blur-md p-3 rounded-lg shadow-2xl border border-white/50 max-w-[180px] hidden lg:block">
              <div className="flex items-start gap-2.5">
                <div className="bg-[#164e33] p-2 rounded-lg text-white shadow-lg shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="font-bold text-[13px] leading-tight text-[#164e33]">
                    Verified & Trusted
                  </p>
                  <p className="text-[9px] text-slate-500 mt-0.5 font-semibold leading-normal">
                    Quality you can rely on.
                  </p>
                </div>
              </div>
            </div>

            <PopularIndustries
              onSelect={(name) => {
                setSearchQuery(name);
                handleSearch("browse", name);
              }}
            />
          </div>
        </div>

        <HeroStats />
      </section>
    </div>
  );
};

export default Hero;
