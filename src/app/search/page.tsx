'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
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
    XCircle,
    Globe
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
            className="bg-white rounded-3xl border border-gray-100 overflow-hidden flex flex-col hover:border-[#1b5e20]/30 transition-all duration-300 ease-out group shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer relative"
        >
            {/* Image Area - Increased Height for better impact */}
            <div className="h-56 sm:h-64 w-full relative bg-gray-50 overflow-hidden group-hover:bg-gray-100 transition-colors p-4">
                {images.length > 0 ? (
                    <>
                        <Image
                            src={images[currentImgIndex]}
                            alt={item.name}
                            fill
                            className="object-contain p-2 group-hover:scale-105 transition-transform duration-700 ease-out"
                        />

                        {images.length > 1 && (
                            <>
                                <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                    <button onClick={prevImg} className="p-2 rounded-full bg-white/90 text-slate-900 shadow-lg hover:bg-[#1b5e20] hover:text-white transition-all transform hover:scale-110">
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button onClick={nextImg} className="p-2 rounded-full bg-white/90 text-slate-900 shadow-lg hover:bg-[#1b5e20] hover:text-white transition-all transform hover:scale-110">
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-20">
                                    {images.map((_: any, i: number) => (
                                        <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === currentImgIndex ? 'w-6 bg-[#1b5e20]' : 'w-1.5 bg-gray-300'}`} />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-200">
                        <Layers className="w-12 h-12 mb-2 opacity-20" />
                        <span className="text-sm font-semibold uppercase ">No Images</span>
                    </div>
                )}

                {/* Category Badge - Adjusted Position & Weight */}
                <div className="absolute top-4 left-4 bg-[#1b5e20] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg z-10">
                    {item.category || item.type}
                </div>
            </div>

            {/* Content Area */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-4 mb-1">
                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-[#1b5e20] transition-colors line-clamp-2 leading-tight flex-1">
                        {item.name}
                    </h3>
                    {item.price > 0 && (
                        <div className="text-xl font-bold text-[#1b5e20] shrink-0">
                           <span className="text-sm font-medium mr-0.5">₹</span>{item.price.toLocaleString()}
                        </div>
                    )}
                </div>

                <div className="flex flex-col mb-4">
                    <span className="text-base font-semibold text-slate-600">
                        {item.vendor?.businessName || 'Elite Trading Corp'}
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-500 mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-sm font-medium uppercase tracking-wide">
                            {item.vendor?.city || 'India'}
                        </span>
                    </div>
                </div>

                {/* Verification Badges - Fixed extrabold issue */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {verificationItems.map((v, i) => (
                        <div key={i} className={`flex items-center gap-1 px-2 py-0.5 rounded-full border ${v.isPresent ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                            {v.isPresent && <CheckCircle2 className="w-3 h-3" />}
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                                {v.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Ratings & Activity */}
                <div className="flex items-center justify-between py-3 border-t border-gray-100 mt-auto mb-5">
                    <div className="flex items-center gap-3">
                        {(() => {
                            const reviews = item.vendor?.reviews || [];
                            const avg = reviews.length > 0
                                ? (reviews.reduce((acc: number, r: any) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1)
                                : (item.rating || 4.5);
                            return (
                                <div className="flex items-center gap-1.5">
                                    <div className="flex items-center bg-emerald-600 text-white px-1.5 py-0.5 rounded-md text-xs font-bold">
                                        {avg} <Star className="w-2.5 h-2.5 ml-0.5 fill-current" />
                                    </div>
                                    <span className="text-xs font-semibold text-slate-500">({reviews.length || 0})</span>
                                </div>
                            );
                        })()}

                        <div className="w-1 h-1 bg-gray-300 rounded-full" />
                        
                        <div className="flex items-center gap-1.5 text-slate-600">
                             <Shield className="w-3.5 h-3.5" />
                             <span className="text-xs font-semibold">Active Hub Partner</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider">TrustSeal</span>
                    </div>
                </div>

                {/* Buttons - Cleaned up */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={(e) => { e.stopPropagation(); handleViewClick(null, 'PRODUCT', item.id, item.vendor); }}
                        className="py-3 px-4 border border-emerald-600 text-emerald-700 hover:bg-emerald-50 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                    >
                        <Mail className="w-4 h-4" /> Supplier
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleViewClick(null, 'CALL', item.id, item.vendor); }}
                        className="py-3 px-4 bg-[#f37021] hover:bg-[#e06015] text-white rounded-2xl text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                        <PhoneCall className="w-4 h-4" /> Call Now
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
    const cityScrollRef = useRef<HTMLDivElement>(null);

    const scrollCities = (direction: 'left' | 'right') => {
        if (cityScrollRef.current) {
            const scrollAmount = 200;
            cityScrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Call Now modal
    const [callModalOpen, setCallModalOpen] = useState(false);
    const [callTargetProduct, setCallTargetProduct] = useState<any>(null);
    const [callPhone, setCallPhone] = useState('');
    const [callSending, setCallSending] = useState(false);
    const [callSent, setCallSent] = useState(false);

    useEffect(() => {
        if (user?.phone) setCallPhone(user.phone);
    }, [user]);

    const handleCallSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setAuthModalOpen(true);
            return;
        }
        setCallSending(true);
        try {
            await apiFetch('/leads/direct', {
                method: 'POST',
                body: JSON.stringify({
                    vendorId: callTargetProduct.vendor.id,
                    actionType: 'CALL',
                    buyerName: user.name,
                    phone: callPhone,
                    city: user.city || callTargetProduct.vendor.city || 'India',
                    categoryId: callTargetProduct.vendor.categories?.[0]?.id || callTargetProduct.category,
                    message: `CALL REQUEST (Search Page): User wants to call ${callTargetProduct.vendor.businessName} regarding ${callTargetProduct.name}. Preferred Phone: ${callPhone}`,
                }),
            });
            setCallSent(true);

            setTimeout(() => {
                setCallSent(false);
                setCallModalOpen(false);
                const phone = callTargetProduct.vendor.phone?.replace(/[^0-9]/g, '');
                if (phone && phone !== '**********') {
                    window.location.href = `tel:${phone}`;
                }
            }, 2500);
        } catch (e) {
            console.error(e);
        } finally {
            setCallSending(false);
        }
    };

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
                    limit: '30'
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
            const s = q.toLowerCase().trim();
            return (p.name && p.name.toLowerCase().includes(s)) ||
                (v.businessName && v.businessName.toLowerCase().includes(s)) ||
                (p.category && p.category.toLowerCase().includes(s));
        })
        .filter((p: any) => {
            if (!currentOfferingType) return true;
            return p.type === currentOfferingType;
        })
        .filter((p: any) => {
            if (!selectedCategoryName) return true;
            return p.category && p.category.toLowerCase().trim() === selectedCategoryName.toLowerCase().trim();
        })
        .filter((p: any) => !isVerified || v.isVerified || v.verified)
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
            const product = filteredItems.find(p => p.id === id);
            if (product) {
                setCallTargetProduct(product);
                setCallModalOpen(true);
            } else {
                // Fallback if product not found in filtered list
                window.location.href = `tel:${vendor?.phone || '+919876543210'}`;
            }
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

            {/* ── Call Now Modal (Consistent with product page) ── */}
            {callModalOpen && callTargetProduct && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    onClick={() => setCallModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col md:flex-row"
                        style={{ maxHeight: '90vh' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Left: Product + Supplier */}
                        <div className="md:w-[260px] shrink-0 bg-gray-50 border-r border-gray-100 flex flex-col overflow-y-auto">
                            <div className="w-full h-44 bg-white border-b border-gray-100 flex items-center justify-center overflow-hidden relative">
                                {(callTargetProduct.images && callTargetProduct.images.length > 0) || callTargetProduct.imageUrl || callTargetProduct.image ? (
                                    <img
                                        src={(callTargetProduct.images && callTargetProduct.images.length > 0) ? callTargetProduct.images[0] : (callTargetProduct.imageUrl || callTargetProduct.image)}
                                        alt={callTargetProduct.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Layers className="w-12 h-12 text-gray-200" />
                                )}
                                <div className="absolute top-2 left-2">
                                    <span className="bg-[#1b5e20] text-white text-base font-semibold px-2 py-0.5 rounded">
                                        Calling Supplier
                                    </span>
                                </div>
                            </div>
                            <div className="p-5 space-y-4">
                                <div>
                                    <h3 className="font-semibold text-slate-900 text-base leading-tight mb-1">{callTargetProduct.name}</h3>
                                    {callTargetProduct.price > 0 && (
                                        <p className="text-lg font-semibold text-[#1b5e20]">
                                            ₹ {callTargetProduct.price.toLocaleString()}
                                        </p>
                                    )}
                                </div>
                                <div className="border-t border-gray-100 pt-4 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-[#164e33]" />
                                        <span className="text-base font-semibold text-[#164e33] truncate">{callTargetProduct.vendor.businessName}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-base text-slate-700">
                                        <MapPin className="w-3.5 h-3.5" /> {callTargetProduct.vendor.city}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Call Form */}
                        <div className="flex-1 flex flex-col overflow-y-auto">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                <h2 className="text-base font-semibold text-slate-900">Confirm your number to call</h2>
                                <button onClick={() => setCallModalOpen(false)} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                                    <X className="w-5 h-5 text-slate-700" />
                                </button>
                            </div>

                            {callSent ? (
                                <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 bg-white">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center border-2 border-green-500/20"
                                    >
                                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center"
                                    >
                                        <p className="text-xl font-semibold text-slate-900">Enquiry Sent Successfully!</p>
                                        <p className="text-base text-slate-700 mt-2">Connecting you to the supplier now...</p>
                                    </motion.div>
                                </div>
                            ) : (
                                <form onSubmit={handleCallSubmit} className="flex-1 p-6 flex flex-col justify-center space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-base font-semibold text-slate-800 uppercase tracking-wide block">
                                            Your Mobile Number <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-gray-200 pr-3">
                                                <img src="https://flagcdn.com/w20/in.png" alt="India" className="w-5 h-auto rounded-lg" />
                                                <span className="text-base font-semibold text-slate-700">+91</span>
                                            </div>
                                            <input
                                                type="tel"
                                                required
                                                pattern="[0-9]{10}"
                                                value={callPhone}
                                                onChange={(e) => setCallPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                                                placeholder="10 digit mobile number"
                                                className="w-full border border-gray-300 rounded-xl pl-24 pr-4 py-4 text-lg font-semibold text-slate-900 outline-none focus:border-[#164e33] focus:ring-4 focus:ring-[#164e33]/10 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={callSending || callPhone.length !== 10}
                                        className="w-full py-4 bg-[#e65100] hover:bg-[#c74600] disabled:opacity-60 text-white rounded-xl font-semibold text-base flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                                    >
                                        {callSending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Phone className="w-5 h-5 fill-white" />}
                                        {callSending ? 'Processing...' : 'Call Now'}
                                    </button>

                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                        <p className="text-base text-slate-700 leading-relaxed text-center">
                                            Verified suppliers get your requirement instantly.
                                        </p>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}

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
                        <h2 className="text-xl font-bold text-[#164e33] tracking-wide uppercase">Explore More</h2>
                        <div className="flex items-center gap-3">
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Advanced Filters</p>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
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
                                className="text-xs font-bold text-[#f58220] uppercase tracking-wider hover:text-orange-600 transition-colors"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsExploreOpen(false)}
                        className="p-2 hover:bg-gray-50 rounded-full text-slate-500 hover:text-slate-900 transition-all"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-10 custom-scrollbar">
                    {/* Price Range Section */}
                    <section className="space-y-5">
                        <div className="flex items-center gap-3">
                           <div className="w-1.5 h-6 bg-[#164e33] rounded-full"></div>
                           <h3 className="text-base font-bold text-slate-900 tracking-wide uppercase">Price Range</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {['Below ₹600', '₹601 - ₹1,000', '₹1,001 - ₹3,000', 'Above ₹3,001'].map(p => (
                                <label
                                    key={p}
                                    onClick={() => handlePriceFilter(p)}
                                    className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all duration-300 border shadow-sm ${currentPriceRange === p ? 'bg-[#164e33] border-[#164e33] shadow-md transform scale-[1.02]' : 'bg-white hover:bg-gray-50 border-gray-200'}`}
                                >
                                    <span className={`text-sm font-bold ${currentPriceRange === p ? 'text-white' : 'text-slate-700'}`}>{p}</span>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${currentPriceRange === p ? 'border-white' : 'border-gray-300'}`}>
                                        {currentPriceRange === p && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </section>

                    {/* Sub Categories Grid - Connected to Backend */}
                    <section className="space-y-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <div className="w-1.5 h-6 bg-[#f58220] rounded-full"></div>
                               <h3 className="text-base font-bold text-slate-900 tracking-wide uppercase">Categories</h3>
                            </div>
                            {categories.length > 6 && (
                                <button
                                    onClick={() => setShowAllCategories(!showAllCategories)}
                                    className="text-sm font-bold text-[#164e33] uppercase tracking-wide hover:text-[#f58220] transition-colors"
                                >
                                    {showAllCategories ? 'Show Less' : 'View All'}
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {(showAllCategories ? categories : categories.slice(0, 6)).map((cat: any) => {
                                const getCategoryFallbackImage = (name: string) => {
                                    const n = (name || '').toLowerCase();
                                    if(n.includes('interior') || n.includes('architect')) return 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=200';
                                    if(n.includes('beauty') || n.includes('care')) return 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=200';
                                    if(n.includes('business') || n.includes('service')) return 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=200';
                                    if(n.includes('chemical')) return 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=200';
                                    if(n.includes('construction')) return 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=200';
                                    if(n.includes('pharma') || n.includes('drug')) return 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=200';
                                    return 'https://images.unsplash.com/photo-1586528116311-ad8ed7450849?auto=format&fit=crop&q=80&w=200';
                                };
                                const imageSrc = cat.imageUrl || getCategoryFallbackImage(cat.name);
                                
                                return (
                                <div
                                    key={cat.id}
                                    onClick={() => { updateURL({ category: cat.id, page: 1 }); setIsExploreOpen(false); }}
                                    className={`flex flex-col items-center gap-3 p-4 border rounded-2xl transition-all duration-300 cursor-pointer group ${currentCategoryId === cat.id ? 'bg-gradient-to-br from-[#164e33]/10 to-transparent border-[#164e33]/30 shadow-md ring-1 ring-[#164e33]/20' : 'bg-white border-gray-100 hover:border-[#164e33]/40 hover:shadow-lg'}`}
                                >
                                    <div className={`w-16 h-16 relative rounded-xl overflow-hidden shadow-sm flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${currentCategoryId === cat.id ? 'bg-white' : 'bg-gray-50'}`}>
                                        <img src={imageSrc} alt={cat.name} className="object-cover w-full h-full" />
                                    </div>
                                    <span className={`text-xs font-bold text-center uppercase tracking-wide leading-tight ${currentCategoryId === cat.id ? 'text-[#164e33]' : 'text-slate-700'}`}>{cat.name}</span>
                                </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Seller Type & Trust */}
                    <section className="space-y-5 pb-10">
                        <div className="flex items-center gap-3">
                           <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                           <h3 className="text-base font-bold text-slate-900 tracking-wide uppercase">Trust & Verification</h3>
                        </div>
                        <div className="space-y-4">
                            <label
                                onClick={() => updateURL({ verified: !isVerified, page: 1 })}
                                className={`flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${isVerified ? 'bg-gradient-to-r from-emerald-50 to-white border-emerald-200 shadow-md transform scale-[1.02]' : 'bg-white border-gray-200 shadow-sm hover:border-emerald-200'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-inner ${isVerified ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-slate-400'}`}>
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className={`text-sm font-bold uppercase tracking-wide mb-0.5 ${isVerified ? 'text-emerald-700' : 'text-slate-800'}`}>Verified Sellers Only</p>
                                        <p className="text-xs text-slate-500 font-semibold">Premium B2B Partners</p>
                                    </div>
                                </div>
                                <div className={`w-14 h-7 rounded-full relative transition-colors duration-300 shadow-inner ${isVerified ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${isVerified ? 'left-8' : 'left-1'}`}></div>
                                </div>
                            </label>
                        </div>
                    </section>
                </div>
            </motion.aside>

            {/* IndiaMart Style Breadcrumbs */}
            <nav className="w-full px-4 md:px-10 py-3 bg-white border-b border-gray-100">
                <ol className="flex items-center gap-2 text-base font-medium text-slate-500">
                    <li><Link href="/" className="hover:text-[#164e33]">B2B Community</Link></li>
                    <li className="text-gray-300">/</li>
                    <li><span className="text-slate-800 uppercase ">{selectedCategoryName || 'All Categories'}</span></li>
                    <li className="text-gray-300">/</li>
                    <li className="text-slate-900 font-semibold uppercase ">{searchQuery || 'Products'}</li>
                </ol>
            </nav>

            <main className="max-w-[1400px] mx-auto w-full px-4 md:px-10 py-6">
                {/* Results Metadata Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 leading-none">
                                {searchQuery || selectedCategoryName || 'Suppliers'}
                            </h1>
                            <span className="px-2.5 py-1 bg-gray-100 text-slate-700 rounded text-base font-semibold mt-1">
                                {filteredItems.length * 10}+ products available
                            </span>
                        </div>
                    </div>


                </div>

                {/* Global Filter Bar (City Strip & Price) */}
                <div className="space-y-4 mb-10">
                    {/* City Strip */}
                    <div className="flex items-center gap-4 bg-white border border-gray-200 p-3 rounded-2xl shadow-sm">
                        <button
                            onClick={() => setIsExploreOpen(true)}
                            className="whitespace-nowrap px-6 py-3 shadow border border-[#164e33]/20 bg-gradient-to-r from-white to-gray-50 hover:to-white hover:border-[#164e33]/40 text-[#164e33] rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 uppercase tracking-wide group"
                        >
                            <Filter className="w-4 h-4 transition-transform group-hover:scale-110" /> Explore
                        </button>

                        <div className="w-px h-10 bg-gray-100 mx-1"></div>

                        {/* IndiaMart Style City Input & Near Me */}
                        <div className="flex items-center gap-6 overflow-hidden">
                            <div className="flex items-center gap-4 min-w-[300px]">
                                <form className="relative flex-1 group" onSubmit={(e) => { e.preventDefault(); updateURL({ city: locationQuery, page: 1 }); }}>
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#164e33] transition-colors" />
                                    <input
                                        value={locationQuery}
                                        onChange={(e) => setLocationQuery(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-transparent focus:border-[#164e33] focus:bg-white rounded-xl text-base font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-500"
                                        placeholder="Enter City (e.g. Indore)"
                                    />
                                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <Search className="w-3.5 h-3.5 text-gray-300 hover:text-[#164e33]" />
                                    </button>
                                </form>

                                <div
                                    onClick={() => { setLocationQuery(''); updateURL({ city: '', page: 1 }); }}
                                    className={`flex items-center gap-2 cursor-pointer group whitespace-nowrap transition-all hover:scale-105 active:scale-95`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${!currentCity ? 'bg-[#164e33] text-white shadow-md' : 'bg-[#164e33]/10 text-[#164e33] group-hover:bg-[#164e33] group-hover:text-white'}`}>
                                        <Globe className="w-4 h-4" />
                                    </div>
                                    <span className={`text-base font-semibold  border-b-2 transition-all ${!currentCity ? 'text-[#164e33] border-[#164e33]' : 'text-[#164e33] border-transparent group-hover:border-[#164e33]'}`}>All India</span>
                                </div>

                                <div
                                    onClick={handleNearMe}
                                    className={`flex items-center gap-2 cursor-pointer group whitespace-nowrap transition-all ${locationLoading ? 'opacity-50' : 'hover:scale-105 active:scale-95'}`}
                                >
                                    <div className="w-8 h-8 rounded-full bg-[#164e33]/10 flex items-center justify-center group-hover:bg-[#164e33] transition-all">
                                        {locationLoading ? (
                                            <Loader2 className="w-4 h-4 animate-spin text-[#164e33] group-hover:text-white" />
                                        ) : (
                                            <MapPin className="w-4 h-4 text-[#164e33] group-hover:text-white" />
                                        )}
                                    </div>
                                    <span className="text-base font-semibold text-[#164e33]  border-b-2 border-transparent group-hover:border-[#164e33]">Near Me</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-px h-6 bg-gray-100 shrink-0"></div>

                        {/* Scrollable Popular Cities with Arrow */}
                        <div className="flex-1 relative flex items-center gap-2 overflow-hidden group/city max-w-full">
                            {/* Scroll Buttons */}
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-white via-white/90 to-transparent pr-10 pl-0 py-2 flex items-center z-10 opacity-0 group-hover/city:opacity-100 transition-opacity pointer-events-none">
                                <button
                                    onClick={() => scrollCities('left')}
                                    className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:bg-[#164e33] hover:text-white transition-all active:scale-90 pointer-events-auto shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                            </div>

                            <div
                                ref={cityScrollRef}
                                className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth px-10 w-full"
                            >
                                {[
                                    ...(currentCity && !['Indore', 'Bhopal', 'Vadodara', 'Bengaluru', 'Delhi', 'Chennai', 'Pune', 'Ahmedabad', 'Coimbatore', 'Hyderabad', 'Mumbai'].includes(currentCity) ? [currentCity] : []),
                                    'Indore', 'Bhopal', 'Vadodara', 'Bengaluru', 'Delhi', 'Chennai', 'Pune', 'Ahmedabad', 'Coimbatore', 'Hyderabad', 'Mumbai'
                                ].map(city => (
                                    <div key={city} className="relative flex items-center shrink-0">
                                        <button
                                            onClick={() => { setLocationQuery(city); updateURL({ city, page: 1 }); }}
                                            className={`whitespace-nowrap px-4 py-2 border rounded-full text-base font-semibold transition-all flex items-center gap-2 ${currentCity === city ? 'bg-[#164e33] text-white border-[#164e33] shadow-md pr-2' : 'bg-white text-slate-800 border-gray-200 hover:border-gray-400'}`}
                                        >
                                            {city}
                                            {currentCity === city && (
                                                <span
                                                    onClick={(e) => { e.stopPropagation(); updateURL({ city: '' }); setLocationQuery(''); }}
                                                    className="hover:bg-white/20 rounded-full p-1 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Scroll Button Right */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-white via-white/90 to-transparent pl-10 pr-0 py-2 flex items-center z-10 opacity-0 group-hover/city:opacity-100 transition-opacity pointer-events-none">
                                <button
                                    onClick={() => scrollCities('right')}
                                    className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:bg-[#164e33] hover:text-white transition-all active:scale-90 pointer-events-auto shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Active Chips Strip (Category & Price) - Hidden as requested */}
                    {false && (
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                            {currentCategoryId && (
                                <button
                                    onClick={() => updateURL({ category: '', page: 1 })}
                                    className="whitespace-nowrap px-4 py-2 bg-[#ff3b3b] text-white rounded-lg text-base font-semibold uppercase  transition-all shadow-sm flex items-center gap-2"
                                >
                                    {selectedCategoryName} <X className="w-3 h-3" />
                                </button>
                            )}

                            {['Below ₹600', '₹601 - ₹1,000', '₹1,001 - ₹3,000', 'Above ₹3,001'].map(range => (
                                <button
                                    key={range}
                                    onClick={() => handlePriceFilter(range)}
                                    className={`whitespace-nowrap px-4 py-2 border rounded-lg text-base font-semibold uppercase  transition-all shadow-sm flex items-center gap-2 ${currentPriceRange === range ? 'bg-[#164e33] text-white border-[#164e33]' : 'bg-white text-slate-700 border-gray-100 hover:border-[#164e33] hover:text-[#164e33]'}`}
                                >
                                    {range}
                                    {currentPriceRange === range && <X className="w-3 h-3" />}
                                </button>
                            ))}

                            <button
                                onClick={() => updateURL({ verified: !isVerified, page: 1 })}
                                className={`whitespace-nowrap px-4 py-2 border rounded-lg text-base font-semibold uppercase  transition-all shadow-sm flex items-center gap-2 ${isVerified ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-gray-100 hover:border-emerald-600 hover:text-emerald-600'}`}
                            >
                                Verified Only
                                {isVerified && <X className="w-3 h-3" />}
                            </button>
                        </div>
                    )}
                </div>
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Simple Sidebar Filters */}
                    <aside className="lg:w-64 shrink-0">
                        <div className="sticky top-24 space-y-6">
                            {/* Offering Type Filter */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h3 className="text-base font-semibold text-slate-900 mb-6 uppercase ">Offering Type</h3>
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
                                                className="accent-[#164e33] w-4 h-4 cursor-pointer"
                                            />
                                            <span className={`text-base font-medium transition-colors ${currentOfferingType === item.id ? 'text-[#164e33] font-semibold' : 'text-slate-800'}`}>{item.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h3 className="text-base font-semibold text-slate-900 mb-6 uppercase ">Categories</h3>
                                <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2">
                                    <button
                                        onClick={() => updateURL({ category: "", page: 1 })}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-base transition-all ${!currentCategoryId ? 'bg-[#164e33] text-white font-semibold' : 'text-slate-800 hover:bg-gray-50'}`}
                                    >
                                        All Categories
                                    </button>
                                    {categories.map((cat: any) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => updateURL({ category: cat.id, page: 1 })}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-base transition-all ${currentCategoryId === cat.id ? 'bg-[#164e33] text-white font-semibold' : 'text-slate-800 hover:bg-gray-50'}`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
                                <label className="flex items-center justify-between cursor-pointer group">
                                    <span className="text-base font-semibold text-slate-800">Verified Suppliers</span>
                                    <input
                                        type="checkbox"
                                        checked={isVerified}
                                        onChange={() => updateURL({ verified: !isVerified, page: 1 })}
                                        className="w-5 h-5 accent-[#164e33]"
                                    />
                                </label>

                                <div className="space-y-3 pt-4 border-t border-gray-100">
                                    <p className="text-base font-semibold text-slate-500 uppercase ">Ratings</p>
                                    {[4.5, 4.0, 3.0].map(val => (
                                        <label key={val} className="flex items-center gap-2 cursor-pointer group">
                                            <input type="radio" name="rating" className="accent-[#164e33]" />
                                            <span className="text-base text-slate-800 font-medium">{val} Stars & up</span>
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
                                <p className="text-slate-700 font-medium text-base hidden sm:block">
                                    Found <span className="font-semibold text-slate-900">
                                        {filteredItems.length}
                                    </span> results
                                </p>
                            </div>
                            <select className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-base font-semibold outline-none text-slate-800">
                                <option>Relevance</option>
                                <option>Newest</option>
                                <option>Ratings</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {loading ? (
                                [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-80 bg-white rounded-xl animate-pulse border border-gray-100"></div>)
                            ) : (
                                filteredItems.length > 0 ? (
                                    filteredItems.map((item: any) => (
                                        <ProductCard key={item.id} item={item} handleViewClick={handleViewClick} />
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-gray-100">
                                        <Layers className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-slate-900">No offers found</h3>
                                        <p className="text-base text-slate-700 mt-1">Try selecting a different filter.</p>
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
                                    className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-base font-semibold text-slate-800 disabled:opacity-50 hover:border-[#164e33] hover:text-[#164e33] transition-all"
                                >
                                    Previous
                                </button>
                                <div className="flex items-center text-base font-semibold text-slate-500">
                                    <span className="text-slate-900">{currentPage}</span> / {pagination.totalPages}
                                </div>
                                <button
                                    disabled={currentPage >= pagination.totalPages}
                                    onClick={() => updateURL({ page: currentPage + 1 })}
                                    className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-base font-semibold text-slate-800 disabled:opacity-50 hover:border-[#164e33] hover:text-[#164e33] transition-all"
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
            <div className="w-12 h-12 border-4 border-[#164e33]/20 border-t-[#164e33] rounded-full animate-spin"></div>
        </div>}>
            <SearchContent />
        </Suspense>
    );
}


