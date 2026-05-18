"use client";
import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setPriceRange,
  setSort,
  toggleRating,
  toggleVerification,
  resetFilters,
  setSearchQuery as setReduxQuery,
  setCity as setReduxCity,
  setCategory as setReduxCategory,
} from "@/redux/slices/filterSlice";
import { apiFetch } from "@/lib/api";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Search,
  Box,
  Loader2,
  Headphones,
  Handshake,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ChevronDown,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import VendorLoginModal from "@/components/VendorLoginModal";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";
import SearchFilters from "@/components/SearchFilters";
import FilterDrawer from "@/components/FilterDrawer";
import { motion, AnimatePresence } from "framer-motion";
import { slugify } from "@/lib/utils";

const FilterSection = ({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0 pb-4 mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2 text-sm font-bold text-slate-800 hover:text-[#164e33] transition-colors"
      >
        {title}{" "}
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && <div className="pt-2">{children}</div>}
    </div>
  );
};

export function SearchPageContent({
  initialQ,
  initialCity,
  initialCategoryId,
}: {
  initialQ?: string;
  initialCity?: string;
  initialCategoryId?: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const q = initialQ || searchParams.get("q") || "";
  const city = initialCity || searchParams.get("city") || "";
  const currentCategoryId =
    initialCategoryId || searchParams.get("category") || "";

  // Industry-level Cache Constants
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  const MAX_CACHE_ITEMS = 5;

  // Cache logic: get initial state from sessionStorage with TTL check
  const getInitialState = (key: string, defaultValue: any) => {
    if (typeof window === "undefined") return defaultValue;

    // Detect if this is a back/forward navigation
    const navEntries = window.performance.getEntriesByType(
      "navigation",
    ) as PerformanceNavigationTiming[];
    const isBackForward =
      navEntries.length > 0 && navEntries[0].type === "back_forward";

    // If not back/forward, don't use cache for core data
    if (!isBackForward && key === "vendors") return defaultValue;

    const cacheKey = `search_cache_${q}_${city}_${currentCategoryId}`;
    const cache = sessionStorage.getItem(cacheKey);
    if (cache) {
      const parsed = JSON.parse(cache);
      const isExpired = Date.now() - parsed.timestamp > CACHE_TTL;

      if (isExpired) {
        sessionStorage.removeItem(cacheKey);
        return defaultValue;
      }
      return parsed[key] !== undefined ? parsed[key] : defaultValue;
    }
    return defaultValue;
  };

  const dispatch = useDispatch();
  const {
    query: reduxQuery,
    city: reduxCity,
    category: reduxCategory,
  } = useSelector((state: any) => state.filter);

  const [searchInput, setSearchInput] = useState(q || "");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [targetVendor, setTargetVendor] = useState<any>(null);

  // Core search state initialized from cache
  const [vendors, setVendors] = useState<any[]>(() =>
    getInitialState("vendors", []),
  );
  const [page, setPage] = useState<number>(() => getInitialState("page", 1));
  const [batchesCount, setBatchesCount] = useState<number>(() =>
    getInitialState("batchesCount", 0),
  );
  const [hasMore, setHasMore] = useState<boolean>(() =>
    getInitialState("hasMore", true),
  );
  const [pagination, setPagination] = useState<{ total: number; totalPages: number }>(() =>
    getInitialState("pagination", { total: 0, totalPages: 1 }),
  );
  const [loading, setLoading] = useState(() => {
    if (typeof window === "undefined") return true;
    const navEntries = window.performance.getEntriesByType(
      "navigation",
    ) as PerformanceNavigationTiming[];
    const isBackForward =
      navEntries.length > 0 && navEntries[0].type === "back_forward";

    const cacheKey = `search_cache_${q}_${city}_${currentCategoryId}`;
    const cache = sessionStorage.getItem(cacheKey);

    // If back button and cache exists, show instantly (loading = false)
    if (isBackForward && cache) {
      const parsed = JSON.parse(cache);
      if (Date.now() - parsed.timestamp < CACHE_TTL) return false;
    }

    return true;
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [limit, setLimit] = useState(24);
  const [locationQuery, setLocationQuery] = useState(city);

  const categoryName = useMemo(() => {
    if (!currentCategoryId) return null;
    const cat = categories.find(
      (c: any) => c.slug === currentCategoryId || c.id === currentCategoryId,
    );
    return cat ? cat.name : null;
  }, [currentCategoryId, categories]);

  // Sync with Redux on mount or when params change
  useEffect(() => {
    if (q) dispatch(setReduxQuery(q));
    if (city) dispatch(setReduxCity(city));
  }, [q, city, dispatch]);

  // Sync Category Name if we have vendors/categories
  useEffect(() => {
    if (!reduxCategory.name && currentCategoryId && categories.length > 0) {
      const found = categories.find(
        (c) => String(c.id) === String(currentCategoryId),
      );
      if (found) {
        dispatch(setReduxCategory({ id: found.id, name: found.name }));
      }
    }
  }, [currentCategoryId, categories, reduxCategory.name, dispatch]);

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const observerTarget = React.useRef<HTMLDivElement>(null);
  const isRevalidating = React.useRef(false);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo =
        direction === "left" ? scrollLeft - 300 : scrollLeft + 300;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  // Save results to cache with LRU cleanup
  useEffect(() => {
    if (typeof window !== "undefined" && (vendors.length > 0 || !loading)) {
      const cacheKey = `search_cache_${q}_${city}_${currentCategoryId}`;

      // LRU Cleanup: keep only 5 recent search states
      const allCacheKeys = Object.keys(sessionStorage).filter((k) =>
        k.startsWith("search_cache_"),
      );
      if (
        allCacheKeys.length >= MAX_CACHE_ITEMS &&
        !allCacheKeys.includes(cacheKey)
      ) {
        // Remove oldest one
        sessionStorage.removeItem(allCacheKeys[0]);
      }

      sessionStorage.setItem(
        cacheKey,
        JSON.stringify({
          vendors,
          page,
          batchesCount,
          hasMore,
          pagination,
          timestamp: Date.now(),
        }),
      );
    }
  }, [
    vendors,
    page,
    batchesCount,
    hasMore,
    pagination,
    q,
    city,
    currentCategoryId,
    loading,
  ]);

  // Scroll restoration
  useEffect(() => {
    if (!loading && vendors.length > 0) {
      const scrollKey = `scroll_${q}_${city}_${currentCategoryId}`;
      const savedScroll = sessionStorage.getItem(scrollKey);
      if (savedScroll) {
        setTimeout(() => {
          window.scrollTo({ top: parseInt(savedScroll), behavior: "instant" });
        }, 100);
      }
    }
  }, [loading, q, city, currentCategoryId]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        const scrollKey = `scroll_${q}_${city}_${currentCategoryId}`;
        sessionStorage.setItem(scrollKey, window.scrollY.toString());
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [q, city, currentCategoryId]);

  useEffect(() => {
    setLocationQuery(city);
  }, [city]);

  useEffect(() => {
    const updateLimit = () => {
      setLimit(window.innerWidth < 768 ? 12 : 24);
    };
    updateLimit();
    window.addEventListener("resize", updateLimit);
    return () => window.removeEventListener("resize", updateLimit);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await apiFetch("/vendors/categories");
      if (data.success) setCategories(data.data || []);
    };
    fetchCategories();
  }, []);

  const fetchVendors = async (
    pageNum: number,
    isNewSearch: boolean = false,
    isSilent: boolean = false,
  ) => {
    if (isNewSearch && !isSilent) {
      setLoading(true);
      setBatchesCount(0);
      setPage(1);
    } else if (!isSilent) {
      setIsFetchingMore(true);
    }

    try {
      const query = new URLSearchParams({
        ...(currentCategoryId && { categoryId: currentCategoryId }),
        ...(city && { city: city }),
        ...(q && { search: q }),
        page: pageNum.toString(),
        limit: limit.toString(),
      });

      const data = await apiFetch(`/vendors?${query.toString()}`);
      const newVendors = Array.isArray(data.data.vendors)
        ? data.data.vendors
        : [];

      if (isNewSearch) {
        setVendors(newVendors);
      } else {
        setVendors((prev) => [...prev, ...newVendors]);
        setBatchesCount((prev) => prev + 1);
      }

      setHasMore(pageNum < (data.data.totalPages || 1));
      setPagination({
        total: data.data.total || 0,
        totalPages: data.data.totalPages || 1,
      });

      if (pageNum > 1) {
        const params = new URLSearchParams(window.location.search);
        params.set("page", pageNum.toString());
        window.history.replaceState(
          null,
          "",
          `${window.location.pathname}?${params.toString()}`,
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  // Stale-While-Revalidate Implementation
  useEffect(() => {
    const cacheKey = `search_cache_${q}_${city}_${currentCategoryId}`;
    const cache =
      typeof window !== "undefined" ? sessionStorage.getItem(cacheKey) : null;

    // Only consider cache if it was a back/forward navigation
    const navEntries =
      typeof window !== "undefined"
        ? (window.performance.getEntriesByType(
            "navigation",
          ) as PerformanceNavigationTiming[])
        : [];
    const isBackForward =
      navEntries.length > 0 && navEntries[0].type === "back_forward";

    if (isBackForward && cache && vendors.length > 0) {
      setLoading(false);
      // Silent Revalidation: Refresh data in background without showing spinner
      if (!isRevalidating.current) {
        isRevalidating.current = true;
        fetchVendors(1, true, true).finally(() => {
          isRevalidating.current = false;
        });
      }
    } else {
      fetchVendors(1, true);
    }
  }, [q, city, currentCategoryId, limit]); // Re-fetch on filter change or limit change

  // Intersection Observer for Auto-load
  useEffect(() => {
    if (loading || isFetchingMore || !hasMore || batchesCount >= 3) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingMore && !loading && hasMore) {
          const nextPage = page + 1;
          // Only increment if we aren't already fetching
          setPage(nextPage);
          fetchVendors(nextPage);
        }
      },
      { threshold: 0.1, rootMargin: "200px" }, // Reduced margin to be safer
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loading, isFetchingMore, hasMore, batchesCount, page]);

  const handleLoadMore = () => {
    if (isFetchingMore || loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchVendors(nextPage);
  };

  const updateURL = (newParams: any) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, value.toString());
    });
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSearch = () => {
    updateURL({ q: searchInput });
  };

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
    if (type === "CALL") {
      /* Handle call logic */
    } else router.push(`/product/${id}`);
  };

  const filteredItems = useMemo(() => {
    return vendors.flatMap((v: any) =>
      (v.products || [])
        .filter((p: any) => {
          if (p.status !== "APPROVED") return false;

          const priceRange = searchParams.get("priceRange");
          if (priceRange) {
            const [min, max] = priceRange
              .split("-")
              .map((v) => (v === "max" ? Infinity : parseInt(v)));
            const price = p.price || 0;
            if (price < min || price > max) return false;
          }

          const automation = searchParams.get("automation");
          if (automation) {
            const activeGrades = automation.split(",");
            if (!p.automationGrade || !activeGrades.includes(p.automationGrade))
              return false;
          }

          if (
            searchParams.get("highTurnover") === "true" &&
            v.annualTurnover !== "5Cr+"
          )
            return false;
          if (searchParams.get("gst3yr") === "true" && !v.isGstOld)
            return false;

          const selectedCatId = searchParams.get("category");
          if (selectedCatId) {
            const selectedCat = categories.find((c) => c.id === selectedCatId);
            const matchesId = p.categoryId === selectedCatId;
            const matchesName =
              selectedCat &&
              (p.category === selectedCat.name ||
                p.category?.name === selectedCat.name);
            if (!matchesId && !matchesName) return false;
          }
          return true;
        })
        .map((p: any) => ({ ...p, vendor: v })),
    );
  }, [vendors, searchParams, categories]);

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-sans antialiased text-slate-900 pt-20">
      <VendorLoginModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        vendor={targetVendor}
      />

      {/* --- Explore Drawer --- */}
      <AnimatePresence></AnimatePresence>

      {/* --- Unified Search Filters Bar --- */}
      <SearchFilters
        categoryName={categoryName}
        q={q}
        city={city}
        listingsCount={filteredItems.length}
        onReset={() => {
          dispatch(resetFilters());
          updateURL({ city: "", category: "", q: "", priceRange: "", ratings: "", verified: "", trustSeal: "", gst: "" });
        }}
      />

      <FilterDrawer />

      {/* --- Main Content Section --- */}
      <main className={`max-w-[1800px] mx-auto px-4 lg:px-12 pt-6 ${filteredItems.length > 0 ? "pb-8" : "pb-0"}`}>
        {/* --- Main Product Grid --- */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(limit)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item: any, idx: number) => (
                    <ProductCard
                      key={`${item.id}-${idx}`}
                      item={item}
                      handleViewClick={handleViewClick}
                      isPriority={idx < 8}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-8 text-center bg-white rounded-lg border border-gray-100 flex flex-col items-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-3 text-slate-200">
                      <Search size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                      No items found
                    </h3>
                    <p className="text-slate-400 font-medium max-w-sm mx-auto text-sm">
                      We couldn't find any products matching your criteria. Try
                      adjusting your location or filters.
                    </p>
                    <button
                      onClick={() => {
                        dispatch(resetFilters());
                        updateURL({ city: "", category: "", q: "", priceRange: "", ratings: "", verified: "", trustSeal: "", gst: "" });
                      }}
                      className="mt-4 px-10 py-3 bg-[#164e33] text-white rounded-lg font-bold text-sm shadow-lg shadow-emerald-900/10"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>

              {/* Loader Sentinel & Load More */}
              {filteredItems.length > 0 && (
                <div className="mt-12 flex flex-col items-center gap-6">
                  {isFetchingMore && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
                      {[...Array(3)].map((_, i) => (
                        <ProductSkeleton key={`more-${i}`} />
                      ))}
                    </div>
                  )}

                  <div ref={observerTarget} className="h-10 w-full" />

                  {hasMore && batchesCount >= 3 && !isFetchingMore && (
                    <button
                      onClick={handleLoadMore}
                      className="px-12 py-4 bg-white border-2 border-[#164e33] text-[#164e33] hover:bg-[#164e33] hover:text-white rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 flex items-center gap-2"
                    >
                      <Sparkles size={16} /> Load More Products
                    </button>
                  )}

                  {!hasMore && filteredItems.length > 0 && (
                    <div className="py-8 flex flex-col items-center gap-2 text-slate-400">
                      <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      </div>
                      <p className="text-sm font-medium tracking-wide uppercase">
                        You've reached the end
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* --- Footer Feature Bar --- */}
      <div className="bg-white border-t border-gray-100 mt-2">
        <div className="max-w-[1500px] mx-auto px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "Verified Vendors",
                desc: "Quality checked partners",
              },
              { icon: Box, title: "Wide Range", desc: "1000+ products listed" },
              {
                icon: Handshake,
                title: "Reliable B2B",
                desc: "India's trusted community",
              },
              {
                icon: Headphones,
                title: "Support",
                desc: "Dedicated help center",
              },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="bg-slate-50 p-4 rounded-lg text-slate-400">
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
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <Loader2 className="animate-spin text-[#164e33]" size={48} />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
