"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Globe, Sparkles, ShieldCheck } from "lucide-react";

interface Topic {
  id: string;
  name: string;
  slug: string;
}

interface ResourceFiltersProps {
  topics: Topic[];
}

/**
 * ResourceFilters Component
 * Optimized for Mobile: Centers pills and hides complex filters on small screens.
 * Desktop: Single-row high-density filter bar.
 */
export function ResourceFilters({ topics }: ResourceFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentTopic = searchParams.get("topic") || "all";
  const currentAccess = searchParams.get("access") || "all";

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page");
    router.push(`/resources?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="mb-12 space-y-6 animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="flex flex-row items-center justify-center sm:justify-between gap-4">
        
        {/* 1. Topic Pills - Centered on Mobile */}
        <div className="flex flex-wrap gap-2 items-center justify-center sm:justify-start">
          <Badge
            variant={currentTopic === "all" ? "default" : "outline"}
            className={cn(
              "px-4 py-1.5 cursor-pointer text-[10px] font-black uppercase tracking-wider transition-all h-[32px] flex items-center",
              currentTopic === "all" ? "shadow-md shadow-primary/20" : "bg-background/50 hover:bg-muted"
            )}
            onClick={() => setFilter("topic", "all")}
          >
            All Domains
          </Badge>
          {topics.map((topic) => (
            <Badge
              key={topic.id}
              variant={currentTopic === topic.slug ? "default" : "outline"}
              className={cn(
                "px-4 py-1.5 cursor-pointer text-[10px] font-black uppercase tracking-wider transition-all h-[32px] flex items-center",
                currentTopic === topic.slug ? "shadow-md shadow-primary/20" : "bg-background/50 hover:bg-muted"
              )}
              onClick={() => setFilter("topic", topic.slug)}
            >
              {topic.name}
            </Badge>
          ))}
        </div>

        {/* 2. Miniaturized Access Dropdown - Hidden on Mobile */}
        <div className="hidden sm:block min-w-[160px] shrink-0">
          <Select 
            value={currentAccess} 
            onValueChange={(value) => setFilter("access", value)}
          >
            <SelectTrigger className="rounded-full h-[32px] text-[10px] font-black uppercase tracking-wider px-4 border-border/50 bg-background/50 backdrop-blur-sm shadow-sm hover:border-primary/30 transition-all">
              <div className="flex items-center gap-2">
                <SelectValue placeholder="Access" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <Globe className="h-3 w-3 text-slate-400" />
                  <span>All Content</span>
                </div>
              </SelectItem>
              <SelectItem value="free">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3 w-3 text-emerald-500" />
                  <span>Public</span>
                </div>
              </SelectItem>
              <SelectItem value="premium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3 w-3 text-primary" />
                  <span>Premium</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

      </div>

      {/* Subtle Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-border/40 to-transparent" />
    </div>
  );
}
