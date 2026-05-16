'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Globe, Zap, Target, Award, BarChart3 } from 'lucide-react';

export default function PremiumAboutSection() {
  
  const values = [
    { title: "Direct Sourcing", desc: "Connecting you to the roots of Indian manufacturing without middlemen.", icon: Zap },
    { title: "Quality Assurance", desc: "Multi-step verification process for every registered supplier.", icon: ShieldCheck },
    { title: "Global Standards", desc: "Bringing local Indian businesses to the international trade stage.", icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased">
      
      {/* --- PREMIUM ABOUT BANNER --- */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-[#1A2E1A]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1600&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-30 grayscale"
            alt="B2B Logistics Banner"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1B5E3D]/80 to-[#1A2E1A]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#D97706] font-semibold  uppercase text-base mb-4 block">
              Our Legacy & Future
            </span>
            <h1 className="text-5xl md:text-7xl font-semibold text-white  mb-6">
              ABOUT INDIA B2B
            </h1>
            <div className="w-24 h-1.5 bg-[#D97706] mx-auto rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* --- CORE STORY SECTION --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-semibold text-[#1B5E3D] mb-8">
                REDESIGNING INDIAN TRADE
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6 font-medium">
                India B2B was founded with a singular vision: to bridge the gap between India's vast manufacturing potential and the global demand for quality. We are more than just a directory; we are a trust-based ecosystem.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                Our platform empowers MSMEs by providing them with the digital tools, logistics support, and verification they need to compete on a global scale. We bring the transparency of modern tech to the traditional roots of Indian commerce.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="h-48 bg-emerald-50 rounded-[2rem] flex flex-col items-center justify-center p-6 border border-emerald-100">
                  <Target className="text-[#D97706] mb-2" size={32} />
                  <span className="font-semibold text-xl text-[#1B5E3D]">MISSION</span>
                </div>
                <div className="h-64 rounded-[2rem] overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="h-64 rounded-[2rem] overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" />
                </div>
                <div className="h-48 bg-[#1B5E3D] rounded-[2rem] flex flex-col items-center justify-center p-6 text-white">
                  <Award className="text-[#D97706] mb-2" size={32} />
                  <span className="font-semibold text-xl uppercase">Excellence</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- OUR VALUES: UNIFORM GRID --- */}
      <section className="py-24 bg-[#F7F9F7]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold text-[#1B5E3D] mb-4">OUR GUIDING PRINCIPLES</h2>
            <p className="text-slate-500 font-medium">Built on trust, driven by technology.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-emerald-50 shadow-sm hover:shadow-xl transition-all group">
                <div className="w-14 h-14 bg-emerald-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#1B5E3D] transition-colors duration-300">
                  <value.icon className="text-[#1B5E3D] group-hover:text-white" size={28} />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-4 uppercase ">{value.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-24 bg-white border-b border-emerald-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            {[
              { label: "YEARS OF TRUST", val: "5+" },
              { label: "VERIFIED FACTORIES", val: "12,000+" },
              { label: "GLOBAL PARTNERS", val: "500+" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <h4 className="text-5xl font-semibold text-[#1B5E3D] mb-2">{stat.val}</h4>
                <p className="text-base font-semibold text-[#D97706]  uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-semibold text-[#1B5E3D] mb-8">BE A PART OF THE GROWTH</h2>
          <p className="text-lg text-slate-600 mb-10 font-medium">
            Join thousands of businesses already scaling their reach with India B2B. Let's build the future of trade together.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-12 py-5 bg-[#1B5E3D] text-white rounded-lg font-semibold shadow-lg shadow-emerald-200 hover:bg-[#14452d] transition-all">
              JOIN AS A SUPPLIER
            </button>
            <button className="px-12 py-5 border-2 border-emerald-100 text-[#1B5E3D] rounded-lg font-semibold hover:bg-emerald-50 transition-all">
              CONTACT OUR TEAM
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
