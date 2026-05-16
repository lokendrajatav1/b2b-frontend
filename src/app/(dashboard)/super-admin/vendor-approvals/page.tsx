"use client";

import React, { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import {
  Building2,
  Search,
  ShieldCheck,
  Clock,
  RefreshCcw,
  CheckCircle2,
  ChevronDown,
  FileText,
  MapPin,
  CheckCheck,
  ArrowRight,
  ShieldAlert,
  UserCheck,
  Package,
  Target,
  BarChart3,
  XCircle,
  MoreVertical,
  Mail,
  Smartphone,
  ExternalLink,
  Zap,
  Globe,
  Linkedin,
  Instagram,
  Facebook,
  ChevronRight,
  AlertCircle,
  X,
  Filter,
  Image as ImageIcon,
  Box,
  Award,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VendorVerificationQueue() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isRejectConfirmOpen, setIsRejectConfirmOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<"PENDING" | "VERIFIED" | "ALL">(
    "PENDING",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [city, setCity] = useState("All Cities");
  const [cities, setCities] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [categories, setCategories] = useState<any[]>([]);
  const [packageFilter, setPackageFilter] = useState("ALL");
  const [packages, setPackages] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState("ALL");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    verified: 0,
    rejected: 0,
  });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalEntries, setTotalEntries] = useState(0);

  useEffect(() => {
    fetchVendors();
    fetchCities();
    fetchCategories();
    fetchPackages();
  }, [
    activeTab,
    timeRange,
    customRange,
    searchQuery,
    city,
    categoryFilter,
    packageFilter,
    page,
    limit,
  ]);

  const fetchCategories = async () => {
    try {
      const data = await apiFetch("/categories");
      setCategories(data.data || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const fetchPackages = async () => {
    try {
      const data = await apiFetch("/packages");
      setPackages(data.data || []);
    } catch (err) {
      console.error("Failed to fetch packages:", err);
    }
  };

  const fetchCities = async () => {
    try {
      const data = await apiFetch("/vendors/cities");
      setCities(data.success ? data.data : []);
    } catch (error) {
      console.error("Failed to fetch cities:", error);
    }
  };

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("status", activeTab);
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (searchQuery) params.append("search", searchQuery);
      if (city !== "All Cities") params.append("city", city);
      if (categoryFilter !== "ALL") params.append("categoryId", categoryFilter);
      if (packageFilter !== "ALL") params.append("packageId", packageFilter);
      if (timeRange !== "ALL") params.append("timeRange", timeRange);
      if (timeRange === "custom" && customRange.start && customRange.end) {
        params.append("startDate", customRange.start);
        params.append("endDate", customRange.end);
      }

      const data = await apiFetch(
        `/admin/vendors/pending?${params.toString()}`,
      );
      setVendors(data.data?.vendors || []);
      setTotalEntries(data.data?.total || 0);

      const analytics = await apiFetch("/admin/analytics");
      const s = analytics.data?.summary || {};
      setStats({
        total: s.totalVendors || 0,
        pending: s.pendingVendors || 0,
        verified: s.verifiedVendors || s.vendors || 0,
        rejected: s.rejectedVendors || 0,
      });
    } catch (error) {
      console.error("Failed to fetch vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    id: string,
    action: "APPROVE" | "REJECT" | "UNVERIFY",
  ) => {
    setProcessingId(id);
    try {
      if (action === "APPROVE") {
        await apiFetch(`/admin/approve-vendor/${id}`, { method: "PATCH" });
      } else if (action === "UNVERIFY") {
        await apiFetch(`/admin/unverify-vendor/${id}`, { method: "PATCH" });
      } else {
        await apiFetch(`/admin/reject-vendor/${id}`, { method: "DELETE" });
      }
      fetchVendors();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to update vendor status:", error);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* --- UNIFIED HEADER & FILTERS --- */}
      <div className="max-w-7xl mx-auto w-full space-y-6 pb-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 capitalize tracking-tight">
              Vendor Registry
            </h1>
            <p className="text-slate-700 font-medium text-[12px] tracking-wider">
              Monitor and verify business partnerships
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchVendors}
              className="px-4 h-[42px] flex items-center gap-2 bg-white border border-gray-100 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all shadow-sm active:scale-95 font-bold text-[12px] uppercase"
            >
              <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* Unified Action Row (Search + Filters) */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-2">
          {/* Search Bar - Integrated */}
          <div className="relative group min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 group-focus-within:text-emerald-600 transition-colors" />
            <input
              type="text"
              placeholder="Search business..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-11 pr-4 h-[42px] bg-white border border-gray-100 rounded-lg text-sm font-medium text-slate-700 outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all shadow-sm placeholder:text-slate-300"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Status Selector */}
            <div className="relative group min-w-[140px]">
              <select
                value={activeTab}
                onChange={(e) => {
                  setActiveTab(e.target.value as any);
                  setPage(1);
                }}
                className="w-full pl-4 pr-10 h-[42px] bg-white border border-gray-100 rounded-lg text-sm font-medium text-slate-700 outline-none focus:border-emerald-600/50 appearance-none cursor-pointer shadow-sm transition-all"
              >
                <option value="PENDING">Pending Review</option>
                <option value="VERIFIED">Verified</option>
                <option value="REJECTED">Rejected</option>
                <option value="ALL">All Applications</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* City Selector */}
            <div className="relative group min-w-[140px]">
              <select
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-4 pr-10 h-[42px] bg-white border border-gray-100 rounded-lg text-sm font-medium text-slate-700 outline-none focus:border-emerald-600/50 appearance-none cursor-pointer shadow-sm transition-all"
              >
                <option value="All Cities">All Cities</option>
                {cities.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Category Selector */}
            <div className="relative group min-w-[140px]">
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-4 pr-10 h-[42px] bg-white border border-gray-100 rounded-lg text-sm font-medium text-slate-700 outline-none focus:border-emerald-600/50 appearance-none cursor-pointer shadow-sm transition-all"
              >
                <option value="ALL">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Package Selector */}
            <div className="relative group min-w-[140px]">
              <select
                value={packageFilter}
                onChange={(e) => {
                  setPackageFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-4 pr-10 h-[42px] bg-white border border-gray-100 rounded-lg text-sm font-medium text-slate-700 outline-none focus:border-emerald-600/50 appearance-none cursor-pointer shadow-sm transition-all"
              >
                <option value="ALL">All Packages</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Time Range Selector */}
            <div className="relative group min-w-[120px]">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Clock size={14} className="text-slate-400" />
              </div>
              <select
                value={timeRange}
                onChange={(e) => {
                  setTimeRange(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-8 h-[42px] bg-white border border-gray-100 rounded-lg text-sm font-medium text-slate-700 outline-none focus:border-emerald-600/50 appearance-none cursor-pointer shadow-sm transition-all"
              >
                <option value="ALL">Lifetime</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="weekly">7 Days</option>
                <option value="monthly">30 Days</option>
                <option value="yearly">12 Months</option>
                <option value="custom">Custom</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* --- SIMPLE CUSTOM DATE RANGE --- */}
      <AnimatePresence>
        {timeRange === "custom" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden max-w-7xl mx-auto w-full"
          >
            <div className="flex items-center gap-4 py-4 px-4 bg-white border border-gray-100 rounded-lg mb-4 shadow-sm">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-md border border-gray-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">From</span>
                <input
                  type="date"
                  className="bg-transparent text-[12px] font-medium text-slate-700 outline-none"
                  onChange={(e) => setCustomRange(prev => ({ ...prev, start: e.target.value }))}
                />
              </div>
              <div className="text-slate-300">
                <ArrowRight size={14} />
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-md border border-gray-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">To</span>
                <input
                  type="date"
                  className="bg-transparent text-[12px] font-medium text-slate-700 outline-none"
                  onChange={(e) => setCustomRange(prev => ({ ...prev, end: e.target.value }))}
                />
              </div>
              {customRange.start && customRange.end && (
                <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase">Filtered</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- STAT CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto w-full">
        <VerificationStatCard
          label="Total Applications"
          value={stats.total}
          icon={Building2}
          iconColor="text-slate-600"
          iconBg="bg-slate-100/50"
        />
        <VerificationStatCard
          label="Pending Review"
          value={stats.pending}
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-100/50"
        />
        <VerificationStatCard
          label="Verified"
          value={stats.verified}
          icon={CheckCheck}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-100/50"
        />
        <VerificationStatCard
          label="Rejected"
          value={stats.rejected}
          icon={XCircle}
          iconColor="text-rose-600"
          iconBg="bg-rose-100/50"
        />
      </div>

      {/* --- TABLE AREA --- */}
      <div className="max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto w-full no-scrollbar">
            <table className="w-full text-left whitespace-nowrap min-w-[900px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-gray-100">
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Business Identity
                  </th>
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Verification
                  </th>
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Applied On
                  </th>
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-700 uppercase tracking-wider text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  [1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td
                        colSpan={5}
                        className="px-6 py-10 h-20 bg-gray-50/5"
                      ></td>
                    </tr>
                  ))
                ) : vendors.length > 0 ? (
                  vendors.map((vendor) => (
                    <tr
                      key={vendor.id}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-slate-50 border border-gray-100 overflow-hidden flex items-center justify-center text-lg font-bold text-slate-300 shrink-0">
                            {vendor.logo || vendor.logoUrl ? (
                              <img
                                src={vendor.logo || vendor.logoUrl}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              (
                                vendor.businessName || vendor.user?.name
                              )?.charAt(0)
                            )}
                          </div>
                          <div>
                            <p className="text-sm  text-slate-900 leading-tight">
                              {vendor.businessName || vendor.user?.name}
                            </p>
                            <p className="text-[10px]  text-slate-700 uppercase tracking-widest mt-0.5">
                              GST: {vendor.gstNumber || "PENDING"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-[13px]  text-slate-700">
                          {vendor.city || "India"}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all ${
                            vendor.status === "VERIFIED"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm"
                              : vendor.status === "REJECTED"
                                ? "bg-rose-50 text-rose-600 border border-rose-100 shadow-sm"
                                : "bg-amber-50 text-amber-600 border border-amber-100 shadow-sm"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              vendor.status === "VERIFIED"
                                ? "bg-emerald-500"
                                : vendor.status === "REJECTED"
                                  ? "bg-rose-500"
                                  : "bg-amber-500 animate-pulse"
                            }`}
                          />
                          {vendor.status === "VERIFIED"
                            ? "Verified"
                            : vendor.status === "REJECTED"
                              ? "Rejected"
                              : "Pending Review"}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-[13px]  text-slate-600">
                        {new Date(vendor.createdAt).toLocaleDateString(
                          "en-GB",
                          { day: "2-digit", month: "short", year: "numeric" },
                        )}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => {
                            setSelectedVendor(vendor);
                            setIsModalOpen(true);
                          }}
                          className="px-5 py-2.5 bg-slate-900 text-white rounded-lg text-[11px] font-semibold uppercase tracking-wider hover:bg-black hover:shadow-lg transition-all active:scale-95"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-32">
                      <div className="flex flex-col items-center text-center">
                        <div className="relative mb-8">
                          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center">
                            <FileText size={40} className="text-slate-200" />
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white border border-emerald-100 rounded-full flex items-center justify-center text-emerald-500 ">
                            <CheckCircle2 size={24} />
                          </div>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mb-1">
                          All partnership applications have been reviewed.
                        </h3>
                        <p className="text-sm font-medium text-slate-600 mb-8">
                          No pending tasks at the moment.
                        </p>
                        <button
                          onClick={() => setActiveTab("VERIFIED")}
                          className="px-8 py-3.5 bg-[#06392D] text-white rounded-lg font-bold text-[14px] flex items-center gap-3   hover:bg-[#0D824D] transition-all"
                        >
                          View Verified Vendors <ArrowRight size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Numbered Pagination */}
          <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
            <p className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, totalEntries)} of {totalEntries}{" "}
              applications
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => page > 1 && setPage(page - 1)}
                disabled={page === 1 || loading}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>

              <div className="flex items-center gap-1">
                {(() => {
                  const totalPages = Math.ceil(totalEntries / limit);
                  return [...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= page - 1 && pageNum <= page + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-9 h-9 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                            page === pageNum
                              ? "bg-slate-900 text-white shadow-lg shadow-slate-200 scale-110 z-10"
                              : "bg-white border border-gray-200 text-slate-600 hover:border-slate-900 hover:text-slate-900"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (pageNum === page - 2 || pageNum === page + 2) {
                      return (
                        <span key={pageNum} className="px-1 text-slate-700">
                          ...
                        </span>
                      );
                    }
                    return null;
                  });
                })()}
              </div>

              <button
                onClick={() =>
                  page < Math.ceil(totalEntries / limit) && setPage(page + 1)
                }
                disabled={page >= Math.ceil(totalEntries / limit) || loading}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- SIDE DRAWER --- */}
      <AnimatePresence>
        {isModalOpen && selectedVendor && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[100] h-screen overflow-hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-screen w-full max-w-2xl bg-[#F8FAFC]  z-[110] flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-base font-semibold text-slate-900 uppercase tracking-tight">
                    Business Verification
                  </h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Business Header Card */}
                <div className="bg-white p-8 rounded-lg border border-gray-100  flex items-start gap-8">
                  <div className="w-24 h-24 bg-emerald-50 rounded-lg border border-emerald-100 overflow-hidden shrink-0 flex items-center justify-center text-3xl font-bold text-emerald-700 ">
                    {selectedVendor.logoUrl || selectedVendor.logo ? (
                      <img
                        src={selectedVendor.logoUrl || selectedVendor.logo}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      (
                        selectedVendor.businessName || selectedVendor.user?.name
                      )?.charAt(0)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-2xl font-semibold text-slate-900 truncate">
                        {selectedVendor.businessName ||
                          selectedVendor.user?.name}
                      </h3>
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          selectedVendor.status === "VERIFIED"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : selectedVendor.status === "REJECTED"
                              ? "bg-rose-50 text-rose-600 border border-rose-100"
                              : "bg-amber-50 text-amber-600 border border-amber-100"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            selectedVendor.status === "VERIFIED"
                              ? "bg-emerald-500"
                              : selectedVendor.status === "REJECTED"
                                ? "bg-rose-500"
                                : "bg-amber-500 animate-pulse"
                          }`}
                        />
                        {selectedVendor.status === "VERIFIED"
                          ? "Verified"
                          : selectedVendor.status === "REJECTED"
                            ? "Rejected"
                            : "Pending Review"}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="flex items-center gap-1.5 text-sm  text-slate-600">
                        <Mail size={14} /> {selectedVendor.user?.email}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm  text-slate-600">
                        <MapPin size={14} /> {selectedVendor.city || "India"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-700 uppercase  pl-1">
                        Contact Details
                      </h4>
                      <div className="space-y-3">
                        <InfoRow
                          icon={<Smartphone className="text-emerald-500" />}
                          label="Phone"
                          value={selectedVendor.phone || "Not provided"}
                        />
                        <InfoRow
                          icon={<Clock className="text-blue-500" />}
                          label="Working Hours"
                          value={
                            selectedVendor.workingHours || "9:00 AM - 6:00 PM"
                          }
                        />
                        <InfoRow
                          icon={<MapPin className="text-rose-500" />}
                          label="Address"
                          value={
                            selectedVendor.address || "Location details pending"
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-700 uppercase  pl-1">
                        Social Links
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {["LinkedIn", "Instagram", "Facebook", "Globe"].map(
                          (s, i) => (
                            <div
                              key={i}
                              className="p-3 bg-white border border-gray-100 rounded-lg flex items-center justify-between group cursor-pointer hover:border-emerald-200 transition-all"
                            >
                              <span className="text-sm font-bold text-slate-600">
                                {s}
                              </span>
                              <ExternalLink
                                size={12}
                                className="text-slate-300 group-hover:text-emerald-500"
                              />
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-700 uppercase  pl-1">
                        Legal Documents
                      </h4>
                      <div className="space-y-3">
                        <AssetRow
                          icon={<ShieldCheck className="text-emerald-500" />}
                          label="GSTIN"
                          value={selectedVendor.gstNumber || "VERIFIED"}
                        />
                        <AssetRow
                          icon={<Zap className="text-amber-500" />}
                          label="Aadhaar"
                          value={
                            selectedVendor.aadhaarNumber || "AUTHENTICATED"
                          }
                        />
                        <div className="p-4 bg-white border border-gray-100 rounded-lg flex items-center justify-between hover:border-blue-200 transition-all cursor-pointer">
                          <div className="flex items-center gap-3">
                            <FileText size={18} className="text-blue-500" />
                            <span className="text-sm font-semibold  text-slate-700">
                              Registration Doc
                            </span>
                          </div>
                          <ExternalLink size={14} className="text-slate-300" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-700 uppercase  pl-1">
                        Industry Categories
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedVendor.categories?.map((c: any) => (
                          <span
                            key={c.id}
                            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-xs font-bold uppercase"
                          >
                            {c.name}
                          </span>
                        )) || (
                          <span className="text-sm font-bold text-slate-600 italic">
                            None selected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-700 uppercase  pl-1">
                    Business Description
                  </h4>
                  <div className="p-6 bg-white rounded-lg border border-gray-100 ">
                    <p className="text-[14px] text-slate-700 font-medium leading-relaxed ">
                      "
                      {selectedVendor.description ||
                        "No business description provided by the vendor."}
                      "
                    </p>
                  </div>
                </div>

                {/* Offerings & Gallery */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Products Section */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-700 uppercase pl-1">
                      Products & Services
                    </h4>
                    <div className="space-y-2">
                      {selectedVendor.products?.length > 0 ? (
                        selectedVendor.products.map((p: any) => (
                          <div
                            key={p.id}
                            className="p-3 bg-white border border-gray-100 rounded-lg flex items-center gap-3 hover:border-emerald-200 transition-all group"
                          >
                            <div className="w-10 h-10 rounded bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden">
                              {p.images?.[0] ? (
                                <img
                                  src={p.images[0]}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Box size={16} className="text-slate-300" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate">
                                {p.name}
                              </p>
                              <p className="text-[10px] text-slate-500 uppercase font-bold">
                                {p.type} •{" "}
                                {p.price ? `₹${p.price}` : "Price on Request"}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-center">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">
                            No offerings listed
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Gallery Section */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-700 uppercase pl-1">
                      Gallery
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedVendor.gallery?.length > 0
                        ? selectedVendor.gallery.map((img: any) => (
                            <div
                              key={img.id}
                              className="aspect-square rounded-lg bg-slate-50 overflow-hidden border border-gray-100 group cursor-zoom-in"
                            >
                              <img
                                src={img.url}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                          ))
                        : [1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="aspect-square rounded-lg bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center"
                            >
                              <ImageIcon size={16} className="text-slate-200" />
                            </div>
                          ))}
                    </div>
                  </div>
                </div>

                {/* Certifications (Conditional) */}
                {selectedVendor.certifications?.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-700 uppercase pl-1">
                      Certifications
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedVendor.certifications.map((cert: any) => (
                        <div
                          key={cert.id}
                          className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg flex items-center gap-2"
                        >
                          <Award size={14} />
                          <span className="text-[11px] font-bold uppercase">
                            {cert.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Secure Action Hub */}
                <div className="pt-8 border-t border-gray-100 flex items-center gap-3 shrink-0">
                  <button
                    onClick={() =>
                      handleStatusUpdate(selectedVendor.id, "APPROVE")
                    }
                    disabled={processingId === selectedVendor.id}
                    className="flex-1 py-3.5 bg-slate-900 hover:bg-black text-white rounded-lg font-bold text-[12px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-slate-900/10"
                  >
                    <ShieldCheck size={18} className="text-emerald-400" />
                    {processingId === selectedVendor.id
                      ? "Wait..."
                      : "AUTHORIZE PARTNERSHIP"}
                  </button>
                  <button
                    onClick={() =>
                      handleStatusUpdate(selectedVendor.id, "REJECT")
                    }
                    disabled={processingId === selectedVendor.id}
                    className="px-6 py-3.5 bg-white border border-rose-100 hover:bg-rose-50 text-rose-600 rounded-lg font-bold text-[12px] uppercase flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-95"
                  >
                    <XCircle size={18} />
                    REJECT APPLICATION
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

const VerificationStatCard = ({
  label,
  value,
  icon: Icon,
  iconColor,
  iconBg,
}: any) => (
  <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
    <div>
      <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
        {label}
      </p>
      <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
    </div>
    <div
      className={`w-12 h-12 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center`}
    >
      <Icon size={20} />
    </div>
  </div>
);

const InfoRow = ({ icon, label, value }: any) => (
  <div className="p-4 bg-white border border-gray-100 rounded-lg flex items-center gap-4">
    <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-semibold text-slate-700 uppercase leading-none mb-1 tracking-wider">
        {label}
      </p>
      <p className="text-sm font-medium text-slate-900 truncate leading-tight">
        {value}
      </p>
    </div>
  </div>
);

const AssetRow = ({ icon, label, value }: any) => (
  <div className="p-4 bg-white border border-gray-100 rounded-lg flex items-center gap-4">
    <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-semibold text-slate-700 uppercase leading-none mb-1 tracking-wider">
        {label}
      </p>
      <p className="text-sm font-medium text-slate-900 truncate leading-tight">
        {value}
      </p>
    </div>
  </div>
);
