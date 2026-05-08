"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Star,
  ShieldCheck,
  MessageCircle,
  BadgeCheck,
  Store,
  Smartphone,
  BarChart3,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AboutSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);
  const slides = [
    { id: 1, src: "/s1.webp", alt: "Banner 1" },
    { id: 2, src: "/s2.webp", alt: "Banner 2" },
    { id: 3, src: "/s3.webp", alt: "Banner 3" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <>
      <section className="about-section py-10 md:py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Left Content Area (Minimized width for maximum banner space) */}
            <div className="lg:flex-3 space-y-8">
              <div className="space-y-4 text-left">
                <h2 className="text-3xl md:text-5xl font-semibold text-[#333333] leading-tight">
                  We connect <br />
                  <span className="text-[#333333]/90">Buyers & Sellers</span>
                </h2>
                <p className="text-slate-900 text-lg font-medium leading-relaxed max-w-xl">
                  B2B Community is India&apos;s largest online B2B marketplace,
                  connecting buyers with vendors.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-10 md:w-14 h-10 md:h-14 rounded-full border-2 border-blue-200 flex items-center justify-center bg-[#164e33]/5/30">
                    <Star className="w-7 h-7 text-blue-500" />
                  </div>
                  <span className="font-semibold text-[#333333] text-base leading-tight">
                    Trusted
                    <br />
                    Platform
                  </span>
                </div>

                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-10 md:w-14 h-10 md:h-14 rounded-full border-2 border-blue-200 flex items-center justify-center bg-[#164e33]/5/30">
                    <ShieldCheck className="w-7 h-7 text-blue-500" />
                  </div>
                  <span className="font-semibold text-[#333333] text-base leading-tight">
                    Safe &<br />
                    Secure
                  </span>
                </div>

                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-10 md:w-14 h-10 md:h-14 rounded-full border-2 border-blue-200 flex items-center justify-center bg-[#164e33]/5/30">
                    <MessageCircle className="w-7 h-7 text-blue-500" />
                  </div>
                  <span className="font-semibold text-[#333333] text-base leading-tight">
                    Quick
                    <br />
                    Assistance
                  </span>
                </div>
              </div>
            </div>

            {/* Right Slider Area (Maximized width, Reduced height) */}
            <div className="lg:flex-7 w-full flex flex-col items-center">
              <div className="relative w-full aspect-21/9 rounded-xl md:rounded-[2.5rem] overflow-hidden   bg-gray-100 border border-gray-100">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={currentSlide}
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                    }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={slides[currentSlide].src}
                      alt={slides[currentSlide].alt}
                      fill
                      className="object-cover"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Slider Navigation Arrows */}
                <button
                  onClick={() =>
                    setCurrentSlide(
                      (prev) => (prev - 1 + slides.length) % slides.length,
                    )
                  }
                  className="absolute hidden md:block left-6 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/10 border border-white/20 text-white backdrop-blur-md hover:bg-white/30 hover:scale-110 transition-all cursor-pointer group"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    setCurrentSlide((prev) => (prev + 1) % slides.length)
                  }
                  className="absolute  hidden md:block  right-6 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/10 border border-white/20 text-white backdrop-blur-md hover:bg-white/30 hover:scale-110 transition-all cursor-pointer group"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Pagination Dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        currentSlide === index
                          ? "w-8 bg-white"
                          : "w-2.5 bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* More for You Section */}
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
                Explore dedicated tools and expert assistance designed to accelerate your B2B growth and market presence.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                img: "/t1.webp",
                title: "Connect with verified partners",
                desc: "Tell us your requirement & let our experts find verified vendors for you.",
                delay: 0.1
              },
              {
                img: "/t2.webp",
                title: "Sell on B2B Community for free",
                desc: "Reach out to millions of active buyers. Sell with us effortlessly.",
                delay: 0.2
              },
              {
                img: "/t3.webp",
                title: "Expert Consultation",
                desc: "Get personalized advice from specialists to scale your business faster.",
                delay: 0.3
              },
              {
                img: "/t4.webp",
                title: "Data-driven insights",
                desc: "Access premium market reports and vendor analytics to stay ahead of competition.",
                delay: 0.4
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: item.delay }}
                whileHover={{ y: -8 }}
                className="group relative bg-white p-8 rounded-xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col items-center text-center h-full"
              >
                <div className="w-20 h-20 relative flex items-center justify-center mb-8">
                  {/* Icon Glow Effect */}
                  <div className="absolute inset-0 bg-[#164e33]/10 rounded-xl blur-xl group-hover:bg-[#164e33]/20 transition-colors" />
                  <div className="relative bg-white p-4 rounded-xl shadow-sm border border-slate-50">
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
      {/* FAQ Section */}
      <section className="faq-section py-24 bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="text-left mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900">
              Frequently asked questions
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-x-8 gap-y-2">
            {[
              [
                {
                  q: "How does B2B Community help my business?",
                  a: "B2B Community connects you with millions of buyers, helping you generate leads and grow your brand visibility globally.",
                },
                {
                  q: "How do I find verified partners?",
                  a: "Our platform features verified badges for trusted vendors, allowing you to choose partners with confidence based on reviews and ratings.",
                },
                {
                  q: "Is there a fee for creating a profile?",
                  a: "You can start with a basic profile for free. We also offer premium listing options to help you stand out in competitive categories.",
                },
                {
                  q: "Can I manage my inquiries on mobile?",
                  a: "Yes, our platform is fully responsive and we offer a mobile app for real-time lead management.",
                },
              ],
              [
                {
                  q: "How does billing work?",
                  a: "Our billing is transparent and flexible. You can choose between various payment models based on your listing tier and lead generation needs.",
                },
                {
                  q: "Can I share an individual app?",
                  a: "Yes, our platform allows you to export and share specific service presentations or vendor profiles with your local teams.",
                },
                {
                  q: "When should I use a new table vs. a view?",
                  a: "New tables are best for distinct data types, while views allow you to filter and slice existing vendor data for specific project needs.",
                },
                {
                  q: "How can I transfer data from one base to another?",
                  a: "We provide easy-to-use export tools that allow you to download vendor analytics and re-upload them to your internal CRM systems.",
                },
              ],
            ].map((column, colIndex) => (
              <div key={colIndex} className="flex-1 space-y-2">
                {column.map((faq, index) => {
                  const faqIndex = colIndex * 4 + index;
                  return (
                    <div
                      key={faqIndex}
                      className="bg-[#f9f9f9] rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setActiveFaqIndex(
                            activeFaqIndex === faqIndex ? null : faqIndex,
                          )
                        }
                        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-100/50 transition-colors cursor-pointer"
                      >
                        <span className="text-base font-semibold text-slate-800">
                          {faq.q}
                        </span>
                        {activeFaqIndex === faqIndex ? (
                          <Minus className="w-5 h-5 text-slate-800" />
                        ) : (
                          <Plus className="w-5 h-5 text-slate-800" />
                        )}
                      </button>
                      <AnimatePresence>
                        {activeFaqIndex === faqIndex && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                          >
                            <div className="px-6 pb-5 text-slate-800 text-base leading-relaxed">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutSection;

