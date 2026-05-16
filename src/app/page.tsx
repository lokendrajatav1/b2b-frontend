"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Hero from "@/components/Hero";
import ServiceGrid from "@/components/ServiceGrid";
import FeaturedServices from "@/components/FeaturedServices";
import AboutSection from "@/components/AboutSection";
import CitySuppliers from "@/components/CitySuppliers";
import QuoteForm from "@/components/QuoteForm";
import AdBanner from "@/components/AdBanner";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'SUPERADMIN') {
        router.replace('/super-admin/dashboard');
      } else if (user.role === 'ADMIN') {
        router.replace('/admin/dashboard');
      } else if (user.role === 'VENDOR') {
        router.replace('/vendor/dashboard');
      }
    }
  }, [user, loading, router]);

  // Optionally show a loading state or nothing while redirecting
  if (loading) return null;

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
