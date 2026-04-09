"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Bookmark,
  MessageSquare,
  UserCircle,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  MapPin,
  Camera
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const popularCities = ['Indore', 'Bhopal', 'Vadodara', 'Bengaluru', 'Delhi', 'Chennai', 'Pune', 'Ahmedabad', 'Coimbatore', 'Hyderabad', 'Mumbai'];

  // Sync with URL when it changes
  useEffect(() => {
    const q = searchParams.get('q') || "";
    const city = searchParams.get('city') || "";
    setSearchQuery(q);
    setCityQuery(city);
  }, [searchParams]);

  // Automatically fetch the user's city based on their IP - only if not in URL
  useEffect(() => {
    // Skip if city is already in URL
    if (searchParams.get('city')) return;

    const fetchUserCity = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data && data.city) {
          setCityQuery(data.city);
        }
      } catch (error) {
        console.warn("Could not automatically determine user city");
      }
    };

    fetchUserCity();
  }, [searchParams]); // Re-check if city is cleared from URL

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.profile-dropdown-container')) setIsUserDropdownOpen(false);
      if (!e.target.closest('.more-dropdown-container')) setIsMoreDropdownOpen(false);
      if (!e.target.closest('.city-dropdown-container')) setIsCityDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('q', searchQuery.trim());
    if (cityQuery.trim()) params.append('city', cityQuery.trim());
    
    if (params.toString()) {
      router.push(`/search?${params.toString()}`);
    } else {
      router.push('/search');
    }
  };

  const handleCitySelect = (city) => {
    setCityQuery(city);
    setIsCityDropdownOpen(false);
  };

  return (
    <header className="w-full sticky top-0 z-50 bg-white shadow-sm transition-all duration-300">
      {/* Main Bar (White) */}
      <div className="border-b border-[#e6e9eb] py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
          {/* Logo & Search */}
          <div className="flex items-center gap-6 lg:gap-10">
            <Link href="/" className="flex items-center shrink-0">
              <h1 className="text-[28px] lg:text-[32px] font-bold text-[#05252e] tracking-tighter flex items-center leading-none">
                B2B Community
                <span className="w-2.5 h-2.5 bg-[#ff3b3b] rounded-full ml-1 mb-1"></span>
              </h1>
            </Link>

            {/* Desktop IndiaMart Style Search Bar */}
            <form onSubmit={handleSearch} className="hidden lg:flex relative w-[600px] h-11 items-center bg-white border border-[#d0d0d0] rounded-[4px] shadow-sm focus-within:border-[#0076a8] focus-within:shadow-md transition-all divide-x divide-gray-200">
              {/* City Selection */}
              <div className="w-[160px] h-full relative flex items-center px-2 hover:bg-gray-50 transition-colors cursor-pointer city-dropdown-container">
                <MapPin className="w-4 h-4 text-[#e43737] mr-1.5 shrink-0" />
                <input
                  type="text"
                  value={cityQuery}
                  onFocus={() => setIsCityDropdownOpen(true)}
                  onChange={(e) => setCityQuery(e.target.value)}
                  placeholder="Enter city"
                  className="w-full bg-transparent outline-none text-[13px] font-semibold text-gray-700 placeholder:text-gray-400 truncate"
                />
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 ml-1 transition-transform ${isCityDropdownOpen ? 'rotate-180' : ''}`} />
                
                {/* City Dropdown Menu */}
                {isCityDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-[220px] bg-white border border-gray-100 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[300px] overflow-y-auto">
                        <p className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">Popular Cities</p>
                        {popularCities.filter(c => c.toLowerCase().includes(cityQuery.toLowerCase())).map(city => (
                            <button
                                key={city}
                                type="button"
                                onClick={() => handleCitySelect(city)}
                                className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-gray-700 hover:bg-[#007367]/5 hover:text-[#007367] transition-all flex items-center gap-2"
                            >
                                <MapPin className="w-3.5 h-3.5 opacity-40" />
                                {city}
                            </button>
                        ))}
                        {popularCities.filter(c => c.toLowerCase().includes(cityQuery.toLowerCase())).length === 0 && (
                             <p className="px-4 py-4 text-xs text-center text-gray-400 font-medium">No matches for "{cityQuery}"</p>
                        )}
                    </div>
                )}
              </div>

              {/* Product Sourcing Input */}
              <div className="flex-1 h-full relative flex items-center px-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter product / service to search"
                  className="w-full h-full bg-transparent outline-none text-[13px] font-medium text-gray-700 placeholder:text-gray-500"
                />
                
                {/* Image Search / Lens Mockup */}
                <button type="button" className="p-2 text-gray-400 hover:text-[#0076a8] transition-colors rounded-full hover:bg-white">
                  <Camera className="w-5 h-5 stroke-[1.5]" />
                </button>
              </div>

              {/* Search Button */}
              <button 
                type="submit" 
                className="h-full px-8 bg-[#007367] hover:bg-[#005e54] text-white font-bold text-[14px] transition-all flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </form>
          </div>

          {/* Main Nav Links & Actions (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-6">
            {/* Profile Dropdown Container */}
            <div className="relative profile-dropdown-container">
              <button 
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-3 p-1.5 hover:bg-gray-100 rounded-full transition-all border border-transparent hover:border-gray-100 group"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-100 flex items-center justify-center">
                  <img 
                    src={user?.profileImage || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} 
                    alt="profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[14px] font-bold text-[#05252e]">
                    {user ? `Hi, ${user.name?.split(' ')[0]}` : 'Account'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 group-hover:text-[#0076a8] transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* User Dropdown Menu */}
              {isUserDropdownOpen && (
                <div className="absolute top-full right-0 mt-3 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl py-3 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {user ? (
                    <>
                      <div className="px-5 py-3 border-b border-gray-50 bg-gray-50/50">
                        <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Signed in as</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                      </div>
                      
                      <div className="p-2">
                        {user.role !== 'BUYER' && (
                          <Link 
                            href={user.role === 'ADMIN' ? '/admin/dashboard' : '/vendor/dashboard'}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-semibold text-gray-700 hover:bg-[#0076a8]/5 hover:text-[#0076a8] transition-all"
                          >
                            <LayoutDashboard className="w-4 h-4" /> Dashboard
                          </Link>
                        )}
                        <div className="h-px bg-gray-50 my-2 mx-2"></div>
                        <Link href="/post-requirement" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-semibold text-gray-700 hover:bg-[#0076a8]/5 hover:text-[#0076a8] transition-all">
                          <MessageSquare className="w-4 h-4" /> Post a Requirement
                        </Link>
                        <div className="h-px bg-gray-50 my-2 mx-2"></div>
                        <button 
                          onClick={logout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-semibold text-red-500 hover:bg-red-50 transition-all"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="px-5 py-4 text-center border-b border-gray-50">
                        <p className="text-sm text-gray-500 mb-3 font-medium">Access your account or grow your business</p>
                        <Link 
                          href="/login" 
                          className="block w-full py-2.5 bg-[#0076a8] text-white rounded-xl font-bold text-[14px] hover:bg-[#005e86] shadow-md active:scale-95 transition-all mb-2"
                        >
                          Sign In
                        </Link>
                        <Link 
                          href="/register" 
                          className="block w-full py-2.5 border border-gray-200 text-[#05252e] rounded-xl font-bold text-[14px] hover:bg-gray-50 transition-all"
                        >
                          Join for Free
                        </Link>
                      </div>
                      <div className="p-2 text-center sm:text-left">
                        <Link href="/post-requirement" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-semibold text-gray-700 hover:bg-[#0076a8]/5 hover:text-[#0076a8] transition-all">
                          <MessageSquare className="w-4 h-4 text-blue-500" /> Post a Requirement
                        </Link>
                        <Link href="/suppliers" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-semibold text-gray-700 hover:bg-[#0076a8]/5 hover:text-[#0076a8] transition-all">
                          <Search className="w-4 h-4 text-emerald-500" /> Find Suppliers
                        </Link>

                        <div className="h-px bg-gray-50 my-2 mx-2"></div>
                        <Link href="/about" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-semibold text-gray-400 hover:text-gray-600 transition-all">
                          About Us
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-[#05252e] p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Search size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Overlay) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white fixed inset-0 z-50 p-6 flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between border-b pb-4 mb-6">
            <h1 className="text-2xl font-bold text-[#05252e] tracking-tighter flex items-center">
              B2B Community
              <span className="w-2 h-2 bg-[#ff3b3b] rounded-full ml-0.5 mt-2"></span>
            </h1>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
              <X size={28} className="text-[#05252e]" />
            </button>
          </div>

          <div className="flex-1 flex flex-col space-y-8">
             {/* Mobile IndiaMart Style Search */}
             <form onSubmit={(e) => { handleSearch(e); setIsMobileMenuOpen(false); }} className="w-full space-y-3">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter product / service to search"
                      className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 focus:border-[#007367] rounded-lg outline-none text-[14px] font-medium text-gray-700 transition-all placeholder:text-gray-400"
                    />
                </div>
                <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#e43737]" />
                    <input
                      type="text"
                      value={cityQuery}
                      onChange={(e) => setCityQuery(e.target.value)}
                      placeholder="Enter city"
                      className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 focus:border-[#007367] rounded-lg outline-none text-[14px] font-medium text-gray-700 transition-all placeholder:text-gray-400"
                    />
                </div>
                <button type="submit" className="w-full py-3.5 bg-[#007367] hover:bg-[#005e54] text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors shadow-md">
                  <Search className="w-4 h-4" /> Search
                </button>
             </form>

             {(!user || user.role !== 'BUYER') && (
               <Link
                  href="/post-requirement"
                  className="block text-2xl font-black text-[#0076a8] tracking-tight hover:text-slate-900 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
               >
                  Post a Requirement
               </Link>
             )}
          </div>

          <div className="pt-8 border-t border-gray-100 flex flex-col space-y-4">
            {user && (
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm shrink-0 bg-gray-50 flex items-center justify-center">
                    <img 
                      src={user.profileImage || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} 
                      alt="profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Welcome Back</p>
                    <h3 className="text-2xl font-black text-[#05252e]">Hi, {user.name?.split(' ')[0]}</h3>
                  </div>
                </div>
            )}
            {user ? (
               <>
                  <Link 
                    href={user.role === 'ADMIN' ? '/admin/dashboard' : user.role === 'VENDOR' ? '/vendor/dashboard' : '/post-requirement'}
                    className="bg-[#05252e] text-white px-6 py-4 rounded-full font-bold text-center flex items-center justify-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    {user.role === 'BUYER' ? 'Post Requirement' : 'Go to Dashboard'}
                  </Link>
                  <button 
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                    className="text-center text-red-500 font-bold py-3 flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-5 h-5" /> Sign Out
                  </button>
               </>
            ) : (
               <>
                  <Link 
                    href="/register" 
                    className="bg-[#05252e] text-white px-6 py-4 rounded-full font-black tracking-wide text-center uppercase"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Join Network
                  </Link>
                  <Link 
                    href="/login" 
                    className="text-center text-[#05252e] font-bold py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
               </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
