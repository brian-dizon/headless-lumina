import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroIllustration from "@/assets/images/hero-illustration.svg";

export function Hero() {
  return (
    <section className="relative py-24 border-b bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/50 dark:to-background overflow-hidden min-h-[600px] lg:min-h-[700px]">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1]">
              Scale Your <span className="text-primary italic">Enterprise</span> with Data-Driven Insights.
            </h1>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl">
              Lumina provides high-performance research, case studies, and expert analysis designed for technical leaders and decision makers.
            </p>

            {/* Mobile Hero Illustration: Only visible on small screens */}
            <div className="lg:hidden relative w-full aspect-square max-w-xl mx-auto mb-10">
              <Image
                src={heroIllustration}
                alt="Tech Company Illustration"
                fill
                priority
                fetchPriority="high"
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="rounded-full px-8 font-bold text-base h-12 shadow-xl shadow-primary/20" asChild>
                <Link href="/resources">Explore the Hub <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 font-bold text-base h-12" asChild>
                <Link href="/experts">Meet our Experts</Link>
              </Button>
            </div>
          </div>

          {/* Desktop Hero Illustration: Only visible on large screens */}
          <div className="hidden lg:block relative lg:w-[600px] lg:h-[600px] mx-auto lg:mx-0">
            <Image
              src={heroIllustration}
              alt="Tech Company Illustration"
              fill
              priority
              fetchPriority="high"
              sizes="600px"
              className="object-contain"
            />
          </div>
        </div>
      </div>
      {/* Subtle Background Decoration */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1/3 h-full bg-primary/5 blur-[120px] rounded-full" />
    </section>
  );
}
