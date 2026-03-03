import { BookOpen, Users, ShieldCheck } from "lucide-react";

export function Features() {
  return (
    <section className="py-20 bg-white dark:bg-background border-b">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col gap-4">
            <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center text-primary">
              <BookOpen className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold">Comprehensive Research</h2>
            <p className="text-muted-foreground">Deep dives into zero-trust security, cloud migration, and AI implementation.</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center text-primary">
              <Users className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold">Expert-Led Insights</h2>
            <p className="text-muted-foreground">Authored by world-class solutions architects and industry strategists.</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold">Premium Reports</h2>
            <p className="text-muted-foreground">Gated whitepapers and architectural blueprints for advanced teams.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
