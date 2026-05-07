"use client";

import React, { useState, useEffect } from 'react';
import { 
  Settings, Cpu, Box, HardHat, Stethoscope, Pill, Monitor, Package, 
  FlaskConical, Layers, Sparkles, Wrench, Laptop, Diamond, Home, Leaf, 
  Gamepad2, Truck, Briefcase, Plane, BookOpen, PenTool, Users, Ship, 
  Brush, CircuitBoard, Sprout, Utensils, Shirt, Printer, Zap, LayoutGrid,
  Search, CheckCircle2, Award, Handshake, Headphones, ArrowRight, Activity
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

const defaultIcons = [
  { icon: Settings, color: "text-green-600", bg: "bg-green-50" },
  { icon: Cpu, color: "text-emerald-600", bg: "bg-emerald-50" },
  { icon: Box, color: "text-orange-400", bg: "bg-orange-50" },
  { icon: HardHat, color: "text-yellow-600", bg: "bg-yellow-50" },
  { icon: Stethoscope, color: "text-pink-500", bg: "bg-pink-50" },
  { icon: Pill, color: "text-teal-500", bg: "bg-teal-50" },
  { icon: Monitor, color: "text-blue-600", bg: "bg-blue-50" },
  { icon: Package, color: "text-purple-500", bg: "bg-purple-50" },
  { icon: FlaskConical, color: "text-indigo-400", bg: "bg-indigo-50" },
  { icon: Layers, color: "text-gray-500", bg: "bg-gray-100" },
  { icon: Sparkles, color: "text-pink-400", bg: "bg-pink-50" },
  { icon: Wrench, color: "text-blue-500", bg: "bg-blue-50" },
  { icon: Laptop, color: "text-sky-500", bg: "bg-sky-50" },
  { icon: Diamond, color: "text-rose-500", bg: "bg-rose-50" },
  { icon: Home, color: "text-amber-600", bg: "bg-amber-50" },
  { icon: Leaf, color: "text-green-500", bg: "bg-green-50" },
  { icon: Gamepad2, color: "text-orange-500", bg: "bg-orange-50" },
  { icon: Truck, color: "text-blue-600", bg: "bg-blue-50" },
  { icon: Briefcase, color: "text-slate-700", bg: "bg-slate-100" },
  { icon: Plane, color: "text-cyan-600", bg: "bg-cyan-50" },
  { icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-50" },
  { icon: PenTool, color: "text-orange-400", bg: "bg-orange-50" },
  { icon: Users, color: "text-blue-700", bg: "bg-blue-50" },
  { icon: Ship, color: "text-teal-600", bg: "bg-teal-50" },
  { icon: Brush, color: "text-yellow-500", bg: "bg-yellow-50" },
  { icon: CircuitBoard, color: "text-violet-600", bg: "bg-violet-50" },
  { icon: Sprout, color: "text-emerald-500", bg: "bg-emerald-50" },
  { icon: Utensils, color: "text-orange-600", bg: "bg-orange-50" },
  { icon: Shirt, color: "text-pink-600", bg: "bg-pink-50" },
  { icon: Printer, color: "text-green-600", bg: "bg-green-50" },
  { icon: Zap, color: "text-yellow-500", bg: "bg-yellow-50" },
];

const ServiceGrid = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiFetch('/categories');
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };

  const handleCategoryClick = (categoryName) => {
    router.push(`/search?q=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 bg-white font-sans tracking-tight">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
        <div className="flex-1">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 leading-tight">
            Explore Our <span className="text-4xl lg:text-5xl font-bold text-[#134e4a]">Marketplace</span>
          </h1>
          <p className="text-gray-500 mt-3 text-xl font-medium">
            Discover products and connect with verified vendors across diverse industries.
          </p>
        </div>
        
        {/* Right Aligned Search Bar */}
        <div className="relative w-full md:w-[450px] lg:w-[500px]">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search industries, products or vendors..." 
            className="w-full pl-5 pr-12 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-base shadow-sm bg-gray-50/30 transition-all"
          />
          <div 
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-emerald-600 transition-colors"
            onClick={handleSearch}
          >
            <Search className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-5 mb-20">
        {categories.map((cat, index) => {
          const style = defaultIcons[index % defaultIcons.length];
          const IconComponent = style.icon;
          return (
            <div 
              key={cat.id} 
              onClick={() => handleCategoryClick(cat.name)}
              className="group border border-gray-100 rounded-2xl p-5 flex flex-col items-center justify-center text-center hover:shadow-xl hover:border-emerald-100 transition-all duration-300 cursor-pointer bg-white min-h-[160px]"
            >
              {/* Bigger Icons */}
              <div className={`p-4 rounded-2xl ${style.bg} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                <IconComponent className={`w-8 h-8 ${style.color}`} strokeWidth={1.8} />
              </div>
              <h3 className="text-[14px] font-bold text-slate-800 leading-snug mb-1.5 group-hover:text-emerald-900">{cat.name}</h3>
              <p className="text-[12px] text-gray-400 font-medium">{cat._count?.vendors || 0} Vendors</p>
            </div>
          );
        })}
        
        {/* Special 'View All' Card */}
        <div 
          onClick={() => router.push('/search')}
          className="bg-[#134e4a] rounded-2xl p-5 flex flex-col items-start justify-center cursor-pointer hover:bg-[#0d3633] transition-all duration-300 relative overflow-hidden group shadow-lg min-h-[160px]"
        >
          <LayoutGrid className="text-white/90 w-8 h-8 mb-3" />
          <h3 className="text-base font-bold text-white mb-1">View All Categories</h3>
          <p className="text-[12px] text-white/70">{categories.length > 0 ? `${categories.length}+ Categories` : 'Explore All'}</p>
          <ArrowRight className="absolute right-4 bottom-4 text-white w-6 h-6 opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300" />
        </div>
      </div>

    
    </div>
  );
};

export default ServiceGrid;
