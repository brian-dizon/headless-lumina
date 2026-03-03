import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Disable Draft Mode API Route
 * This route clears the __next_preview_data cookie and redirects
 * the user back to the home page or a specific path.
 */
export async function GET() {
  (await draftMode()).disable();
  redirect("/");
}
