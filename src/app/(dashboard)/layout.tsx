'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import NotificationDropdown from '@/components/dashboard/NotificationDropdown';
import { useAuth } from '@/context/AuthContext';
import { Search, Settings, HelpCircle, ChevronDown, UserCircle, LogOut } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  useEffect(() => {
    if (!loading) {
      const path = window.location.pathname;
      
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
      const isAdminPath = path.startsWith('/admin');
      const isVendorPath = path.startsWith('/vendor');
      const isSubAdminPath = path.startsWith('/subadmin');

      if (isAdminPath && !['ADMIN', 'SUBADMIN'].includes(user.role)) {
        router.push(user.role === 'VENDOR' ? '/vendor/dashboard' : '/');
      } else if (isVendorPath && user.role !== 'VENDOR') {
        router.push(user.role === 'ADMIN' ? '/admin/dashboard' : '/');
      } else if (isSubAdminPath && user.role !== 'SUBADMIN') {
        router.push(user.role === 'ADMIN' ? '/admin/dashboard' : '/');
      }
    }
  }, [user, loading, router]);

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
      />
      <div className={`flex-1 min-h-screen flex flex-col relative transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Top Header */}
        <header id="main-dashboard-header" className="h-16 bg-white/70 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30 transition-all duration-300">
          <div className="flex items-center gap-6 flex-1">
             <div className="hidden lg:block shrink-0">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                   <div className="w-1 h-4 bg-blue-600 rounded-full" />
                   {window.location.pathname.includes('/admin') ? 'ADMIN HQ' : (window.location.pathname.includes('/subadmin') ? 'TEAM HUB' : 'VENDOR PORTAL')}
                </h2>
             </div>
             
             <div className="relative group max-w-sm w-full">
               <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500" />
               <input 
                 type="text" 
                 placeholder="Quick search..." 
                 className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-blue-500 text-[13px] font-medium placeholder:text-gray-400 transition-all"
               />
             </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-xl border border-gray-100">
                <NotificationDropdown />
                <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-200/50 transition-colors">
                  <HelpCircle className="w-4.5 h-4.5" />
                </button>
            </div>
            
            <div className="h-6 w-px bg-gray-200 mx-1"></div>

            <div className="flex items-center gap-3 cursor-pointer p-1.5 rounded-xl border border-transparent hover:bg-gray-50 transition-all group relative">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900 capitalize leading-none">
                  {user.name && isNaN(Number(user.name)) ? user.name : 'Guest Member'}
                </p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm group-hover:shadow-md transition-all">
                <UserCircle className="w-5.5 h-5.5" />
              </div>
              
              {/* Simple Logout Dropdown Overlay */}
              <div className="absolute top-full right-0 mt-1 w-40 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-1.5 overflow-hidden">
                 <button 
                   onClick={logout}
                   className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                 >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                 </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-10 animate-fade-in dashboard-content overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
