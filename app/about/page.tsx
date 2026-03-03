import { gql } from "@apollo/client";
import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { getClient } from "@/lib/apollo-client";

const GET_PAGE_BLOCKS = gql`
  query GetPageBlocks($id: ID!) {
    page(id: $id, idType: URI) {
      title
      editorBlocks {
        name
        renderedHtml
        ... on CoreHeading {
          attributes {
            level
          }
        }
        ... on CoreQuote {
          attributes {
            value
          }
        }
      }
    }
  }
`;

interface AboutPageData {
  page: {
    title: string;
    editorBlocks: Array<{
      name: string;
      renderedHtml: string;
      attributes?: {
        level?: number;
        [key: string]: unknown;
      } | null;
    }> | null;
  } | null;
}

export default async function AboutPage() {
  const { data } = await getClient().query<AboutPageData>({
    query: GET_PAGE_BLOCKS,
    variables: { id: "/about-us/" },
  });

  if (!data?.page) {
    notFound();
  }

  const blocks = data.page.editorBlocks ?? [];

  return (
    <main className="min-h-screen">
      <div className="container mx-auto py-24 px-4 max-w-5xl">
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4">{data.page.title}</h1>
          <div className="h-2 w-20 bg-primary rounded-full" />
        </div>
        <BlockRenderer blocks={blocks} />
      </div>
    </main>
  );
}
