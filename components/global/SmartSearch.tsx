"use client";

import { useState, useEffect } from "react";
import { smartSearch } from "@/app/actions/ai-search";
import { performSearch, SearchResult } from "@/app/actions/search";
import { Search, Sparkles, BrainCircuit, Loader2, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";

/**
 * Hybrid SmartSearch Component
 * 1. AJAX Search: Instant keyword matching from WordPress (Sub-100ms)
 * 2. AI Search: Deep technical synthesis (On-demand)
 */
export function SmartSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [isSearching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);

  // Keyboard Shortcut: Cmd+K to open
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // AJAX Search Logic (Debounced)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setSearching(true);
        const data = await performSearch(query);
        setResults(data);
        setSearching(false);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // AI Search Logic (On-demand)
  async function handleAiInquiry(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setAiAnswer(null);

    try {
      const result = await smartSearch(query);
      setAiAnswer(result.answer || "I couldn't synthesize a deep answer. Try a different technical question.");
    } catch {
      setAiAnswer("AI Recalibration required. Showing library matches instead.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          aria-label="Search Lumina Library"
          className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2 bg-muted/50 border-primary/20 hover:bg-muted transition-all"
        >
          <Search className="h-4 w-4 xl:mr-2 text-muted-foreground" />
          <span className="hidden xl:inline-flex text-muted-foreground text-xs font-medium">Search Lumina Library...</span>
          <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[650px] gap-0 p-0 overflow-hidden border-primary/20 bg-background/95 backdrop-blur-xl flex flex-col h-[600px]">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl font-black uppercase tracking-tight">
            <Search className="h-5 w-5 text-primary" />
            Lumina Search
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6 flex-grow overflow-hidden flex flex-col">
          <div className="relative">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAiInquiry()}
              placeholder="Start typing to find resources..."
              className="h-14 pl-12 pr-12 rounded-2xl border-primary/20 focus-visible:ring-primary shadow-lg"
            />
            <Search className="absolute left-4 top-4 h-6 w-6 text-muted-foreground" />
            {isSearching && <Loader2 className="absolute right-4 top-4 h-6 w-6 text-primary animate-spin" />}
          </div>

          <div className="flex-grow overflow-y-auto pr-2 space-y-6 custom-scrollbar">
            {/* 1. AJAX Results (Always Reliable) */}
            {results.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Matching Resources</h3>
                  <Badge variant="outline" className="text-[9px] font-bold uppercase">{results.length} Matches</Badge>
                </div>
                <div className="grid gap-2">
                  {results.map((res) => (
                    <Link 
                      key={res.id} 
                      href={`/resources/${res.slug}`}
                      onClick={() => setOpen(false)}
                      className="group flex items-center justify-between p-4 rounded-xl border bg-background hover:border-primary/50 hover:bg-primary/5 transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                          <FileText className="h-5 w-5 text-primary group-hover:text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm leading-none group-hover:text-primary transition-colors">{res.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{res.resourceDetails?.subtitle}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-all group-hover:translate-x-1" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 2. AI Deep Insight (On Demand) */}
            {query.length >= 3 && (
              <div className="pt-4 border-t border-dashed">
                {!aiAnswer && !isLoading ? (
                  <Button 
                    onClick={() => handleAiInquiry()}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-emerald-600 hover:opacity-90 font-bold gap-2 shadow-lg shadow-primary/20"
                  >
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    Ask the Architect for a Deep Insight
                  </Button>
                ) : (
                  <div className="rounded-2xl bg-primary/5 border border-primary/10 p-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <BrainCircuit className="h-4 w-4 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Architectural Insight</span>
                      </div>
                      {isLoading && <Loader2 className="h-3 w-3 text-primary animate-spin" />}
                    </div>
                    
                    {isLoading ? (
                      <div className="space-y-2 py-4">
                        <div className="h-3 bg-primary/10 rounded w-full animate-pulse" />
                        <div className="h-3 bg-primary/10 rounded w-[90%] animate-pulse" />
                        <div className="h-3 bg-primary/10 rounded w-[75%] animate-pulse" />
                      </div>
                    ) : (
                      <div className="text-sm font-medium leading-relaxed text-slate-700 dark:text-slate-200 italic border-l-2 border-primary pl-4">
                        {aiAnswer}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {query.length < 2 && !results.length && (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
                <Search className="h-12 w-12 mb-4" />
                <p className="text-sm font-bold uppercase tracking-widest">Library Search Ready</p>
                <p className="text-xs">Find architectural patterns and expert reports instantly.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-muted/30 p-4 border-t flex justify-center">
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-2">
            Lumina Real-time Indexing Active
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
