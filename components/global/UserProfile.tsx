"use client";

import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

/**
 * UserProfile Component
 * Handles the authentication UI logic for the Navbar.
 * Using Clerk's pre-built components for a seamless experience.
 */
export function UserProfile() {
  return (
    <div className="flex items-center gap-3">
      {/* 1. Shown only when the user is LOGGED OUT */}
      <SignedOut>
        <Button asChild size="sm" className="hidden sm:flex font-bold px-5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full transition-all">
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </SignedOut>

      {/* 2. Shown only when the user is LOGGED IN */}
      <SignedIn>
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-9 w-9 ring-2 ring-primary/10 hover:ring-primary/30 transition-all"
            }
          }}
        />
      </SignedIn>
    </div>
  );
}
