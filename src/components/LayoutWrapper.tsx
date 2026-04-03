'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Define routes that should NOT have the global Navbar and Footer
  // Dashboards, Login, Register, admin etc. usually have their own
  const noLayoutRoutes = [
    '/admin',
    '/vendor',
    '/subadmin',
    '/wp-admin',
    '/wp-subadmin',
    '/login',
    '/register'
  ];

  // We check if current path starts with any of the excluded routes
  const hideLayout = noLayoutRoutes.some(route => pathname.startsWith(route)) || pathname.includes('/dashboard');

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
