'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { apiFetch } from '@/lib/api';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Filter, 
  Phone,
  MessageCircle,
  Layers,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  CheckCircle2,
  Mail,
  Smartphone,
  Shield,
  PhoneCall,
  XCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import VendorLoginModal from '@/components/VendorLoginModal';

const ProductCard = ({ item, handleViewClick }: { item: any; handleViewClick: any }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const images = (item.images && item.images.length > 0) 
    ? item.images 
    : (item.imageUrl || item.image ? [item.imageUrl || item.image] : []);

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % images.length);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const verificationItems = [
    { label: 'GST', isPresent: item.vendor?.gstNumber || item.vendor?.verifiedStatus === 'VERIFIED' },
    { label: 'Mobile', isPresent: !!item.vendor?.phone },
    { label: 'Email', isPresent: !!item.vendor?.email },
    { label: 'Member', isPresent: !!item.vendor?.memberSince }
  ];

  return (
    <div 
        onClick={(e) => handleViewClick(e, 'PRODUCT', item.id, item.vendor)}
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col hover:border-[#007367]/40 transition-all group shadow-sm hover:shadow-2xl cursor-pointer"
    >
        {/* Image Carousel Area */}
        <div className="h-44 w-full relative bg-gray-100 overflow-hidden group-hover:bg-gray-200 transition-colors">
            {images.length > 0 ? (
                <>
                    <Image 
                      src={images[currentImgIndex]} 
                      alt={item.name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-1000" 
                    />
                    
                    {images.length > 1 && (
                        <>
                            <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                <button onClick={prevImg} className="p-1.5 rounded-full bg-white/95 text-gray-800 shadow-xl hover:bg-[#007367] hover:text-white transition-all transform hover:scale-110">
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button onClick={nextImg} className="p-1.5 rounded-full bg-white/95 text-gray-800 shadow-xl hover:bg-[#007367] hover:text-white transition-all transform hover:scale-110">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
                                {images.map((_: any, i: number) => (
                                    <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === currentImgIndex ? 'w-6 bg-[#007367]' : 'w-2 bg-white/50'}`} />
                                ))}
                            </div>
                        </>
                    )}
                </>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                    <Layers className="w-12 h-12 mb-2 opacity-30" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">No Portfolio Images</span>
                </div>
            )}
            
            <div className="absolute top-4 left-4 bg-[#007367] text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg z-10 border border-white/20">
                {item.category || item.type}
            </div>
        </div>

        <div className="p-2 flex-1 flex flex-col space-y-1">
            {/* Primary Header: Product Name & Price Stacker */}
            <div className="space-y-0">
                <span className="text-[15px] font-semibold text-gray-900 group-hover:text-[#007367] transition-colors line-clamp-1 leading-tight block">
                    {item.name}
                </span>
                {item.price > 0 && (
                    <div className="flex items-center">
                        <span className="text-[15px] font-bold text-[#007367]">₹{item.price}</span>
                    </div>
                )}
                <div className="pt-1">
                    <button 
                        onClick={(e) => handleViewClick(e, 'PRODUCT', item.id, item.vendor)}
                        className="w-full py-1.5 bg-[#007367] hover:bg-[#005e54] text-white rounded-md text-[10px] font-bold transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-1.5"
                    >
                        <Mail className="w-2.5 h-2.5" /> Contact Supplier
                    </button>
                </div>
            </div>

            {/* Secondary Header: Vendor & Location */}
            <div className="pt-1 border-t border-gray-50">
                <span className="text-[13px] font-semibold text-gray-900 hover:text-[#007367] transition-colors line-clamp-1 block leading-none mb-0.5">
                    {item.vendor?.businessName || 'Elite Trading Corp'}
                </span>
                <div className="flex items-center gap-1 text-gray-500">
                    <MapPin className="w-2.5 h-2.5 text-[#007367]" />
                    <span className="text-[12px] font-medium text-gray-700">
                        {item.vendor?.city || 'India'}
                    </span>
                </div>
            </div>

            {/* Verification & Trust Row (Logic-driven Ticks/Crosses - Single Row) */}
            <div className="flex flex-wrap gap-1 pt-0.5">
                {verificationItems.map((v, i) => (
                    <div key={i} className="flex items-center gap-0.5 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                        {v.isPresent ? (
                            <CheckCircle2 className="w-1.5 h-1.5 text-blue-500 fill-blue-50" />
                        ) : (
                            <XCircle className="w-1.5 h-1.5 text-red-500 fill-red-50" />
                        )}
                        <span className={`text-[7px] font-semibold ${v.isPresent ? 'text-gray-700' : 'text-gray-400 opacity-70'}`}>
                            {v.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* Unified Trust & Rating Row */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1 border-t border-gray-50">
                {/* Rating - Real Calculation */}
                {(() => {
                    const reviews = item.vendor?.reviews || [];
                    const avg = reviews.length > 0 
                        ? (reviews.reduce((acc: number, r: any) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1)
                        : (item.rating || 4.5);
                    return (
                        <div className="flex items-center gap-1">
                            <div className="flex items-center bg-green-700 text-white px-1 py-0.5 rounded text-[8px] font-bold shadow-sm">
                                {avg} <Star className="w-2 h-2 ml-0.5 fill-current" />
                            </div>
                            {reviews.length > 0 && (
                                <span className="text-[8px] font-bold text-gray-400">({reviews.length})</span>
                            )}
                        </div>
                    );
                })()}
                
                {/* Years - Real Calculation from createdAt */}
                {(() => {
                    const startYear = item.vendor?.createdAt ? new Date(item.vendor.createdAt).getFullYear() : new Date().getFullYear() - 1;
                    const years = new Date().getFullYear() - startYear;
                    return (
                        <div className="flex items-center gap-0.5 border-l border-gray-200 pl-2">
                            <Shield className="w-2.5 h-2.5 text-gray-400" />
                            <span className="text-[9px] font-medium text-gray-600">
                                {years > 0 ? `${years} yr${years > 1 ? 's' : ''}` : '< 1 yr'} active
                            </span>
                        </div>
                    );
                })()}

                {/* TrustSeal Badge */}
                <div className="flex items-center gap-0.5 bg-[#F1C82E]/10 text-[#C92500] px-1.5 py-0.5 rounded border border-[#F1C82E] ml-auto">
                    <CheckCircle2 className="w-2.5 h-2.5 fill-[#F1C82E]" />
                    <span className="text-[9px] font-bold">TrustSeal</span>
                </div>
            </div>

            {/* Final Action Footer */}
            <div className="pt-1 mt-auto">
                <button 
                    onClick={() => handleViewClick(null, 'CALL', item.id, item.vendor)}
                    className="w-full py-1.5 bg-[#007367] hover:bg-[#005e54] text-white rounded-md text-[11px] font-bold transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-1.5"
                >
                    <PhoneCall className="w-3 h-3 animate-shake" /> Call Now
                </button>
            </div>
        </div>
    </div>
  );
};

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [targetVendor, setTargetVendor] = useState<any>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const initialCategory = searchParams.get('category') || '';
  const q = searchParams.get('q') || '';
  const city = searchParams.get('city') || '';
  const verified = searchParams.get('verified') === 'true';
  const offeringType = searchParams.get('offeringType') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const priceRange = searchParams.get('price') || '';

  const [vendors, setVendors] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1
  });

  const [searchQuery, setSearchQuery] = useState(q);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(q);
  const [locationQuery, setLocationQuery] = useState(city);

  // Sync with URL when it changes externally (e.g. from Navbar)
  useEffect(() => {
    const externalQ = searchParams.get('q') || '';
    const externalCity = searchParams.get('city') || '';
    if (externalQ !== searchQuery) {
        setSearchQuery(externalQ);
        setDebouncedSearchQuery(externalQ);
    }
    if (externalCity !== locationQuery) setLocationQuery(externalCity);
  }, [searchParams]);

  // Debounce search query for local input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedSearchQuery !== searchQuery) {
          updateURL({ q: searchQuery, page: 1 });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const updateURL = (newParams: any) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined || value === false) {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }
    });
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSearchTrigger = () => {
    updateURL({ city: locationQuery, page: 1 });
  };

  const handleNearMe = () => {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
        const { lat, lon } = { lat: position.coords.latitude, lon: position.coords.longitude };
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`);
            const data = await res.json();
            const cityName = data.address.city || data.address.town || data.address.village || data.address.state_district;
            
            if (cityName) {
                const cleanCity = cityName.replace(' District', '');
                setLocationQuery(cleanCity);
                updateURL({ city: cleanCity, page: 1 });
            }
        } catch (error) {
            console.error('Location detection error:', error);
        } finally {
            setLocationLoading(false);
        }
    }, (error) => {
        console.error('Geolocation error:', error);
        setLocationLoading(false);
    });
  };

  const handlePriceFilter = (range: string) => {
    const currentPrice = searchParams.get('price') || '';
    updateURL({ price: currentPrice === range ? '' : range, page: 1 });
  };

  const handleDirectAction = async (vendorId: string, actionType: string, phoneNumber: string) => {
    try {
      apiFetch('/leads/direct', {
        method: 'POST',
        body: JSON.stringify({ vendorId, actionType })
      }).catch(e => console.warn('Lead tracking error', e));
      
      if (actionType === 'CALL') {
        window.location.href = `tel:${phoneNumber}`;
      } else if (actionType === 'WHATSAPP') {
        const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
        window.open(`https://wa.me/${cleanPhone}`, '_blank');
      }
    } catch (error) {
       console.error('Engagement failed', error);
    }
  };

  // Derived values from URL
  const currentCategoryId = searchParams.get('category') || '';
  const currentCity = searchParams.get('city') || '';
  const isVerified = searchParams.get('verified') === 'true';
  const currentOfferingType = searchParams.get('offeringType') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');
  const currentPriceRange = searchParams.get('price') || '';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiFetch('/vendors/categories');
        if (data.success) {
           setCategories(data.data || []);
        }
      } catch (error) {
        console.error('Categories fetch failed:', error);
      }
    };
    
    const detectLocation = async () => {
        if (!currentCity) {
            try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                if (data.city) {
                    setLocationQuery(data.city);
                    updateURL({ city: data.city });
                }
            } catch (error) {
                console.warn('IP Location detection failed:', error);
            }
        }
    };

    fetchCategories();
    detectLocation();
  }, []);

  // Sync searchQuery with URL for external changes
  useEffect(() => {
    const qStr = searchParams.get('q') || '';
    const cityStr = searchParams.get('city') || '';
    if (qStr !== searchQuery) {
        setSearchQuery(qStr);
        setDebouncedSearchQuery(qStr);
    }
    if (cityStr !== locationQuery) setLocationQuery(cityStr);
  }, [searchParams]);



  useEffect(() => {
    const controller = new AbortController();

    const fetchVendors = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          ...(currentCategoryId && { categoryId: currentCategoryId }),
          ...(currentCity && { city: currentCity }),
          ...(isVerified && { verified: 'true' }),
          ...(currentOfferingType && { offeringType: currentOfferingType }),
          ...(q && { search: q }),
          page: currentPage.toString(),
          limit: '12'
        });
        
        const data = await apiFetch(`/vendors?${query.toString()}`, {
          signal: controller.signal
        });
        
        setVendors(Array.isArray(data.data.vendors) ? data.data.vendors : []);
        setPagination({
            total: data.data.total || 0,
            totalPages: data.data.totalPages || 1
        });
      } catch (error: any) {
        if (error.name === 'AbortError') return;
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
    return () => controller.abort();
  }, [searchParams]);

  // Compute final frontend items using URL params
  const selectedCategoryName = categories.find((c: any) => c.id === currentCategoryId)?.name;
  
  const filteredItems = vendors.flatMap((v: any) => (v.products || [])
      .filter((p: any) => p.status === 'APPROVED') 
      .filter((p: any) => {
          if (!q) return true;
          const s = q.toLowerCase();
          return p.name.toLowerCase().includes(s) || 
                 v.businessName.toLowerCase().includes(s) || 
                 (p.category && p.category.toLowerCase().includes(s));
      })
      .filter((p: any) => !currentOfferingType || p.type === currentOfferingType)
      .filter((p: any) => !selectedCategoryName || p.category === selectedCategoryName)
      .filter((p: any) => !isVerified || v.isVerified)
      .filter((p: any) => {
          if (!currentPriceRange) return true;
          const price = p.price || 0;
          if (currentPriceRange === 'Below ₹600') return price < 600;
          if (currentPriceRange === '₹601 - ₹1,000') return price >= 601 && price <= 1000;
          if (currentPriceRange === '₹1,001 - ₹3,000') return price >= 1001 && price <= 3000;
          if (currentPriceRange === 'Above ₹3,001') return price > 3001;
          return true;
      })
      .map((p: any) => ({ ...p, vendor: v }))
  );
  const handleViewClick = (e: any, type: string, id: string, vendor: any) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!user) {
      setTargetVendor(vendor);
      setAuthModalOpen(true);
      return;
    }

    if (type === 'CALL') {
      window.location.href = `tel:${vendor?.phone || '+919876543210'}`;
    } else {
      router.push(`/product/${id}`);
    }
  };

  const [isExploreOpen, setIsExploreOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <VendorLoginModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        vendor={targetVendor} 
        onSuccess={() => setAuthModalOpen(false)} 
      />

      {/* Explore Drawer Backdrop */}
      {isExploreOpen && (
        <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-60 transition-opacity duration-300"
            onClick={() => setIsExploreOpen(false)}
        />
      )}

      {/* Explore Drawer Content */}
      <motion.aside 
        initial={{ x: '-100%' }}
        animate={{ x: isExploreOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 left-0 h-full w-[90%] md:w-[450px] bg-white z-70 shadow-2xl flex flex-col overflow-hidden"
      >
        <header className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="space-y-0.5">
                <h2 className="text-lg font-black text-gray-900 uppercase tracking-tighter">Explore More</h2>
                <div className="flex items-center gap-2">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Advanced Filters</p>
                    <button 
                        onClick={() => {
                            updateURL({
                                category: '',
                                city: '',
                                verified: false,
                                offeringType: '',
                                price: '',
                                q: '',
                                page: 1
                            });
                            setSearchQuery('');
                            setLocationQuery('');
                        }}
                        className="text-[10px] font-black text-[#ff3b3b] uppercase tracking-wider hover:underline"
                    >
                        Clear All
                    </button>
                </div>
            </div>
            <button 
                onClick={() => setIsExploreOpen(false)}
                className="p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-900 transition-all"
            >
                <X className="w-6 h-6" />
            </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-12">
            {/* Price Range Section */}
            <section className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-l-4 border-[#007367] pl-3">Price Range</h3>
                <div className="grid grid-cols-2 gap-3">
                    {['Below ₹600', '₹601 - ₹1,000', '₹1,001 - ₹3,000', 'Above ₹3,001'].map(p => (
                        <label 
                            key={p} 
                            onClick={() => handlePriceFilter(p)}
                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all group ${currentPriceRange === p ? 'bg-[#007367]/10 border border-[#007367]/20 shadow-sm' : 'bg-gray-50 hover:bg-gray-100 border border-transparent'}`}
                        >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${currentPriceRange === p ? 'border-[#007367]' : 'border-gray-300 group-hover:border-[#007367]'}`}>
                                {currentPriceRange === p && <div className="w-2.5 h-2.5 bg-[#007367] rounded-full"></div>}
                            </div>
                            <span className={`text-xs font-semibold ${currentPriceRange === p ? 'text-[#007367]' : 'text-gray-700'}`}>{p}</span>
                        </label>
                    ))}
                </div>
            </section>

            {/* Sub Categories Grid - Connected to Backend */}
            <section className="space-y-4">
                <div className="flex items-center justify-between pr-2">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-l-4 border-[#ff3b3b] pl-3">Categories</h3>
                    {categories.length > 6 && (
                        <button 
                            onClick={() => setShowAllCategories(!showAllCategories)}
                            className="text-[10px] font-bold text-[#007367] uppercase hover:underline"
                        >
                            {showAllCategories ? 'Show Less' : 'View All'}
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {(showAllCategories ? categories : categories.slice(0, 6)).map((cat: any) => (
                        <div 
                            key={cat.id} 
                            onClick={() => { updateURL({category: cat.id, page: 1}); setIsExploreOpen(false); }}
                            className={`flex flex-col items-center gap-3 p-4 border rounded-2xl transition-all cursor-pointer group ${currentCategoryId === cat.id ? 'bg-[#ff3b3b]/5 border-[#ff3b3b]/20 shadow-md' : 'bg-slate-50/50 border-gray-100 hover:border-[#007367] hover:shadow-lg'}`}
                        >
                            <div className="w-20 h-20 relative rounded-xl overflow-hidden shadow-sm bg-white flex items-center justify-center">
                                {cat.imageUrl ? (
                                    <img src={cat.imageUrl} alt={cat.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <Layers className="w-8 h-8 text-gray-200" />
                                )}
                            </div>
                            <span className={`text-[11px] font-bold text-center uppercase tracking-tight leading-none ${currentCategoryId === cat.id ? 'text-[#ff3b3b]' : 'text-gray-700'}`}>{cat.name}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Brands Section */}
            <section className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-l-4 border-[#0076a8] pl-3">Top Brands</h3>
                <div className="grid grid-cols-4 gap-4">
                    {[
                        'https://5.imimg.com/data5/CH/YB/HT/GLADMIN-60238/gic-level-controllers-125x125.jpg',
                        'https://5.imimg.com/data5/BrandMcat/LC/TT/AG/GLADMIN-60238/gelco-electronics-125x125.jpg',
                        'https://5.imimg.com/data5/BrandMcat/HF/FH/HW/GLADMIN-60238/grundfos-125x125.jpg',
                        'https://5.imimg.com/data5/BrandMcat/QW/GZ/CM/GLADMIN-60238/kirloskar-125x125.jpg'
                    ].map((img, i) => (
                        <div key={i} className="aspect-square rounded-full border-2 border-gray-100 p-2 hover:border-[#007367] transition-all cursor-pointer bg-white shadow-sm overflow-hidden flex items-center justify-center">
                            <img src={img} alt="brand" className="w-full h-full object-contain grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100" />
                        </div>
                    ))}
                </div>
            </section>

            {/* Seller Type & Trust */}
            <section className="space-y-4 pb-10">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-l-4 border-[#f59e0b] pl-3">Trust & Verification</h3>
                <div className="space-y-4">
                    <label 
                        onClick={() => updateURL({ verified: !isVerified, page: 1 })}
                        className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border ${isVerified ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'bg-gray-50 border-transparent hover:bg-gray-100'}`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isVerified ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                                <Search className="w-5 h-5" />
                            </div>
                            <div>
                                <p className={`text-xs font-black uppercase tracking-tight ${isVerified ? 'text-emerald-700' : 'text-gray-700'}`}>Verified Sellers Only</p>
                                <p className="text-[10px] text-gray-500 font-medium">Business verified by B2B Community</p>
                            </div>
                        </div>
                        <div className={`w-12 h-6 rounded-full relative transition-colors ${isVerified ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isVerified ? 'left-7' : 'left-1'}`}></div>
                        </div>
                    </label>
                </div>
            </section>
        </div>
      </motion.aside>

      {/* IndiaMart Style Breadcrumbs */}
      <nav className="w-full px-4 md:px-10 py-3 bg-white border-b border-gray-100">
        <ol className="flex items-center gap-2 text-[11px] font-medium text-gray-400">
          <li><Link href="/" className="hover:text-[#007367]">B2B Community</Link></li>
          <li className="text-gray-300">/</li>
          <li><span className="text-gray-600 uppercase tracking-wider">{selectedCategoryName || 'All Categories'}</span></li>
          <li className="text-gray-300">/</li>
          <li className="text-gray-900 font-bold uppercase tracking-wider">{searchQuery || 'Products'}</li>
        </ol>
      </nav>

      <main className="w-full px-4 md:px-10 py-6">
        {/* Results Metadata Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div className="space-y-1">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-none">
                        {searchQuery || selectedCategoryName || 'Suppliers'}
                    </h1>
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded text-[11px] font-bold mt-1">
                        {filteredItems.length * 10}+ products available
                    </span>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">View by:</span>
                <div className="flex bg-white border border-gray-200 rounded-lg p-0.5 shadow-sm">
                    <button className="px-3 py-1.5 bg-[#007367] text-white rounded-md text-[10px] font-bold uppercase flex items-center gap-1.5 transition-all">
                        <div className="grid grid-cols-2 gap-0.5 w-3">
                            <div className="w-1 h-1 bg-white/40"></div><div className="w-1 h-1 bg-white"></div>
                            <div className="w-1 h-1 bg-white"></div><div className="w-1 h-1 bg-white/40"></div>
                        </div>
                        Grid
                    </button>
                    <button className="px-3 py-1.5 text-gray-500 hover:text-[#007367] rounded-md text-[10px] font-bold uppercase transition-all">
                        List
                    </button>
                </div>
            </div>
        </div>

        {/* Global Filter Bar (City Strip & Price) */}
        <div className="space-y-4 mb-10">
            {/* City Strip */}
            <div className="flex items-center gap-4 bg-white border border-gray-200 p-3 rounded-2xl shadow-sm">
                <button 
                    onClick={() => setIsExploreOpen(true)}
                    className="whitespace-nowrap px-5 py-2.5 bg-[#007367]/5 hover:bg-[#007367]/10 text-[#007367] rounded-xl text-xs font-black transition-all flex items-center gap-2 border border-[#007367]/10 uppercase tracking-wider"
                >
                    <Filter className="w-4 h-4" /> Explore
                </button>
                
                <div className="w-px h-10 bg-gray-100 mx-1"></div>

                {/* IndiaMart Style City Input & Near Me */}
                <div className="flex items-center gap-6 flex-1 overflow-hidden">
                    <div className="flex items-center gap-4 min-w-[300px]">
                        <form className="relative flex-1 group" onSubmit={(e) => { e.preventDefault(); updateURL({ city: locationQuery, page: 1 }); }}>
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#007367] transition-colors" />
                            <input 
                                value={locationQuery}
                                onChange={(e) => setLocationQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-transparent focus:border-[#007367] focus:bg-white rounded-xl text-xs font-bold text-gray-900 outline-none transition-all placeholder:text-gray-400"
                                placeholder="Enter City (e.g. Indore)"
                            />
                            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Search className="w-3.5 h-3.5 text-gray-300 hover:text-[#007367]" />
                            </button>
                        </form>

                        <div 
                            onClick={handleNearMe}
                            className={`flex items-center gap-2 cursor-pointer group whitespace-nowrap transition-all ${locationLoading ? 'opacity-50' : 'hover:scale-105 active:scale-95'}`}
                        >
                            <div className="w-8 h-8 rounded-full bg-[#007367]/10 flex items-center justify-center group-hover:bg-[#007367] transition-all">
                                {locationLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-[#007367] group-hover:text-white" />
                                ) : (
                                    <MapPin className="w-4 h-4 text-[#007367] group-hover:text-white" />
                                )}
                            </div>
                            <span className="text-xs font-bold text-[#007367] tracking-wider border-b-2 border-transparent group-hover:border-[#007367]">Near Me</span>
                        </div>
                    </div>

                    <div className="w-px h-6 bg-gray-100"></div>

                    {/* Scrollable Popular Cities */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
                        {[
                            ...(currentCity && !['Indore', 'Bhopal', 'Vadodara', 'Bengaluru', 'Delhi', 'Chennai', 'Pune', 'Ahmedabad', 'Coimbatore', 'Hyderabad', 'Mumbai'].includes(currentCity) ? [currentCity] : []),
                            'Indore', 'Bhopal', 'Vadodara', 'Bengaluru', 'Delhi', 'Chennai', 'Pune', 'Ahmedabad', 'Coimbatore', 'Hyderabad', 'Mumbai'
                        ].map(city => (
                            <div key={city} className="relative flex items-center">
                                <button 
                                    onClick={() => { setLocationQuery(city); updateURL({ city, page: 1 }); }}
                                    className={`whitespace-nowrap px-4 py-2 border rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${currentCity === city ? 'bg-[#007367] text-white border-[#007367] shadow-sm pr-2' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
                                >
                                    {city}
                                    {currentCity === city && (
                                        <span 
                                            onClick={(e) => { e.stopPropagation(); updateURL({ city: '' }); setLocationQuery(''); }}
                                            className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </span>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Active Chips Strip (Category & Price) */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                {currentCategoryId && (
                    <button 
                        onClick={() => updateURL({ category: '', page: 1})}
                        className="whitespace-nowrap px-4 py-2 bg-[#ff3b3b] text-white rounded-lg text-[11px] font-bold uppercase tracking-tight transition-all shadow-sm flex items-center gap-2"
                    >
                        {selectedCategoryName} <X className="w-3 h-3" />
                    </button>
                )}
                
                {['Below ₹600', '₹601 - ₹1,000', '₹1,001 - ₹3,000', 'Above ₹3,001'].map(range => (
                    <button 
                        key={range}
                        onClick={() => handlePriceFilter(range)}
                        className={`whitespace-nowrap px-4 py-2 border rounded-lg text-[11px] font-bold uppercase tracking-tight transition-all shadow-sm flex items-center gap-2 ${currentPriceRange === range ? 'bg-[#007367] text-white border-[#007367]' : 'bg-white text-gray-500 border-gray-100 hover:border-[#007367] hover:text-[#007367]'}`}
                    >
                        {range}
                        {currentPriceRange === range && <X className="w-3 h-3" />}
                    </button>
                ))}
                
                <button 
                    onClick={() => updateURL({ verified: !isVerified, page: 1 })}
                    className={`whitespace-nowrap px-4 py-2 border rounded-lg text-[11px] font-bold uppercase tracking-tight transition-all shadow-sm flex items-center gap-2 ${isVerified ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-500 border-gray-100 hover:border-emerald-600 hover:text-emerald-600'}`}
                >
                    Verified Only
                    {isVerified && <X className="w-3 h-3" />}
                </button>
            </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Simple Sidebar Filters */}
            <aside className="lg:w-64 shrink-0">
                <div className="sticky top-24 space-y-6">
                    {/* Offering Type Filter */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-6 uppercase tracking-wider">Offering Type</h3>
                        <div className="space-y-3">
                           {[
                               { id: '', label: 'All Offers' },
                               { id: 'PRODUCT', label: 'Products' },
                               { id: 'SERVICE', label: 'Services' }
                           ].map((item) => (
                              <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                                 <input 
                                     type="radio" 
                                     name="offeringType" 
                                     checked={currentOfferingType === item.id}
                                     onChange={() => updateURL({ offeringType: item.id, page: 1 })}
                                     className="accent-[#007367] w-4 h-4 cursor-pointer"
                                 />
                                 <span className={`text-sm font-medium transition-colors ${currentOfferingType === item.id ? 'text-[#007367] font-semibold' : 'text-gray-600'}`}>{item.label}</span>
                              </label>
                           ))}
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-6 uppercase tracking-wider">Categories</h3>
                        <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2">
                              <button 
                                 onClick={() => updateURL({ category: "", page: 1 })}
                                 className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${!currentCategoryId ? 'bg-[#007367] text-white font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                              >
                                 All Categories
                              </button>
                           {categories.map((cat: any) => (
                              <button 
                                 key={cat.id}
                                 onClick={() => updateURL({ category: cat.id, page: 1 })}
                                 className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${currentCategoryId === cat.id ? 'bg-[#007367] text-white font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                              >
                                 {cat.name}
                              </button>
                           ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
                        <label className="flex items-center justify-between cursor-pointer group">
                           <span className="text-sm font-semibold text-gray-700">Verified Suppliers</span>
                           <input 
                               type="checkbox" 
                               checked={isVerified}
                               onChange={() => updateURL({ verified: !isVerified, page: 1 })}
                               className="w-5 h-5 accent-[#007367]"
                           />
                        </label>
                        
                        <div className="space-y-3 pt-4 border-t border-gray-100">
                           <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Ratings</p>
                           {[4.5, 4.0, 3.0].map(val => (
                              <label key={val} className="flex items-center gap-2 cursor-pointer group">
                                 <input type="radio" name="rating" className="accent-[#007367]" />
                                 <span className="text-sm text-gray-600 font-medium">{val} Stars & up</span>
                              </label>
                           ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* simple Four-Column Results Area */}
            <div className="flex-1 space-y-6">
                <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between px-2 gap-4">
                    <div className="flex items-center gap-4">
                        <p className="text-gray-500 font-medium text-sm hidden sm:block">
                            Found <span className="font-semibold text-gray-900">
                                {filteredItems.length}
                            </span> results
                        </p>
                    </div>
                    <select className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-semibold outline-none text-gray-700">
                        <option>Relevance</option>
                        <option>Newest</option>
                        <option>Ratings</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {loading ? (
                        [1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-80 bg-white rounded-xl animate-pulse border border-gray-100"></div>)
                    ) : (
                        filteredItems.length > 0 ? (
                            filteredItems.map((item: any) => (
                                <ProductCard key={item.id} item={item} handleViewClick={handleViewClick} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-gray-100">
                                <Layers className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-gray-900">No offers found</h3>
                                <p className="text-sm text-gray-500 mt-1">Try selecting a different filter.</p>
                            </div>
                        )
                    )}
                </div>

                {/* Scalable Pagination Controls (Added to fix 'missing' logic) */}
                {pagination.totalPages > 1 && (
                    <div className="flex justify-center gap-3 mt-12 py-6 border-t border-gray-100">
                        <button 
                            disabled={currentPage <= 1}
                            onClick={() => updateURL({ page: currentPage - 1 })}
                            className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 disabled:opacity-50 hover:border-[#007367] hover:text-[#007367] transition-all"
                        >
                            Previous
                        </button>
                        <div className="flex items-center text-sm font-bold text-gray-400">
                           <span className="text-gray-900">{currentPage}</span> / {pagination.totalPages}
                        </div>
                        <button 
                            disabled={currentPage >= pagination.totalPages}
                            onClick={() => updateURL({ page: currentPage + 1 })}
                            className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 disabled:opacity-50 hover:border-[#007367] hover:text-[#007367] transition-all"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
      </main>
    </div>
  );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#007367]/20 border-t-[#007367] rounded-full animate-spin"></div>
        </div>}>
            <SearchContent />
        </Suspense>
    );
}
