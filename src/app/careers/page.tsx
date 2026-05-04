'use client';

import React from 'react';
import { Briefcase, Zap, Heart, Star, MapPin, ArrowRight, Rocket } from 'lucide-react';

export default function CareersPage() {
  const openings = [
    { title: 'Frontend Engineer (React)', dept: 'Engineering', type: 'Full-time', location: 'Remote / Mumbai' },
    { title: 'Product Designer', dept: 'Design', type: 'Full-time', location: 'Remote / Mumbai' },
    { title: 'B2B Sales Manager', dept: 'Sales', type: 'Full-time', location: 'Delhi / Bangalore' },
    { title: 'Customer Success lead', dept: 'Support', type: 'Full-time', location: 'Mumbai' },
  ];

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      {/* Hero */}
      <section className="pt-28 pb-16 bg-white border-b border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#164e33]/[0.02] rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#164e33]/[0.08] text-[#164e33] text-base font-semibold px-4 py-1.5 rounded-full mb-4 tracking-wide uppercase">
              <Rocket className="w-3.5 h-3.5" /> Join the Revolution
            </div>
            <h1 className="text-3xl md:text-5xl font-semibold text-slate-900  leading-tight">
              Build the future of <br/> 
              <span className="text-[#164e33]">Indian Commerce</span>
            </h1>
            <p className="text-base md:text-lg text-slate-500 mt-5 leading-relaxed font-normal max-w-lg">
              We're looking for passionate individuals to help us solve complex 
              problems for millions of SMEs across India.
            </p>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-base font-semibold text-slate-500 uppercase  mb-10 text-center">Why join us?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: 'Hyper Growth', desc: 'Work in a fast-paced environment where your impact is immediate.', color: '#164e33' },
              { icon: Heart, title: 'Health & Wellness', desc: 'Comprehensive health insurance and mental wellness support for you and your family.', color: '#f58220' },
              { icon: Star, title: 'Ownership', desc: 'Every employee gets ESOPs. We want you to own a piece of what you build.', color: '#164e33' },
            ].map((perk, idx) => (
              <div key={idx} className="p-7 rounded-2xl bg-[#f8faf9] border border-gray-100 hover:shadow-sm transition-all group">
                <div 
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-colors"
                  style={{ backgroundColor: `${perk.color}10` }}
                >
                  <perk.icon className="w-5 h-5" style={{ color: perk.color }} />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2 ">{perk.title}</h3>
                <p className="text-slate-500 text-base leading-relaxed font-normal">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 ">Open Positions</h2>
              <p className="text-slate-500 mt-1.5 text-base font-normal">Join a team that values your craft.</p>
            </div>
            <div className="flex gap-3">
              <select className="px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-base font-medium text-slate-800 outline-none">
                <option>All Departments</option>
                <option>Engineering</option>
                <option>Design</option>
                <option>Sales</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {openings.map((job, idx) => (
              <div 
                key={idx}
                className="p-5 md:p-6 bg-white border border-gray-100 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md hover:border-[#164e33]/20 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-[#164e33]/[0.08] rounded-xl flex items-center justify-center text-[#164e33] shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-slate-900 group-hover:text-[#164e33] transition-colors">{job.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-base font-semibold text-[#f58220] uppercase ">{job.dept}</span>
                      <div className="flex items-center gap-1 text-slate-500 text-base font-medium">
                        <MapPin className="w-3 h-3" /> {job.location}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                   <span className="text-base font-medium text-slate-500 uppercase tracking-wide">{job.type}</span>
                   <div className="w-9 h-9 bg-[#f8faf9] rounded-full flex items-center justify-center group-hover:bg-[#164e33] group-hover:text-white text-slate-500 transition-all">
                      <ArrowRight className="w-4 h-4" />
                   </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 md:p-10 bg-[#164e33]/[0.04] rounded-2xl text-center border border-[#164e33]/10 relative overflow-hidden">
             <h3 className="text-lg font-semibold text-slate-900 mb-2">Don't see a fit?</h3>
             <p className="text-slate-500 mb-6 max-w-lg mx-auto text-base font-normal">We're always looking for brilliant minds. Send your resume to <span className="text-[#164e33] font-medium">careers@b2b-india.com</span></p>
             <button className="px-8 py-3 bg-[#164e33] text-white rounded-xl font-medium text-base hover:bg-[#113f29] transition-all">General Application</button>
          </div>
        </div>
      </section>
    </div>
  );
}


