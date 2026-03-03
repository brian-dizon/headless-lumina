import { getClient } from "@/lib/apollo-client";
import { gql } from "@apollo/client";
import { notFound } from "next/navigation";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { PageHeader } from "@/components/global/PageHeader";

/**
 * 1. The Relational Collection Query
 * This query is more complex than a standard post fetch.
 * - We target the 'topics' taxonomy.
 * - We filter by slug using the 'where' argument.
 * - We "nest" the resources query inside the topic node. This is the 
 *   GraphQL way of saying: "Give me this topic, and all posts linked to it."
 */
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

/**
 * 2. Data Integrity Interfaces
 * We define the structure of the WordPress response.
 * Note the use of 'TopicResource' interface—this ensures that the 
 * resources fetched here match the 'ResourceCard' prop requirements
 * exactly, preventing runtime UI errors.
 */
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

/**
 * 3. The Topic Archive Page (Main Controller)
 * Handles the logic for rendering a specific category/topic archive.
 */
export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  /**
   * 3a. Route Parameter Resolution
   * In Next.js 15, 'params' is a Promise. We must 'await' it to 
   * access the dynamic slug from the URL (e.g., 'cloud-computing').
   */
  const { slug } = await params;

  /**
   * 3b. Data Fetching via Singleton
   * We pass the 'slug' variable to GraphQL. 
   * IMPORTANT: We wrap the slug in an array [slug] because the 
   * WPGraphQL 'where' filter for taxonomies expects an array of strings.
   */
  const { data } = await getClient().query<TopicPageData>({
    query: GET_RESOURCES_BY_TOPIC,
    variables: { topicSlug: [slug] },
  });

  // Extract the specific topic node (the first and only match)
  const topic = data?.topics?.nodes?.[0];

  /**
   * 3c. The "Defensive" 404
   * If an editor deletes a topic in WP but the URL still exists in 
   * a user's browser, we catch the 'null' response and show a 404.
   */
  if (!topic) {
    return notFound();
  }

  const resources = topic.resources?.nodes || [];

  return (
    <main className="min-h-screen">
      <div className="container mx-auto py-16 px-4 max-w-7xl">
        
        {/** 
         * 4. Page Branding
         * Reuses the global PageHeader. If the topic has no description 
         * in WordPress, we provide a smart fallback string.
         */}
        <PageHeader 
          eyebrow="Browse Topic" 
          title={topic.name} 
          description={topic.description || `Explore our latest insights and reports on ${topic.name}.`} 
        />

        {/** 
         * 5. The Filtered Grid
         * If resources are found, we map them into cards. 
         * If not, we show a professional 'Empty State'.
         */}
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

/**
 * 6. Static Site Generation (Build Optimization)
 * This function crawls your entire WordPress taxonomy at Build Time.
 * It ensures that every topic page is generated as a static HTML file
 * on the server, making the site load instantly for the user.
 */
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

  // Return the array of slugs in the format Next.js requires
  return data.topics.nodes.map((topic) => ({
    slug: topic.slug,
  }));
}
