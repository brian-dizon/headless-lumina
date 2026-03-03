import { Suspense } from "react";
import { getClient } from "@/lib/apollo-client";
import { GET_ALL_TOPIC_SLUGS } from "@/lib/graphql/queries";
import { PageHeader } from "@/components/global/PageHeader";
import { ResourceGrid } from "@/components/resources/ResourceGrid";
import { ResourceFilters } from "@/components/resources/ResourceFilters";

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800 rounded-xl" />
      ))}
    </div>
  );
}

export default async function ResourcesPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ page?: string; topic?: string; access?: string }> 
}) {
  // 1. Await Search Params
  const resolvedParams = await searchParams;
  const currentPage = parseInt(resolvedParams.page || "1", 10);
  const currentTopic = resolvedParams.topic || "all";
  const currentAccess = resolvedParams.access || "all";

  // 2. Fetch Topics for the Filters (Cached via ISR)
  const { data: topicData } = await getClient().query({
    query: GET_ALL_TOPIC_SLUGS
  });
  const topics = topicData?.topics?.nodes || [];

  return (
    <main className="min-h-screen">
      <div className="container mx-auto py-16 px-4 max-w-7xl">
        <PageHeader 
          eyebrow="Library" 
          title="All Resources" 
          description="Access our full archive of technical reports, case studies, and engineering guides." 
        />

        {/* High-End Filtering UI */}
        <ResourceFilters topics={topics} />

        {/* Dynamic Filtered Grid */}
        <Suspense key={`${currentPage}-${currentTopic}-${currentAccess}`} fallback={<GridSkeleton />}>
          <ResourceGrid 
            page={currentPage} 
            topic={currentTopic} 
            access={currentAccess} 
          />
        </Suspense>
      </div>
    </main>
  );
}
