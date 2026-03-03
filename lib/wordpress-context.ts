import { getClient } from "@/lib/apollo-client";
import { gql } from "@apollo/client";

const GET_ALL_CONTEXT = gql`
  query GetAllContext {
    resources(first: 20) {
      nodes {
        title
        slug
        content
      }
    }
  }
`;

/**
 * Get WordPress Context
 * Fetches resource content and formats it as a "Source of Truth" block 
 * for RAG-powered AI interactions.
 */
export async function getWordPressContext() {
  try {
    const { data } = await getClient().query<{ resources: { nodes: { title: string; slug: string; content: string }[] } }>({ 
      query: GET_ALL_CONTEXT 
    });
    const resources = data?.resources?.nodes || [];

    return resources
      .map((r: { title: string; slug: string; content: string }) => {
        const cleanContent = r.content.replace(/<[^>]*>?/gm, "").slice(0, 1500);
        return `RESOURCE: ${r.title}\nURL: /resources/${r.slug}\nCONTENT: ${cleanContent}`;
      })
      .join("\n\n---\n\n");
  } catch (error) {
    console.error("Context Fetch Error:", error);
    return "";
  }
}
