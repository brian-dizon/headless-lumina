import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowRight, Twitter, Linkedin, Globe } from "lucide-react";

interface ExpertCardProps {
  expert: {
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
}

export function ExpertCard({ expert }: ExpertCardProps) {
  const { title, slug, expertProfile } = expert;

  return (
    <Link href={`/experts/${slug}`} className="group block h-full">
      <Card className="relative h-full overflow-hidden border-border/50 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 ease-in-out group-hover:-translate-y-2">
        {/* Subtle Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10 transition-all duration-700 ease-in-out group-hover:scale-150 group-hover:-translate-x-4 group-hover:translate-y-4" />
        
        <CardContent className="relative z-10 p-8 flex flex-col items-center text-center h-full">
          {/* Headshot with Premium Border */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-0 group-hover:scale-110 transition-all duration-700 ease-in-out" />
            <Avatar className="h-28 w-28 ring-4 ring-background shadow-2xl transition-all duration-500 ease-in-out group-hover:ring-primary/20 scale-100 group-hover:scale-105 overflow-hidden">
              {expertProfile?.headshot?.node?.sourceUrl ? (
                <Image 
                  src={expertProfile.headshot.node.sourceUrl}
                  alt={expertProfile.headshot.node.altText || title}
                  width={112}
                  height={112}
                  className="aspect-square h-full w-full object-cover"
                />
              ) : (
                <AvatarFallback className="text-2xl font-black bg-primary/5 text-primary">
                  {title.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
          </div>

          {/* Identity */}
          <div className="space-y-1.5 mb-6">
            <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary/80">
              {expertProfile?.jobTitle || "Lumina Expert"}
            </p>
          </div>

          {/* Bio Snippet */}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-8 flex-grow">
            {expertProfile?.bio || "Expert insights on architecture, security, and digital transformation."}
          </p>

          {/* Social / Footer */}
          <div className="flex items-center gap-4 pt-6 border-t border-border/50 w-full justify-center text-muted-foreground/40">
            <Globe className="h-4 w-4 hover:text-primary transition-colors cursor-pointer" />
            <Linkedin className="h-4 w-4 hover:text-primary transition-colors cursor-pointer" />
            <Twitter className="h-4 w-4 hover:text-primary transition-colors cursor-pointer" />
            <div className="h-4 w-px bg-border/50 mx-2" />
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary">
              Profile <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
