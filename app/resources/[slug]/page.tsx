import { getClient } from "@/lib/apollo-client";
import { gql } from "@apollo/client";
import { notFound } from "next/navigation";

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

  const { title, content, resourceDetails } = data.resource;
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto py-24 px-4 max-w-4xl">
        {/* Header Section */}
        <header className="mb-12 border-b pb-8">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">{title}</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">{resourceDetails.subtitle}</p>
        </header>

        {/* The "Senior" Content Renderer */}
        {/* 'prose' activates the Typography plugin we just installed! */}
        <article className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight  prose-a:text-primary prose-img:rounded-xl" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  // This function is used to pre-render all the pages at build time.
  // You can fetch all slugs from WordPress here and return them as an array of params.
  // For example:
  // const { data } = await getClient().query({ query: gql`{ resources { nodes { slug } } }` });
  // return data.resources.nodes.map((node: { slug: string }) => ({ slug: node.slug }));

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
