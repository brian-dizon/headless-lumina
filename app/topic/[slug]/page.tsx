import { getClient } from "@/lib/apollo-client";
import { GET_RESOURCES_BY_TOPIC, GET_ALL_TOPIC_SLUGS } from "@/lib/graphql/queries";
import { notFound } from "next/navigation";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { PageHeader } from "@/components/global/PageHeader";
import { TopicPageData, GetAllTopicsData } from "@/types";

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data } = await getClient().query<TopicPageData>({
    query: GET_RESOURCES_BY_TOPIC,
    variables: { topicSlug: [slug] },
  });

  const topic = data?.topics?.nodes?.[0];

  if (!topic) {
    return notFound();
  }

  const resources = topic.resources?.nodes || [];

  return (
    <main className="min-h-screen">
      <div className="container mx-auto py-16 px-4 max-w-7xl">
        <PageHeader eyebrow="Browse Topic" title={topic.name} description={topic.description || `Explore our latest insights and reports on ${topic.name}.`} />

        {resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource) => (
              <ResourceCard key={resource.slug} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-muted-foreground font-medium">
              No resources have been tagged with <span className="text-foreground font-bold">{topic.name}</span> yet.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  const { data } = await getClient().query<GetAllTopicsData>({
    query: GET_ALL_TOPIC_SLUGS,
  });

  if (!data?.topics?.nodes) {
    return [];
  }

  return data.topics.nodes.map((topic) => ({
    slug: topic.slug,
  }));
}
