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
  ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import VendorLoginModal from '@/components/VendorLoginModal';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [targetVendor, setTargetVendor] = useState<any>(null);

  const initialCategory = searchParams.get('category') || '';
  const initialQuery = searchParams.get('q') || '';
  const initialCity = searchParams.get('city') || '';
  const initialVerified = searchParams.get('verified') === 'true';
  const initialOfferingType = searchParams.get('offeringType') || '';
  
  const [vendors, setVendors] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: initialCategory,
    city: initialCity,
    verified: initialVerified,
    offeringType: initialOfferingType,
    page: parseInt(searchParams.get('page') || '1')
  });

  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1
  });

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [locationQuery, setLocationQuery] = useState(initialCity);

  const handleSearchTrigger = () => {
    setFilters({ ...filters, city: locationQuery, page: 1 });
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
        if (!initialCity) {
            try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                if (data.city) {
                    setLocationQuery(data.city);
                    setFilters(prev => ({ ...prev, city: data.city }));
                }
            } catch (error) {
                console.warn('IP Location detection failed:', error);
            }
        }
    };

    fetchCategories();
    detectLocation();
  }, []);

  // Update URL search parameters
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (filters.category) params.set('category', filters.category);
    if (filters.city) params.set('city', filters.city);
    if (filters.verified) params.set('verified', 'true');
    if (filters.offeringType) params.set('offeringType', filters.offeringType);
    if (filters.page > 1) params.set('page', filters.page.toString());

    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ''}`, { scroll: false });
  }, [filters, searchQuery, pathname, router]);

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          ...(filters.category && { categoryId: filters.category }),
          ...(filters.city && { city: filters.city }),
          ...(filters.verified && { verified: 'true' }),
          ...(filters.offeringType && { offeringType: filters.offeringType }),
          ...(searchQuery && { search: searchQuery }),
          page: filters.page.toString(),
          limit: '12'
        });
        
        const data = await apiFetch(`/vendors?${query.toString()}`);
        setVendors(Array.isArray(data.data.vendors) ? data.data.vendors : []);
        setPagination({
            total: data.data.total || 0,
            totalPages: data.data.totalPages || 1
        });
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [filters, searchQuery]);

  // Compute final frontend items
  const selectedCategoryName = categories.find((c: any) => c.id === filters.category)?.name;
  const filteredItems = vendors.flatMap((v: any) => (v.products || [])
      .filter((p: any) => p.status === 'APPROVED') 
      .filter((p: any) => !filters.offeringType || p.type === filters.offeringType)
      .filter((p: any) => !selectedCategoryName || p.category === selectedCategoryName)
      .map((p: any) => ({ ...p, vendor: v }))
  );
  const handleViewClick = (e: React.MouseEvent, type: 'PRODUCT' | 'SUPPLIER', id: string, vendor: any) => {
    if (!user) {
      e.preventDefault();
      setTargetVendor(vendor);
      setAuthModalOpen(true);
      return;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <VendorLoginModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        vendor={targetVendor} 
        onSuccess={() => setAuthModalOpen(false)} 
      />
      {/* Full-Width Search Header */}
      <div className="bg-[#05252e] pt-24 pb-32">
        <div className="w-full px-4 md:px-10">
            <div className="max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-semibold text-white mb-6">Find verified suppliers</h1>
                
                <div className="bg-white p-2 rounded-xl shadow-lg flex flex-col md:flex-row gap-2">
                    <div className="flex-1 flex items-center px-4 border-b md:border-b-0 md:border-r border-gray-100 py-3 md:py-0">
                        <Search className="w-5 h-5 text-gray-400 mr-3" />
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearchTrigger()}
                            placeholder="Product or service..." 
                            className="bg-transparent w-full outline-none font-medium text-gray-800"
                        />
                    </div>
                    <div className="flex-1 flex items-center px-4 py-3 md:py-0">
                        <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                        <input 
                            type="text" 
                            value={locationQuery}
                            onChange={(e) => setLocationQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearchTrigger()}
                            placeholder="Location..." 
                            className="bg-transparent w-full outline-none font-medium text-gray-800"
                        />
                    </div>
                    <button 
                        onClick={handleSearchTrigger}
                        className="bg-[#007367] hover:bg-[#005e54] text-white px-8 py-3.5 rounded-lg font-semibold transition-all"
                    >
                        Search
                    </button>
                </div>
            </div>
        </div>
      </div>

      <main className="w-full px-4 md:px-10 py-12">
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
                                     checked={filters.offeringType === item.id}
                                     onChange={() => setFilters({...filters, offeringType: item.id})}
                                     className="accent-[#007367] w-4 h-4 cursor-pointer"
                                 />
                                 <span className={`text-sm font-medium transition-colors ${filters.offeringType === item.id ? 'text-[#007367] font-semibold' : 'text-gray-600'}`}>{item.label}</span>
                              </label>
                           ))}
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-6 uppercase tracking-wider">Categories</h3>
                        <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2">
                              <button 
                                 onClick={() => setFilters({...filters, category: ""})}
                                 className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${!filters.category ? 'bg-[#007367] text-white font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                              >
                                 All Categories
                              </button>
                           {categories.map((cat: any) => (
                              <button 
                                 key={cat.id}
                                 onClick={() => setFilters({...filters, category: cat.id})}
                                 className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${filters.category === cat.id ? 'bg-[#007367] text-white font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
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
                               checked={filters.verified}
                               onChange={() => setFilters({...filters, verified: !filters.verified})}
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
                        (() => {
                            return filteredItems.length > 0 ? filteredItems.map((item: any, idx) => (
                                <div key={item.id || idx} className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col hover:border-[#007367] transition-all group shadow-sm hover:shadow-lg">
                                    <div className="h-44 w-full relative bg-gray-50 overflow-hidden border-b border-gray-100 group-hover:border-[#007367]/20 transition-colors">
                                        {item.imageUrl ? (
                                            <Image src={item.imageUrl} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-50">
                                                <Layers className="w-10 h-10 mb-2 opacity-50" />
                                                <span className="text-xs font-medium">No Image</span>
                                            </div>
                                        )}
                                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-[#007367] px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm z-10 border border-[#007367]/10">
                                            {item.category || item.type}
                                        </div>
                                    </div>

                                    <div className="p-4 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-2 gap-2">
                                            <h2 className="text-base font-bold text-gray-900 group-hover:text-[#007367] transition-colors line-clamp-2 leading-tight flex-1">{item.name}</h2>
                                            {item.price > 0 && (
                                                <span className="text-sm font-black text-[#007367] bg-[#007367]/10 px-2 py-1 rounded-lg">₹{item.price}</span>
                                            )}
                                        </div>
                                        <p className="text-gray-500 text-xs mt-1 mb-4 line-clamp-2 font-medium leading-relaxed">
                                            {item.description || `High-quality ${item.type.toLowerCase()} offered by verified seller. Minimum order quantity: ${item.moq || 1}.`}
                                        </p>
                                        
                                        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                            <div className="flex items-center gap-2 max-w-[60%]">
                                                <div className="w-8 h-8 rounded-lg bg-[#007367]/10 flex items-center justify-center text-[#007367] font-bold text-xs shrink-0 overflow-hidden">
                                                    {item.vendor.logoUrl ? (
                                                        <img src={item.vendor.logoUrl} alt={item.vendor.businessName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        item.vendor.businessName.charAt(0)
                                                    )}
                                                </div>
                                                <div className="flex flex-col overflow-hidden">
                                                    <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Supplied by</span>
                                                    <Link 
                                                        href={`/supplier/${item.vendor.id}`} 
                                                        onClick={(e) => handleViewClick(e, 'SUPPLIER', item.vendor.id, item.vendor)}
                                                        className="text-xs font-bold text-gray-800 line-clamp-1 truncate hover:text-[#007367] transition-colors"
                                                    >
                                                        {item.vendor.businessName}
                                                    </Link>
                                                </div>
                                            </div>
                                            <Link 
                                                href={`/product/${item.id}`} 
                                                onClick={(e) => handleViewClick(e, 'PRODUCT', item.id, item.vendor)}
                                                className="px-3 py-1.5 bg-gray-50 group-hover:bg-[#007367]/10 text-gray-700 group-hover:text-[#007367] rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border border-gray-200 group-hover:border-[#007367]/20 flex items-center gap-1"
                                            >
                                                View <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-gray-100">
                                    <Layers className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-gray-900">No offers found</h3>
                                    <p className="text-sm text-gray-500 mt-1">Try selecting a different filter.</p>
                                </div>
                            );
                        })()
                    )}
                </div>

                {/* Scalable Pagination Controls (Added to fix 'missing' logic) */}
                {pagination.totalPages > 1 && (
                    <div className="flex justify-center gap-3 mt-12 py-6 border-t border-gray-100">
                        <button 
                            disabled={filters.page <= 1}
                            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                            className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 disabled:opacity-50 hover:border-[#007367] hover:text-[#007367] transition-all"
                        >
                            Previous
                        </button>
                        <div className="flex items-center text-sm font-bold text-gray-400">
                           <span className="text-gray-900">{filters.page}</span> / {pagination.totalPages}
                        </div>
                        <button 
                            disabled={filters.page >= pagination.totalPages}
                            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
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
