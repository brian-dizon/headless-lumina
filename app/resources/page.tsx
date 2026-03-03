import { Suspense } from "react";
import { PageHeader } from "@/components/global/PageHeader";
import { ResourceGrid } from "@/components/resources/ResourceGrid";

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800 rounded-xl" />
      ))}
    </div>
  );
}

export default async function ResourcesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  // Await searchParams (Next.js 15 Requirement)
  const resolvedParams = await searchParams;
  const currentPage = parseInt(resolvedParams.page || "1", 10);

  return (
    <main className="min-h-screen">
      <div className="container mx-auto py-16 px-4 max-w-7xl">
        <PageHeader eyebrow="Library" title="All Resources" description="Access our full archive of technical reports, case studies, and engineering guides." />

        <Suspense key={currentPage} fallback={<GridSkeleton />}>
          <ResourceGrid page={currentPage} />
        </Suspense>
      </div>
    </main>
  );
}
