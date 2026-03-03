import { getClient } from "@/lib/apollo-client";
import { gql } from "@apollo/client";
import { notFound } from "next/navigation";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Linkedin, Twitter, Globe } from "lucide-react";

// The GraphQL Query: We fetch the expert and THEIR specific resources
const GET_EXPERT_BY_SLUG = gql`
  query GetExpertBySlug($slug: ID!) {
    expert(id: $slug, idType: SLUG) {
      title
      slug
      expertProfile {
        jobTitle
        bio
        headshot {
          node {
            sourceUrl
          }
        }
      }
    }
    resources(first: 100) {
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
                slug
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
`;

interface SingleExpertData {
  expert: {
    title: string;
    slug: string;
    expertProfile: {
      jobTitle: string;
      bio: string;
      headshot: {
        node: {
          sourceUrl: string;
        };
      };
    };
  } | null;
  resources: {
    nodes: ExpertResource[];
  } | null;
}

interface ExpertResource {
  slug: string;
  title: string;
  resourceDetails?: {
    subtitle?: string | null;
    isPremium?: boolean | null;
    expertRelationship?: {
      nodes?: Array<{
        title: string;
        slug: string;
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

interface GetAllExpertSlugsData {
  experts: {
    nodes: Array<{
      slug: string;
    }>;
  };
}

export default async function ExpertSinglePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: expertSlug } = await params;

  const { data } = await getClient().query<SingleExpertData>({
    query: GET_EXPERT_BY_SLUG,
    variables: { slug: expertSlug },
  });

  if (!data?.expert) {
    notFound();
  }

  const { title, expertProfile } = data.expert;
  const allResources = data?.resources?.nodes ?? [];
  const authoredResources = allResources.filter((resource) =>
    resource.resourceDetails?.expertRelationship?.nodes?.some((expert) => expert.slug === expertSlug)
  );

  return (
    <main className="min-h-screen">
      {/* 1. Expert Hero Section */}
      <section className="bg-slate-50 dark:bg-slate-900/50 border-b py-20 overflow-hidden relative">
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-12 items-center">
            {/* Left: Large Headshot with Glow */}
            <div className="relative group mx-auto md:mx-0">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-110 opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
              <Avatar className="h-64 w-64 ring-8 ring-white dark:ring-slate-800 shadow-2xl relative z-10 animate-in fade-in zoom-in duration-1000">
                <AvatarImage src={expertProfile?.headshot?.node?.sourceUrl} className="object-cover" />
                <AvatarFallback className="text-6xl font-black bg-primary/5 text-primary">{title.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>

            {/* Right: Identity & Bio */}
            <div className="space-y-6 animate-in slide-in-from-right-12 duration-1000">
              <div>
                <Badge variant="outline" className="mb-4 px-3 py-1 text-primary border-primary/20 bg-primary/5">
                  Lumina Principal Expert
                </Badge>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-2 leading-none">{title}</h1>
                <p className="text-xl font-bold text-primary uppercase tracking-widest text-[11px]">{expertProfile?.jobTitle}</p>
              </div>

              <div className="prose dark:prose-invert prose-lg text-muted-foreground leading-relaxed max-w-2xl">
                <p>{expertProfile?.bio || "Expert insights on architecture, security, and digital transformation at the enterprise level."}</p>
              </div>

              <div className="flex items-center gap-6 pt-6 border-t border-border/50 text-muted-foreground/60">
                <Globe className="h-5 w-5 hover:text-primary transition-colors cursor-pointer" />
                <Linkedin className="h-5 w-5 hover:text-primary transition-colors cursor-pointer" />
                <Twitter className="h-5 w-5 hover:text-primary transition-colors cursor-pointer" />
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Background Symbol */}
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] dark:opacity-[0.05] pointer-events-none select-none rotate-12">
          <BookOpen className="h-96 w-96 text-primary" strokeWidth={1} />
        </div>
      </section>

      {/* 2. Resources Feed */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-end justify-between mb-12 border-b pb-8">
            <div className="space-y-1">
              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Insights from <span className="text-primary">{title.split(" ")[0]}</span>
              </h2>
              <p className="text-muted-foreground">Detailed reports and engineering guides authored by this expert.</p>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{authoredResources.length} Publications</p>
            </div>
          </div>

          {authoredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {authoredResources.map((resource) => (
                <ResourceCard key={resource.slug} resource={resource} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-muted-foreground font-medium">No resources have been authored by this expert yet.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export async function generateStaticParams() {
  const { data } = await getClient().query<GetAllExpertSlugsData>({
    query: gql`
      query GetAllExpertSlugs {
        experts(first: 100) {
          nodes {
            slug
          }
        }
      }
    `,
  });

  if (!data?.experts?.nodes) {
    return [];
  }

  return data.experts.nodes.map((node) => ({
    slug: node.slug,
  }));
}
