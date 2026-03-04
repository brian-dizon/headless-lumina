import { getIndustryPulse } from "@/lib/external-api";
import { ExternalLink, Zap, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

/**
 * IndustryPulse Component
 * Displays live, tech-focused news in a high-end corporate style.
 * Fetches data on the server for speed and SEO.
 */
export async function IndustryPulse() {
  const data = await getIndustryPulse();

  if (!data.hits || data.hits.length === 0) {
    return null; // Don't render if there's no data
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden" id="industry-pulse">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-bold uppercase tracking-tighter text-[10px]">
            Live Feed
          </Badge>
          <Zap className="h-4 w-4 text-primary animate-pulse" />
        </div>
        <CardTitle className="text-xl font-black">The Industry Pulse</CardTitle>
        <CardDescription>
          Real-time insights and architectural trends from the global tech community.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {data.hits.map((item) => (
          <a
            key={item.objectID}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-4 rounded-xl border border-transparent bg-background/50 hover:bg-white dark:hover:bg-slate-900 hover:border-border/50 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-bold text-sm line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                  {item.title}
                </h4>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                  <span className="flex items-center gap-1 italic">
                    <TrendingUp className="h-3 w-3" /> {item.points} Points
                  </span>
                  <span>by {item.author}</span>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
            </div>
          </a>
        ))}
      </CardContent>
    </Card>
  );
}
