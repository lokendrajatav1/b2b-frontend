"use client";

import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  Bookmark,
  MessageSquare,
  UserCircle,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="w-full">
      {/* Top Bar (Dark Slate: #17313b) */}
      <div className="top-bar px-4 hidden md:block bg-[#17313b] border-b border-[#2d4b55]/30">
        <div className="container mx-auto flex items-center justify-end space-x-6 py-2">
          {/* Search Bar */}
          <div className="relative w-64 flex items-center">
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-4 pr-10 h-8 bg-[#1a3a46] text-white border border-[#3a5d6a] rounded-full outline-none placeholder:text-gray-400 text-[13px]"
            />
            <Search className="absolute right-3.5 w-3.5 h-3.5 text-gray-400" />
          </div>

          <div className="flex items-center space-x-8 text-[13px] font-semibold text-white/90">
            <Link href="#" className="hover:text-white transition-colors">
              Leave a Review
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              For Providers
            </Link>

            <div className="flex items-center space-x-5">
             <div className="flex items-center space-x-2 cursor-pointer hover:text-white transition-colors">
                <UserCircle className="w-5 h-5 text-gray-300" />
                <span className="whitespace-nowrap">Sign In</span>
              </div>
              <button className="px-5 py-1.5 border border-white text-white rounded-full font-bold hover:bg-white hover:text-[#17313b] transition-all text-[13px]">
                Join
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Bar (White) */}
      <div className="bg-white border-b border-[#e6e9eb] py-4 px-4 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <h1 className="text-[32px] font-bold text-[#05252e] tracking-tighter flex items-center leading-none">
                B2B Community
                <span className="w-2.5 h-2.5 bg-[#ff3b3b] rounded-full ml-1 mb-1"></span>
              </h1>
            </Link>
          </div>

          {/* Main Nav Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link
              href="#"
              className="text-[15px] font-bold text-[#05252e] hover:text-[#0076a8]"
            >
              Development
            </Link>
            <Link
              href="#"
              className="text-[15px] font-bold text-[#05252e] hover:text-[#0076a8]"
            >
              IT Services
            </Link>
            <Link
              href="#"
              className="text-[15px] font-bold text-[#05252e] hover:text-[#0076a8]"
            >
              Marketing
            </Link>
            <Link
              href="#"
              className="text-[15px] font-bold text-[#05252e] hover:text-[#0076a8]"
            >
              Design
            </Link>
            <Link
              href="#"
              className="text-[15px] font-bold text-[#05252e] hover:text-[#0076a8]"
            >
              Business Services
            </Link>
            <Link
              href="#"
              className="text-[15px] font-bold text-[#05252e] hover:text-[#0076a8]"
            >
              Pricing & Packages
            </Link>
            <div className="flex items-center text-[15px] font-bold text-[#05252e] hover:text-[#0076a8] cursor-pointer group">
              Resources{" "}
              <ChevronDown className="w-3.5 h-3.5 ml-1 transition-transform group-hover:rotate-180" />
            </div>

            <div className="h-6 w-[1.5px] bg-[#e6e9eb]"></div>

            <Link
              href="#"
              className="text-[#0076a8] font-bold text-[15px] hover:underline whitespace-nowrap"
            >
              Post a Project
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-[#05252e]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Overlay) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white fixed inset-0 z-50 p-6 flex flex-col space-y-6 animate-fade-in overflow-y-auto">
          <div className="flex items-center justify-between border-b pb-4">
            <h1 className="text-2xl font-bold text-[#05252e] tracking-tighter flex items-center">
              B2B Community
              <span className="w-2 h-2 bg-[#ff3b3b] rounded-full ml-0.5 mt-2"></span>
            </h1>
            <button onClick={() => setIsMobileMenuOpen(false)}>
              <X size={28} className="text-[#05252e]" />
            </button>
          </div>

          <nav className="flex flex-col space-y-5">
            <Link href="#" className="text-lg font-bold text-[#05252e]">
              Development
            </Link>
            <Link href="#" className="text-lg font-bold text-[#05252e]">
              IT Services
            </Link>
            <Link href="#" className="text-lg font-bold text-[#05252e]">
              Marketing
            </Link>
            <Link href="#" className="text-lg font-bold text-[#05252e]">
              Design
            </Link>
            <Link href="#" className="text-lg font-bold text-[#05252e]">
              Business Services
            </Link>
            <Link href="#" className="text-lg font-bold text-[#05252e]">
              Pricing & Packages
            </Link>
            <Link href="#" className="text-lg font-bold text-[#05252e]">
              Resources
            </Link>
          </nav>

          <div className="pt-8 border-t flex flex-col space-y-4">
            <button className="bg-[#17313b] text-white px-6 py-4 rounded-full font-bold">
              Join Now
            </button>
            <Link href="#" className="text-center text-[#05252e] font-bold">
              Sign In
            </Link>
            <Link
              href="#"
              className="bg-blue-50 text-[#0076a8] px-6 py-4 rounded-full font-bold text-center"
            >
              Post a Project
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
