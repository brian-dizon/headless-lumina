import { GET_PAGE_BLOCKS } from "@/lib/graphql/queries";
import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { getClient } from "@/lib/apollo-client";
import { AboutPageData } from "@/types";
import { ContactForm } from "@/components/global/ContactForm";

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

        {/* Contact Section */}
        <div className="mt-32 pt-20 border-t border-border/50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-6">
              <h2 className="text-4xl font-black tracking-tight">Ready to start a <span className="text-primary italic">Transformation</span>?</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Whether you need a full architectural audit or just a second opinion on your cloud strategy, our experts are here to help.
              </p>
              <div className="pt-8 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">1</div>
                  <p className="font-bold">Submit your technical inquiry</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">2</div>
                  <p className="font-bold">Expert matching in 24 hours</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">3</div>
                  <p className="font-bold">Scale with confidence</p>
                </div>
              </div>
            </div>
            
            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  );
}
