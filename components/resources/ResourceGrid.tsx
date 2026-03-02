import { getClient } from "@/lib/apollo-client";
import { gql } from "@apollo/client";
import { ResourceCard } from "./ResourceCard";

type ResourceNode = {
  title: string;
  slug: string;
  resourceDetails: {
    subtitle: string | null;
    isPremium: boolean | null;
    expertRelationship: {
      nodes: {
        title: string;
        expertProfile: {
          jobTitle: string | null;
          headshot: {
            node: {
              sourceUrl: string;
              altText: string | null;
            } | null;
          } | null;
        } | null;
      }[];
    } | null;
  } | null;
  topics: {
    nodes: {
      name: string;
      slug: string;
    }[];
  } | null;
};

type GetResourcesData = {
  resources: {
    nodes: ResourceNode[];
  };
};

const GET_RESOURCES = gql`
  query GetLuminaResources {
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
                      altText
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

export async function ResourceGrid() {
  const { data } = await getClient().query<GetResourcesData>({
    query: GET_RESOURCES,
  });

  const nodes = data?.resources.nodes ?? [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {nodes.map((resource) => (
        <ResourceCard key={resource.slug} resource={resource} />
      ))}
    </div>
  );
}
