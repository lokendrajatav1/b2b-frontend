import React, { useState } from "react";
import {
  Building2,
  Castle,
  Landmark,
  MapPin,
  Building,
  Tent,
  Store,
  Map,
  TowerControl,
  Navigation,
} from "lucide-react";

// City data with image paths and beautiful generic fallback icons
const cities = [
  { name: "Delhi", image: "/images/cities/delhi.png", Fallback: Landmark },
  {
    name: "Bengaluru",
    image: "/images/cities/bengaluru.png",
    Fallback: Building2,
  },
  { name: "Chennai", image: "/images/cities/chennai.png", Fallback: Store },
  { name: "Mumbai", image: "/images/cities/mumbai.png", Fallback: Castle },
  { name: "Ahmedabad", image: "/images/cities/ahmedabad.png", Fallback: Tent },
  {
    name: "Kolkata",
    image: "/images/cities/kolkata.png",
    Fallback: TowerControl,
  },
  { name: "Pune", image: "/images/cities/pune.png", Fallback: Building },
  { name: "Surat", image: "/images/cities/surat.png", Fallback: Map },
  { name: "Jaipur", image: "/images/cities/jaipur.png", Fallback: Castle },
  {
    name: "Hyderabad",
    image: "/images/cities/hyderabad.png",
    Fallback: Navigation,
  },
];

const CityIcon = ({ city }) => {
  const Icon = city.Fallback;
  const router = require("next/navigation").useRouter();

  return (
    <div
      onClick={() => router.push(`/search?city=${city.name}`)}
      className="flex flex-col items-center group cursor-pointer transition-all duration-300"
    >
      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center mb-4 transition-all duration-500 group-hover:border-[#164e33]/30 group-hover:bg-white group-hover:shadow-[0_20px_40px_-15px_rgba(0,118,168,0.12)] group-hover:-translate-y-1 relative overflow-hidden">
        {/* Animated Background Ring */}
        <div className="absolute inset-0 border-2 border-[#164e33] opacity-0 group-hover:opacity-10 scale-90 group-hover:scale-100 transition-all duration-500 rounded-lg"></div>

        {/* The Icon */}
        <Icon className="w-10 h-10 text-slate-400 group-hover:text-[#164e33] transition-all duration-500 transform group-hover:scale-110 stroke-[1.5]" />

        {/* Subtle glow effect */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#164e33]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      <span className="text-base md:text-base font-semibold text-slate-600 group-hover:text-slate-900 transition-colors ">
        {city.name}
      </span>
    </div>
  );
};

const CitySuppliers = () => {
  return (
    <section className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 bg-white border-t border-gray-100">
      <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-8">
        Explore Vendors by City
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-10 gap-x-4">
        {cities.map((city) => (
          <CityIcon key={city.name} city={city} />
        ))}
      </div>
    </section>
  );
};

export default CitySuppliers;
