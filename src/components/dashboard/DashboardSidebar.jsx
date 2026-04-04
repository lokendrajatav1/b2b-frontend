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

export default function DashboardSidebar({ isCollapsed, onToggle }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userRole, setUserRole] = useState('USER');

  useEffect(() => {
    if (user) {
      setUserRole(user.role);
    }
  }, [user]);

  const adminNav = [
    { section: 'Dashboard', items: [
      { label: 'Overview', icon: LayoutDashboard, href: '/admin/dashboard' },
      { label: 'Platform Insights', icon: BarChart3, href: '/admin/analytics' },
      { label: 'Administrative History', icon: History, href: '/admin/activity' },
      { label: 'Announcement Hub', icon: Bell, href: '/admin/notifications' },
    ]},
    { section: 'Verification', items: [
      { label: 'Vendor Approvals', icon: Building2, href: '/admin/vendor-approvals' },
      { label: 'Product Approvals', icon: Briefcase, href: '/admin/offering-approvals' },
    ]},
    { section: 'Ecosystem', items: [
      { label: 'Platform Users', icon: Users, href: '/admin/users' },
      { label: 'Market Categories', icon: Layers, href: '/admin/categories' },
      { label: 'Market Demands', icon: Target, href: '/admin/leads' },
    ]},
    { section: 'Business', items: [
      { label: 'Sub-Admins', icon: Users, href: '/admin/subadmins' },
      { label: 'Membership Plans', icon: Package, href: '/admin/packages' },
      { label: 'Revenue Ledger', icon: CreditCard, href: '/admin/transactions' },
      { label: 'Refund Processing', icon: Briefcase, href: '/admin/refunds' },
      { label: 'Global Settings', icon: Settings, href: '/admin/settings' },
    ]}
  ];

  const vendorNav = [
    { section: 'Overview', items: [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/vendor/dashboard' },
      { label: 'Performance Index', icon: BarChart3, href: '/vendor/ranking' },
    ]},
    { section: 'Inventory', items: [
      { label: 'Product Portfolio', icon: Package, href: '/vendor/products' },
      { label: 'Inquiry Inbox', icon: Target, href: '/vendor/leads' },
    ]},
    { section: 'Account', items: [
      { label: 'Public Profile', icon: Globe, href: '/vendor/profile' },
      { label: 'Financial Hub', icon: CreditCard, href: '/vendor/billing' },
      { label: 'Refunds', icon: Briefcase, href: '/vendor/refunds' },
    ]}
  ];

  const subAdminNav = [
    { section: 'Dashboard', items: [
      { label: 'Overview', icon: LayoutDashboard, href: '/subadmin/dashboard' },
      { label: 'Team Announcements', icon: Bell, href: '/subadmin/notifications' },
    ]},
    { section: 'Verification', items: [
      { label: 'Vendor Approvals', icon: Building2, href: '/subadmin/vendors' },
      { label: 'Product Approvals', icon: Briefcase, href: '/subadmin/products' },
    ]},
    { section: 'Ecosystem', items: [
      { label: 'Platform Users', icon: Users, href: '/subadmin/users' },
      { label: 'Market Categories', icon: Layers, href: '/subadmin/categories' },
      { label: 'Market Demands', icon: Target, href: '/subadmin/leads' },
    ]}
  ];

  const currentNav = userRole === 'ADMIN' ? adminNav : (userRole === 'SUBADMIN' ? subAdminNav : vendorNav);

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-40 lg:hidden p-3 bg-white rounded-xl border border-gray-100 shadow-lg text-gray-500"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Main Sidebar (Premium State) */}
      <aside className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-300 z-40 ${mobileOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full lg:translate-x-0'} ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}>
        {/* Brand Shield & Header */}
        <div className={`p-8 border-b border-gray-50 mb-4 h-24 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
           {!isCollapsed ? (
             <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-blue-600 rounded-4xl flex items-center justify-center text-white shadow-lg shadow-blue-50 transform group-hover:rotate-6 transition-all duration-300">
                   <Globe className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xl font-semibold text-gray-900 tracking-tight leading-none block">MARKETER.</span>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1 block">
                    {userRole === 'ADMIN' ? 'ADMIN PANEL' : (userRole === 'SUBADMIN' ? 'SUB ADMIN PANEL' : 'VENDOR PANEL')}
                  </span>
                </div>
             </Link>
           ) : (
              <div className="w-10 h-10 bg-blue-600 rounded-4xl flex items-center justify-center text-white shadow-lg shadow-blue-50">
                 <Globe className="w-5 h-5" />
              </div>
           )}
        </div>

        {/* Navigation Core */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto space-y-8 custom-scrollbar">
           {currentNav.map((section) => (
             <div key={section.section} className="space-y-1.5">
                {!isCollapsed && (
                  <p className="px-4 text-[9px] font-semibold text-gray-400 uppercase tracking-[0.2em] mb-4 opacity-70">
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
                      className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group relative ${isActive ? 'sidebar-active-link shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'}`}
                    >
                      <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                      {!isCollapsed && <span className="text-[13px] tracking-tight">{item.label}</span>}
                      {isActive && !isCollapsed && <ChevronRight className="ml-auto w-3.5 h-3.5 opacity-50" />}
                      {isCollapsed && isActive && (
                        <div className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full" />
                      )}
                    </Link>
                  );
                })}
             </div>
           ))}
        </nav>

        {/* User Foothold */}
        <div className={`p-6 border-t border-gray-50 space-y-4 ${isCollapsed ? 'items-center' : ''}`}>
           {!isCollapsed && userRole === 'VENDOR' && (
             <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-2">
                <div className="flex items-center justify-between mb-2">
                   <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest leading-none">Wallet Balance</p>
                </div>
                <p className="text-lg font-semibold text-gray-900">₹12,450.00</p>
             </div>
           )}

           <button 
             onClick={logout}
             className={`flex items-center gap-4 px-4 py-3 w-full rounded-2xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all font-medium group ${isCollapsed ? 'justify-center' : ''}`}
           >
              <div className="p-2 bg-gray-50 group-hover:bg-red-100 rounded-lg transition-colors">
                <LogOut className="w-4 h-4" />
              </div>
              {!isCollapsed && <span className="text-[13px]">Sign Out</span>}
           </button>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 lg:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}
