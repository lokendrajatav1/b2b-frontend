"use client";

import React from "react";
import Image from "next/image";
import { Menu } from "lucide-react";

const services = [
  { id: 1, label: "Restaurants", img: "/services/restaurant-2022.svg" },
  { id: 2, label: "Hotels", img: "/services/hotel-2022.svg" },
  { id: 3, label: "Beauty Spa", img: "/services/beauty.svg" },
  { id: 4, label: "Home Decor", img: "/services/homedecor.svg" },
  { id: 5, label: "Wedding Planning", img: "/services/hotkey_wedding_icon.webp" },
  { id: 6, label: "Education", img: "/services/education.svg" },
  { id: 7, label: "Rent & Hire", img: "/services/renthire.svg" },
  { id: 8, label: "Hospitals", img: "/services/hospital_2023.svg" },
  { id: 9, label: "Contractors", img: "/services/contractor-2022.svg" },
  { id: 10, label: "Pet Shops", img: "/services/pet_shops_2023.svg" },
  { id: 11, label: "PG/Hostels", img: "/services/pg-hostels-rooms.svg" },
  { id: 12, label: "Estate Agent", img: "/services/estate-agent.svg" },
  { id: 13, label: "Dentists", img: "/services/dentist_2023.svg" },
  { id: 14, label: "Gym", img: "/services/gym_2023.svg" },
  { id: 15, label: "Loans", img: "/services/loans.svg" },
  { id: 16, label: "Event Organisers", img: "/services/eventorganizers.svg" },
  { id: 17, label: "Driving Schools", img: "/services/driving_school_2023.svg" },
  { id: 18, label: "Packers & Movers", img: "/services/packers_movers_2023.svg" },
  { id: 19, label: "Courier Service", img: "/services/courier_2023.svg" },
  { id: 20, label: "Popular Categories", img: null, isMore: true },
];

const ServiceGrid = () => {
  return (
    <section className="service-grid-section py-12 bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-4  md:grid-cols-5 lg:grid-cols-10 gap-x-4 gap-y-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="service-item flex flex-col items-center group cursor-pointer"
            >
              <div 
                className={`service-icon-wrapper w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-white rounded-[20px] shadow-sm mb-3 transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1 relative ${service.isMore ? 'bg-[#f8fbfe]' : ''}`}
                style={{
                  border: '1px solid transparent',
                  background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, rgba(0, 118, 211, 0.3) 50%, transparent 40%, transparent 60%, rgba(0, 118, 211, 0.3) 100%) border-box'
                }}
              >
                {service.isMore ? (
                  <div className="w-10 h-10 rounded-full bg-[#052842] flex items-center justify-center">
                    <Menu className="w-5 h-5 text-white" />
                  </div>
                ) : (
                  <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center  justify-center">
                    {/* Placeholder for when images aren't added yet */}
                    <div className="absolute inset-0 bg-gray-50 rounded flex items-center justify-center text-[10px] text-gray-300 font-bold uppercase overflow-hidden">
                       <Image 
                        src={service.img} 
                        alt={service.label}
                        fill
                        className="object-contain p-1"
                        onError={(e) => {
                          // Silently fail or show placeholder if image missing
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <span className="service-label text-xs md:text-[13px] font-medium text-[#444] text-center leading-tight group-hover:text-black transition-colors">
                {service.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceGrid;
