"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Heart,
  Sparkles,
  Wrench,
  ShoppingBag,
  CheckCircle,
  Award,
  Zap,
  Headphones,
  ShieldCheck,
  Building2,
  Diamond,
  Utensils,
  Flower2,
  Waves,
  Scissors,
  AirVent,
  Car,
  Bike,
  Film,
  ShoppingCart,
  Lightbulb,
  Handshake,
} from "lucide-react";

const ServiceSection = ({
  title,
  subtitle,
  icon: TitleIcon,
  iconBg,
  items,
  router,
}) => (
  <div className="bg-white rounded-lg p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 flex flex-col h-full">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div className="flex items-center gap-4">
        <div className={`p-3.5 md:p-4 rounded-lg ${iconBg} shrink-0`}>
          <TitleIcon
            className="w-6 h-6 md:w-8 md:h-8 text-green-800"
            strokeWidth={1.5}
          />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-green-950 tracking-tight leading-tight">
            {title}
          </h2>
          <p className="text-gray-500 text-sm md:text-base mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>
      <button
        onClick={() => router.push("/search")}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-xs md:text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all hover:border-green-200 active:scale-95 shrink-0"
      >
        View all <ArrowRight className="w-4 h-4 text-green-700" />
      </button>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 mt-auto">
      {items.map((item, idx) => (
        <div
          key={idx}
          onClick={() =>
            router.push(`/search?q=${encodeURIComponent(item.label)}`)
          }
          className="group cursor-pointer"
        >
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-3 shadow-inner bg-gray-100">
            <img
              src={item.image}
              alt={item.label}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm p-2 rounded-full shadow-lg border border-white/20">
              <item.icon
                className="w-4 h-4 md:w-5 md:h-5 text-green-800"
                strokeWidth={2}
              />
            </div>
          </div>
          <p className="text-center font-bold text-gray-800 text-xs md:text-sm transition-colors group-hover:text-green-800">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  </div>
);

const FeaturesBar = () => (
  <div className="mt-12 bg-white/50 backdrop-blur-sm border border-white rounded-lg py-10 px-8 md:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-8 shadow-xl shadow-gray-200/20">
    {[
      {
        icon: ShieldCheck,
        title: "Verified & Trusted",
        desc: "Quality checked partners",
        color: "text-green-800",
        bg: "bg-green-100/50",
      },
      {
        icon: Award,
        title: "Wide Range",
        desc: "100+ categories to explore",
        color: "text-green-800",
        bg: "bg-green-100/50",
      },
      {
        icon: Handshake,
        title: "Easy & Reliable",
        desc: "Quick bookings & secure payments",
        color: "text-green-800",
        bg: "bg-green-100/50",
      },
      {
        icon: Headphones,
        title: "24/7 Support",
        desc: "We're here to help you",
        color: "text-green-800",
        bg: "bg-green-100/50",
      },
    ].map((f, i) => (
      <div
        key={i}
        className="flex items-center gap-5 lg:border-r last:border-0 border-gray-100 lg:pr-8 group hover:translate-y-[-2px] transition-transform duration-300"
      >
        <div
          className={`p-4 rounded-lg ${f.bg} shrink-0 transition-transform group-hover:scale-110`}
        >
          <f.icon
            className={`w-6 h-6 md:w-7 md:h-7 ${f.color}`}
            strokeWidth={2}
          />
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-gray-800 text-sm md:text-[15px] leading-tight">
            {f.title}
          </h4>
          <p className="text-gray-500 text-[11px] md:text-xs mt-1 leading-normal">
            {f.desc}
          </p>
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
      subtitle: "Everything you need for celebration.",
      icon: Heart,
      iconBg: "bg-orange-50",
      items: [
        {
          label: "Banquet Halls",
          icon: Building2,
          image:
            "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=400&auto=format&fit=crop",
        },
        {
          label: "Bridal Requisite",
          icon: Diamond,
          image:
            "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=400&auto=format&fit=crop",
        },
        {
          label: "Caterers",
          icon: Utensils,
          image:
            "https://media.istockphoto.com/id/650655146/photo/catering-food-wedding-event-table.webp?a=1&b=1&s=612x612&w=0&k=20&c=OSZxkktoI6XU03mElpuRFw-hykcvek82IEKQNr60cTo=",
        },
      ],
    },
    {
      title: "Beauty & Spa",
      subtitle: "Relax, rejuvenate & look best.",
      icon: Flower2,
      iconBg: "bg-green-50",
      items: [
        {
          label: "Beauty Parlours",
          icon: Flower2,
          image:
            "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=400&auto=format&fit=crop",
        },
        {
          label: "Spa & Massages",
          icon: Waves,
          image:
            "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3BhJTIwYW5kbWFzc2FnZXxlbnwwfHwwfHx8MA%3D%3D",
        },
        {
          label: "Salons",
          icon: Scissors,
          image:
            "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=400&auto=format&fit=crop",
        },
      ],
    },
    {
      title: "Repairs & Services",
      subtitle: "Expert help for home and vehicles.",
      icon: Wrench,
      iconBg: "bg-blue-50",
      items: [
        {
          label: "AC Service",
          icon: AirVent,
          image:
            "https://plus.unsplash.com/premium_photo-1682126012378-859ca7a9f4cf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8QUMlMjBSZXBhaXJ8ZW58MHx8MHx8fDA%3D",
        },
        {
          label: "Car Service",
          icon: Car,
          image:
            "https://media.istockphoto.com/id/470928420/photo/mechanic-working-on-a-car-in-a-garage.jpg?s=612x612&w=0&k=20&c=XlTTIdEau0WSPeT8GU3ZBz4DtTNkZrc4wEu5YpKaL18=",
        },
        {
          label: "Bike Service",
          icon: Bike,
          image:
            "https://images.unsplash.com/photo-1623220988124-bcd1bad9a408?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fEJpa2UlMjBtb3RvciUyMFJlcGFpcnxlbnwwfHwwfHx8MA%3D%3D",
        },
      ],
    },
    {
      title: "Daily Needs",
      subtitle: "Everyday essentials in one place.",
      icon: ShoppingBag,
      iconBg: "bg-purple-50",
      items: [
        {
          label: "Movies",
          icon: Film,
          image:
            "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=400&auto=format&fit=crop",
        },
        {
          label: "Grocery",
          icon: ShoppingCart,
          image:
            "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop",
        },
        {
          label: "Electricians",
          icon: Lightbulb,
          image:
            "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=400&auto=format&fit=crop",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc] py-12 px-4 sm:px-6 md:px-12 font-sans tracking-tight">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
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
