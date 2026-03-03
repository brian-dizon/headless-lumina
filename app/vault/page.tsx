import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, Star, FileText } from "lucide-react";
import { IndustryPulse } from "@/components/global/IndustryPulse";

export default async function VaultPage() {
    const user = await currentUser();

    // Middleware should technically catch this, but double-checking is safe
    if (!user) {
        redirect("/sign-in");
    }

    return (
        <main className="min-h-[80vh] py-24">
            <div className="container mx-auto px-4 max-w-5xl">
                <header className="mb-12 border-b pb-8 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                        Welcome back, {user.firstName || "Member"}
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Your personal hub for premium Lumina Insights resources.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {/* Quick Stats / Overview Cards */}
                    <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-primary/10 rounded-xl">
                                <BookOpen className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-bold">Reading List</h3>
                        </div>
                        <p className="text-3xl font-black">0</p>
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
                            <h2 className="text-2xl font-bold tracking-tight">Recommended for You</h2>
                            <Button variant="outline" asChild>
                                <Link href="/resources">Browse All Resources</Link>
                            </Button>
                        </div>

                        <div className="p-12 text-center border-2 border-dashed rounded-3xl bg-muted/30">
                            <h3 className="text-xl font-bold mb-2">Your vault is empty</h3>
                            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                Start exploring our library of expert reports, architectural guides, and case studies to build your personalized knowledge base.
                            </p>
                            <Button asChild size="lg" className="rounded-full">
                                <Link href="/resources">Discover Content</Link>
                            </Button>
                        </div>
                    </section>

                    <aside className="lg:col-span-1 sticky top-24">
                        <IndustryPulse />
                    </aside>
                </div>
            </div>
        </main>
    );
}
