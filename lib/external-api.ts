import { PulseResponse } from "@/types/pulse";

/**
 * Fetch Industry Pulse Data
 * Fetches the latest trending tech news from Hacker News (Algolia API)
 * with a 1-hour revalidation period for high performance.
 */
export async function getIndustryPulse(): Promise<PulseResponse> {
  try {
    const response = await fetch(
      "https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=5",
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch industry pulse data");
    }

    return response.json();
  } catch (error) {
    console.error("External API Error:", error);
    return { hits: [], nbHits: 0, page: 0, nbPages: 0, hitsPerPage: 0 };
  }
}
