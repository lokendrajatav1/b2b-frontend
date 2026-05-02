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
    <footer className="bg-[#17313b] text-white pt-12 pb-8">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand & Description */}
          <div className="space-y-4">
            <Link href="/" className="inline-block bg-white p-2.5 rounded-xl">
              <img src="/logo.png" alt={settings.websiteName} className="h-16 w-auto object-contain" />
            </Link>
            <p className="text-slate-500 text-base leading-relaxed max-w-xs">
              Connect with leading business services and experts worldwide. India&apos;s largest B2B marketplace for trusted discovery.
            </p>
            <div className="flex items-center gap-4">
              {settings.facebookUrl && (
                <Link href={settings.facebookUrl} target="_blank" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition">
                  <Facebook className="w-5 h-5" />
                </Link>
              )}
              {settings.twitterUrl && (
                <Link href={settings.twitterUrl} target="_blank" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition">
                  <Twitter className="w-5 h-5" />
                </Link>
              )}
              {settings.linkedinUrl && (
                <Link href={settings.linkedinUrl} target="_blank" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition">
                  <Linkedin className="w-5 h-5" />
                </Link>
              )}
              {settings.instagramUrl && (
                <Link href={settings.instagramUrl} target="_blank" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition">
                  <Instagram className="w-5 h-5" />
                </Link>
              )}
              {settings.youtubeUrl && (
                <Link href={settings.youtubeUrl} target="_blank" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition">
                  <Youtube className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>

          {/* Service Categories */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-white uppercase ">Top Services</h4>
            <ul className="space-y-2">
              {["Marketing Services", "IT & Development", "Advertising & PR", "Design & Creative", "Business Consultation"].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-slate-500 text-base block">
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
                  <Link href={item.href} className="text-slate-500 text-base block hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-white uppercase ">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-slate-500 text-base">
                <MapPin className="w-5 h-5 text-[#4ecdc4] shrink-0" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-3 text-slate-500 text-base">
                <Phone className="w-5 h-5 text-[#4ecdc4] shrink-0" />
                <span>{settings.contactPhone}</span>
              </li>
              <li className="flex items-center gap-3 text-slate-500 text-base">
                <Mail className="w-5 h-5 text-[#4ecdc4] shrink-0" />
                <span>{settings.contactEmail}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-slate-700 text-base">
            © {new Date().getFullYear()} {settings.websiteName}. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <Link href="#" className="text-slate-700 text-base text-right">Industry Access</Link>
            <Link href="#" className="text-slate-700 text-base">Privacy Policy</Link>
            <Link href="#" className="text-slate-700 text-base">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
