import { getClient } from "@/lib/apollo-client";
import { GET_RESOURCES } from "@/lib/graphql/queries";
import { ResourceCard } from "./ResourceCard";
import { Button } from "@/components/ui/button";
import { GetResourcesData } from "@/types";
import Link from "next/link";
import { ChevronLeft, ArrowRight } from "lucide-react";

export async function ResourceGrid({ page = 1 }: { page?: number }) {
  const POSTS_PER_PAGE = 6;

  // 1. Fetch the data batch using the centralized query and type
  const { data } = await getClient().query<GetResourcesData>({
    query: GET_RESOURCES,
    variables: { first: 100 }
  });

  const allNodes = data?.resources.nodes ?? [];
  const totalPosts = allNodes.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  // 2. Client-Side Slicing Logic (Senior Workaround for missing Offset Plugin)
  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const nodes = allNodes.slice(startIndex, endIndex);

  return (
    <div className="space-y-12">
      {/* 1. The Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {nodes.map((resource) => (
          <ResourceCard key={resource.slug} resource={resource} />
        ))}
      </div>

      {/* 2. Unified Navigation UI */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-6 pt-12 border-t border-border/50">
          <div className="flex items-center gap-4">
            {page > 1 ? (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full font-bold px-6 h-10 hover:bg-primary hover:text-white transition-all"
                asChild
              >
                <Link href={`/resources?page=${page - 1}`}>
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Link>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                disabled
                className="rounded-full font-bold px-6 h-10 opacity-30"
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
            )}

            <div className="bg-muted px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Page {page} of {totalPages}
            </div>

            {page < totalPages ? (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full font-bold px-6 h-10 hover:bg-primary hover:text-white transition-all"
                asChild
              >
                <Link href={`/resources?page=${page + 1}`}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                disabled
                className="rounded-full font-bold px-6 h-10 opacity-30"
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
          
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
            Showing {nodes.length} of {totalPosts} Resources
          </p>
        </div>
      )}
    </div>
  );
}
