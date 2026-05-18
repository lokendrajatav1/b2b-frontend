'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function UniformPremiumContact() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-800 font-sans antialiased selection:bg-[#FF4F00]/10 selection:text-[#FF4F00]">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-16 bg-white border-b border-slate-100">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 rounded-full mb-6 border border-orange-100"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4F00] animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#FF4F00]">24/7 Global Business Desk</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight uppercase"
          >
            GET IN TOUCH WITH US
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-500 mt-4 max-w-2xl mx-auto text-base md:text-lg font-normal leading-relaxed"
          >
            Connecting manufacturers, suppliers, and exporters with global buyers. Reach out to our trade advisory team for custom enterprise solutions.
          </motion.p>
        </div>
      </section>

      {/* --- CONTENT SECTION --- */}
      <section className="py-20 bg-[#F9FBFD]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* LEFT: INFO */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <div className="relative pb-2 inline-block mb-6">
                  <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider">
                    Contact Details
                  </h2>
                  <div className="absolute bottom-0 left-0 w-8 h-[2px] bg-[#FF4F00] rounded-full" />
                </div>
                
                <div className="space-y-4">
                  {[
                    { icon: Mail, label: "Email Support", val: "support@indiab2bconnect.com", desc: "For general and technical inquiries" },
                    { icon: Phone, label: "Toll-Free Helpline", val: "+91 1800 123 4567", desc: "Available Mon-Sat, 9AM-7PM IST" },
                    { icon: MapPin, label: "Registered Office", val: "Sector 62, Noida, Uttar Pradesh, India", desc: "IndiaB2B Connect Corporate HQ" }
                  ].map((item, i) => (
                    <div 
                      key={i} 
                      className="p-6 bg-white rounded-2xl border border-slate-100 flex items-start gap-5 shadow-sm"
                    >
                      <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-[#FF4F00] shrink-0 border border-orange-100/50">
                        <item.icon size={22} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#FF4F00] uppercase tracking-wider mb-0.5">{item.label}</p>
                        <p className="text-base font-bold text-slate-800 mb-1">{item.val}</p>
                        <p className="text-xs font-normal text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT: FORM */}
            <div className="lg:col-span-7">
              <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-900/5">
                <div className="relative pb-2 inline-block mb-8">
                  <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider">
                    Send A Message
                  </h2>
                  <div className="absolute bottom-0 left-0 w-8 h-[2px] bg-[#FF4F00] rounded-full" />
                </div>

                {formSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 bg-emerald-50 rounded-2xl border border-emerald-100 text-center space-y-3"
                  >
                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto text-white shadow-sm">
                      <CheckCircle2 size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Message Received Successfully!</h3>
                    <p className="text-sm text-slate-600 max-w-md mx-auto">
                      Thank you for contacting IndiaB2B Connect. Our business development team will review your inquiry and get back to you within 24 business hours.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                        <input 
                          type="text" 
                          required
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#FF4F00] focus:ring-4 focus:ring-[#FF4F00]/10 outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400" 
                          placeholder="Enter your name" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                        <input 
                          type="email" 
                          required
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#FF4F00] focus:ring-4 focus:ring-[#FF4F00]/10 outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400" 
                          placeholder="name@company.com" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Inquiry Type</label>
                      <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#FF4F00] focus:ring-4 focus:ring-[#FF4F00]/10 outline-none transition-all text-sm font-medium text-slate-800 appearance-none cursor-pointer">
                        <option>General Corporate Inquiry</option>
                        <option>Bulk Sourcing Requirement</option>
                        <option>Vendor Partnership & Onboarding</option>
                        <option>Technical / Account Support</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Message Details</label>
                      <textarea 
                        rows={5} 
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#FF4F00] focus:ring-4 focus:ring-[#FF4F00]/10 outline-none transition-all text-sm font-medium text-slate-800 resize-none placeholder:text-slate-400" 
                        placeholder="Please elaborate on your business requirement or query..." 
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="w-full md:w-auto px-8 py-4 bg-[#FF4F00] text-white rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-[#e04500] transition-colors flex items-center justify-center gap-3 shadow-lg shadow-orange-600/10 hover:shadow-orange-600/20 active:scale-[0.98] transition-all"
                    >
                      Submit Message <Send size={14} />
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
