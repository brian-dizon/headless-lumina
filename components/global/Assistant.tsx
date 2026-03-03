"use client";

import { useState, useRef, useEffect } from "react";
import { assistantChat } from "@/app/actions/ai-chat";
import { 
  BrainCircuit, 
  X, 
  Send, 
  User, 
  Bot,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

/**
 * Assistant Component (Reliable Version)
 * Uses Server Actions for high-compatibility technical guidance.
 */
export function Assistant() {
  const [isOpen, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm the Lumina Assistant. Ask me anything about our architectural guides and research reports."
    }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await assistantChat([...messages, userMessage]);
      
      const assistantMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        role: "assistant", 
        content: response.answer || response.error || "I encountered an error." 
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setMessages(prev => [...prev, { id: "err", role: "assistant", content: "Connectivity issue. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {isOpen && (
        <Card className="mb-4 w-[380px] sm:w-[420px] h-[500px] shadow-2xl border-primary/20 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300 bg-background/95 backdrop-blur-xl">
          <CardHeader className="p-4 border-b bg-primary/5 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <BrainCircuit className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm font-black uppercase tracking-tight">Lumina Assistant</CardTitle>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Architect Online</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-grow p-0 overflow-hidden">
            <ScrollArea ref={scrollRef} className="h-full p-4">
              <div className="space-y-6">
                {messages.map((m) => (
                  <div key={m.id} className={cn("flex gap-3", m.role === "user" ? "flex-row-reverse" : "flex-row")}>
                    <div className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border",
                      m.role === "user" ? "bg-muted border-border" : "bg-primary/10 border-primary/20"
                    )}>
                      {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-primary" />}
                    </div>
                    <div className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                      m.role === "user" 
                        ? "bg-primary text-white font-medium rounded-tr-none" 
                        : "bg-muted/50 border border-border/50 text-foreground rounded-tl-none italic"
                    )}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 animate-in fade-in duration-300">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <Bot className="h-4 w-4 text-primary animate-pulse" />
                    </div>
                    <div className="bg-muted/50 border border-border/50 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
                      <Loader2 className="h-3 w-3 text-primary animate-spin" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Architect is thinking...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>

          <CardFooter className="p-4 border-t bg-muted/20">
            <form onSubmit={handleSend} className="flex w-full gap-2 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about our architecture..."
                className="h-11 rounded-xl bg-background border-border/50 focus-visible:ring-primary pr-12 shadow-sm"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="icon" 
                className="absolute right-1 top-1 h-9 w-9 rounded-lg transition-all"
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}

      {!isOpen && (
        <Button 
          onClick={() => setOpen(true)}
          className="h-14 w-14 rounded-2xl shadow-2xl shadow-primary/40 flex items-center justify-center group transition-all hover:scale-110 active:scale-95"
        >
          <div className="relative">
            <BrainCircuit className="h-7 w-7 transition-transform group-hover:rotate-12" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 border-2 border-primary rounded-full animate-pulse" />
          </div>
        </Button>
      )}
    </div>
  );
}
