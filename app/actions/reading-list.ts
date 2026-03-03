"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Toggle Resource in Reading List
 * Uses Clerk publicMetadata to store saved resource slugs.
 * This ensures state persists across devices without a separate database.
 */
export async function toggleReadingList(slug: string) {
  const { userId } = await auth();
  if (!userId) return { error: "You must be signed in to save resources." };

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  
  // Get current list (default to empty array)
  const currentList = (user.publicMetadata.readingList as string[]) || [];
  
  let newList;
  const isSaved = currentList.includes(slug);

  if (isSaved) {
    // Remove if exists
    newList = currentList.filter(s => s !== slug);
  } else {
    // Add if new
    newList = [...currentList, slug];
  }

  try {
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        readingList: newList
      }
    });

    // Revalidate paths to update UI state
    revalidatePath("/resources");
    revalidatePath(`/resources/${slug}`);
    revalidatePath("/vault");

    return { success: true, isSaved: !isSaved };
  } catch (error) {
    console.error("Reading List Error:", error);
    return { error: "Failed to update your reading list." };
  }
}
