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
    ]},
    { section: 'Business', items: [
      { label: 'Admins', icon: Users, href: '/super-admin/subadmins' },
      { label: 'Packages', icon: Package, href: '/super-admin/packages' },
      { label: 'Ledger', icon: CreditCard, href: '/super-admin/transactions' },
      { label: 'Refunds', icon: Briefcase, href: '/super-admin/refunds' },
      { label: 'Settings', icon: Settings, href: '/super-admin/settings' },
    ]}
  ];

  const currentNav = userRole === 'SUPERADMIN' ? adminNav : (userRole === 'ADMIN' ? subAdminNav : vendorNav);

  return (
    <>

      {/* Main Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen bg-[#f8f9fa] border-r border-gray-100 flex flex-col transition-all duration-300 z-40 ${mobileOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full lg:translate-x-0'} ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}>
        {/* Brand Header */}
        <div className={`py-4 px-4 border-b border-gray-100 flex items-center justify-center ${isCollapsed ? 'h-16' : 'h-[72px]'}`}>
           {!isCollapsed ? (
             <Link href="/" className="flex items-center justify-center">
                <img src="/logo.png" alt="India B2B" className="h-10 w-auto object-contain" />
             </Link>
           ) : (
              <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
           )}
        </div>

        {/* Navigation Core */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto space-y-8 custom-scrollbar">
           {currentNav.map((section) => (
             <div key={section.section} className="space-y-1.5">
                {!isCollapsed && (
                  <p className="px-4 text-base font-bold text-slate-500 uppercase  mb-4 mt-8">
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
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative border border-transparent ${isActive ? 'bg-[#f37021]/10 text-[#f37021]' : 'text-slate-600 hover:bg-[#f37021]/5 hover:text-[#f37021] font-medium'}`}
                    >
                      <div className={`transition-all ${isActive ? 'text-[#f37021]' : 'text-slate-400 group-hover:text-[#f37021]'}`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      {!isCollapsed && <span className={`text-base ${isActive ? 'font-semibold' : ''}`}>{item.label}</span>}
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
