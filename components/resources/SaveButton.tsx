"use client";

import { useTransition, useState } from "react";
import { toggleReadingList } from "@/app/actions/reading-list";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

interface SaveButtonProps {
  slug: string;
  className?: string;
}

/**
 * SaveButton Component
 * Handles the "Add to Reading List" interaction with Clerk.
 * Features instant local state toggling + optimistic UI.
 * Refactored to avoid cascading renders in useEffect.
 */
export function SaveButton({ slug, className }: SaveButtonProps) {
  const { user, isLoaded, isSignedIn } = useUser();
  const [isPending, startTransition] = useTransition();
  
  // 1. Check if the resource is in the user's reading list
  const isSavedInMetadata = (user?.publicMetadata?.readingList as string[] || []).includes(slug);
  
  // 2. Use a local state that is initialized from metadata only once
  // or use a flag to track if the user has manually toggled it in this session.
  const [isSavedLocal, setIsSavedLocal] = useState<boolean | null>(null);

  // Derive the final state: preference given to manual toggle, then metadata
  const activeSavedState = isSavedLocal !== null ? isSavedLocal : isSavedInMetadata;

  async function handleToggle() {
    if (!isSignedIn) return;

    // Instant UI Flip (Optimistic)
    const nextState = !activeSavedState;
    setIsSavedLocal(nextState);

    startTransition(async () => {
      const result = await toggleReadingList(slug);
      
      if (result.success) {
        if (result.isSaved) {
          toast.success("Added to reading list", {
            icon: <BookmarkCheck className="h-4 w-4 text-destructive" />,
          });
        } else {
          toast.info("Removed from reading list");
        }
      }

      if (result.error) {
        // Revert on error
        setIsSavedLocal(!nextState);
        toast.error("Sync Failed", { description: result.error });
      }
    });
  }

  if (!isLoaded || !isSignedIn) return null;

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleToggle();
      }}
      disabled={isPending}
      className={cn(
        "group relative h-9 w-9 rounded-full flex items-center justify-center transition-all duration-300",
        activeSavedState 
          ? "bg-destructive/10 border border-destructive/20 scale-110 shadow-lg shadow-destructive/5" 
          : "bg-muted/50 border border-transparent text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20",
        isPending && "opacity-70",
        className
      )}
      title={activeSavedState ? "Remove from Reading List" : "Add to Reading List"}
      aria-label={activeSavedState ? "Remove from Reading List" : "Add to Reading List"}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin text-destructive" />
      ) : activeSavedState ? (
        <BookmarkCheck className="h-4 w-4 text-destructive animate-in zoom-in-50 duration-300 fill-destructive/20" />
      ) : (
        <Bookmark className="h-4 w-4 transition-transform group-hover:rotate-12 group-hover:fill-destructive/5" />
      )}
    </button>
  );
}
