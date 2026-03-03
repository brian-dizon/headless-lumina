import { getClient } from "@/lib/apollo-client";
import { GET_RESOURCES } from "@/lib/graphql/queries";
import { ResourceCard } from "./ResourceCard";
import { Button } from "@/components/ui/button";
import { GetResourcesData } from "@/types";
import Link from "next/link";
import { ChevronLeft, ArrowRight, SearchX } from "lucide-react";

interface ResourceGridProps {
  page?: number;
  topic?: string;
  access?: string;
}

/**
 * ResourceGrid Component
 * Orchestrates server-side fetching and client-side filtering/pagination.
 */
export async function ResourceGrid({ 
  page = 1, 
  topic = "all", 
  access = "all" 
}: ResourceGridProps) {
  const POSTS_PER_PAGE = 6;

  // 1. Fetch the full batch (up to 100) for instant in-memory filtering
  const { data } = await getClient().query<GetResourcesData>({
    query: GET_RESOURCES,
    variables: { first: 100 }
  });

  let allNodes = data?.resources.nodes ?? [];

  // 2. Apply Filters
  if (topic && topic !== "all") {
    allNodes = allNodes.filter(node => 
      node.topics?.nodes?.some(t => t.slug === topic)
    );
  }

  if (access && access !== "all") {
    if (access === "premium") {
      allNodes = allNodes.filter(node => node.resourceDetails?.isPremium);
    } else if (access === "free") {
      allNodes = allNodes.filter(node => !node.resourceDetails?.isPremium);
    }
  }

  const totalPosts = allNodes.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  // 3. Slicing Logic for Pagination
  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const nodes = allNodes.slice(startIndex, endIndex);

  // 4. Empty State
  if (nodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
          <SearchX className="h-10 w-10 text-muted-foreground/40" />
        </div>
        <h3 className="text-2xl font-black tracking-tight mb-2">No Resources Found</h3>
        <p className="text-muted-foreground max-w-sm mx-auto mb-8">
          We couldn&apos;t find any resources matching your current filters. Try adjusting your technical domains or access level.
        </p>
        <Button variant="outline" className="rounded-full font-bold" asChild>
          <Link href="/resources">Reset All Filters</Link>
        </Button>
      </div>
    );
  }

  // 5. Build Pagination URL helper
  const getPaginationUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    if (topic !== "all") params.set("topic", topic);
    if (access !== "all") params.set("access", access);
    params.set("page", pageNum.toString());
    return `/resources?${params.toString()}`;
  };

  return (
    <div className="space-y-12">
      {/* The Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {nodes.map((resource) => (
          <ResourceCard key={resource.slug} resource={resource} />
        ))}
      </div>

      {/* Unified Navigation UI */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-6 pt-12 border-t border-border/50">
          <div className="flex items-center gap-4">
            {page > 1 ? (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full font-bold px-6 h-10 hover:bg-primary hover:text-white transition-all shadow-sm"
                asChild
              >
                <Link href={getPaginationUrl(page - 1)}>
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled className="rounded-full font-bold px-6 h-10 opacity-20">
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
            )}

            <div className="bg-muted px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground shadow-inner">
              Page {page} of {totalPages}
            </div>

            {page < totalPages ? (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full font-bold px-6 h-10 hover:bg-primary hover:text-white transition-all shadow-sm"
                asChild
              >
                <Link href={getPaginationUrl(page + 1)}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled className="rounded-full font-bold px-6 h-10 opacity-20">
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
          
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest opacity-60">
            Showing {nodes.length} of {totalPosts} Filtered Resources
          </p>
        </div>
      )}
    </div>
  );
}
