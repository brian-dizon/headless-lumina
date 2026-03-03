import { getClient } from "@/lib/apollo-client";
import { gql } from "@apollo/client";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getAuthToken } from "@/lib/auth";
import { draftMode } from "next/headers";

/**
 * 1. The Single Resource Query
 * Fetches a specific resource by its SLUG.
 * We include 'asPreview' to allow fetching draft content.
 */
const GET_RESOURCE_BY_SLUG = gql`
  query GetResourceBySlug($slug: ID!, $asPreview: Boolean) {
    resource(id: $slug, idType: SLUG, asPreview: $asPreview) {
      title
      content
      resourceDetails {
        subtitle
        isPremium
      }
      topics {
        nodes {
          name
          slug
        }
      }
    }
  }
`;

/**
 * 2. TypeScript Data Contract
 */
interface SingleResourceData {
  resource: {
    title: string;
    content: string;
    resourceDetails: {
      subtitle: string;
      isPremium: boolean;
    };
    topics: {
      nodes: Array<{
        name: string;
        slug: string;
      }>;
    };
  } | null;
}

interface AllResourceSlugsData {
  resources: {
    nodes: Array<{
      slug: string;
    }>;
  };
}

/**
 * 3. The Single Resource Page (Main Component)
 */
export default async function SingleResourcePage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ id?: string }>
}) {
  // Await parameters
  const { slug } = await params;
  const { id } = await searchParams;

  // Draft Mode Detection
  const isDraft = (await draftMode()).isEnabled;
  const authToken = isDraft ? getAuthToken() : undefined;

  // 4. Data Fetching
  // Senior Strategy: If we have an ID and are in draft mode, fetch by DATABASE_ID.
  // Otherwise, fetch by the standard SLUG.
  const queryId = isDraft && id ? id : slug;
  const queryIdType = isDraft && id ? "DATABASE_ID" : "SLUG";

  let data;
  try {
    const response = await getClient(authToken).query<SingleResourceData>({
      query: GET_RESOURCE_BY_SLUG,
      variables: { 
        slug: queryId,
        asPreview: isDraft
      },
    });
    // Note: Since we use the same variable name $slug in GQL, we just pass the ID into it. 
    // WordPress handles this correctly as long as idType matches.
    data = response.data;
  } catch (error: any) {
    console.error("GraphQL Error:", JSON.stringify(error, null, 2));
  }

  // Update the query variable name in the call below to match our dynamic switch
  const { data: finalData } = await getClient(authToken).query<SingleResourceData>({
    query: gql`
      query GetResourceBySlug($id: ID!, $idType: ResourceIdType!, $asPreview: Boolean) {
        resource(id: $id, idType: $idType, asPreview: $asPreview) {
          title
          content
          resourceDetails {
            subtitle
            isPremium
          }
          topics {
            nodes {
              name
              slug
            }
          }
        }
      }
    `,
    variables: { 
      id: queryId,
      idType: queryIdType,
      asPreview: isDraft
    },
  });

  if (!finalData?.resource) {
    notFound();
  }

  const { title, content, resourceDetails, topics } = finalData.resource;

  return (
    <main className="min-h-screen">
      {/* Draft Mode Banner */}
      {isDraft && (
        <div className="bg-primary/10 border-b border-primary/20 py-2">
          <div className="container mx-auto px-4 max-w-4xl flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              Preview Mode Active
            </p>
            <Link 
              href="/api/disable-draft" 
              className="text-[10px] font-bold underline hover:text-primary transition-colors"
            >
              Exit Preview
            </Link>
          </div>
        </div>
      )}

      <div className="container mx-auto py-24 px-4 max-w-4xl">
        {/* 6. Article Header Section */}
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
          <p className="text-xl text-muted-foreground leading-relaxed">{resourceDetails.subtitle}</p>
        </header>

        {/* 7. Content Renderer */}
        <article
          className="prose dark:prose-invert prose-slate prose-lg max-w-none 
          prose-headings:font-black prose-headings:tracking-tight 
          prose-a:text-primary prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </main>
  );
}

/**
 * 8. Static Site Generation (SSG) Optimization
 */
export async function generateStaticParams() {
  const { data } = await getClient().query<AllResourceSlugsData>({
    query: gql`
      query GetAllResourceSlugs {
        resources(first: 100) {
          nodes {
            slug
          }
        }
      }
    `,
  });

  if (!data?.resources?.nodes) {
    return [];
  }

  return data.resources.nodes.map((node) => ({ slug: node.slug }));
}
