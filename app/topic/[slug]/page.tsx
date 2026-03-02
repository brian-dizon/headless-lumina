import { getClient } from "@/lib/apollo-client";
import { gql } from "@apollo/client";
import { notFound } from "next/navigation";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { PageHeader } from "@/components/global/PageHeader";

// 1. The GraphQL Query: We fetch the Topic AND its connected Resources
const GET_RESOURCES_BY_TOPIC = gql`
  query GetResourcesByTopic($topicSlug: [String]!) {
    topics(where: { slug: $topicSlug }) {
      nodes {
        name
        description
        resources {
          nodes {
            title
            slug
            resourceDetails {
              subtitle
              isPremium
              expertRelationship {
                nodes {
                  ... on Expert {
                    title
                    expertProfile {
                      jobTitle
                      headshot {
                        node {
                          sourceUrl
                        }
                      }
                    }
                  }
                }
              }
            }
            topics {
              nodes {
                name
                slug
              }
            }
          }
        }
      }
    }
  }
`;

interface TopicPageData {
  topics: {
    nodes: Array<{
      name: string;
      description: string | null;
      resources: {
        nodes: TopicResource[];
      };
    }>;
  };
}

interface TopicResource {
  slug: string;
  title: string;
  resourceDetails?: {
    subtitle?: string | null;
    isPremium?: boolean | null;
    expertRelationship?: {
      nodes?: Array<{
        title: string;
        expertProfile?: {
          jobTitle?: string | null;
          headshot?: {
            node?: {
              sourceUrl?: string | null;
              altText?: string | null;
            } | null;
          } | null;
        } | null;
      }> | null;
    } | null;
  } | null;
  topics?: {
    nodes?: Array<{
      name: string;
      slug: string;
    }> | null;
  } | null;
}

interface GetAllTopicsData {
  topics: {
    nodes: Array<{
      slug: string;
    }>;
  };
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Fetch data from WordPress (passing slug inside an array [])
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
        {/* Topic Header */}
        <PageHeader eyebrow="Browse Topic" title={topic.name} description={topic.description || `Explore our latest insights and reports on ${topic.name}.`} />

        {/* The Results Grid */}
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

// 2. Static Optimization: Pre-build all topic pages
export async function generateStaticParams() {
  const { data } = await getClient().query<GetAllTopicsData>({
    query: gql`
      query GetAllTopics {
        topics(first: 100) {
          nodes {
            slug
          }
        }
      }
    `,
  });

  if (!data?.topics?.nodes) {
    return [];
  }

  return data.topics.nodes.map((topic) => ({
    slug: topic.slug,
  }));
}
