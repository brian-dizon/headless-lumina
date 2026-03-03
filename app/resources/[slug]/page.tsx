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
import { AISummary } from "@/components/resources/AISummary";
import { SaveButton } from "@/components/resources/SaveButton";
import Image from "next/image";
import { Calendar, Clock, History, User } from "lucide-react";

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

  const { title, content, resourceDetails, topics, featuredImage, date, modified } = data.resource;
  const isPremium = resourceDetails?.isPremium;
  const experts = resourceDetails?.expertRelationship?.nodes || [];

  // Logic: Calculate estimated reading time (200 words per minute)
  const wordCount = content?.split(/\s+/).length || 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

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
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex gap-2">
              {topics?.nodes?.map((topic) => (
                <Link key={topic.slug} href={`/topic/${topic.slug}`}>
                  <Badge variant="secondary" className="px-3 py-1 hover:bg-primary hover:text-white transition-colors">
                    {topic.name}
                  </Badge>
                </Link>
              ))}
            </div>
            
            <SaveButton slug={slug} />
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">{title}</h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">{resourceDetails?.subtitle}</p>

          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center gap-y-4 gap-x-8 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70">
            {experts.length > 0 && (
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-primary" />
                <span>{experts[0].title} {experts.length > 1 && `+ ${experts.length - 1}`}</span>
              </div>
            )}
            
            {date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                <span>Published {formatDate(date)}</span>
              </div>
            )}

            {modified && modified !== date && (
              <div className="flex items-center gap-2">
                <History className="h-3.5 w-3.5" />
                <span>Updated {formatDate(modified)}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              <span>{readingTime} Min Read</span>
            </div>
          </div>
        </header>

        {/* 4. Gated Logic: Premium vs Public */}
        {isPremium && !userId ? (
          <GatedContent />
        ) : (
          <>
            {/* Featured Image */}
            {featuredImage?.node?.sourceUrl && (
              <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-12 shadow-2xl border border-border/50">
                <Image
                  src={featuredImage.node.sourceUrl}
                  alt={featuredImage.node.altText || title}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            )}

            <AISummary content={content ?? ""} title={title ?? ""} />
            <article
              className="prose dark:prose-invert prose-slate prose-lg max-w-none 
              prose-headings:font-black prose-headings:tracking-tight 
              prose-a:text-primary prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: content ?? "" }}
            />
          </>
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
