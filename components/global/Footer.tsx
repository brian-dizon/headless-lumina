"use client";

import Image from "next/image";
import { ContactForm } from "./ContactForm";
import onlineTechTalks from "@/assets/images/online-tech-talks-animate.svg";

export function Footer() {
    return (
        <footer className="w-full border-t bg-slate-50 dark:bg-slate-900/20 pt-24 pb-12 mt-auto">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">

                    {/* Left Side: Illustration */}
                    <div className="relative w-full aspect-square max-w-xl mx-auto lg:mx-0 lg:max-w-none hover:scale-[1.02] transition-transform duration-500">
                        <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full" />
                        <Image
                            src={onlineTechTalks}
                            alt="Online Tech Talks Illustration"
                            fill
                            className="object-contain relative z-10"
                            priority
                        />
                    </div>

                    {/* Right Side: Lead Capture Form */}
                    <div className="flex justify-center lg:justify-end">
                        <div className="w-full max-w-lg">
                            <ContactForm />
                        </div>
                    </div>

                </div>

                {/* Global Footer Bottom */}
                <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} Lumina Insights. All rights reserved.</p>
                    <div className="flex items-center gap-6 font-medium">
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
