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
  }, [user, loading, router]);

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
    <div className="min-h-screen bg-[#f4f7fa] text-black flex font-sans">
      <DashboardSidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />
      <div className={`flex-1 min-w-0 min-h-screen flex flex-col relative transition-all duration-300 ml-0 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Top Header */}
        <header id="main-dashboard-header" className="h-16 bg-white/70 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 transition-all duration-300">
          <div className="flex items-center gap-3 flex-1">
             {/* Mobile Hamburger — only on small screens */}
             <button
               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
               className="lg:hidden p-2 rounded-xl border border-gray-200 text-slate-700 shrink-0"
             >
               {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
             </button>

             <div className="shrink-0">
               <h2 className="text-base lg:text-base font-semibold text-slate-900 uppercase  flex items-center gap-2">
                 <div className="w-1 h-3.5 lg:h-4 bg-[#007367] rounded-full hidden lg:block" />
                 {user.role === 'SUPERADMIN' ? 'SUPERADMIN PANEL' : (user.role === 'ADMIN' ? 'ADMIN PANEL' : 'VENDOR DASHBOARD')}
               </h2>
             </div>


          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-none border border-gray-100">
                <NotificationDropdown />

            </div>
            
            <div className="h-6 w-px bg-gray-200 mx-1"></div>

            <div className="flex items-center gap-3 cursor-pointer p-1.5 rounded-none border border-transparent hover:bg-gray-50 transition-all group relative">
              <div className="text-right hidden sm:block">
                <p className="text-base font-semibold text-slate-900 capitalize leading-none">
                  {user.name && isNaN(Number(user.name)) ? user.name : 'Authorized User'}
                </p>
              </div>
              <div className="w-9 h-9 rounded-none bg-[#007367]/5 border border-[#007367]/10 flex items-center justify-center text-[#007367] shadow-sm group-hover:shadow-md transition-all overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <UserCircle className="w-5.5 h-5.5" />
                )}
              </div>
              
              {/* Simple Logout Dropdown Overlay */}
              <div className="absolute top-full right-0 mt-1 w-40 bg-white border border-gray-100 rounded-none shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-1.5 overflow-hidden">
                 <button 
                   onClick={logout}
                   className="w-full flex items-center gap-2.5 px-3 py-2 text-base font-semibold text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                 >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                 </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10 animate-fade-in dashboard-content overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}


