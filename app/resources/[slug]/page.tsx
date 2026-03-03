import { getClient } from "@/lib/apollo-client";
import { GET_RESOURCE_BY_SLUG, GET_ALL_RESOURCE_SLUGS } from "@/lib/graphql/queries";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getAuthToken } from "@/lib/auth";
import { draftMode } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { GatedContent } from "@/components/global/GatedContent";
import { SingleResourceData, AllResourceSlugsData } from "@/types";

export default async function SingleResourcePage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ id?: string }> }) {
  // Await parameters
  const { slug } = await params;
  const { id } = await searchParams;

  // 1. Auth Status (Clerk)
  const { userId } = await auth();

  // 2. Draft Mode Detection
  const isDraft = (await draftMode()).isEnabled;
  const authToken = isDraft ? getAuthToken() : undefined;

  // 3. Data Fetching Logic
  const queryId = isDraft && id ? id : slug;
  const queryIdType = isDraft && id ? "DATABASE_ID" : "SLUG";

  // 4. Data Fetching via Centralized Query
  const { data } = await getClient(authToken).query<SingleResourceData>({
    query: GET_RESOURCE_BY_SLUG,
    variables: {
      id: queryId,
      idType: queryIdType,
      asPreview: isDraft,
    },
  });

  if (!data?.resource) {
    notFound();
  }

  const { title, content, resourceDetails, topics } = data.resource;
  const isPremium = resourceDetails?.isPremium;

  return (
    <main className="min-h-screen">
      {/* Draft Mode Banner */}
      {isDraft && (
        <div className="bg-primary/10 border-b border-primary/20 py-2">
          <div className="container mx-auto px-4 max-w-4xl flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Preview Mode Active</p>
            <Link href="/api/disable-draft" className="text-[10px] font-bold underline hover:text-primary transition-colors">
              Exit Preview
            </Link>
          </div>
        </div>
      )}

      <div className="container mx-auto py-24 px-4 max-w-4xl">
        {/* Article Header */}
        <header className="mb-12 border-b pb-8">
          <div className="flex gap-2 mb-6">
            {topics?.nodes?.map((topic) => (
              <Link key={topic.slug} href={`/topic/${topic.slug}`}>
                <Badge variant="secondary" className="px-3 py-1 hover:bg-primary hover:text-white transition-colors">
                  {topic.name}
                </Badge>
              </Link>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">{title}</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">{resourceDetails?.subtitle}</p>
        </header>

        {/* 4. Gated Logic: Premium vs Public */}
        {isPremium && !userId ? (
          <GatedContent />
        ) : (
          <article
            className="prose dark:prose-invert prose-slate prose-lg max-w-none 
            prose-headings:font-black prose-headings:tracking-tight 
            prose-a:text-primary prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: content ?? "" }}
          />
        )}
      </div>
    </main>
  );
}

/**
 * 8. Static Site Generation (SSG) Optimization
 */
export async function generateStaticParams() {
  const { data } = await getClient().query<AllResourceSlugsData>({
    query: GET_ALL_RESOURCE_SLUGS,
  });

  if (!data?.resources?.nodes) {
    return [];
  }

  // Returns an array of objects: [{ slug: 'post-1' }, { slug: 'post-2' }]
  return data.resources.nodes.map((node) => ({ slug: node.slug }));
}
