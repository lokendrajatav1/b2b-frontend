"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Target,
  Users,
  Settings,
  Globe,
  LogOut,
  Briefcase,
  CreditCard,
  BarChart3,
  ChevronRight,
  Bell,
  Menu,
  X,
  Package,
  Layers,
  Building2,
  Lock,
  ArrowRight,
  History,
  Headphones,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function DashboardSidebar({
  isCollapsed,
  onToggle,
  mobileOpen,
  setMobileOpen,
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [userRole, setUserRole] = useState("USER");

  useEffect(() => {
    if (user) {
      setUserRole(user.role);
    }
  }, [user]);

  const adminNav = [
    {
      label: "Overview",
      icon: LayoutDashboard,
      href: "/super-admin/dashboard",
    },
    { label: "Analytics", icon: BarChart3, href: "/super-admin/analytics" },
    { label: "Activity", icon: History, href: "/super-admin/activity" },
    {
      label: "Alerts",
      icon: Bell,
      href: "/super-admin/notifications",
      badge: 12,
    },
    {
      label: "Vendors",
      icon: Building2,
      href: "/super-admin/vendor-approvals",
    },
    {
      label: "Products",
      icon: Package,
      href: "/super-admin/offering-approvals",
    },
    { label: "Users", icon: Users, href: "/super-admin/users" },
    { label: "Categories", icon: Layers, href: "/super-admin/categories" },
    { label: "Leads", icon: Target, href: "/super-admin/leads" },
    { label: "Admins", icon: Users, href: "/super-admin/admins" },
    { label: "Packages", icon: Package, href: "/super-admin/packages" },
    { label: "Ledger", icon: CreditCard, href: "/super-admin/transactions" },
    { label: "Refunds", icon: Briefcase, href: "/super-admin/refunds" },
    { label: "Profile", icon: Globe, href: "/super-admin/profile" },
    { label: "Settings", icon: Settings, href: "/super-admin/settings" },
  ];

  const vendorNav = [
    {
      section: "Overview",
      items: [
        {
          label: "Dashboard",
          icon: LayoutDashboard,
          href: "/vendor/dashboard",
        },
        { label: "Performance", icon: BarChart3, href: "/vendor/ranking" },
      ],
    },
    {
      section: "Inventory",
      items: [
        { label: "Products", icon: Package, href: "/vendor/products" },
        { label: "Leads", icon: Target, href: "/vendor/leads" },
      ],
    },
    {
      section: "Account",
      items: [
        { label: "Profile", icon: Globe, href: "/vendor/profile" },
        { label: "Billing", icon: CreditCard, href: "/vendor/billing" },
        { label: "Refunds", icon: Briefcase, href: "/vendor/refunds" },
      ],
    },
  ];

  const limitedAdminNav = [
    {
      section: "Dashboard",
      items: [
        { label: "Overview", icon: LayoutDashboard, href: "/admin/dashboard" },
        { label: "Alerts", icon: Bell, href: "/admin/notifications" },
        { label: "Profile", icon: Settings, href: "/admin/profile" },
      ],
    },
    {
      section: "Verification",
      items: [
        { label: "Vendors", icon: Building2, href: "/admin/vendors" },
        { label: "Products", icon: Briefcase, href: "/admin/products" },
      ],
    },
    {
      section: "Ecosystem",
      items: [
        { label: "Users", icon: Users, href: "/admin/users" },
        { label: "Categories", icon: Layers, href: "/admin/categories" },
        { label: "Leads", icon: Target, href: "/admin/leads" },
      ],
    },
  ];

  const currentNav =
    userRole === "SUPERADMIN"
      ? adminNav
      : userRole === "ADMIN"
        ? limitedAdminNav
        : vendorNav;

  return (
    <>
      {/* Main Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-[#062d1d] border-r border-[#062d1d] flex flex-col transition-all duration-300 z-40 ${mobileOpen ? "translate-x-0 w-64 " : "-translate-x-full lg:translate-x-0"} ${isCollapsed ? "lg:w-[72px]" : "lg:w-64"}`}
      >
        {/* Brand Header & Toggle */}
        <div
          className={`relative flex items-center justify-between border-b border-[#ffffff]/10 ${isCollapsed ? "h-20 flex-col py-4" : "h-[80px] px-4"}`}
        >
          <Link
            href="/"
            className={`flex items-center gap-3 group ${isCollapsed ? "justify-center" : ""}`}
            title="Dashboard"
          >
            {isCollapsed ? (
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                {userRole === "SUPERADMIN"
                  ? "SA"
                  : userRole === "ADMIN"
                    ? "AD"
                    : "VP"}
              </div>
            ) : (
              <span className="text-white font-semibold text-base uppercase truncate pl-2">
                {userRole === "SUPERADMIN"
                  ? "SUPER ADMIN"
                  : userRole === "ADMIN"
                    ? "ADMIN PANEL"
                    : "VENDOR PANEL"}
              </span>
            )}
          </Link>

          {/* Desktop Toggle Button - Inside Sidebar */}
          <button
            onClick={onToggle}
            className={`hidden lg:flex items-center justify-center p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all border border-white/10 ${isCollapsed ? "mt-2" : ""}`}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation Core */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {(userRole === "SUPERADMIN"
            ? adminNav
            : currentNav.flatMap((s) => s.items)
          ).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                title={isCollapsed ? item.label : ""}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative ${isActive ? "bg-[#124131] text-white" : "text-white/70 hover:text-white hover:bg-white/5 font-medium"}`}
              >
                <div
                  className={`transition-all ${isActive ? "text-white" : "text-white/60 group-hover:text-white"}`}
                >
                  <item.icon className="w-5 h-5 stroke-[2]" />
                </div>
                {!isCollapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-base font-semibold">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="bg-[#BA2B1E] text-white text-xs font-bold px-2 py-0.5 rounded-lg ">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Need Help Section - For All Roles Except Super Admin */}
        {!isCollapsed && userRole !== "SUPERADMIN" && (
          <div className="px-4 mb-8">
            <div className="p-5 bg-white/5 rounded-[1.5rem] border border-white/10 relative overflow-hidden group">
              {/* Background Decorative Element */}
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-all" />

              <p className="text-sm font-bold text-white mb-1.5 relative z-10 tracking-tight">
                Need Help?
              </p>
              <p className="text-[11px] font-medium text-white/50 mb-4 leading-relaxed relative z-10">
                Our support team is available to help you with anything.
              </p>

              <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-bold rounded-xl border border-white/10 transition-all group-hover:scale-[1.02] active:scale-[0.98]">
                <Headphones size={14} className="text-white" />
                Contact Support
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-30 lg:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}
