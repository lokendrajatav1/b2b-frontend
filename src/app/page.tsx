"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ServiceGrid from "@/components/ServiceGrid";
import FeaturedServices from "@/components/FeaturedServices";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <main>
        <Hero />
        <ServiceGrid />
        <FeaturedServices />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}
