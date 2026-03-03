"use server";

import { getClient } from "@/lib/apollo-client";
import { SEARCH_RESOURCES } from "@/lib/graphql/queries";

export type SearchResult = {
  id: string;
  title: string;
  slug: string;
  resourceDetails?: {
    subtitle?: string;
  };
};

/**
 * AJAX Search Server Action
 * Performs a keyword search on WordPress resources.
 */
export async function performSearch(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return [];

  try {
    const { data } = await getClient().query<{ resources: { nodes: SearchResult[] } }>({
      query: SEARCH_RESOURCES,
      variables: { search: query },
    });

    return data?.resources?.nodes || [];
  } catch (error) {
    console.error("AJAX Search Error:", error);
    return [];
  }
}
