import { Suspense } from "react";
import { PageHeader } from "@/components/global/PageHeader";
import { ResourceGrid } from "@/components/resources/ResourceGrid";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Skeleton Loader for better UX during the fetch
function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse min-h-[1000px] md:min-h-[600px]">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800 rounded-xl" />
      ))}
    </div>
  );
}

export function FeaturedResources() {
  return (
    <div className="container mx-auto py-24 px-4 max-w-7xl">
      <div className="flex items-end justify-between mb-12 gap-4 flex-wrap">
        <div>
          <PageHeader
            eyebrow="Latest Insights"
            title="From the Lab"
            description="Freshly published reports and engineering guides from the Lumina team."
            as="h2"
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
  );
}
