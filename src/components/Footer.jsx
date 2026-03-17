"use client";

import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#17313b] text-white pt-20 pb-10">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Description */}
          <div className="space-y-6">
            <Link href="/" className="text-3xl font-black tracking-tight text-white flex items-center">
              B2B Community<span className="text-[#4ecdc4]">.</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Connect with leading business services and experts worldwide. India&apos;s largest B2B marketplace for trusted discovery.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-[#4ecdc4]/20 hover:text-[#4ecdc4] transition-all">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-[#4ecdc4]/20 hover:text-[#4ecdc4] transition-all">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-[#4ecdc4]/20 hover:text-[#4ecdc4] transition-all">
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-[#4ecdc4]/20 hover:text-[#4ecdc4] transition-all">
                <Instagram className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Service Categories */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white uppercase tracking-wider">Top Services</h4>
            <ul className="space-y-3">
              {["Marketing Services", "IT & Development", "Advertising & PR", "Design & Creative", "Business Consultation"].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-gray-400 hover:text-[#4ecdc4] text-sm transition-colors block">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {["About Us", "Contact Us", "Careers", "Verified Partners", "Sell with us"].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-gray-400 hover:text-[#4ecdc4] text-sm transition-colors block">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white uppercase tracking-wider">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-5 h-5 text-[#4ecdc4] shrink-0" />
                <span>Sector 62, Noida, Uttar Pradesh, India</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-5 h-5 text-[#4ecdc4] shrink-0" />
                <span>+91 120 456 7890</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-5 h-5 text-[#4ecdc4] shrink-0" />
                <span>support@b2bcommunity.co.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} B2B Community. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <Link href="#" className="text-gray-500 hover:text-white text-xs transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-gray-500 hover:text-white text-xs transition-colors">Terms of Service</Link>
            <Link href="#" className="text-gray-500 hover:text-white text-xs transition-colors">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
