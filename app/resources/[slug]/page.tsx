import { getClient } from "@/lib/apollo-client";
import { gql } from "@apollo/client";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

/**
 * 1. The Single Resource Query
 * Fetches a specific resource by its SLUG. 
 * We include the 'content' (raw WordPress HTML) and 'topics' 
 * to provide a rich, deep-linked article experience.
 */
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

/**
 * 2. TypeScript Data Contract
 * Defines the expected shape of a single resource.
 * The 'resource' field is nullable to handle cases where WP returns no match.
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
 * Uses Next.js 15 Promise-based params to identify the specific resource.
 */
export default async function SingleResourcePage({ params }: { params: Promise<{ slug: string }> }) {
  // Await the slug from the URL parameters
  const { slug } = await params;

  // 4. Data Fetching
  // Calls our Apollo singleton, passing the slug as a GraphQL variable.
  const { data } = await getClient().query<SingleResourceData>({
    query: GET_RESOURCE_BY_SLUG,
    variables: { slug },
  });

  // 5. 404 Handling
  // If the slug doesn't exist in WordPress, we trigger the Next.js notFound() 
  // function to show the system 404 page instead of a broken UI.
  if (!data?.resource) {
    notFound();
  }

  const { title, content, resourceDetails, topics } = data.resource;

  return (
    <main className="min-h-screen">
      <div className="container mx-auto py-24 px-4 max-w-4xl">
        
        {/* 6. Article Header Section */}
        <header className="mb-12 border-b pb-8">
          {/* Internal Linking: Topic Breadcrumbs */}
          <div className="flex gap-2 mb-6">
            {topics?.nodes?.map((topic) => (
              <Link key={topic.slug} href={`/topic/${topic.slug}`}>
                <Badge variant="secondary" className="px-3 py-1 hover:bg-primary hover:text-white transition-colors">
                  {topic.name}
                </Badge>
              </Link>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
            {title}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {resourceDetails.subtitle}
          </p>
        </header>

        {/* 7. The Content Renderer (Senior Pattern)
            'prose' enables the @tailwindcss/typography plugin.
            'dark:prose-invert' handles theme switching for WP HTML.
            'dangerouslySetInnerHTML' is used here because we trust the WP source. */}
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
 * Pre-builds every single resource page as static HTML at build time.
 * This ensures 0ms latency for the user and maximum SEO value.
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

  // Returns an array of objects: [{ slug: 'post-1' }, { slug: 'post-2' }]
  return data.resources.nodes.map((node) => ({ slug: node.slug }));
}
