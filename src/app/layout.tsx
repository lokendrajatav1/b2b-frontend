import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "B2B Community | India's Largest Marketplace",
  description: "Connect buyers with sellers in India's leading B2B marketplace.",
};

import LayoutWrapper from "@/components/LayoutWrapper";
import GoogleAdsProvider from "@/components/GoogleAdsProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${openSans.variable} font-sans antialiased bg-gray-50 text-slate-800`}
      >
        <AuthProvider>
          <GoogleAdsProvider />
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}

