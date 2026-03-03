import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/global/theme-provider";
import { Navbar } from "@/components/global/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { Footer } from "@/components/global/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Assistant } from "@/components/global/Assistant";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TooltipProvider>
              <Navbar />
              <div className="flex-grow">{children}</div>
              <Footer />
              <Assistant />
              <Toaster position="top-center" />
            </TooltipProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
