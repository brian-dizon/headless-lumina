import { getClient } from "@/lib/apollo-client";
import { gql } from "@apollo/client";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// The GraphQL Query: We fetch the slug as a variable
const GET_RESOURCE_BY_SLUG = gql`
  query GetResourceBySlug($slug: ID!) {
    resource(id: $slug, idType: SLUG) {
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

// TypeScript: Always define what your data looks like!
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
  } | null; // It can be null if not found
}

interface AllResourceSlugsData {
  resources: {
    nodes: Array<{
      slug: string;
    }>;
  };
}

export default async function SingleResourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // 1. Fetch from WordPress
  const { data } = await getClient().query<SingleResourceData>({
    query: GET_RESOURCE_BY_SLUG,
    variables: { slug },
  });

  // 2. Error Handling: If WordPress can't find the resource, show a 404
  if (!data?.resource) {
    notFound();
  }

  const { title, content, resourceDetails, topics } = data.resource;
  return (
    <main className="min-h-screen">
      <div className="container mx-auto py-24 px-4 max-w-4xl">
        {/* Header Section */}
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

        {/* The "Senior" Content Renderer */}
        {/* 'prose' activates the Typography plugin we just installed! */}
        <article className="prose dark:prose-invert prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight  prose-a:text-primary prose-img:rounded-xl" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </main>
  );
}

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
