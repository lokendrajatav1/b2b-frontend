import React from 'react';
import { Play, Info, MoreVertical } from 'lucide-react';

// Mock data - in a real app, this might come from props or an API
const adData = [
  { id: 1, discount: '-25%', imageUrl: 'https://placehold.co/100x150/e91e63/white?text=Invite+1' },
  { id: 2, discount: '-29%', imageUrl: 'https://placehold.co/100x150/000000/white?text=Invite+2' },
  { id: 3, discount: '-22%', imageUrl: 'https://placehold.co/100x150/f06292/white?text=Invite+3' },
  { id: 4, discount: '-27%', imageUrl: 'https://placehold.co/100x150/455a64/white?text=Invite+4' },
  { id: 5, discount: '-25%', imageUrl: 'https://placehold.co/100x150/880e4f/white?text=Invite+5' },
  { id: 6, discount: '-22%', imageUrl: 'https://placehold.co/100x150/5d4037/white?text=Invite+6' },
  { id: 7, discount: '-27%', imageUrl: 'https://placehold.co/100x150/ad1457/white?text=Invite+7' },
  { id: 8, discount: '-25%', imageUrl: 'https://placehold.co/100x150/0277bd/white?text=Invite+8' },
];

const AdBanner = () => {
  return (
    <div className="w-full bg-[#F1F3F4] py-2 px-4 relative group border-y border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center">
        
        {/* Scrollable Container for items */}
        <div className="flex flex-1 gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {adData.map((item) => (
            <div 
              key={item.id} 
              className="relative min-w-[80px] sm:min-w-[100px] aspect-[2/3] rounded-md overflow-hidden bg-white shadow-sm hover:scale-105 transition-transform cursor-pointer"
            >
              {/* Image Placeholder */}
              <img 
                src={item.imageUrl} 
                alt="Ad Thumbnail" 
                className="w-full h-full object-cover" 
              />
              
              {/* Discount Badge */}
              <div className="absolute top-1 left-1 bg-white/95 border border-[#c2185b] rounded-sm px-1 shadow-sm">
                <span className="text-[10px] font-bold text-[#c2185b]">
                  {item.discount}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Play Button Section */}
        <div className="flex items-center justify-center pl-6 pr-12">
          <button className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-[#e91e63] flex items-center justify-center bg-white group-hover:scale-110 transition-transform shadow-lg">
            <Play className="fill-[#e91e63] text-[#e91e63] ml-1 w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        </div>

        {/* Ad Info Icons (Top Right) */}
        <div className="absolute top-1 right-2 flex items-center space-x-0.5 opacity-60">
          <Info size={14} className="text-sky-500 cursor-pointer" />
          <MoreVertical size={14} className="text-sky-500 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default AdBanner;