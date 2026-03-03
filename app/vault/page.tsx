import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, Star, FileText, ArrowRight } from "lucide-react";
import { IndustryPulse } from "@/components/global/IndustryPulse";
import { getClient } from "@/lib/apollo-client";
import { GET_RESOURCES } from "@/lib/graphql/queries";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { GetResourcesData } from "@/types";

export default async function VaultPage() {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    // 1. Get saved slugs from Clerk metadata
    const readingListSlugs = (user.publicMetadata.readingList as string[]) || [];

    // 2. Fetch resources from WordPress to match slugs
    const { data } = await getClient().query<GetResourcesData>({
        query: GET_RESOURCES,
        variables: { first: 100 }
    });

    const allResources = data?.resources?.nodes || [];
    const savedResources = allResources.filter(res => readingListSlugs.includes(res.slug));

    return (
        <main className="min-h-[80vh] py-24">
            <div className="container mx-auto px-4 max-w-7xl">
                <header className="mb-12 border-b pb-8 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                        Welcome back, {user.firstName || "Member"}
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Your personal hub for premium Lumina Insights resources.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-primary/10 rounded-xl">
                                <BookOpen className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-bold">Reading List</h3>
                        </div>
                        <p className="text-3xl font-black">{readingListSlugs.length}</p>
                        <p className="text-sm text-muted-foreground">Saved for later</p>
                    </div>

                    <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-primary/10 rounded-xl">
                                <Star className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-bold">Premium Access</h3>
                        </div>
                        <p className="text-3xl font-black">Active</p>
                        <p className="text-sm text-muted-foreground">Unlimited reports</p>
                    </div>

                    <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-primary/10 rounded-xl">
                                <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-bold">Downloads</h3>
                        </div>
                        <p className="text-3xl font-black">0</p>
                        <p className="text-sm text-muted-foreground">PDFs generated</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                    <section className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold tracking-tight">Your Reading List</h2>
                            <Button variant="outline" asChild size="sm" className="rounded-full">
                                <Link href="/resources">Browse All <ArrowRight className="ml-2 h-4 w-4" /></Link>
                            </Button>
                        </div>

                        {savedResources.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {savedResources.map((res) => (
                                    <ResourceCard key={res.slug} resource={res} />
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center border-2 border-dashed rounded-3xl bg-muted/30">
                                <h3 className="text-xl font-bold mb-2">Your list is empty</h3>
                                <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">
                                    Bookmark expert reports and architectural guides to build your personalized knowledge base.
                                </p>
                                <Button asChild size="lg" className="rounded-full font-bold">
                                    <Link href="/resources">Explore Resources</Link>
                                </Button>
                            </div>
                        )}
                    </section>

                    <aside className="lg:col-span-1 sticky top-24">
                        <IndustryPulse />
                    </aside>
                </div>
            </div>
        </main>
    );
}
