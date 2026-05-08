"use client";

import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, Youtube } from "lucide-react";
import { apiFetch } from "@/lib/api";

const Footer = () => {
  const [settings, setSettings] = React.useState({
    websiteName: 'Admission Master',
    contactEmail: 'support@indiab2b.co.in',
    contactPhone: '+91 120 456 7890',
    address: 'Sector 62, Noida, Uttar Pradesh, India',
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    youtubeUrl: ''
  });

  React.useEffect(() => {
    apiFetch('/settings').then((data) => {
      if (data) setSettings(data);
    }).catch(err => console.error("Error fetching settings:", err));
  }, []);

  return (
    <>
      <div className="w-full h-60 md:h-80 lg:h-120 relative select-none pointer-events-none -mb-12 md:-mb-20 z-10">
        <img
          src="/footer.png"
          alt="Landscape"
          className="w-full h-full object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d3a26] to-[95%]" />
      </div>

    <footer className="bg-[#0d3a26] text-white relative overflow-hidden pt-12 md:pt-20">
      {/* Decorative Landscape Illustration */}
    
      <div className="container mx-auto px-6 md:px-12 lg:px-20 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand & Description */}
          <div className="space-y-4">
            <Link href="/" className="inline-block bg-white p-2.5 rounded-xl">
              <img src="/logo.png" alt={settings.websiteName} className="h-16 w-auto object-contain" />
            </Link>
            <p className="text-white text-base leading-relaxed max-w-xs">
              Connect with leading business services and experts worldwide. India&apos;s largest B2B marketplace for trusted discovery.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Facebook, url: settings.facebookUrl, color: 'hover:bg-blue-600' },
                { icon: Twitter, url: settings.twitterUrl, color: 'hover:bg-sky-500' },
                { icon: Linkedin, url: settings.linkedinUrl, color: 'hover:bg-blue-700' },
                { icon: Instagram, url: settings.instagramUrl, color: 'hover:bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600' },
                { icon: Youtube, url: settings.youtubeUrl, color: 'hover:bg-red-600' }
              ].map((social, idx) => social.url || idx < 3 ? ( // Always show at least 3 placeholders for UI balance if empty
                <Link
                  key={idx}
                  href={social.url || "#"}
                  target="_blank"
                  className={`w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 transition-all duration-300 group hover:scale-110 hover:shadow-lg hover:shadow-white/5 ${social.color}`}
                >
                  <social.icon className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
                </Link>
              ) : null)}
            </div>
          </div>

          {/* Service Categories */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-white uppercase ">Top Services</h4>
            <ul className="space-y-2">
              {["Marketing Services", "IT & Development", "Advertising & PR", "Design & Creative", "Business Consultation"].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-white/90 text-base block hover:text-white transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-white uppercase ">Company</h4>
            <ul className="space-y-2">
              {[
                { label: "About Us", href: "/about" },
                { label: "Contact Us", href: "/contact" },
                // { label: "Careers", href: "/careers" },
                // { label: "Find Suppliers", href: "/find-suppliers" },
                // { label: "Sell with us", href: "/sell" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-white/90 text-base block hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-6">
            <h4 className="text-base font-bold text-white uppercase tracking-wider">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-4 text-white/90 text-sm group cursor-default">
                <div className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 group-hover:bg-[#164e33] group-hover:border-[#164e33] transition-all shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <span className="pt-2">{settings.address}</span>
              </li>
              <li className="flex items-center gap-4 text-white/90 text-sm group cursor-pointer hover:text-white transition-colors">
                <div className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 group-hover:bg-[#164e33] group-hover:border-[#164e33] transition-all shrink-0">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <span>{settings.contactPhone}</span>
              </li>
              <li className="flex items-center gap-4 text-white/90 text-sm group cursor-pointer hover:text-white transition-colors">
                <div className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 group-hover:bg-[#164e33] group-hover:border-[#164e33] transition-all shrink-0">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <span className="truncate">{settings.contactEmail}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white/60 text-base">
            © {new Date().getFullYear()} {settings.websiteName}. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <Link href="/industry-access" className="text-white/60 text-base text-right hover:text-white transition-colors">Industry Access</Link>
            <Link href="/privacy-policy" className="text-white/60 text-base hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="text-white/60 text-base hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
};

export default Footer;
