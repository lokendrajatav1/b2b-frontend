"use client";

import React from "react";
import Image from "next/image";
import { 
  Menu, 
  Settings,
  Cpu,
  Package,
  HardHat,
  Stethoscope,
  Pill,
  Box,
  FlaskConical,
  Layers,
  Sparkles,
  Wrench,
  Monitor,
  Diamond,
  Home,
  Leaf,
  Gamepad2,
  Truck,
  Briefcase,
  Hotel,
  BookOpen,
  Compass,
  Users,
  Ship,
  Paintbrush,
  Zap,
  LayoutGrid
} from "lucide-react";
import Link from "next/link";

const services = [
  { id: 1, label: "Machine Parts", icon: Settings, color: "text-blue-600", bg: "bg-blue-50" },
  { id: 2, label: "Industrial Machines", icon: Cpu, color: "text-emerald-600", bg: "bg-emerald-50" },
  { id: 3, label: "Industrial Supplies", icon: Package, color: "text-orange-600", bg: "bg-orange-50" },
  { id: 4, label: "Construction", icon: HardHat, color: "text-amber-600", bg: "bg-amber-50" },
  { id: 5, label: "Hospitals & Labs", icon: Stethoscope, color: "text-rose-600", bg: "bg-rose-50" },
  { id: 6, label: "Drugs & Pharma", icon: Pill, color: "text-indigo-600", bg: "bg-indigo-50" },
  { id: 7, label: "Electronics", icon: Cpu, color: "text-sky-600", bg: "bg-sky-50" },
  { id: 8, label: "Packing Machines", icon: Box, color: "text-slate-600", bg: "bg-slate-50" },
  { id: 9, label: "Chemicals", icon: FlaskConical, color: "text-violet-600", bg: "bg-violet-50" },
  { id: 10, label: "Metals", icon: Layers, color: "text-stone-600", bg: "bg-stone-50" },
  { id: 11, label: "Beauty & Care", icon: Sparkles, color: "text-pink-600", bg: "bg-pink-50" },
  { id: 12, label: "Engineering Services", icon: Wrench, color: "text-cyan-600", bg: "bg-cyan-50" },
  { id: 13, label: "IT & Computers", icon: Monitor, color: "text-blue-500", bg: "bg-blue-50" },
  { id: 14, label: "Jewelry & Gems", icon: Diamond, color: "text-rose-500", bg: "bg-rose-50" },
  { id: 15, label: "Home Supplies", icon: Home, color: "text-amber-500", bg: "bg-amber-50" },
  { id: 16, label: "Herbal Products", icon: Leaf, color: "text-green-600", bg: "bg-green-50" },
  { id: 17, label: "Sports & Toys", icon: Gamepad2, color: "text-orange-500", bg: "bg-orange-50" },
  { id: 18, label: "Transport & Logistics", icon: Truck, color: "text-blue-700", bg: "bg-blue-50" },
  { id: 19, label: "Business Services", icon: Briefcase, color: "text-slate-700", bg: "bg-slate-50" },
  { id: 20, label: "Travel & Hotels", icon: Hotel, color: "text-teal-600", bg: "bg-teal-50" },
  { id: 21, label: "Education & Training", icon: BookOpen, color: "text-indigo-700", bg: "bg-indigo-50" },
  { id: 22, label: "Architects & Interiors", icon: Compass, color: "text-orange-700", bg: "bg-orange-50" },
  { id: 23, label: "HR & Recruitment", icon: Users, color: "text-blue-800", bg: "bg-blue-50" },
  { id: 24, label: "Rail & Shipping", icon: Ship, color: "text-sky-700", bg: "bg-sky-50" },
  { id: 25, label: "Housekeeping", icon: Paintbrush, color: "text-amber-700", bg: "bg-amber-50" },
  { id: 26, label: "Electronics Parts", icon: Cpu, color: "text-purple-600", bg: "bg-purple-50" },
  { id: 27, label: "Popular", icon: LayoutGrid, color: "text-white", bg: "bg-[#007367]", isMore: true },
];

const ServiceGrid = () => {
  return (
    <section className="service-grid-section py-20 bg-white">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6">
        <div className="mb-16 px-4">
           <div className="space-y-4">
              <h2 className="text-[#007367] font-bold tracking-widest text-xs uppercase flex items-center gap-2">
                <span className="w-8 h-px bg-[#007367]"></span>
                Sourcing Made Simple
              </h2>
              <h3 className="text-3xl md:text-5xl font-semibold text-[#0f172a] tracking-tight">
                Explore Our <br />
                <span className="text-[#007367]">Marketplace.</span>
              </h3>
           </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-4 md:gap-6 lg:gap-8">
          {services.map((service) => (
            <Link
              key={service.id}
              href={service.isMore ? "/search?q" : `/search?q=${service.label}`}
              className="service-item flex flex-col items-center group cursor-pointer"
            >
              <div 
                className={`service-icon-wrapper w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center rounded-[24px] lg:rounded-[32px] mb-4 lg:mb-5 relative border border-gray-100 group-hover:border-[#007367]/20 group-hover:shadow-2xl group-hover:shadow-[#007367]/10 transition-all duration-500 ${service.bg}`}
              >
                <div className="relative w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                   <service.icon className={`w-full h-full ${service.color} stroke-[1.2px]`} />
                </div>
                
                <div className="absolute inset-0 rounded-[24px] lg:rounded-[32px] bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <span className="service-label text-[10px] md:text-[12px] lg:text-[13px] font-bold text-slate-800 text-center leading-tight tracking-tight px-1 group-hover:text-[#007367] transition-colors">
                {service.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceGrid;
