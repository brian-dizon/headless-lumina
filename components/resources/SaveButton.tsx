"use client";

import { useTransition } from "react";
import { toggleReadingList } from "@/app/actions/reading-list";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";

interface SaveButtonProps {
  slug: string;
  className?: string;
}

/**
 * SaveButton Component
 * Handles the "Add to Reading List" interaction with Clerk.
 * Self-contained: Manages its own "Saved" state based on user metadata.
 */
export function SaveButton({ slug, className }: SaveButtonProps) {
  const { user, isLoaded, isSignedIn } = useUser();
  const [isPending, startTransition] = useTransition();

  // 1. Derive "Saved" state from user metadata
  const readingList = (user?.publicMetadata?.readingList as string[]) || [];
  const isSaved = readingList.includes(slug);

  async function handleToggle() {
    if (!isSignedIn) return;

    startTransition(async () => {
      const result = await toggleReadingList(slug);
      if (result.error) {
        console.error(result.error);
      }
    });
  }

  // Hide if not signed in or still loading user data
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
        "group relative h-9 w-9 rounded-full flex items-center justify-center transition-all",
        isSaved 
          ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110" 
          : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary hover:scale-110",
        isPending && "opacity-70",
        className
      )}
      title={isSaved ? "Remove from Reading List" : "Add to Reading List"}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isSaved ? (
        <BookmarkCheck className="h-4 w-4 animate-in zoom-in-50 duration-300" />
      ) : (
        <Bookmark className="h-4 w-4 transition-transform group-hover:rotate-12" />
      )}
    </button>
  );
}
