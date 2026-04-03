"use client";

import React from "react";
import Image from "next/image";

const categories = [
  {
    title: "Wedding Requisites",
    items: [
      {
        label: "Banquet Halls",
        img: "/featured/banquethalls_rectangle_2024.webp",
      },
      {
        label: "Bridal Requisite",
        img: "/featured/bridalrequisite_rectangle_2024.webp",
      },
      { label: "Caterers", img: "/featured/caterers_rectangle_2024.webp" },
    ],
  },
  {
    title: "Beauty & Spa",
    items: [
      {
        label: "Beauty Parlours",
        img: "/featured/beautyparlours_rectangle_2024.webp",
      },
      {
        label: "Spa & Massages",
        img: "/featured/spamassages_rectangle_2024.webp",
      },
      { label: "Salons", img: "/featured/salons_rectangle_2024.webp" },
    ],
  },
  {
    title: "Repairs & Services",
    items: [
      { label: "AC Service", img: "/featured/hkim_acrepair.avif" },
      { label: "Car Service", img: "/featured/carservice_rectangle_2024.webp" },
      {
        label: "Bike Service",
        img: "/featured/bikeservice_rectangle_2024.webp",
      },
    ],
  },
  {
    title: "Daily Needs",
    items: [
      { label: "Movies", img: "/featured/hkim_movies.webp" },
      { label: "Grocery", img: "/featured/grocery_rectangle_2024.webp" },
      {
        label: "Electricians",
        img: "/featured/electricians_rectangle_2024.webp",
      },
    ],
  },
];

const FeaturedServices = () => {
  return (
    <section className="featured-services-section py-12 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="featured-card bg-white border border-gray-200 rounded-3xl p-4 md:p-6"
            >
              <h3 className="text-xl font-bold text-[#05252e] mb-6">
                {cat.title}
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {cat.items.map((item, i) => (
                  <div
                    key={i}
                    className="featured-item flex flex-col items-center group cursor-pointer"
                  >
                    <div className="relative w-full aspect-square mb-3 rounded-2xl overflow-hidden bg-gray-100">
                      <Image
                        src={item.img}
                        alt={item.label}
                        fill
                        className="object-cover"
                        onError={(e) => {
                        }}
                      />
                      <div className="absolute inset-0 bg-black/5"></div>
                    </div>
                    <span className="text-xs md:text-sm font-semibold text-[#444] text-center">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
