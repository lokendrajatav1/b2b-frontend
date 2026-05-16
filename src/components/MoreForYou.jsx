"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const MoreForYou = () => {
  const items = [
    {
      img: "/t1.webp",
      title: "Connect with verified partners",
      desc: "Tell us your requirement & let our experts find verified vendors for you.",
      delay: 0.1,
    },
    {
      img: "/t2.webp",
      title: "Sell on B2B Community for free",
      desc: "Reach out to millions of active buyers. Sell with us effortlessly.",
      delay: 0.2,
    },
    {
      img: "/t3.webp",
      title: "Expert Consultation",
      desc: "Get personalized advice from specialists to scale your business faster.",
      delay: 0.3,
    },
    {
      img: "/t4.webp",
      title: "Data-driven insights",
      desc: "Access premium market reports and vendor analytics to stay ahead of competition.",
      delay: 0.4,
    },
  ];

  return (
    <section className="more-for-you py-20 relative overflow-hidden bg-[#fdfdfd]">
      {/* Soft Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#164e33]/5 rounded-full blur-[100px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[100px] -ml-64 -mb-64" />

      <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              More for You
            </h2>
            <p className="text-slate-600 font-medium max-w-xl">
              Explore dedicated tools and expert assistance designed to
              accelerate your B2B growth and market presence.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: item.delay }}
              whileHover={{ y: -8 }}
              className="group relative bg-white p-8 rounded-lg border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col items-center text-center h-full"
            >
              <div className="w-20 h-20 relative flex items-center justify-center mb-8">
                {/* Icon Glow Effect */}
                <div className="absolute inset-0 bg-[#164e33]/10 rounded-lg blur-xl group-hover:bg-[#164e33]/20 transition-colors" />
                <div className="relative bg-white p-4 rounded-lg shadow-sm border border-slate-50">
                  <Image
                    src={item.img}
                    alt={item.title}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
              </div>

              <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-4 leading-tight">
                {item.title}
              </h3>

              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                {item.desc}
              </p>

              {/* Subtle Bottom Accent */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-[#164e33] rounded-full group-hover:w-16 transition-all duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MoreForYou;
