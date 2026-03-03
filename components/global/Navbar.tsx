"use client";

import { Logo } from "./Logo";
import { ModeToggle } from "./mode-toggle";
import { MobileNav } from "./MobileNav";
import { UserProfile } from "./UserProfile";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm shadow-slate-200/20">
      <div className="container flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <MobileNav />
          <Logo />
        </div>
        
        <div className="flex items-center gap-2 md:gap-8">
          {/* Navigation Links - Hidden on mobile, visible on tablet+ */}
          <div className="hidden md:flex gap-8 text-sm font-bold uppercase tracking-wider text-muted-foreground/80">
            <Link href="/resources" className="hover:text-primary transition-colors py-2 border-b-2 border-transparent hover:border-primary">
              Resources
            </Link>
            <Link href="/experts" className="hover:text-primary transition-colors py-2 border-b-2 border-transparent hover:border-primary">
              Experts
            </Link>
            <Link href="/about" className="hover:text-primary transition-colors py-2 border-b-2 border-transparent hover:border-primary">
              About
            </Link>
          </div>
          
          <div className="flex items-center gap-3 pl-4 border-l border-border/50">
            <ModeToggle />
            <UserProfile />
          </div>
        </div>
      </div>
    </nav>
  );
}
