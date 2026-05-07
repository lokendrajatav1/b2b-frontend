'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function TermsOfService() {
  const sections = [
    { id: '01', title: 'Acceptance of Protocol', content: 'By accessing the B2B Community platform, you agree to comply with our professional operational standards and legal frameworks.' },
    { id: '02', title: 'User Responsibility', content: 'Users are responsible for maintaining the accuracy of their business profiles and the security of their credentials. Fraudulent activity or misrepresentation will result in immediate termination of access.' },
    { id: '03', title: 'Trade Conduct', content: 'All business interactions facilitated through the platform must adhere to ethical trade practices and applicable laws. B2B Community is not a party to the contracts formed between buyers and sellers.' },
    { id: '04', title: 'Intellectual Assets', content: 'The platform architecture, brand assets, and aggregated data are the exclusive property of B2B Community. Unauthorized extraction or reproduction is prohibited.' },
    { id: '05', title: 'Limitation of Liability', content: 'B2B Community provides the platform "as-is" and is not liable for indirect damages arising from platform utilization or business outcomes.' },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] py-20 px-6 font-sans antialiased text-slate-800">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-24 border-l-4 border-emerald-500 pl-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Heading: All fonts are same size (text-5xl) */}
            <h1 className="text-5xl font-black text-slate-900 uppercase">
              Terms of Service
            </h1>
            <div className="mt-4 flex items-center gap-4">
              <span className="h-px w-12 bg-emerald-500"></span>
              <p className="text-[10px] font-bold uppercase  text-slate-400">
                Last Updated • May 07, 2026
              </p>
            </div>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Side: Creative Visual Element */}
          <div className="hidden lg:block lg:col-span-4 sticky top-24 h-fit">
            <div className="relative p-8 bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-50 rounded-full blur-3xl" />
              <h3 className="text-sm font-bold text-emerald-600 uppercase mb-6 ">Navigation</h3>
              <nav className="space-y-6">
                {sections.map((s) => (
                  <div key={s.id} className="group cursor-pointer flex items-center gap-4">
                    <span className="text-[10px] font-mono text-slate-300 group-hover:text-emerald-500 transition-colors">{s.id}</span>
                    <span className="text-xs font-bold text-slate-400 group-hover:text-slate-900 uppercase  transition-colors">{s.title}</span>
                  </div>
                ))}
              </nav>
            </div>
          </div>

          {/* Right Side: Content Sections */}
          <div className="lg:col-span-8 space-y-20">
            {sections.map((section, index) => (
              <motion.section
                key={section.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="flex items-baseline gap-6 mb-4">
                  <span className="text-4xl font-black text-slate-100 absolute -left-12 -top-4 select-none lg:static lg:block">
                    {section.id}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 uppercase">
                    {section.title}
                  </h2>
                </div>
                <div className="lg:pl-16">
                  <p className="text-lg leading-relaxed text-slate-500 font-medium">
                    {section.content}
                  </p>
                </div>
              </motion.section>
            ))}
          </div>

        </div>

        {/* Footer Accent */}
        <footer className="mt-32 pt-8 border-t border-slate-100 flex justify-between items-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase ">© B2B Community Platform</p>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <div className="w-2 h-2 rounded-full bg-slate-200" />
          </div>
        </footer>
      </div>
    </div>
  );
}