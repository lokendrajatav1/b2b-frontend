"use client";

import React, { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import {
  Users,
  Store,
  Box,
  Send,
  ShieldCheck,
  Calendar,
  ChevronDown,
  CheckCircle2,
  TrendingUp,
  BarChart2,
  Clock,
  Bell,
  Layers,
  UserCheck,
  Package,
  BookOpen,
  Undo2,
  Settings,
  Headset,
  ArrowUpRight,
  RefreshCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";

export default function SuperAdminDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("monthly");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState("07:10 PM");

  useEffect(() => {
    fetchDashboardStats();
    fetchCategories();
    const now = new Date();
    setLastUpdated(
      now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    );
  }, [timeRange, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const data = await apiFetch("/vendors/categories");
      setCategories(data.success ? data.data : []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      let url = `/admin/analytics?timeRange=${timeRange}`;
      if (timeRange === "custom" && customRange.start && customRange.end) {
        url += `&startDate=${customRange.start}&endDate=${customRange.end}`;
      }
      if (selectedCategory !== "All") {
        url += `&category=${selectedCategory}`;
      }
      const data = await apiFetch(url);
      setDashboardData(data.data || {});
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Title and Date Filter */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <h2 className="text-base font-bold text-[#111827] leading-none">
              Super Admin Control Hub
            </h2>
            <ShieldCheck size={16} className="text-green-500" />
          </div>
          <p className="text-xs text-gray-900 font-bold">
            Monitor platform health, verify applications, and track marketplace
            performance.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-1.5 shadow-sm">
              <Calendar size={14} className="text-gray-500" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="text-xs font-bold text-gray-900 outline-none bg-transparent cursor-pointer"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="weekly">Last 7 Days</option>
                <option value="monthly">Last 30 Days</option>
                <option value="yearly">Last 12 Months</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            <button
              onClick={fetchDashboardStats}
              className="p-2.5 bg-white border border-gray-300 rounded-lg text-black hover:text-[#0D824D] hover:border-[#0D824D] transition-all shadow-sm"
              title="Refresh Data"
            >
              <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          {/* Custom Date Range Sub-row */}
          <AnimatePresence>
            {timeRange === "custom" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-3 bg-slate-50 rounded-lg px-4 py-3 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <Clock size={13} className="text-slate-400 shrink-0" />
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
                      Custom Range:
                    </span>
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <input
                      type="date"
                      className="flex-1 md:flex-none bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[11px] font-bold text-slate-700 outline-none focus:border-emerald-400 transition-all shadow-sm cursor-pointer"
                      onChange={(e) =>
                        setCustomRange((prev) => ({
                          ...prev,
                          start: e.target.value,
                        }))
                      }
                    />
                    <span className="text-[11px] font-bold text-slate-400">
                      →
                    </span>
                    <input
                      type="date"
                      className="flex-1 md:flex-none bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[11px] font-bold text-slate-700 outline-none focus:border-emerald-400 transition-all shadow-sm cursor-pointer"
                      onChange={(e) =>
                        setCustomRange((prev) => ({
                          ...prev,
                          end: e.target.value,
                        }))
                      }
                    />
                  </div>
                  {customRange.start && customRange.end && (
                    <span className="md:ml-auto text-center md:text-left text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 shrink-0">
                      Range Active
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="TOTAL USERS"
          value={dashboardData?.summary?.totalUsers || "0"}
          growth="+12.5%"
          color="#0D824D"
          icon={<Users size={24} />}
          bg="#F0FDF4"
          delay={0}
        />
        <StatCard
          label="VERIFIED VENDORS"
          value={dashboardData?.summary?.totalVendors || "0"}
          growth="+8.2%"
          color="#EA580C"
          icon={<Store size={24} />}
          bg="#FFF7ED"
          delay={0.1}
        />
        <StatCard
          label="TOTAL OFFERINGS"
          value={dashboardData?.summary?.totalProducts || "0"}
          growth="+15.3%"
          color="#2563EB"
          icon={<Box size={24} />}
          bg="#EFF6FF"
          delay={0.2}
        />
        <StatCard
          label="BUSINESS LEADS"
          value={dashboardData?.summary?.totalLeads || "0"}
          growth="+9.7%"
          color="#9333EA"
          icon={<Send size={24} />}
          bg="#FAF5FF"
          delay={0.3}
        />
      </div>

      {/* Main Grid: Revenue & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Chart Placeholder */}
        <div className="lg:col-span-8 bg-white rounded-lg border border-gray-100 p-6 ">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-sm text-gray-900 mb-0.5">
                Revenue Growth
              </h3>
              <p className="text-xs text-gray-900 font-bold">
                Subscription and listing performance analysis.
              </p>
            </div>
            <select className="bg-gray-50 border border-gray-200 text-xs font-bold rounded-lg px-2 py-1.5 outline-none">
              <option>Monthly View</option>
            </select>
          </div>

          <div className="flex flex-col xl:flex-row gap-8">
            {/* Fake Graph Area */}
            <div className="flex-1 min-h-[300px] flex flex-col">
              <div className="flex-1 flex gap-4">
                {/* Y-Axis Labels */}
                <div className="flex flex-col justify-between text-[10px] font-bold text-slate-400 py-2 shrink-0">
                  <span>₹20L</span>
                  <span>₹15L</span>
                  <span>₹10L</span>
                  <span>₹5L</span>
                  <span>₹0</span>
                </div>
                {/* Chart Visualization */}
                <div className="flex-1 relative border-b border-l border-gray-100 flex items-end">
                  <svg
                    className="absolute inset-0 w-full h-full"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,200 L100,150 L200,140 L300,135 L400,100 L500,50 L600,60"
                      fill="none"
                      stroke="#0D824D"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="600" cy="60" r="6" fill="#0D824D" />
                    <circle
                      cx="600"
                      cy="60"
                      r="10"
                      stroke="#0D824D"
                      strokeWidth="2"
                      fill="none"
                      className="animate-ping"
                    />
                  </svg>
                </div>
              </div>
              {/* X-Axis Labels */}
              <div className="flex justify-between pl-10 pr-2 mt-4">
                {["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => (
                  <span
                    key={m}
                    className="text-[10px] font-bold text-slate-500 uppercase tracking-wider"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Revenue Stats */}
            <div className="w-full xl:w-64 grid grid-cols-1 sm:grid-cols-3 xl:flex xl:flex-col gap-6 xl:border-l xl:border-gray-100 xl:pl-8 pt-6 xl:pt-0 border-t xl:border-t-0 border-gray-50">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Gross Revenue
                </p>
                <p className="text-xl font-bold text-slate-900 leading-none">
                  ₹
                  {dashboardData?.summary?.totalRevenue?.toLocaleString() ||
                    "0"}
                </p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    +16.4%
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    vs last period
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Premium Plans
                </p>
                <p className="text-lg font-bold text-slate-900 leading-none">
                  ₹11,20,430
                </p>
                <span className="inline-block text-[10px] font-bold text-emerald-600 mt-1">
                  +12.6%
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Catalogue Fees
                </p>
                <p className="text-lg font-bold text-slate-900 leading-none">
                  ₹7,55,000
                </p>
                <span className="inline-block text-[10px] font-bold text-emerald-600 mt-1">
                  +21.3%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-4 bg-white rounded-lg border border-gray-100 p-6  flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-sm text-gray-900">Recent Activity</h3>
            <button className="text-xs font-bold bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg">
              View All
            </button>
          </div>
          <div className="space-y-6 flex-1 overflow-y-auto max-h-[400px] no-scrollbar">
            {dashboardData?.recentLeads?.length > 0 ? (
              dashboardData.recentLeads
                .slice(0, 5)
                .map((lead: any, i: number) => (
                  <ActivityItem
                    key={i}
                    title={`New inquiry for ${lead.productName || "Offering"}`}
                    sub={lead.buyerName || "Unknown Prospect"}
                    time={new Date(lead.createdAt).toLocaleDateString()}
                  />
                ))
            ) : (
              <p className="text-xs text-black font-bold text-center py-10 opacity-40">
                No active engagement found.
              </p>
            )}
          </div>
          <button className="w-full mt-6 py-2.5 border border-dashed border-gray-300 rounded-lg text-xs font-bold text-black hover:bg-gray-50 transition-colors">
            Generate Activity Report
          </button>
        </div>
      </div>

      {/* Footer Row Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-lg border border-gray-100 min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-[14px] text-gray-900 uppercase">
              Top Vendor Locations
            </h4>
            <BarChart2 size={18} className="text-gray-400" />
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dashboardData?.trends?.topLocations || []}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: "#64748b" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: "#64748b" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                  labelStyle={{ fontWeight: 800, color: "#1e293b" }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#EA580C"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#EA580C" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg border border-gray-100 min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col gap-1">
              <h4 className="font-bold text-[14px] text-gray-900 uppercase">
                Sector Performance
              </h4>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-[10px] font-bold text-gray-500 bg-gray-50 border-none outline-none rounded-md px-2 py-0.5"
              >
                <option value="All">All Sectors</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <TrendingUp size={18} className="text-gray-400" />
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={dashboardData?.trends?.revenueTrends || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D824D" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#0D824D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: "#64748b" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: "#64748b" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                  labelStyle={{ fontWeight: 800, color: "#1e293b" }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0D824D"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg border border-gray-100 lg:col-span-2">
          <h4 className="font-bold text-[14px] text-gray-900 uppercase mb-6">
            Vendor Verification
          </h4>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-[12px] border-slate-100 relative">
                <div
                  className="absolute inset-0 rounded-full border-[12px] border-emerald-500 border-t-transparent border-r-transparent -rotate-45"
                  style={{
                    clipPath:
                      "polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 0)",
                  }}
                ></div>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter leading-none">
                  Total
                </span>
                <span className="text-lg font-bold text-slate-900 leading-none">
                  {dashboardData?.summary?.totalVendors || 0}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-12 gap-y-6 flex-1 w-full">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-100" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Verified
                  </span>
                </div>
                <p className="text-xl font-bold text-slate-900 ml-5">
                  {dashboardData?.summary?.verifiedVendors || 0}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-100" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Pending
                  </span>
                </div>
                <p className="text-xl font-bold text-slate-900 ml-5">
                  {dashboardData?.summary?.pendingVendors || 0}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-100" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Rejected
                  </span>
                </div>
                <p className="text-xl font-bold text-slate-900 ml-5">
                  {dashboardData?.summary?.rejectedVendors || 0}
                </p>
              </div>

              <div className="space-y-1 pt-4 border-t border-gray-50 col-span-full">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Verification Status
                  </span>
                  <span className="text-[10px] font-bold text-slate-900">
                    100% Tracking
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-2">
                  <div className="flex h-full">
                    <div
                      className="h-full bg-emerald-500"
                      style={{
                        width: `${((dashboardData?.summary?.verifiedVendors || 0) / (dashboardData?.summary?.totalVendors || 1)) * 100}%`,
                      }}
                    />
                    <div
                      className="h-full bg-amber-500"
                      style={{
                        width: `${((dashboardData?.summary?.pendingVendors || 0) / (dashboardData?.summary?.totalVendors || 1)) * 100}%`,
                      }}
                    />
                    <div
                      className="h-full bg-rose-500"
                      style={{
                        width: `${((dashboardData?.summary?.rejectedVendors || 0) / (dashboardData?.summary?.totalVendors || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

const StatCard = ({ label, value, growth, color, icon, bg, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white p-8 rounded-lg border border-gray-100  relative overflow-hidden group hover: transition-all"
  >
    <div className="flex items-center justify-between mb-3">
      <div style={{ backgroundColor: bg }} className="p-2.5 rounded-lg">
        {React.cloneElement(icon as React.ReactElement<any>, {
          size: 16,
          style: { color },
        })}
      </div>
      <div className="text-right">
        <p className="text-xs font-bold text-black uppercase mb-0.5">{label}</p>
        <p className="text-base font-bold text-black leading-none">{value}</p>
      </div>
    </div>
    <div className="flex items-center gap-1.5">
      <span style={{ color: color }} className="text-xs font-bold">
        {growth}
      </span>
      <span className="text-xs text-black font-bold uppercase tracking-tighter">
        vs last 30d
      </span>
    </div>
    {/* Animated Sparkline Style SVG */}
    <div className="mt-6 h-12 w-full overflow-hidden opacity-20">
      <svg
        viewBox="0 0 100 20"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: delay + 0.5 }}
          d="M0,15 Q15,5 30,12 T60,10 T100,5"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  </motion.div>
);

const ActivityItem = ({ title, sub, time }: any) => (
  <div className="flex items-start gap-4 group cursor-pointer border-b border-gray-50 pb-4 last:border-0 last:pb-0">
    <div className="flex-1">
      <p className="text-sm font-bold text-black leading-tight mb-1 group-hover:text-[#0D824D] transition-colors">
        {title}
      </p>
      <div className="flex items-center gap-2">
        <p className="text-xs text-gray-500 font-bold">{sub}</p>
        <span className="w-1 h-1 rounded-full bg-gray-300" />
        <span className="text-xs text-gray-400 font-bold uppercase">
          {time}
        </span>
      </div>
    </div>
  </div>
);

const FooterWidget = ({ title, value, subtitle, color }: any) => (
  <div className="bg-white p-8 rounded-lg border border-gray-100  hover: transition-all">
    <div className="flex justify-between mb-6">
      <h4 className="font-bold text-[14px] text-gray-900 uppercase leading-tight pr-4">
        {title}
      </h4>
      <ArrowUpRight
        size={18}
        className="text-gray-500 cursor-pointer hover:text-blue-500 transition-colors"
      />
    </div>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
        <TrendingUp size={20} className="text-gray-500" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-bold text-gray-600 truncate max-w-[100px]">
            {subtitle || "Monthly Avg"}
          </span>
          <span className="text-xs font-bold text-gray-800">{value}</span>
        </div>
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `75%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className={`h-full ${color}`}
          />
        </div>
      </div>
    </div>
  </div>
);
