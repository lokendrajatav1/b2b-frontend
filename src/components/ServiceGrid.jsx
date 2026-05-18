"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Cpu,
  Box,
  HardHat,
  Stethoscope,
  Pill,
  Monitor,
  Package,
  FlaskConical,
  Layers,
  Sparkles,
  Wrench,
  Laptop,
  Diamond,
  Home,
  Leaf,
  Gamepad2,
  Truck,
  Briefcase,
  Plane,
  BookOpen,
  PenTool,
  Users,
  Ship,
  Brush,
  CircuitBoard,
  Sprout,
  Utensils,
  Shirt,
  Printer,
  Zap,
  LayoutGrid,
  Search,
  CheckCircle2,
  Award,
  Handshake,
  Headphones,
  ArrowRight,
  Activity,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

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
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiFetch("/categories");
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);


  const handleCategoryClick = (categoryName) => {
    router.push(`/search?q=${encodeURIComponent(categoryName)}`);
  };

  const displayedCategories = showAll ? categories : categories.slice(0, 15);

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-2 bg-white font-sans tracking-tight mt-4">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8">
        <div className="flex-1 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl lg:text-4xl font-bold text-slate-800 leading-tight">
            Explore Our{" "}
            <span className="text-3xl sm:text-4xl lg:text-4xl font-bold text-[#134e4a]">
              Marketplace
            </span>
          </h1>
          <p className="text-gray-800 mt-4 text-lg sm:text-l font-medium leading-relaxed">
            Discover products and connect with verified vendors across diverse
            industries.
          </p>
        </div>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-5 mb-20">
        {displayedCategories.map((cat, index) => {
          const style = defaultIcons[index % defaultIcons.length];
          const IconComponent = style.icon;
          return (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.name)}
              className="group border border-gray-100 rounded-lg p-5 flex flex-col items-center justify-center text-center hover:shadow-xl hover:border-emerald-100 transition-all duration-300 cursor-pointer bg-white min-h-[160px]"
            >
              {/* Bigger Icons */}
              <div
                className={`p-4 rounded-lg ${style.bg} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm`}
              >
                <IconComponent
                  className={`w-8 h-8 ${style.color}`}
                  strokeWidth={1.8}
                />
              </div>
              <h3 className="text-[14px] font-medium text-slate-800 leading-snug mb-1.5 group-hover:text-emerald-900">
                {cat.name}
              </h3>
            </div>
          );
        })}

        {/* Special 'View All' Card - Only show when NOT showing all */}
        {!showAll && categories.length > 15 && (
          <div
            onClick={() => setShowAll(true)}
            className="bg-[#134e4a] rounded-lg p-5 flex flex-col items-start justify-center cursor-pointer hover:bg-[#0d3633] transition-all duration-300 relative overflow-hidden group shadow-lg min-h-[160px]"
          >
            <LayoutGrid className="text-white/90 w-8 h-8 mb-3" />
            <h3 className="text-base font-bold text-white mb-1">
              View All Categories
            </h3>
            <p className="text-[12px] text-white/70">
              {categories.length > 0
                ? `${categories.length}+ Categories`
                : "Explore All"}
            </p>
            <ArrowRight className="absolute right-4 bottom-4 text-white w-6 h-6 opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceGrid;
