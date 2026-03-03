import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Topic = {
  name: string;
  slug: string;
};

type Expert = {
  title: string;
  expertProfile?: {
    jobTitle?: string | null;
    headshot?: {
      node?: {
        sourceUrl?: string | null;
        altText?: string | null;
      } | null;
    } | null;
  } | null;
};

type Resource = {
  slug: string;
  title: string;
  resourceDetails?: {
    subtitle?: string | null;
    isPremium?: boolean | null;
    expertRelationship?: {
      nodes?: Expert[] | null;
    } | null;
  } | null;
  topics?: {
    nodes?: Topic[] | null;
  } | null;
};

interface ResourceCardProps {
  resource: Resource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const { title, resourceDetails, topics } = resource;
  const experts = resourceDetails?.expertRelationship?.nodes || [];
  
  // Senior Logic: Limit to 3 visible avatars
  const MAX_AVATARS = 3;
  const visibleExperts = experts.slice(0, MAX_AVATARS);
  const remainingCount = experts.length - MAX_AVATARS;

  return (
    <Card className="relative flex flex-col h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 group">
      <CardHeader className="space-y-3 pb-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Topics: Higher z-index to sit on top of the card link */}
          <div className="flex gap-1.5 flex-wrap relative z-20">
            {topics?.nodes?.map((topic: Topic) => (
              <Link key={topic.slug} href={`/topic/${topic.slug}`}>
                <Badge variant="secondary" className="px-2 py-0 h-5 text-[10px] font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-colors cursor-pointer">
                  {topic.name}
                </Badge>
              </Link>
            ))}
          </div>
          
          {resourceDetails?.isPremium && (
            <Badge variant="destructive" className="h-5 text-[10px] font-bold uppercase tracking-wider relative z-20">
              Premium
            </Badge>
          )}
        </div>

        {/* The Title Link is the "Main" link. It uses the 'after' pseudo-element to cover the whole card. */}
        <CardTitle className="text-xl leading-snug text-slate-900 dark:text-white group-hover:text-primary">
          <Link href={`/resources/${resource.slug}`} className="after:absolute after:inset-0 after:z-10 focus:outline-none">
            {title}
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
          {resourceDetails?.subtitle}
        </p>
      </CardContent>

      <CardFooter className="border-t bg-muted/30 pt-4 pb-4 px-6 mt-auto">
        <div className="flex items-center gap-4 w-full relative z-20">
          {/* Stacked Avatar Group */}
          {experts.length > 0 && (
            <div className="flex items-center">
              <div className="flex -space-x-3">
                {visibleExperts.map((expert: Expert) => (
                  <Avatar key={expert.title} className="h-8 w-8 ring-2 ring-background shrink-0">
                    <AvatarImage 
                      src={expert.expertProfile?.headshot?.node?.sourceUrl ?? undefined}
                      alt={expert.expertProfile?.headshot?.node?.altText ?? expert.title}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                      {expert.title.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                
                {remainingCount > 0 && (
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted border-2 border-background text-[10px] font-bold text-muted-foreground shrink-0 z-10">
                    +{remainingCount}
                  </div>
                )}
              </div>
              
              <div className="ml-3 overflow-hidden">
                <p className="text-[11px] font-bold text-foreground truncate">
                  {experts.length === 1 
                    ? experts[0].title 
                    : `${experts.length} Contributors`}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {experts.length === 1 
                    ? experts[0].expertProfile?.jobTitle 
                    : "Lumina Expert Team"}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
