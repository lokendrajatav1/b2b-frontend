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
  MapPin
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Automatically fetch the user's city based on their IP
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
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('keyword', searchQuery.trim());
    if (cityQuery.trim()) params.append('city', cityQuery.trim());
    
    if (params.toString()) {
      router.push(`/search?${params.toString()}`);
    } else {
      router.push('/search');
    }
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

            {/* Desktop Unified Search Bar */}
            <form onSubmit={handleSearch} className="hidden lg:flex relative w-[500px] h-11 items-center bg-slate-50 border border-slate-200 rounded-full focus-within:border-[#0076a8] focus-within:bg-white focus-within:shadow-md transition-all">
              {/* Product Input */}
              <div className="flex-1 h-full relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What are you looking for?"
                  className="w-full h-full pl-10 pr-4 bg-transparent outline-none text-[13px] font-medium text-slate-700 placeholder:text-slate-400"
                 />
              </div>

              <div className="w-px h-6 bg-slate-200"></div>

              {/* City Input */}
              <div className="w-[180px] h-full relative">
                 <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <input
                  type="text"
                  value={cityQuery}
                  onChange={(e) => setCityQuery(e.target.value)}
                  placeholder="Where? (e.g. Pune)"
                  className="w-full h-full pl-9 pr-12 bg-transparent outline-none text-[13px] font-medium text-slate-700 placeholder:text-slate-400"
                 />
                 <button type="submit" className="absolute right-1.5 top-1.5 bottom-1.5 w-8 bg-[#0076a8] hover:bg-[#005e86] text-white rounded-full flex items-center justify-center transition-colors">
                   <Search className="w-4 h-4" />
                 </button>
              </div>
            </form>
          </div>

          {/* Main Nav Links & Actions (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-6">
            {(!user || user.role !== 'BUYER') && (
              <Link
                href="/post-requirement"
                className="text-[#0076a8] font-bold text-[14px] whitespace-nowrap hover:text-[#005e86] transition-colors"
              >
                Post a Requirement
              </Link>
            )}

            <div className="h-6 w-px bg-gray-200 hidden xl:block"></div>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  {user.role !== 'BUYER' ? (
                    <Link 
                      href={user.role === 'ADMIN' ? '/admin/dashboard' : '/vendor/dashboard'}
                      className="flex items-center space-x-2 px-5 py-2.5 bg-[#05252e] text-white rounded-full font-bold text-[12px] uppercase tracking-wider hover:bg-[#0a3845] transition-colors shadow-sm whitespace-nowrap"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span className="hidden xl:inline">Dashboard</span>
                    </Link>
                  ) : (
                    <Link 
                      href="/post-requirement"
                      className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 text-white rounded-full font-bold text-[12px] uppercase tracking-wider hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
                    >
                      <span className="hidden xl:inline">Post Requirement</span>
                    </Link>
                  )}
                  <button 
                    onClick={logout}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all"
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
                  <Link href="/login" className="flex items-center space-x-2 cursor-pointer text-[#05252e] font-bold text-[14px] hover:text-[#0076a8] transition-colors">
                    <UserCircle className="w-5 h-5 text-gray-400" />
                    <span className="whitespace-nowrap">Sign In</span>
                  </Link>
                  <Link href="/register" className="px-6 py-2.5 bg-[#0076a8] hover:bg-[#005e86] text-white rounded-full font-bold text-[14px] transition-all shadow-md active:scale-95 whitespace-nowrap">
                    Join
                  </Link>
                </>
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
             {/* Mobile Unified Search */}
             <form onSubmit={(e) => { handleSearch(e); setIsMobileMenuOpen(false); }} className="w-full space-y-3">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="What are you looking for?"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#0076a8] focus:bg-white rounded-xl outline-none text-[14px] font-medium text-slate-700 transition-all placeholder:text-slate-400"
                    />
                </div>
                <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={cityQuery}
                      onChange={(e) => setCityQuery(e.target.value)}
                      placeholder="Where? (e.g. Mumbai)"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#0076a8] focus:bg-white rounded-xl outline-none text-[14px] font-medium text-slate-700 transition-all placeholder:text-slate-400"
                    />
                </div>
                <button type="submit" className="w-full py-3.5 bg-[#0076a8] hover:bg-[#005e86] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-md">
                  <Search className="w-4 h-4" /> Search Verified Sellers
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
