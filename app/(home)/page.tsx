import { Suspense } from "react";
import { StatusGrid } from "@/components/global/StatusGrid";
import { Hero } from "./_components/Hero";
import { Features } from "./_components/Features";
import { FeaturedResources } from "./_components/FeaturedResources";

export default function Home() {
  return (
    <main className="min-h-screen">

      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Global Infrastructure Status (Command Center Pizzazz) */}
      <Suspense fallback={<div className="h-[450px] md:h-[200px] w-full bg-slate-950 animate-pulse" />}>
        <StatusGrid />
      </Suspense>

      {/* 3. Key Features / Value Prop */}
      <Features />

      {/* 4. Featured Resources Section */}
      <Suspense fallback={<div className="h-[1000px] md:h-[1150px] w-full bg-slate-50 dark:bg-slate-900 animate-pulse" />}>
        <FeaturedResources />
      </Suspense>

    </main>
  );
}
