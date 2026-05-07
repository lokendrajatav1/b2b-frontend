"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, Heart, Sparkles, Wrench, ShoppingBag, 
  CheckCircle, Award, Zap, Headphones, ShieldCheck,
  Building2, Diamond, Utensils, Flower2, Waves, Scissors,
  AirVent, Car, Bike, Film, ShoppingCart, Lightbulb, Handshake
} from 'lucide-react';

const ServiceSection = ({ title, subtitle, icon: TitleIcon, iconBg, items, router }) => (
  <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
    <div className="flex justify-between items-start mb-8">
      <div className="flex gap-4">
        {/* Title icon background color changes per section */}
        <div className={`p-4 rounded-full ${iconBg}`}>
          {/* Main title icons are green now */}
          <TitleIcon className="w-8 h-8 text-green-800" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-green-950 tracking-tight">{title}</h2>
          <p className="text-gray-500 text-base mt-1">{subtitle}</p>
        </div>
      </div>
      <button 
        onClick={() => router.push('/search')}
        className="flex items-center gap-2 px-5 py-2 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
      >
        View all <ArrowRight className="w-4 h-4 text-green-700" />
      </button>
    </div>

    <div className="grid grid-cols-3 gap-5">
      {items.map((item, idx) => (
        <div 
          key={idx} 
          onClick={() => router.push(`/search?q=${encodeURIComponent(item.label)}`)}
          className="group cursor-pointer"
        >
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3 shadow-inner">
            <img 
              src={item.image} 
              alt={item.label}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Small icon circle on the image - made green to match request */}
            <div className="absolute bottom-3 left-3 bg-white p-2.5 rounded-full shadow-lg">
              <item.icon className="w-5 h-5 text-green-800" strokeWidth={2} />
            </div>
          </div>
          <p className="text-center font-bold text-gray-800 text-sm">{item.label}</p>
        </div>
      ))}
    </div>
  </div>
);

const FeaturesBar = () => (
  <div className="mt-12 bg-gray-50/50 border border-gray-100 rounded-[2rem] py-8 px-12 grid grid-cols-4 gap-8">
    {[
      { icon: ShieldCheck, title: "Verified & Trusted", desc: "Quality checked partners", color: "text-green-800", bg: "bg-green-100" },
      { icon: Award, title: "Wide Range", desc: "100+ categories to explore", color: "text-green-800", bg: "bg-green-100" },
      { icon: Handshake, title: "Easy & Reliable", desc: "Quick bookings & secure payments", color: "text-green-800", bg: "bg-green-100" },
      { icon: Headphones, title: "24/7 Support", desc: "We're here to help you", color: "text-green-800", bg: "bg-green-100" },
    ].map((f, i) => (
      <div key={i} className="flex items-center gap-5 border-r last:border-0 border-gray-200 pr-8">
        <div className={`p-3.5 rounded-full ${f.bg}`}>
          {/* Feature icons are green too */}
          <f.icon className={`w-7 h-7 ${f.color}`} strokeWidth={2} />
        </div>
        <div>
          <h4 className="font-bold text-gray-800 text-[15px]">{f.title}</h4>
          <p className="text-gray-500 text-xs mt-0.5">{f.desc}</p>
        </div>
      </div>
    ))}
  </div>
);

const FeaturedServices = () => {
  const router = useRouter();

  const sections = [
    {
      title: "Wedding Requisites",
      subtitle: "Everything you need for a perfect celebration.",
      icon: Heart,
      iconBg: "bg-orange-50",
      items: [
        { label: "Banquet Halls", icon: Building2, image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=400&auto=format&fit=crop" },
        { label: "Bridal Requisite", icon: Diamond, image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=400&auto=format&fit=crop" },
        { label: "Caterers", icon: Utensils, image: "https://media.istockphoto.com/id/650655146/photo/catering-food-wedding-event-table.webp?a=1&b=1&s=612x612&w=0&k=20&c=OSZxkktoI6XU03mElpuRFw-hykcvek82IEKQNr60cTo=" },
      ]
    },
    {
      title: "Beauty & Spa",
      subtitle: "Relax, rejuvenate & look your best.",
      icon: Flower2,
      iconBg: "bg-green-50",
      items: [
        { label: "Beauty Parlours", icon: Flower2, image: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=400&auto=format&fit=crop" },
        { label: "Spa & Massages", icon: Waves, image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3BhJTIwYW5kbWFzc2FnZXxlbnwwfHwwfHx8MA%3D%3D" },
        { label: "Salons", icon: Scissors, image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=400&auto=format&fit=crop" },
      ]
    },
    {
      title: "Repairs & Services",
      subtitle: "Expert help for your home and vehicles.",
      icon: Wrench,
      iconBg: "bg-blue-50",
      items: [
        { label: "AC Service", icon: AirVent, image: "https://plus.unsplash.com/premium_photo-1682126012378-859ca7a9f4cf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8QUMlMjBSZXBhaXJ8ZW58MHx8MHx8fDA%3D" },
        { label: "Car Service", icon: Car, image: "https://media.istockphoto.com/id/470928420/photo/mechanic-working-on-a-car-in-a-garage.jpg?s=612x612&w=0&k=20&c=XlTTIdEau0WSPeT8GU3ZBz4DtTNkZrc4wEu5YpKaL18=" },
        { label: "Bike Service", icon: Bike, image: "https://images.unsplash.com/photo-1623220988124-bcd1bad9a408?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fEJpa2UlMjBtb3RvciUyMFJlcGFpcnxlbnwwfHwwfHx8MA%3D%3D" },
      ]
    },
    {
      title: "Daily Needs",
      subtitle: "All your everyday essentials in one place.",
      icon: ShoppingBag,
      iconBg: "bg-purple-50",
      items: [
        { label: "Movies", icon: Film, image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=400&auto=format&fit=crop" },
        { label: "Grocery", icon: ShoppingCart, image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop" },
        { label: "Electricians", icon: Lightbulb, image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=400&auto=format&fit=crop" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 p-12 font-sans tracking-tight">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section, index) => (
            <ServiceSection key={index} {...section} router={router} />
          ))}
        </div>
        <FeaturesBar />
      </div>
    </div>
  );
};

export default FeaturedServices;