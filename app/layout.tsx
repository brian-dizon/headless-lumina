import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/global/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/global/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { Footer } from "@/components/global/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";

const SmartSearch = dynamic(() => import("@/components/global/SmartSearch").then(mod => mod.SmartSearch));

const ClientAssistant = dynamic(() => import("@/components/global/ClientAssistant").then(mod => mod.ClientAssistant));

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lumina Insights | Enterprise Knowledge Hub",
  description: "Expertly curated reports, guides, and case studies for the modern enterprise.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://www.transparenttextures.com" crossOrigin="anonymous" />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TooltipProvider>
              <Navbar />
              <Suspense fallback={<div className="flex-grow animate-pulse bg-slate-50 dark:bg-slate-950" />}>
                <div className="flex-grow">{children}</div>
              </Suspense>
              <Footer />
              <ClientAssistant />
              <Toaster position="top-center" />
            </TooltipProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
