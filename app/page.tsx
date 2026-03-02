import { Suspense } from "react";
import { PageHeader } from "@/components/global/PageHeader";
import { ResourceGrid } from "@/components/resources/ResourceGrid";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BookOpen, Users, ShieldCheck } from "lucide-react";

import Image from "next/image";

// Skeleton Loader for better UX during the fetch
function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800 rounded-xl" />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      
      {/* 1. Hero Section */}
      <section className="relative py-24 border-b bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/50 dark:to-background overflow-hidden">
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
                  src="/images/hero-illustration.svg" 
                  alt="Tech Company Illustration" 
                  fill
                  priority
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
                src="/images/hero-illustration.svg" 
                alt="Tech Company Illustration" 
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>
        </div>
        {/* Subtle Background Decoration */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1/3 h-full bg-primary/5 blur-[120px] rounded-full" />
      </section>

      {/* 2. Key Features / Value Prop */}
      <section className="py-20 bg-white dark:bg-background border-b">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col gap-4">
              <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center text-primary">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Comprehensive Research</h3>
              <p className="text-muted-foreground">Deep dives into zero-trust security, cloud migration, and AI implementation.</p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center text-primary">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Expert-Led Insights</h3>
              <p className="text-muted-foreground">Authored by world-class solutions architects and industry strategists.</p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Premium Reports</h3>
              <p className="text-muted-foreground">Gated whitepapers and architectural blueprints for advanced teams.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Resources Section */}
      <div className="container mx-auto py-24 px-4 max-w-7xl">
        <div className="flex items-end justify-between mb-12 gap-4 flex-wrap">
          <div>
            <PageHeader 
              eyebrow="Latest Insights"
              title="From the Lab"
              description="Freshly published reports and engineering guides from the Lumina team."
            />
          </div>
          <Button variant="link" className="font-bold text-primary p-0 h-auto group" asChild>
            <Link href="/resources">View All Resources <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
          </Button>
        </div>

        {/* Dynamic Section: Streams in when WordPress responds */}
        <Suspense fallback={<GridSkeleton />}>
          <ResourceGrid />
        </Suspense>
      </div>

    </main>
  );
}
