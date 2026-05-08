'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { apiFetch } from '@/lib/api';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
    Search, MapPin, Star, ShieldCheck, Filter, Mail, PhoneCall, Globe,
    Heart, LayoutGrid, Headphones, Handshake, Sparkles, Settings, Box,
    ChevronDown, ArrowRight, Loader2, X, CheckCircle2, ChevronRight,
    ArrowLeft, Video, Image as ImageIcon, Navigation, Factory, Layers
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import VendorLoginModal from '@/components/VendorLoginModal';
import { motion, AnimatePresence } from 'framer-motion';

const ProductCard = ({ item, handleViewClick }: { item: any; handleViewClick: any }) => {
    const images = (item.images && item.images.length > 0)
        ? item.images
        : (item.imageUrl || item.image ? [item.imageUrl || item.image] : []);

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 group">
            {/* Image Section with Slider Logic Placeholder */}
            <div className="h-56 w-full relative bg-gray-50 border-b border-gray-100">
                {images.length > 0 ? (
                    <img src={images[0]} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                        <Box size={40} className="opacity-20" />
                    </div>
                )}
                
                {/* Category Badge */}
                <div className="absolute bottom-2 right-2 flex gap-1.5">
                   <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-[#164e33] flex items-center gap-1 shadow-sm border border-gray-100 uppercase tracking-wider">
                      <Box size={12} className="text-[#164e33]" /> {item.category?.name || item.category || (item.vendor?.categories && item.vendor.categories[0]?.name) || 'General'}
                   </div>
                </div>

                {/* Left/Right Nav Arrows (Simulation) */}
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
                    <h3 className="text-[15px] font-bold text-[#D97528] hover:underline cursor-pointer leading-tight mb-1 line-clamp-2 min-h-[40px]">
                        {item.name}
                    </h3>
                    <p className="text-[17px] font-black text-slate-900">
                       {item.price ? `₹${item.price.toLocaleString()}` : 'Ask Price'}
                    </p>
                </div>

                {/* Main Action Button */}
                <button 
                  onClick={(e) => handleViewClick(e, 'PRODUCT', item.id, item.vendor)}
                  className="w-full py-2.5 bg-[#164e33] hover:bg-[#006972] text-white rounded-md text-sm font-bold flex items-center justify-center gap-2 transition-colors mb-4 shadow-sm"
                >
                   <Navigation size={16} className="rotate-45" /> Contact Supplier
                </button>

                {/* Vendor Info */}
                <div className="space-y-1.5 border-t border-gray-50 pt-3">
                   <p className="text-[12px] font-bold text-slate-600 hover:text-[#164e33] cursor-pointer truncate">
                      {item.vendor?.businessName || 'Verified Supplier'}
                   </p>
                   <div className="flex items-center gap-1.5 text-#164e33">
                      <MapPin size={13} className="text-slate-400" />
                      <span className="text-[11px] font-bold">{item.vendor?.city || 'India'}</span>
                      {item.vendor?.area && <span className="text-[11px] text-slate-400">• {item.vendor.area}</span>}
                   </div>
                   
                   {/* Verification Badges */}
                   <div className="flex flex-wrap items-center gap-2 py-1">
                      {['GST', 'Email', 'Mobile'].map(label => (
                         <div key={label} className="flex items-center gap-1 text-[10px] font-bold text-#164e33">
                            <CheckCircle2 size={10} className="text-emerald-500" /> {label}
                         </div>
                      ))}
                      <div className="text-[10px] font-bold text-slate-400">• Member: 1 yr</div>
                   </div>

                   {/* Ratings & TrustSeal */}
                   <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1">
                         <div className="flex items-center">
                            {[1, 2, 3, 4].map(i => <Star key={i} size={10} className="fill-amber-400 text-amber-400" />)}
                            <Star size={10} className="text-slate-200" />
                         </div>
                         <span className="text-[11px] font-bold text-slate-600">4.5 (18)</span>
                      </div>
                      <div className="bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded text-[9px] font-black uppercase border border-amber-100 flex items-center gap-1">
                         <ShieldCheck size={10} /> TrustSEAL
                      </div>
                   </div>
                </div>

                {/* Secondary Action */}
                <button 
                  onClick={(e) => handleViewClick(e, 'CALL', item.id, item.vendor)}
                  className="w-full mt-4 py-2 border border-[#164e33] text-[#164e33] hover:bg-emerald-50 rounded-md text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                   <PhoneCall size={16} /> Call Now
                </button>
            </div>
        </div>
    );
};

