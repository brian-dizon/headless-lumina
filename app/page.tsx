import { Suspense } from "react";
import { PageHeader } from "@/components/global/PageHeader";
import { ResourceGrid } from "@/components/resources/ResourceGrid";

// Skeleton Loader for better UX during the fetch
function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-64 bg-slate-100 rounded-xl" />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto py-16 px-4 max-w-7xl">
        
        {/* Static Header: Renders immediately */}
        <PageHeader 
          eyebrow="Knowledge Hub"
          title="Lumina Insights"
          description="Expertly curated reports, guides, and case studies designed to help your enterprise scale securely and efficiently."
        />

        {/* Dynamic Section: Streams in when WordPress responds */}
        <Suspense fallback={<GridSkeleton />}>
          <ResourceGrid />
        </Suspense>

      </div>
    </main>
  );
}
