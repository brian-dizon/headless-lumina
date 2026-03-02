import { Suspense } from "react";
import { PageHeader } from "@/components/global/PageHeader";
import { ExpertGrid } from "@/components/experts/ExpertGrid";

// Skeleton Loader for Expert Grid
function ExpertGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-pulse">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-80 bg-slate-100 dark:bg-slate-800 rounded-3xl" />
      ))}
    </div>
  );
}

export default function ExpertsPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto py-16 px-4 max-w-7xl">
        
        {/* Header Section */}
        <PageHeader 
          eyebrow="The Team"
          title="World-Class Experts"
          description="Meet the architects, strategists, and researchers behind the Lumina Knowledge Hub. Our team brings decades of experience from across the global tech landscape."
        />

        {/* Dynamic Content: Expert Grid with Streaming */}
        <Suspense fallback={<ExpertGridSkeleton />}>
          <ExpertGrid />
        </Suspense>

      </div>
    </main>
  );
}
