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
      className="flex flex-col items-center group cursor-pointer"
    >
      <div 
        className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center mb-4 group-hover:scale-105 group-hover:border-[#164e33]/40 group-hover:bg-white group-hover:shadow-[0_12px_30px_-8px_rgba(22,78,51,0.08)] relative overflow-hidden"
        style={{ transition: "all 400ms cubic-bezier(0.25, 1, 0.5, 1)" }}
      >
        {/* The Icon */}
        <Icon 
          className="w-10 h-10 text-slate-800 group-hover:text-[#164e33] stroke-[1.5]"
          style={{ transition: "all 400ms cubic-bezier(0.25, 1, 0.5, 1)" }}
        />
      </div>

      <span 
        className="text-sm md:text-base font-medium text-slate-700 group-hover:text-[#164e33]"
        style={{ transition: "all 400ms cubic-bezier(0.25, 1, 0.5, 1)" }}
      >
        {city.name}
      </span>
    </div>
  );
};

const CitySuppliers = () => {
  return (
    <section className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 bg-white border-t border-gray-100">
      <h2 className="text-xl md:text-3xl font-medium text-slate-900 mb-8">
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
