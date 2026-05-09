'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import NotificationDropdown from '@/components/dashboard/NotificationDropdown';
import { useAuth } from '@/context/AuthContext';
import { Search, Settings, HelpCircle, ChevronDown, UserCircle, LogOut, Menu, X } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const profileRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (pathname === '/super-admin' || pathname === '/admin') return;
    
    if (!loading) {
      const path = pathname;
      
      if (!user) {
        router.push('/login');
        return;
      }

      // 1. Kick out Buyers
      if (user.role === 'BUYER') {
        router.push('/');
        return;
      }

      // 2. Dashboard Protection Logic
      const isSuperAdminPath = path.startsWith('/super-admin');
      const isVendorPath = path.startsWith('/vendor');
      const isAdminPath = path.startsWith('/admin');

      if (isSuperAdminPath && user.role !== 'SUPERADMIN') {
        router.push(user.role === 'ADMIN' ? '/admin/dashboard' : '/vendor/dashboard');
      } else if (isVendorPath && user.role !== 'VENDOR') {
        router.push(user.role === 'SUPERADMIN' ? '/super-admin/dashboard' : '/admin/dashboard');
      } else if (isAdminPath && user.role !== 'ADMIN') {
        router.push(user.role === 'SUPERADMIN' ? '/super-admin/dashboard' : '/vendor/dashboard');
      }
    }
  }, [user, loading, router, pathname]);

  const getProfileLink = () => {
    if (!user) return '#';
    if (user.role === 'SUPERADMIN') return '/super-admin/profile';
    if (user.role === 'ADMIN') return '/admin/profile';
    return '/vendor/profile';
  };

  if (pathname === '/super-admin' || pathname === '/admin') {
    return <>{children}</>;
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#f4f7fa] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-slate-900 flex font-sans antialiased">
      <DashboardSidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />
      <div className={`flex-1 min-w-0 min-h-screen flex flex-col relative transition-all duration-300 ml-0 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Top Header */}
        <header id="main-dashboard-header" className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30">
          <div className="flex items-center gap-6">
             <button
               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
               className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-gray-50 transition-colors"
             >
               {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
             </button>

             <div className="shrink-0 flex items-center">
                 <img src="/logo.png" alt="INDIA B2B" className="h-10 w-auto object-contain" />
             </div>
          </div>

          {/* Header Spacer (Search removed) */}
          <div className="flex-1" />

          <div className="flex items-center gap-6">
            <NotificationDropdown />
            
            <div ref={profileRef} className="relative">
              <div 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-base font-semibold text-slate-900 leading-none mb-1">
                    {user.name && isNaN(Number(user.name)) ? user.name : 'Monu'}
                  </p>
                  <p className="text-xs font-semibold text-slate-800 uppercase leading-none">
                    {user.role === 'SUPERADMIN' ? 'SUPER ADMIN' : user.role}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#164e33] overflow-hidden transition-all group-hover:border-[#164e33]/30 shadow-sm">
                  {user.avatar || user.profileImage || user.vendor?.logoUrl ? (
                    <img src={user.avatar || user.profileImage || user.vendor?.logoUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#164e33] flex items-center justify-center font-semibold text-white text-sm">
                       {user.name ? user.name[0].toUpperCase() : 'M'}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Profile Dropdown Overlay */}
              <div className={`fixed sm:absolute inset-x-4 sm:inset-x-auto sm:right-0 mt-3 sm:w-56 bg-white border border-gray-100 rounded-2xl  transition-all z-50 p-2 transform origin-top-right ${isProfileOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                 <div className="px-3 py-3 border-b border-gray-50 mb-1 sm:hidden">
                    <p className="text-sm font-semibold text-slate-900 capitalize leading-none mb-1">{user.name}</p>
                    <p className="text-sm font-semibold text-slate-800 uppercase">{user.role === 'SUPERADMIN' ? 'SUPER ADMIN' : user.role}</p>
                 </div>

                 <button 
                   onClick={() => {
                     router.push(getProfileLink());
                     setIsProfileOpen(false);
                   }}
                   className="w-full flex items-center gap-3 px-3.5 py-3 text-sm font-semibold text-slate-800 hover:text-[#164e33] hover:bg-[#164e33]/5 rounded-xl transition-all"
                 >
                    <UserCircle className="w-4 h-4" />
                    View Profile
                 </button>

                 <button 
                   onClick={() => {
                     logout();
                     setIsProfileOpen(false);
                   }}
                   className="w-full flex items-center gap-3 px-3.5 py-3 text-sm font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                 >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                 </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-10 animate-fade-in dashboard-content overflow-y-auto bg-[#f8fafc]">
          {children}
        </main>
      </div>
    </div>
  );
}
