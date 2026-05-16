import React from "react";
import {
  Star,
  ShieldCheck,
  MapPin,
  Navigation,
  CheckCircle2,
  PhoneCall,
  ArrowLeft,
  ArrowRight,
  Box,
} from "lucide-react";

interface ProductCardProps {
  item: any;
  handleViewClick: (e: any, type: string, id: any, vendor: any) => void;
  isPriority?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  item,
  handleViewClick,
  isPriority = false,
}) => {
  const images =
    item.images && item.images.length > 0
      ? item.images
      : item.imageUrl || item.image
        ? [item.imageUrl || item.image]
        : [];

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 group">
      {/* Image Section */}
      <div className="h-56 w-full relative bg-gray-50 border-b border-gray-100">
        {images.length > 0 ? (
          <img
            src={images[0]}
            alt={item.name}
            className="w-full h-full object-cover"
            loading={isPriority ? "eager" : "lazy"}
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-200">
            <Box size={40} className="opacity-20" />
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute bottom-2 right-2 flex gap-1.5">
          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-semibold text-[#164e33] flex items-center gap-1 shadow-sm border border-gray-100 uppercase tracking-wider">
            <Box size={12} className="text-[#164e33]" />{" "}
            {item.category?.name ||
              item.category ||
              (item.vendor?.categories && item.vendor.categories[0]?.name) ||
              "General"}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/20 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowLeft size={14} />
        </button>
        <button className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/20 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-1">
        {/* Title & Price */}
        <div className="mb-3">
          <h3 className="text-[15px] font-semibold text-[#0056b3] hover:text-[#004494] hover:underline cursor-pointer leading-tight mb-1 line-clamp-2 min-h-[40px]">
            {item.name}
          </h3>
          <p className="text-[17px] font-bold text-slate-900">
            {item.price ? `₹${item.price.toLocaleString()}` : "Ask Price"}
          </p>
        </div>

        {/* Main Action Button */}
        <button
          onClick={(e) => handleViewClick(e, "PRODUCT", item.id, item.vendor)}
          className="w-full py-2.5 bg-[#164e33] hover:bg-[#006972] text-white rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-colors mb-4 shadow-sm"
        >
          <Navigation size={16} className="rotate-45" /> Contact Supplier
        </button>

        {/* Vendor Info */}
        <div className="space-y-1.5 border-t border-gray-50 pt-3">
          <p className="text-[12px] font-semibold text-slate-600 hover:text-[#164e33] cursor-pointer truncate">
            {item.vendor?.businessName || "Verified Supplier"}
          </p>
          <div className="flex items-center gap-1.5">
            <MapPin size={13} className="text-slate-400" />
            <span className="text-[11px] font-semibold">
              {item.vendor?.city || "India"}
            </span>
            {item.vendor?.area && (
              <span className="text-[11px] text-slate-400">
                • {item.vendor.area}
              </span>
            )}
          </div>

          {/* Verification Badges */}
          <div className="flex flex-wrap items-center gap-2 py-1">
            {["GST", "Email", "Mobile"].map((label) => (
              <div
                key={label}
                className="flex items-center gap-1 text-[10px] font-semibold text-[#164e33]"
              >
                <CheckCircle2 size={10} className="text-emerald-500" /> {label}
              </div>
            ))}
          </div>

          {/* Ratings & TrustSeal */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {[1, 2, 3, 4].map((i) => (
                  <Star
                    key={i}
                    size={10}
                    className="fill-amber-400 text-amber-400"
                  />
                ))}
                <Star size={10} className="text-slate-200" />
              </div>
              <span className="text-[11px] font-semibold text-slate-600">
                4.5 (18)
              </span>
            </div>
            <div className="bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded text-[9px] font-semibold border border-amber-100 flex items-center gap-1">
              <ShieldCheck size={10} /> TrustSEAL
            </div>
          </div>
        </div>

        {/* Secondary Action */}
        <button
          onClick={(e) => handleViewClick(e, "CALL", item.id, item.vendor)}
          className="w-full mt-4 py-2 border border-[#164e33] text-[#164e33] hover:bg-emerald-50 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <PhoneCall size={16} /> Call Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
