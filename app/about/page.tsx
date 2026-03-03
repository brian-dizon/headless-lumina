import { GET_PAGE_BLOCKS } from "@/lib/graphql/queries";
import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { getClient } from "@/lib/apollo-client";
import { AboutPageData } from "@/types";

export default async function AboutPage() {
  const { data } = await getClient().query<AboutPageData>({
    query: GET_PAGE_BLOCKS,
    variables: { id: "/about-us/", idType: "URI" },
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