const FilterSection = ({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-gray-100 last:border-0 pb-4 mb-4">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-2 text-sm font-bold text-slate-800 hover:text-[#164e33] transition-colors"
            >
                {title} <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <div className="pt-2">{children}</div>}
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
    const [isExploreOpen, setIsExploreOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [vendors, setVendors] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
    const scrollRef = React.useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - 300 : scrollLeft + 300;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    const q = searchParams.get('q') || '';
    const city = searchParams.get('city') || '';
    const currentCategoryId = searchParams.get('category') || '';
    const currentPage = parseInt(searchParams.get('page') || '1');

    const [locationQuery, setLocationQuery] = useState(city);

    useEffect(() => {
        setLocationQuery(city);
    }, [city]);

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await apiFetch('/vendors/categories');
            if (data.success) setCategories(data.data || []);
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchVendors = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams({
                    ...(currentCategoryId && { categoryId: currentCategoryId }),
                    ...(city && { city: city }),
                    ...(q && { search: q }),
                    page: currentPage.toString(),
                    limit: '30'
                });
                const data = await apiFetch(`/vendors?${query.toString()}`);
                setVendors(Array.isArray(data.data.vendors) ? data.data.vendors : []);
                setPagination({ total: data.data.total || 0, totalPages: data.data.totalPages || 1 });
            } catch (error) { console.error(error); } finally { setLoading(false); }
        };
        fetchVendors();
    }, [searchParams]);

    const updateURL = (newParams: any) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(newParams).forEach(([key, value]) => {
            if (!value) params.delete(key);
            else params.set(key, value.toString());
        });
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const handleViewClick = (e: any, type: string, id: string, vendor: any) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        if (!user) { setTargetVendor(vendor); setAuthModalOpen(true); return; }
        if (type === 'CALL') { /* Handle call logic */ }
        else router.push(`/product/${id}`);
    };

    const filteredItems = vendors.flatMap((v: any) => (v.products || [])
        .filter((p: any) => {
            // Basic Approval Filter
            if (p.status !== 'APPROVED') return false;

            // 1. Price Filter
            const priceRange = searchParams.get('priceRange');
            if (priceRange) {
                const [min, max] = priceRange.split('-').map(v => v === 'max' ? Infinity : parseInt(v));
                const price = p.price || 0;
                if (price < min || price > max) return false;
            }

            // 2. Automation Grade Filter
            const automation = searchParams.get('automation');
            if (automation) {
                const activeGrades = automation.split(',');
                // Assuming products have an 'automationGrade' field or similar
                if (!p.automationGrade || !activeGrades.includes(p.automationGrade)) return false;
            }

            // 3. Business Credentials (Vendor Level)
            const highTurnover = searchParams.get('highTurnover') === 'true';
            if (highTurnover && v.annualTurnover !== '5Cr+') return false;

            const gst3yr = searchParams.get('gst3yr') === 'true';
            if (gst3yr && !v.isGstOld) return false;

            // 4. Category Filter (Important for precise results)
            const selectedCatId = searchParams.get('category');
            if (selectedCatId) {
                // Find the name of the selected category to match with product.category string if needed
                const selectedCat = categories.find(c => c.id === selectedCatId);
                const matchesId = p.categoryId === selectedCatId;
                const matchesName = selectedCat && (p.category === selectedCat.name || p.category?.name === selectedCat.name);
                
                if (!matchesId && !matchesName) return false;
            }

            return true;
        })
        .map((p: any) => ({ ...p, vendor: v }))
    );

    return (
        <div className="min-h-screen bg-[#fcfcfc] font-sans antialiased text-slate-900">
            <VendorLoginModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} vendor={targetVendor} />

            {/* --- Explore Drawer --- */}
            <AnimatePresence>
                {isExploreOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsExploreOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                        />
<motion.div
    initial={{ x: '-100%' }}
    animate={{ x: 0 }}
    exit={{ x: '-100%' }}
    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    className="fixed top-0 left-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl overflow-y-auto no-scrollbar"
>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                                    <h2 className="text-xl font-bold text-slate-800">Explore More</h2>
                                    <button onClick={() => setIsExploreOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-900">
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="space-y-8">
                                    {/* Price Range Section */}
                                    <section>
                                        <h3 className="text-sm font-bold text-#164e33 uppercase tracking-wider mb-4">Price Range</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {[
                                                { label: 'Below ₹2,00,000', val: '200000' },
                                                { label: '₹2,00,001 - ₹7,50,000', val: '750000' },
                                                { label: '₹7,50,001 - ₹15,50,000', val: '1550000' },
                                                { label: 'Above ₹15,50,001', val: 'max' }
                                            ].map(p => (
                                                <label key={p.val} className="flex items-center gap-3 cursor-pointer group">
                                                    <div className="w-5 h-5 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:border-[#164e33] transition-all">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-transparent group-hover:bg-[#164e33]/30"></div>
                                                    </div>
                                                    <span className="text-[13px] font-semibold text-slate-600 group-hover:text-slate-900">{p.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Categories Section */}
                                    <section>
                                        <h3 className="text-sm font-bold text-#164e33 uppercase tracking-wider mb-4">Categories</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {categories.map((cat) => (
                                                <button 
                                                    key={cat.id} 
                                                    onClick={() => { updateURL({ category: cat.id }); setIsExploreOpen(false); }}
                                                    className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all border ${currentCategoryId === cat.id ? 'bg-[#164e33] text-white border-[#164e33] shadow-md shadow-emerald-900/20' : 'bg-white text-slate-600 border-gray-100 hover:border-[#164e33]/30 hover:bg-emerald-50'}`}
                                                >
                                                    {cat.name}
                                                </button>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Filters Section */}
                                    <section>
                                        <h3 className="text-sm font-bold text-#164e33 uppercase tracking-wider mb-4">Filters</h3>
                                        <div className="space-y-4">
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <input 
                                                    type="checkbox" 
                                                    checked={!!city}
                                                    onChange={(e) => updateURL({ city: e.target.checked ? 'Indore' : '' })}
                                                    className="w-5 h-5 rounded border-gray-300 text-[#164e33] focus:ring-[#164e33]" 
                                                />
                                                <span className="text-[13px] font-semibold text-slate-600">Show Suppliers from {city || 'Indore'} only</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-[#164e33] focus:ring-[#164e33]" />
                                                <span className="text-[13px] font-semibold text-slate-600">Your City</span>
                                            </label>
                                        </div>
                                    </section>
                                </div>

                                <div className="mt-12 pt-6 border-t border-gray-100">
                                    <button 
                                        onClick={() => setIsExploreOpen(false)}
                                        className="w-full py-4 bg-[#164e33] text-white rounded-xl font-bold text-sm uppercase shadow-lg shadow-[#164e33]/20 hover:bg-[#006972] transition-all"
                                    >
                                        Show Results
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* --- Search Result Title --- */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-[1500px] mx-auto px-4 lg:px-8 py-4">
                    <h1 className="text-[22px] lg:text-[28px] font-medium text-slate-800">
                        {q || 'Products'} {city ? `near ${city}` : 'across India'}
                        <span className="ml-4 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">Advanced Search</span>
                    </h1>
                </div>
            </div>

            {/* --- Sub-Header Filter Bar --- */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
                <div className="max-w-[1500px] mx-auto px-4 lg:px-8 py-3 flex flex-wrap items-center gap-3">
                    {/* Location Input Box */}
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 lg:w-[350px] group focus-within:border-[#164e33] transition-all">
                        <MapPin size={18} className="text-slate-400 group-focus-within:text-[#164e33]" />
                        <input 
                            type="text" 
                            value={locationQuery}
                            onChange={(e) => setLocationQuery(e.target.value)}
                            placeholder="Select City to find sellers near you"
                            className="bg-transparent text-sm font-semibold w-full focus:outline-none placeholder:text-slate-400"
                        />
                        <button onClick={() => updateURL({ city: locationQuery })} className="text-slate-400 hover:text-[#164e33]">
                           <Search size={16} />
                        </button>
                    </div>

                    {/* Explore Now Button */}
                    <button 
                        onClick={() => setIsExploreOpen(true)}
                        className="flex items-center gap-2 border border-gray-200 px-4 py-1.5 rounded-full text-xs font-bold text-white bg-[#164e33] hover:bg-[#006972] shadow-md shadow-[#164e33]/10 transition-all active:scale-95"
                    >
                        <Sparkles size={14} /> Explore Now
                    </button>

                    {/* Near Me Button */}
                    <button className="flex items-center gap-2 border border-gray-200 px-4 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all active:scale-95">
                        <div className="w-5 h-5 bg-[#164e33]/10 rounded-full flex items-center justify-center text-[#164e33]">
                           <Navigation size={12} className="rotate-45" />
                        </div>
                        Near Me
                    </button>

                    <div className="h-6 w-px bg-gray-200 mx-2 hidden lg:block"></div>

                    {/* City Pills Slider */}
                    <div className="relative flex-1 overflow-hidden group/slider">
                        <div 
                            ref={scrollRef}
                            className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth pr-10"
                        >
                            <button 
                              onClick={() => updateURL({ city: '' })}
                              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${!city ? 'bg-[#D97528] text-white border-[#D97528]' : 'bg-white text-slate-600 border-gray-200 hover:border-slate-300'}`}
                            >
                               All India
                            </button>
                            {city && (
                               <div className="bg-[#D97528] text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 whitespace-nowrap shadow-sm">
                                   {city} <X size={14} className="cursor-pointer" onClick={() => updateURL({ city: '' })} />
                               </div>
                            )}
                            {['Indore', 'Ahmedabad', 'Bhopal', 'Jaipur', 'Pune', 'Thane', 'Morbi', 'Hyderabad', 'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Surat', 'Lucknow', 'Kanpur'].filter(c => c !== city).map(c => (
                               <button 
                                 key={c} 
                                 onClick={() => updateURL({ city: c })}
                                 className="px-4 py-1.5 rounded-full bg-white border border-gray-200 text-slate-600 text-xs font-bold hover:border-slate-300 transition-all whitespace-nowrap shadow-sm"
                               >
                                   {c}
                               </button>
                            ))}
                        </div>

                        {/* Navigation Arrows */}
                        <button 
                            onClick={() => scroll('left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-full flex items-center justify-center text-slate-400 hover:text-[#164e33] shadow-sm opacity-0 group-hover/slider:opacity-100 transition-opacity z-10"
                        >
                            <ChevronRight size={18} className="rotate-180" />
                        </button>
                        <button 
                            onClick={() => scroll('right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-full flex items-center justify-center text-slate-400 hover:text-[#164e33] shadow-sm opacity-0 group-hover/slider:opacity-100 transition-opacity z-10"
                        >
                            <ChevronRight size={18} />
                        </button>

                        {/* Fades */}
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* --- Main Content Section --- */}
            <main className="max-w-[1500px] mx-auto px-4 lg:px-8 py-8 flex gap-8">
                
                {/* --- Sidebar Filters --- */}
                <aside className="w-[280px] shrink-0 hidden xl:block">
                    <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-24 shadow-sm">
                        <FilterSection title="Price">
                            <div className="space-y-2.5">
                                {[
                                   { label: 'Below ₹2,00,000', val: '0-200000' },
                                   { label: '₹2,00,001 - ₹7,50,000', val: '200001-750000' },
                                   { label: '₹7,50,001 - ₹15,50,000', val: '750001-1550000' },
                                   { label: 'Above ₹15,50,001', val: '1550001-max' }
                                ].map(p => (
                                   <label key={p.val} className="flex items-center gap-2.5 cursor-pointer group">
                                      <input 
                                        type="radio" 
                                        name="price"
                                        checked={searchParams.get('priceRange') === p.val}
                                        onChange={() => updateURL({ priceRange: p.val })}
                                        className="w-4 h-4 border-gray-300 text-[#164e33] focus:ring-[#164e33]" 
                                      />
                                      <span className="text-[13px] font-medium text-slate-600 group-hover:text-[#164e33]">{p.label}</span>
                                   </label>
                                ))}
                            </div>
                        </FilterSection>

                        <FilterSection title="Business Credentials">
                           <div className="space-y-3">
                              <label className="flex items-center gap-2.5 cursor-pointer group">
                                 <input 
                                    type="checkbox" 
                                    checked={searchParams.get('highTurnover') === 'true'}
                                    onChange={(e) => updateURL({ highTurnover: e.target.checked })}
                                    className="w-4 h-4 rounded border-gray-300 text-[#164e33]" 
                                 />
                                 <span className="text-[13px] font-medium text-slate-600 group-hover:text-[#164e33]">Annual turnover ₹5 Cr+</span>
                              </label>
                              <label className="flex items-center gap-2.5 cursor-pointer group">
                                 <input 
                                    type="checkbox" 
                                    checked={searchParams.get('gst3yr') === 'true'}
                                    onChange={(e) => updateURL({ gst3yr: e.target.checked })}
                                    className="w-4 h-4 rounded border-gray-300 text-[#164e33]" 
                                 />
                                 <span className="text-[13px] font-medium text-slate-600 group-hover:text-[#164e33]">GST registered 3+ years</span>
                              </label>
                           </div>
                        </FilterSection>

                        <FilterSection title="Automation Grade" defaultOpen={true}>
                           <div className="space-y-3">
                              {['Manual', 'Semi Automatic', 'Automatic'].map(grade => (
                                 <label key={grade} className="flex items-center gap-2.5 cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        checked={searchParams.get('automation')?.includes(grade)}
                                        onChange={(e) => {
                                            const current = searchParams.get('automation') || '';
                                            const newVal = e.target.checked ? (current ? `${current},${grade}` : grade) : current.replace(new RegExp(`,?${grade}`), '');
                                            updateURL({ automation: newVal });
                                        }}
                                        className="w-4 h-4 rounded border-gray-300 text-[#164e33]" 
                                    />
                                    <span className="text-[13px] font-medium text-slate-600 group-hover:text-[#164e33]">{grade}</span>
                                 </label>
                              ))}
                           </div>
                        </FilterSection>

                        <div className="pt-2">
                           <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-tight">Categories</h3>
                           <div className="space-y-1.5">
                              {categories.slice(0, 8).map(cat => (
                                 <button 
                                   key={cat.id} 
                                   onClick={() => updateURL({ category: cat.id })}
                                   className={`w-full text-left px-2 py-1.5 rounded text-[13px] font-medium transition-all ${currentCategoryId === cat.id ? 'bg-emerald-50 text-[#164e33]' : 'text-#164e33 hover:bg-gray-50'}`}
                                 >
                                    {cat.name}
                                 </button>
                              ))}
                           </div>
                        </div>
                    </div>
                </aside>

                {/* --- Main Product Grid --- */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-[14px] font-bold text-#164e33">
                           Showing <span className="text-slate-900">{filteredItems.length}</span> results for <span className="text-slate-900 font-black">"{q || 'All Products'}"</span>
                        </p>
                  
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[1, 2, 3, 4, 8].map(i => <div key={i} className="bg-white rounded-xl h-[450px] animate-pulse border border-gray-100" />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item: any) => (
                                    <ProductCard key={item.id} item={item} handleViewClick={handleViewClick} />
                                ))
                            ) : (
                                <div className="col-span-full py-32 text-center bg-white rounded-3xl border border-gray-100 flex flex-col items-center">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200">
                                        <Search size={40} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">No items found</h3>
                                    <p className="text-slate-400 font-medium max-w-sm mx-auto text-sm">We couldn't find any products matching your criteria. Try adjusting your location or filters.</p>
                                    <button 
                                        onClick={() => updateURL({ city: '', category: '', q: '' })}
                                        className="mt-8 px-10 py-3 bg-[#164e33] text-white rounded-lg font-bold text-sm shadow-lg shadow-emerald-900/10"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="mt-16 flex items-center justify-center gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => updateURL({ page: currentPage - 1 })}
                                className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-slate-400 hover:text-[#164e33] disabled:opacity-30 transition-all bg-white shadow-sm"
                            >
                                <ArrowLeft size={18} />
                            </button>
                            {[...Array(pagination.totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => updateURL({ page: i + 1 })}
                                    className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${currentPage === i + 1 ? 'bg-[#D97528] text-white shadow-md' : 'bg-white border border-gray-200 text-slate-600 hover:border-slate-300 shadow-sm'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                disabled={currentPage === pagination.totalPages}
                                onClick={() => updateURL({ page: currentPage + 1 })}
                                className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-slate-400 hover:text-[#164e33] disabled:opacity-30 transition-all bg-white shadow-sm"
                            >
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* --- Footer Feature Bar --- */}
            <div className="bg-white border-t border-gray-100 mt-20">
                <div className="max-w-[1500px] mx-auto px-8 py-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: ShieldCheck, title: "Verified Vendors", desc: "Quality checked partners" },
                            { icon: Box, title: "Wide Range", desc: "1000+ products listed" },
                            { icon: Handshake, title: "Reliable B2B", desc: "India's trusted community" },
                            { icon: Headphones, title: "Support", desc: "Dedicated help center" },
                        ].map((f, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="bg-slate-50 p-4 rounded-xl text-slate-400">
                                    <f.icon size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">{f.title}</p>
                                    <p className="text-xs text-slate-400 font-medium">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="animate-spin text-[#164e33]" size={48} /></div>}>
            <SearchContent />
        </Suspense>
    );
}