'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { apiFetch } from '@/lib/api';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
    Search, MapPin, Star, ShieldCheck, Filter, Mail, PhoneCall, Globe,
    Heart, LayoutGrid, Headphones, Handshake, Sparkles, Settings, Box,
    ChevronDown, ArrowRight, Loader2, X, CheckCircle2, ChevronRight,
    ArrowLeft
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
        <div
            onClick={(e) => handleViewClick(e, 'PRODUCT', item.id, item.vendor)}
            className="bg-white rounded-3xl border border-gray-200 overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300 group cursor-pointer relative"
        >
            <div className="h-64 w-full relative bg-gray-50">
                {images.length > 0 ? (
                    <img src={images[0]} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                        <Box className="w-12 h-12 opacity-20" />
                    </div>
                )}
                <div className="absolute top-4 left-4 bg-[#164e33] text-white px-3 py-1.5 rounded text-[12px] font-bold uppercase tracking-wider z-10">
                    {item.category?.name || 'General'}
                </div>
                <button className="absolute top-4 right-4 p-2.5 rounded-full bg-white text-slate-400 hover:text-red-500 transition-colors z-10 shadow-md border border-gray-100">
                    <Heart size={20} />
                </button>
            </div>

            <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-[20px] font-bold text-slate-800 leading-tight line-clamp-1">
                        {item.name}
                    </h3>
                    <p className="text-[20px] font-bold text-[#1b5e20]">
                        ₹{item.price ? item.price.toLocaleString() : 'N/A'}
                    </p>
                </div>

                <p className="text-[15px] text-slate-600 mb-2 font-medium">{item.vendor?.businessName || 'Business Name'}</p>

                <div className="flex items-center gap-1.5 text-slate-400 mb-4">
                    <MapPin size={16} className="fill-slate-400 text-white" />
                    <span className="text-[13px] font-semibold uppercase tracking-wide">{item.vendor?.city || 'India'}</span>
                </div>

                <div className="flex flex-wrap gap-2.5 mb-4">
                    {['GST', 'MOBILE', 'EMAIL'].map((label) => (
                        <div key={label} className="flex items-center gap-1.5 bg-emerald-50 text-[#164e33] px-3 py-1 rounded-md text-[11px] font-bold border border-emerald-100">
                            <CheckCircle2 size={12} strokeWidth={2.5} />
                            {label}
                        </div>
                    ))}
                </div>

                <div className="mb-5">
                    <span className="bg-slate-50 text-slate-500 px-3 py-1 rounded text-[11px] font-bold uppercase border border-slate-200">Member</span>
                </div>

                <div className="flex items-center gap-4 py-4 border-t border-gray-100 mt-auto">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[15px] font-bold text-slate-800">4.5</span>
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        <span className="text-[13px] font-medium text-slate-400">(10)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                        <ShieldCheck size={18} className="text-slate-400" />
                        <span className="text-[13px] font-semibold">Active Hub Partner</span>
                    </div>
                    <div className="ml-auto bg-amber-50 text-amber-600 px-2.5 py-1 rounded text-[11px] font-bold border border-amber-100 uppercase tracking-tighter">TrustSeal</div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); handleViewClick(e, 'PRODUCT', item.id, item.vendor); }}
                        className="py-3 px-4 border-2 border-[#164e33] text-[#164e33] hover:bg-emerald-50 rounded-2xl text-[15px] font-bold transition-all flex items-center justify-center gap-2"
                    >
                        <Mail size={18} /> Vendor
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleViewClick(e, 'CALL', item.id, item.vendor); }}
                        className="py-3 px-4 bg-[#f37021] hover:bg-[#e06015] text-white rounded-2xl text-[15px] font-bold transition-all flex items-center justify-center gap-2 shadow-md"
                    >
                        <PhoneCall size={18} /> Call Now
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
    const [loading, setLoading] = useState(true);
    const [vendors, setVendors] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
    const [isExploreOpen, setIsExploreOpen] = useState(false);

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
        .filter((p: any) => p.status === 'APPROVED')
        .map((p: any) => ({ ...p, vendor: v }))
    );

    return (
        <div className="min-h-screen bg-[#fcfcfc] font-sans antialiased text-slate-900">
            <VendorLoginModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} vendor={targetVendor} />

            {/* --- EXPLORE SIDEBAR --- */}
            <AnimatePresence>
                {isExploreOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsExploreOpen(false)}
                            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]"
                        />
                        <motion.div 
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 h-screen w-full max-w-[380px] bg-white z-[110] shadow-2xl flex flex-col"
                        >
                            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                        <LayoutGrid size={20} />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Categories</h2>
                                </div>
                                <button onClick={() => setIsExploreOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-2 no-scrollbar">
                                <button 
                                    onClick={() => { updateURL({ category: '' }); setIsExploreOpen(false); }}
                                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bold text-[15px] transition-all ${!currentCategoryId ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                    <LayoutGrid size={20} /> All Categories
                                </button>
                                {categories.map((cat: any) => (
                                    <button 
                                        key={cat.id} 
                                        onClick={() => { updateURL({ category: cat.id }); setIsExploreOpen(false); }}
                                        className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bold text-[15px] transition-all ${currentCategoryId === cat.id ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                            <Box size={18} />
                                        </div>
                                        <span className="truncate">{cat.name}</span>
                                        {currentCategoryId === cat.id && <CheckCircle2 size={16} className="ml-auto text-emerald-500" />}
                                    </button>
                                ))}
                            </div>

                            <div className="p-6 border-t border-gray-50">
                                <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm uppercase tracking-wide shadow-xl shadow-slate-200">
                                    Apply Filters
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <nav className="max-w-[1400px] mx-auto px-6 py-5 flex items-center gap-2 text-[15px] font-medium text-slate-500">
                <Link href="/" className="hover:text-[#164e33]">B2B Community</Link>
                <ChevronRight size={16} className="text-slate-300" />
                <Link href="/search" className="hover:text-[#164e33]">All Categories</Link>
                <ChevronRight size={16} className="text-slate-300" />
                <span className="text-slate-900 font-bold">Products</span>
            </nav>

            <main className="max-w-[1400px] mx-auto px-6 pb-20">
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-2">
                        <h1 className="text-[36px] font-bold text-slate-900">Vendors</h1>
                        <div className="bg-emerald-50 text-[#164e33] px-4 py-1.5 rounded-full text-[13px] font-bold border border-emerald-100 mt-1">
                            {pagination.total} products available
                        </div>
                    </div>
                    <p className="text-slate-500 text-[16px] font-medium">Discover verified vendors and trusted businesses in {city || 'India'}</p>
                </div>

                <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm flex flex-wrap items-center gap-3 mb-10">
                    <button 
                        onClick={() => setIsExploreOpen(true)}
                        className="flex items-center gap-2 bg-white border border-[#164e33]/30 px-6 py-3 rounded-xl text-[#164e33] font-bold text-[15px] hover:border-[#164e33] transition-all"
                    >
                        <Filter size={20} strokeWidth={2.5} /> Explore
                    </button>

                    <form 
                        onSubmit={(e) => { e.preventDefault(); updateURL({ city: locationQuery }); }}
                        className="flex-1 min-w-[200px] relative"
                    >
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            value={locationQuery}
                            onChange={(e) => setLocationQuery(e.target.value)}
                            placeholder="Indore"
                            className="w-full bg-slate-50/50 border border-gray-100 rounded-xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-[#164e33]/10 focus:bg-white text-[15px] font-bold"
                        />
                        <button type="submit">
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#164e33] transition-colors" size={18} />
                        </button>
                    </form>

                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                        <button onClick={() => updateURL({ city: '' })} className={`px-6 py-3 rounded-xl border font-bold text-[15px] whitespace-nowrap transition-all ${!city ? 'bg-[#164e33] text-white border-[#164e33]' : 'border-gray-100 text-slate-600'}`}>All India</button>
                        {city && (
                            <div className="bg-[#164e33] text-white px-5 py-3 rounded-xl font-bold text-[15px] flex items-center gap-2 whitespace-nowrap">
                                {city} <X size={16} className="cursor-pointer" onClick={() => updateURL({ city: '' })} />
                            </div>
                        )}
                        {['Indore', 'Bhopal', 'Vadodara', 'Delhi'].filter(c => c !== city).map(c => (
                            <button key={c} onClick={() => updateURL({ city: c })} className="px-6 py-3 rounded-xl border border-gray-100 text-slate-500 font-bold text-[15px] hover:bg-gray-50 hidden lg:block whitespace-nowrap">
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-10">
                    {/* Desktop Sidebar (Left) */}
                    <aside className="w-[300px] shrink-0 hidden xl:block">
                        <div className="bg-white border border-gray-100 rounded-3xl p-8 space-y-10 sticky top-6 shadow-sm">
                            <div>
                                <h3 className="text-[16px] font-bold text-slate-800 flex items-center justify-between mb-6 uppercase tracking-tight">
                                    Offering Type <ChevronDown size={18} className="text-slate-400" />
                                </h3>
                                <div className="space-y-5">
                                    {['All Offers', 'Products', 'Services'].map((type, i) => (
                                        <label key={type} className="flex items-center gap-4 cursor-pointer group">
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${i === 0 ? 'border-[#164e33]' : 'border-gray-300'}`}>
                                                {i === 0 && <div className="w-3 h-3 bg-[#164e33] rounded-full" />}
                                            </div>
                                            <span className={`text-[15px] font-bold ${i === 0 ? 'text-[#164e33]' : 'text-slate-600'}`}>{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[16px] font-bold text-slate-800 flex items-center justify-between mb-6 uppercase tracking-tight">
                                    Categories <ChevronDown size={18} className="text-slate-400" />
                                </h3>
                                <div className="space-y-2 -mx-2">
                                    <button 
                                        onClick={() => updateURL({ category: '' })}
                                        className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold text-[15px] transition-all ${!currentCategoryId ? 'bg-emerald-50 text-[#164e33]' : 'text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        <LayoutGrid size={20} /> All Categories
                                    </button>
                                    {categories.map((cat: any) => (
                                        <button 
                                            key={cat.id} 
                                            onClick={() => updateURL({ category: cat.id })}
                                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold text-[15px] transition-all ${currentCategoryId === cat.id ? 'bg-emerald-50 text-[#164e33]' : 'text-slate-600 hover:bg-slate-50'}`}
                                        >
                                            <Box size={20} className={currentCategoryId === cat.id ? 'text-[#164e33]' : 'text-slate-400'} /> 
                                            <span className="truncate">{cat.name}</span>
                                        </button>
                                    ))}
                                </div>
                                <button 
                                    onClick={() => setIsExploreOpen(true)}
                                    className="w-full mt-6 py-4 border-2 border-emerald-50 rounded-2xl text-[#164e33] font-bold text-[15px] flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all"
                                >
                                    <ArrowRight size={18} /> View More
                                </button>
                            </div>
                        </div>
                    </aside>

                    <div className="flex-1">
                        <div className="mb-8 flex items-center justify-between">
                            <p className="text-slate-600 font-bold text-[16px]">Found {filteredItems.length} results</p>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="bg-white rounded-3xl h-[520px] animate-pulse border border-gray-100" />)}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredItems.length > 0 ? (
                                    filteredItems.map((item: any, index: number) => {
                                        const adIndex = Math.floor((index + 1) / 6) - 1;
                                        const showAd = (index + 1) % 6 === 0;
                                        
                                        const adsData = [
                                            {
                                                title: "Scale Your Global Operations with Admission Master",
                                                desc: "Join 10,000+ verified businesses leveraging our pan-India network to capture high-intent leads.",
                                                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
                                                cta: "Start Your Campaign",
                                                tag: "Premium Growth"
                                            },
                                            {
                                                title: "Verified Supplier Gold Membership",
                                                desc: "Get the 'TrustSeal' badge and 5x more visibility in category searches across the platform.",
                                                image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop",
                                                cta: "Upgrade to Gold",
                                                tag: "Seller Success"
                                            },
                                            {
                                                title: "Logistics & Supply Chain Solutions",
                                                desc: "Streamline your delivery with our integrated logistics partners. Flat 20% off for new vendors.",
                                                image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop",
                                                cta: "Explore Logistics",
                                                tag: "Service Partner"
                                            },
                                            {
                                                title: "Digital Marketing for Manufacturers",
                                                desc: "Boost your online presence with professional SEO and social media curation tailored for B2B.",
                                                image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=800&auto=format&fit=crop",
                                                cta: "Get Free Audit",
                                                tag: "Digital Reach"
                                            }
                                        ];

                                        const currentAd = adsData[adIndex % adsData.length];

                                        return (
                                            <React.Fragment key={item.id}>
                                                <ProductCard item={item} handleViewClick={handleViewClick} />
                                                
                                                {showAd && (
                                                    <div className="col-span-full my-6">
                                                        <div className="bg-white border border-gray-100 rounded-[2rem] p-4 flex flex-col lg:flex-row items-stretch gap-6 relative overflow-hidden group shadow-lg shadow-slate-100/50">
                                                            {/* Ad Image Wrapper */}
                                                            <div className="lg:w-1/3 h-64 lg:h-auto relative rounded-2xl overflow-hidden shrink-0 shadow-inner">
                                                                <img 
                                                                    src={currentAd.image} 
                                                                    alt={currentAd.title} 
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                                />
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                                                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                                                                    <div className="bg-[#164e33] text-white px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest">Sponsored</div>
                                                                    <div className="bg-white/20 backdrop-blur-md text-white px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-tight">Marketplace Ads</div>
                                                                </div>
                                                            </div>

                                                            {/* Ad Content Wrapper */}
                                                            <div className="flex-1 py-4 lg:py-8 px-4 flex flex-col justify-center gap-6">
                                                                <div>
                                                                    <div className="flex items-center gap-3 mb-3">
                                                                        <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-500 shadow-sm border border-amber-100/50">
                                                                            <Sparkles className="w-4 h-4 animate-pulse" />
                                                                        </div>
                                                                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">{currentAd.tag}</span>
                                                                    </div>
                                                                    <h4 className="text-2xl md:text-3xl font-black text-slate-900 mb-3 tracking-tight leading-tight">{currentAd.title}</h4>
                                                                    <p className="text-slate-500 font-medium max-w-xl leading-relaxed text-[15px]">
                                                                        {currentAd.desc}
                                                                    </p>
                                                                </div>

                                                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                                                    <button className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold text-[15px] hover:bg-black transition-all shadow-xl shadow-slate-200 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2">
                                                                        {currentAd.cta} <ArrowRight className="w-5 h-5" />
                                                                    </button>
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="flex -space-x-3">
                                                                            {[1,2,3].map(i => (
                                                                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                                                                                    <img src={`https://i.pravatar.cc/100?img=${i+20 + (adIndex * 3)}`} alt="user" />
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                        <p className="text-xs font-bold text-slate-400 leading-tight">Active Partners <br/> In your network</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Decorative Subtle Grid Overlay */}
                                                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
                                                        </div>
                                                    </div>
                                                )}
                                            </React.Fragment>
                                        );
                                    })
                                ) : (
                                    <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-gray-100 flex flex-col items-center">
                                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                            <Search size={40} className="text-slate-200" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-800 mb-2">No results found</h3>
                                        <p className="text-slate-400 font-medium max-w-sm mx-auto">We couldn't find any products matching your search. Try adjusting your filters or location.</p>
                                        <button 
                                            onClick={() => updateURL({ city: '', category: '', q: '' })}
                                            className="mt-8 px-8 py-3.5 bg-[#164e33] text-white rounded-2xl font-bold text-[14px]"
                                        >
                                            Reset All Filters
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
                                    className="w-12 h-12 rounded-2xl border border-gray-100 flex items-center justify-center text-slate-400 hover:text-[#164e33] disabled:opacity-30 transition-all"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                {[...Array(pagination.totalPages)].map((_, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => updateURL({ page: i + 1 })}
                                        className={`w-12 h-12 rounded-2xl font-bold text-sm transition-all ${currentPage === i + 1 ? 'bg-[#164e33] text-white shadow-lg shadow-emerald-900/10' : 'border border-gray-100 text-slate-600 hover:bg-gray-50'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button 
                                    disabled={currentPage === pagination.totalPages}
                                    onClick={() => updateURL({ page: currentPage + 1 })}
                                    className="w-12 h-12 rounded-2xl border border-gray-100 flex items-center justify-center text-slate-400 hover:text-[#164e33] disabled:opacity-30 transition-all"
                                >
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <div className="bg-[#f8fafc] border-t border-gray-200 mt-20">
                <div className="max-w-[1400px] mx-auto px-6 py-16">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        {[
                            { icon: ShieldCheck, title: "Verified Vendors", desc: "Quality checked partners" },
                            { icon: Box, title: "Wide Range", desc: "100+ categories to explore" },
                            { icon: Handshake, title: "Easy & Reliable", desc: "Quick bookings & secure payments" },
                            { icon: Headphones, title: "24/7 Support", desc: "We're here to help you" },
                        ].map((f, i) => (
                            <div key={i} className="flex items-center gap-5 group">
                                <div className="bg-emerald-50 p-5 rounded-full group-hover:bg-emerald-100 transition-colors">
                                    <f.icon className="text-[#164e33]" size={28} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-[16px]">{f.title}</p>
                                    <p className="text-[14px] text-slate-500 font-medium">{f.desc}</p>
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