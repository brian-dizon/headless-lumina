"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, ArrowRight } from "lucide-react";
import { Logo } from "./Logo";
import Link from "next/link";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { name: "Resources", href: "/resources" },
    { name: "Experts", href: "/experts" },
    { name: "About", href: "/about" },
  ];

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px] border-r border-border/40 p-0">
          <div className="flex flex-col h-full bg-background">
            <SheetHeader className="p-6 border-b text-left">
              <SheetTitle>
                <Logo />
              </SheetTitle>
            </SheetHeader>
            
            <nav className="flex-grow p-6">
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between p-4 rounded-xl text-lg font-bold tracking-tight hover:bg-muted/50 transition-colors group"
                  >
                    {link.name}
                    <ArrowRight className="h-5 w-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                  </Link>
                ))}
              </div>
            </nav>

            <div className="p-6 border-t mt-auto">
              <Button className="w-full h-12 rounded-xl font-bold" onClick={() => setOpen(false)}>
                Sign Up for Free
              </Button>
              <p className="text-[10px] text-center text-muted-foreground mt-4 uppercase tracking-[0.2em] font-bold">
                Lumina Enterprise v1.0
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
