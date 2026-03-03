import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Draft Mode API Route
 * This route acts as a secure gateway to enable Next.js Draft Mode.
 * It is typically called from a WordPress "Preview" link.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");
  const id = searchParams.get("id"); // WordPress Database ID
  const postType = searchParams.get("postType") || "resources";

  if (secret !== process.env.NEXT_PUBLIC_PREVIEW_SECRET || !slug) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  (await draftMode()).enable();

  // Redirect to the slug, but attach the ID as a hint for the preview fetch
  redirect(`/${postType}/${slug}${id ? `?id=${id}` : ""}`);
}
