'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "Information Governance",
      content: "At B2B Community, we prioritize the security and confidentiality of your corporate data. This policy outlines how we manage and protect information collected through our platform."
    },
    {
      title: "Data Acquisition",
      content: "We collect business identity information, transaction logs, and operational data necessary to facilitate trade and verification. This includes GSTIN, business registration documents, and professional contact details."
    },
    {
      title: "Utilization Protocol",
      content: "Data is utilized to verify business authenticity, optimize lead matching, facilitate direct communication between trade partners, and enhance platform security through audit logging."
    },
    {
      title: "Third-Party Disclosure",
      content: "We do not sell business data. Information is shared only with verified partners explicitly selected by the user or required by regulatory authorities."
    },
    {
      title: "Data Protection",
      content: "We implement enterprise-grade encryption and secure storage protocols to safeguard your information against unauthorized access or breaches."
    }
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb] py-20 px-4 font-sans text-slate-700 antialiased">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section: Minimal & Impactful */}
        <header className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-medium inline-block mb-4 border border-emerald-100">
              Legal Document
            </span>
            <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 mb-6">
              Privacy Policy
            </h1>
            <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
              <span>Updated May 07, 2026</span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span>v 2.1.0</span>
            </div>
          </motion.div>
        </header>

        {/* Content Body: Creative Card-Based Flow */}
        <div className="relative border-l-2 border-slate-100 ml-4 md:ml-12 pl-8 md:pl-16 space-y-16">
          {sections.map((section, index) => (
            <motion.section
              key={index}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              {/* Timeline Indicator (Creative Bullet) */}
              <div className="absolute -left-[41px] md:-left-[73px] top-1.5 w-4 h-4 rounded-full border-2 border-white bg-emerald-500 shadow-sm group-hover:scale-125 transition-transform duration-300" />
              
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow duration-300">
                <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-3">
                  <span className="text-emerald-500 opacity-50 font-mono text-sm">0{index + 1}</span>
                  {section.title}
                </h2>
                <p className="text-base leading-relaxed text-slate-500">
                  {section.content}
                </p>
              </div>
            </motion.section>
          ))}
        </div>

       

       
      </div>
    </div>
  );
}