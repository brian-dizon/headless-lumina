"use client";

import { useEffect, useState } from "react";
import { smartSearch } from "@/app/actions/ai-search";
import { Search, Sparkles, BrainCircuit, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";

/**
 * SmartSearch Component
 * A global RAG-powered search modal that answers questions based on WordPress content.
 */
export function SmartSearch() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setAnswer(null);

    try {
      const result = await smartSearch(query);
      setAnswer(result.answer || result.error || "No answer found.");
    } catch {
      setAnswer("An error occurred during the search.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2 bg-muted/50 border-primary/20 hover:bg-muted transition-all"
        >
          <Search className="h-4 w-4 xl:mr-2 text-muted-foreground" />
          <span className="hidden xl:inline-flex text-muted-foreground text-xs font-medium">Ask the Architect...</span>
          <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] gap-0 p-0 overflow-hidden border-primary/20 bg-background/95 backdrop-blur-xl">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl font-black uppercase tracking-tight">
            <BrainCircuit className="h-5 w-5 text-primary" />
            Lumina Smart Search
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <form onSubmit={handleSearch} className="relative">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. What is Lumina's stance on Zero Trust?"
              className="h-14 pl-12 pr-12 rounded-2xl border-primary/20 focus-visible:ring-primary shadow-lg"
            />
            <Search className="absolute left-4 top-4 h-6 w-6 text-muted-foreground" />
            {loading && <Loader2 className="absolute right-4 top-4 h-6 w-6 text-primary animate-spin" />}
          </form>

          {/* AI Response Area */}
          <div className="min-h-[200px] rounded-2xl bg-primary/5 border border-primary/10 p-6 relative overflow-hidden">
            {!answer && !loading && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-2 opacity-40 py-10">
                <Sparkles className="h-8 w-8 mb-2" />
                <p className="text-sm font-bold uppercase tracking-widest">Awaiting Inquiry</p>
                <p className="text-xs">The Architect is ready to analyze the Lumina library.</p>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center h-full py-10 space-y-4">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 rounded-full bg-primary animate-bounce" />
                </div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Analyzing Library...</p>
              </div>
            )}

            {answer && (
              <div className="prose prose-sm dark:prose-invert max-w-none animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-primary text-white font-black text-[9px] uppercase tracking-widest px-2 py-0">Answer</Badge>
                </div>
                <div className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed italic border-l-2 border-primary pl-4">
                  {answer}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-muted/30 p-4 border-t flex justify-center">
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="h-3 w-3" /> Powered by Gemini & Lumina Knowledge Base
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
