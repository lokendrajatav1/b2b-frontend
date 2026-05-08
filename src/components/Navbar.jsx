"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  MapPin,
  Building2,
  UserCircle2
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const pathname = usePathname();
  const isDashboard = pathname.includes('/dashboard') || pathname.includes('/vendor/') || pathname.includes('/admin/') || pathname.includes('/super-admin/');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const popularCities = ['Indore', 'Bhopal', 'Vadodara', 'Bengaluru', 'Delhi', 'Chennai', 'Pune', 'Ahmedabad', 'Coimbatore', 'Hyderabad', 'Mumbai'];

  useEffect(() => {
    const q = searchParams.get('q') || "";
    const city = searchParams.get('city') || "";
    setSearchQuery(q);
    setCityQuery(city);
  }, [searchParams]);

  useEffect(() => {
    if (searchParams.get('city')) return;
    const fetchUserCity = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data && data.city) setCityQuery(data.city);
      } catch (error) {
        console.warn("Could not automatically determine user city");
      }
    };
    fetchUserCity();
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('q', searchQuery.trim());
    if (cityQuery.trim()) params.append('city', cityQuery.trim());
    router.push(params.toString() ? `/search?${params.toString()}` : '/search');
  };

  const handleCitySelect = (city) => {
    setCityQuery(city);
    setIsCityDropdownOpen(false);
  };

  return (
    <header className="w-full sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <img 
            src="/logo.png" 
            alt="INDIA B2B" 
            className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Desktop Search Bar (Pixel Perfect) - Hidden on Dashboards */}
        {!isDashboard && (
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-2xl mx-10 h-11 border border-slate-200 rounded-xl overflow-hidden focus-within:border-[#164e33] focus-within:shadow-md transition-all shadow-sm bg-white">
            <div className="relative flex items-center px-4 bg-slate-50 border-r border-slate-200 gap-2 min-w-[150px] city-dropdown-container">
              <MapPin size={16} className="text-red-500 shrink-0" />
              <input 
                type="text" 
                value={cityQuery}
                onChange={(e) => setCityQuery(e.target.value)}
                onFocus={() => setIsCityDropdownOpen(true)}
                className="bg-transparent text-sm font-semibold text-slate-800 focus:outline-none w-full truncate cursor-pointer"
                placeholder="City"
              />
              {isCityDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-[220px] bg-white border border-gray-100 rounded-xl shadow-2xl py-2 z-50 max-h-[300px] overflow-y-auto">
                  {popularCities.map(city => (
                    <button key={city} type="button" onClick={() => handleCitySelect(city)} className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-[#164e33]/5 hover:text-[#164e33] transition-all flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 opacity-40" /> {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product / service..." 
              className="flex-1 px-4 text-sm font-medium focus:outline-none text-slate-800 placeholder:text-slate-500"
            />
            <button type="submit" className="bg-[#164e33] text-white px-8 flex items-center gap-2 hover:bg-[#113f29] transition-all !text-white">
              <Search size={18} className="text-white" />
              <span className="font-bold text-sm uppercase tracking-wide text-white">Search</span>
            </button>
          </form>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-4 lg:gap-8">
          <Link href="/register" className="hidden sm:flex items-center gap-2 border border-slate-200 px-5 py-2.5 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-[#164e33]/30 transition-all shadow-sm">
            <Building2 size={18} className="text-[#164e33]" />
            Become a Vendor
          </Link>
          
          <div className="relative">
            <button 
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center gap-3 p-1.5 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100 group"
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-sm bg-slate-100 flex items-center justify-center">
                <img 
                  src={user?.profileImage || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} 
                  alt="profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden lg:flex flex-col items-start leading-none gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase ">{user?.role || 'Welcome'}</span>
                <span className="text-sm font-bold text-slate-800 group-hover:text-[#164e33] transition-colors">
                   {user ? user.name?.split(' ')[0] : 'My Account'}
                </span>
              </div>
            </button>

            {isUserDropdownOpen && (
              <div className="absolute top-full right-0 mt-3 w-64 bg-white border border-gray-100 rounded-xl shadow-2xl py-3 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {user ? (
                  <div className="p-2">
                    <Link 
                      href={user.role === 'SUPERADMIN' ? '/super-admin/profile' : user.role === 'ADMIN' ? '/admin/profile' : '/profile'} 
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-[#164e33]/5 hover:text-[#164e33] transition-all"
                    >
                      <UserCircle2 className="w-4 h-4" /> My Profile
                    </Link>
                    {user.role !== 'BUYER' && (
                      <Link 
                        href={user.role === 'SUPERADMIN' ? '/super-admin/dashboard' : user.role === 'ADMIN' ? '/admin/dashboard' : '/vendor/dashboard'}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-[#164e33]/5 hover:text-[#164e33] transition-all mt-1"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                    )}
                    <div className="h-px bg-slate-50 my-2 mx-2"></div>
                    <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="p-4 text-center">
                    <Link href="/login" className="block w-full py-3 bg-[#164e33] text-white rounded-xl font-bold text-sm uppercase shadow-lg shadow-[#164e33]/20 transition-all mb-3">Sign In</Link>
                    <Link href="/register" className="block w-full py-3 border border-slate-200 text-[#164e33] rounded-xl font-bold text-sm uppercase hover:bg-slate-50 transition-all">Create Account</Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

