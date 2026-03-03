"use client";

import { useEffect, useState } from "react";
import { generateExecutiveSummary } from "@/app/actions/ai-summary";
import { Sparkles, BrainCircuit, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AISummaryProps {
  content: string;
  title: string;
}

/**
 * AISummary Component
 * Fetches and displays a 3-bullet technical summary of the article.
 * Uses Shadcn Tooltips for professional fallback info interaction.
 */
export function AISummary({ content, title }: AISummaryProps) {
  const [summary, setSummary] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    async function loadSummary() {
      try {
        const result = await generateExecutiveSummary(content, title);
        if (result.data) setSummary(result.data);
        if (result.warning) setWarning(result.warning);
      } catch (err: unknown) {
        console.error("Summary UI Error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSummary();
  }, [content, title]);

  return (
    <Card className="mb-12 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden relative group">
      {/* Dynamic Background Glow */}
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <BrainCircuit className="h-24 w-24 text-primary" />
      </div>

      <CardHeader className="pb-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`${warning ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-primary/10 text-primary border-primary/20'} font-bold uppercase tracking-tighter text-[10px]`}>
              {warning ? "Standard Insight" : "AI Architect Insight"}
            </Badge>
            
            {warning && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help text-amber-600/50 hover:text-amber-600 transition-colors">
                    <Info className="h-3.5 w-3.5" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-[200px] text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white border-none shadow-xl">
                  <p>{warning}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          {!warning && <Sparkles className="h-4 w-4 text-primary animate-pulse" />}
        </div>
        <CardTitle className="text-xl font-black flex items-center gap-2">
          Executive Summary
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-3 pt-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="h-4 w-4 bg-primary/10 rounded-full shrink-0 animate-pulse" />
                <div className="h-4 bg-muted w-full rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <ul className="space-y-4 pt-4">
            {summary.map((point, index) => (
              <li key={index} className="flex gap-4 items-start group/point">
                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0 group-hover/point:scale-150 transition-transform" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-relaxed tracking-tight italic">
                  &ldquo;{point}&rdquo;
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
