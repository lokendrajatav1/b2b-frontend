'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function DashboardSidebar({ isCollapsed, onToggle, mobileOpen, setMobileOpen }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [userRole, setUserRole] = useState('USER');

  useEffect(() => {
    if (user) {
      setUserRole(user.role);
    }
  }, [user]);

  const adminNav = [
    { section: 'Dashboard', items: [
      { label: 'Overview', icon: LayoutDashboard, href: '/super-admin/dashboard' },
      { label: 'Analytics', icon: BarChart3, href: '/super-admin/analytics' },
      { label: 'Activity', icon: History, href: '/super-admin/activity' },
      { label: 'Alerts', icon: Bell, href: '/super-admin/notifications' },
    ]},
    { section: 'Verification', items: [
      { label: 'Vendors', icon: Building2, href: '/super-admin/vendor-approvals' },
      { label: 'Products', icon: Briefcase, href: '/super-admin/offering-approvals' },
    ]},
    { section: 'Ecosystem', items: [
      { label: 'Users', icon: Users, href: '/super-admin/users' },
      { label: 'Categories', icon: Layers, href: '/super-admin/categories' },
      { label: 'Leads', icon: Target, href: '/super-admin/leads' },
    ]},
    { section: 'Business', items: [
      { label: 'Admins', icon: Users, href: '/super-admin/subadmins' },
      { label: 'Packages', icon: Package, href: '/super-admin/packages' },
      { label: 'Ledger', icon: CreditCard, href: '/super-admin/transactions' },
      { label: 'Refunds', icon: Briefcase, href: '/super-admin/refunds' },
      { label: 'Settings', icon: Settings, href: '/super-admin/settings' },
    ]}
  ];

  const vendorNav = [
    { section: 'Overview', items: [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/vendor/dashboard' },
      { label: 'Performance', icon: BarChart3, href: '/vendor/ranking' },
    ]},
    { section: 'Inventory', items: [
      { label: 'Products', icon: Package, href: '/vendor/products' },
      { label: 'Leads', icon: Target, href: '/vendor/leads' },
    ]},
    { section: 'Account', items: [
      { label: 'Profile', icon: Globe, href: '/vendor/profile' },
      { label: 'Billing', icon: CreditCard, href: '/vendor/billing' },
      { label: 'Refunds', icon: Briefcase, href: '/vendor/refunds' },
    ]}
  ];

  const subAdminNav = [
    { section: 'Dashboard', items: [
      { label: 'Overview', icon: LayoutDashboard, href: '/admin/dashboard' },
      { label: 'Alerts', icon: Bell, href: '/admin/notifications' },
      { label: 'Profile', icon: Settings, href: '/admin/profile' },
    ]},
    { section: 'Verification', items: [
      { label: 'Vendors', icon: Building2, href: '/admin/vendors' },
      { label: 'Products', icon: Briefcase, href: '/admin/products' },
    ]},
    { section: 'Ecosystem', items: [
      { label: 'Users', icon: Users, href: '/admin/users' },
      { label: 'Categories', icon: Layers, href: '/admin/categories' },
      { label: 'Leads', icon: Target, href: '/admin/leads' },
    ]}
  ];

  const currentNav = userRole === 'SUPERADMIN' ? adminNav : (userRole === 'ADMIN' ? subAdminNav : vendorNav);

  return (
    <>

      {/* Main Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen bg-[#164e33] border-r border-[#164e33] flex flex-col transition-all duration-300 z-40 ${mobileOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full lg:translate-x-0'} ${isCollapsed ? 'lg:w-[72px]' : 'lg:w-64'}`}>
        {/* Brand Header & Toggle */}
        <div className={`relative flex items-center justify-between border-b border-[#ffffff]/10 ${isCollapsed ? 'h-20 flex-col py-4' : 'h-[80px] px-4'}`}>
           <Link href="/" className={`flex items-center gap-3 group ${isCollapsed ? 'justify-center' : ''}`} title="Dashboard">
              {isCollapsed ? (
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                  {userRole === 'SUPERADMIN' ? 'SA' : (userRole === 'ADMIN' ? 'AD' : 'VP')}
                </div>
              ) : (
                <span className="text-white font-bold text-lg tracking-widest uppercase truncate">
                   {userRole === 'SUPERADMIN' ? 'SUPERADMIN' : (userRole === 'ADMIN' ? 'ADMIN PANEL' : 'VENDOR PANEL')}
                </span>
              )}
           </Link>

           {/* Desktop Toggle Button - Inside Sidebar */}
           <button
             onClick={onToggle}
             className={`hidden lg:flex items-center justify-center p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all border border-white/10 ${isCollapsed ? 'mt-2' : ''}`}
             title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
           >
             {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <Menu className="w-5 h-5" />}
           </button>
        </div>


        {/* Navigation Core */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto space-y-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
           {currentNav.map((section) => (
             <div key={section.section} className={`${isCollapsed ? 'space-y-3 pt-4' : 'space-y-1 pt-2'}`}>
                {!isCollapsed && (
                  <p className="px-3 text-xs font-semibold text-[#8ebfb5] uppercase tracking-wider mb-2 mt-4 hidden">
                    {section.section}
                  </p>
                )}
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link 
                      key={item.href} 
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      title={isCollapsed ? item.label : ''}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative border border-transparent ${isActive ? 'bg-[#186a5a] text-white' : 'text-[#8ebfb5] hover:bg-[#186a5a] hover:text-white font-medium'}`}
                    >
                      <div className={`transition-all ${isActive ? 'text-white' : 'text-[#8ebfb5] group-hover:text-white'}`}>
                        <item.icon className="w-5 h-5 stroke-[2]" />
                      </div>
                      {!isCollapsed && <span className={`text-[15px] ${isActive ? 'font-medium' : ''}`}>{item.label}</span>}
                    </Link>
                  );
                })}
             </div>
           ))}
        </nav>

        {/* User Foothold */}
        {/* <div className={`p-6 border-t border-gray-50 space-y-4 ${isCollapsed ? 'items-center' : ''}`}>
           {!isCollapsed && userRole === 'VENDOR' && (
             <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-2">
                <div className="flex items-center justify-between mb-2">
                   <p className="text-base font-semibold text-slate-500 uppercase  leading-none">Wallet Balance</p>
                </div>
                <p className="text-lg font-semibold text-slate-900">₹12,450.00</p>
             </div>
           )}

           <button 
             onClick={logout}
             className={`flex items-center gap-4 px-4 py-3 w-full rounded-2xl text-slate-700 hover:text-red-600 hover:bg-red-50 transition-all font-medium group ${isCollapsed ? 'justify-center' : ''}`}
           >
              <div className="p-2 bg-gray-50 group-hover:bg-red-100 rounded-lg transition-colors">
                <LogOut className="w-4 h-4" />
              </div>
              {!isCollapsed && <span className="text-base">Sign Out</span>}
           </button>
        </div> */}
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
