import { getClient } from "@/lib/apollo-client";
import { GET_EXPERTS } from "@/lib/graphql/queries";
import { ExpertCard } from "./ExpertCard";

type ExpertNode = {
  title: string;
  slug: string;
  expertProfile: {
    jobTitle: string | null;
    bio: string | null;
    headshot: {
      node: {
        sourceUrl: string;
        altText: string | null;
      } | null;
    } | null;
  } | null;
};

type GetExpertsData = {
  experts: {
    nodes: ExpertNode[];
  };
};

export async function ExpertGrid() {
  const { data } = await getClient().query<GetExpertsData>({
    query: GET_EXPERTS,
    variables: { first: 100 }
  });

  const nodes = data?.experts?.nodes || [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {nodes.map((expert) => (
        <ExpertCard key={expert.slug} expert={expert} />
      ))}
    </div>
  );
}
