"use client";

import Hero from "@/components/Hero";
import ServiceGrid from "@/components/ServiceGrid";
import FeaturedServices from "@/components/FeaturedServices";
import AboutSection from "@/components/AboutSection";
import CitySuppliers from "@/components/CitySuppliers";
import QuoteForm from "@/components/QuoteForm";
import AdBanner from "@/components/AdBanner";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <main>
        <Hero />
        <ServiceGrid />
        <FeaturedServices />
        <CitySuppliers />
        <QuoteForm />
        <AboutSection />
      </main>
    </div>
  );
}
