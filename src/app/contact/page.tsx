'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock, ShieldCheck } from 'lucide-react';

export default function UniformPremiumContact() {
  
  // Heading Style Constant for absolute uniformity
  const headingStyle = "text-3xl font-semibold text-[#1B5E3D] uppercase ";

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-slate-900 font-sans antialiased">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-16 bg-white border-b border-emerald-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 rounded-full mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
            <span className="text-base font-semibold uppercase  text-[#D97706]">24/7 Global Desk</span>
          </motion.div>
          
          {/* Uniform Heading */}
          <h1 className={headingStyle}>
            Get In Touch With Us
          </h1>
          
          <p className="text-slate-400 mt-4 max-w-xl mx-auto text-base font-medium">
            Connecting Indian excellence with global opportunities through transparent communication.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12">
            
            {/* LEFT: INFO */}
            <div className="lg:col-span-4 space-y-8">
              <div>
                <h2 className={headingStyle + " text-xl mb-6"}>Contact Details</h2>
                <div className="space-y-4">
                  {[
                    { icon: Mail, label: "EMAIL", val: "support@indiab2b.com" },
                    { icon: Phone, label: "PHONE", val: "+91 1800 123 4567" },
                    { icon: MapPin, label: "OFFICE", val: "Mumbai, MH, India" }
                  ].map((item, i) => (
                    <div key={i} className="p-6 bg-white rounded-3xl border border-emerald-50 flex items-center gap-5 shadow-sm">
                      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#1B5E3D]">
                        <item.icon size={20} />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-slate-300 uppercase ">{item.label}</p>
                        <p className="text-base font-semibold text-slate-700">{item.val}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100">
                <Clock className="text-[#1B5E3D] mb-4" size={28} />
                <h3 className="text-base font-semibold text-[#1B5E3D] uppercase  mb-2">Operational Hours</h3>
                <p className="text-base text-slate-500 font-medium">
                  Monday — Saturday<br />
                  09:00 AM - 07:00 PM (IST)
                </p>
              </div>
            </div>

            {/* RIGHT: FORM */}
            <div className="lg:col-span-8">
              <div className="bg-white p-10 md:p-14 rounded-[3.5rem] border border-emerald-50 shadow-xl shadow-emerald-900/5">
                <h2 className={headingStyle + " mb-10"}>Send A Message</h2>
                
                <form className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-base font-semibold text-slate-400 uppercase  ml-1">Full Name</label>
                      <input type="text" className="w-full pb-3 bg-transparent border-b border-slate-100 focus:border-[#1B5E3D] outline-none transition-all text-base font-semibold text-slate-800 placeholder:font-normal" placeholder="Enter your name" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-base font-semibold text-slate-400 uppercase  ml-1">Email Address</label>
                      <input type="email" className="w-full pb-3 bg-transparent border-b border-slate-100 focus:border-[#1B5E3D] outline-none transition-all text-base font-semibold text-slate-800 placeholder:font-normal" placeholder="name@company.com" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-base font-semibold text-slate-400 uppercase  ml-1">Inquiry Type</label>
                    <select className="w-full pb-3 bg-transparent border-b border-slate-100 focus:border-[#1B5E3D] outline-none transition-all text-base font-semibold text-slate-800 appearance-none">
                      <option>General Inquiry</option>
                      <option>Bulk Order Sourcing</option>
                      <option>Partnership Opportunity</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-base font-semibold text-slate-400 uppercase  ml-1">Message</label>
                    <textarea rows={4} className="w-full pb-3 bg-transparent border-b border-slate-100 focus:border-[#1B5E3D] outline-none transition-all text-base font-semibold text-slate-800 resize-none placeholder:font-normal" placeholder="How can we assist your business?" />
                  </div>

                  <button className="px-10 py-4 bg-[#1B5E3D] text-white rounded-2xl font-semibold uppercase  text-[12px] hover:bg-[#14452d] transition-all flex items-center gap-3 shadow-lg active:scale-95">
                    Submit Message <Send size={16} />
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- TRUST FOOTER --- */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 border-t border-emerald-50 pt-16 flex flex-col md:flex-row justify-between items-center gap-8">
          <h2 className="text-[12px] font-semibold text-slate-300 uppercase ">Verified Trade Network</h2>
          <div className="flex gap-8 opacity-40 grayscale">
            <ShieldCheck size={32} />
            <div className="font-semibold text-xl">MSME</div>
            <div className="font-semibold text-xl">ISO</div>
          </div>
        </div>
      </section>
    </div>
  );
}
