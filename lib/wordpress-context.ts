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
    const { data } = await getClient().query({ query: GET_ALL_CONTEXT });
    const resources = data?.resources?.nodes || [];

    return resources
      .map((r: any) => {
        const cleanContent = r.content.replace(/<[^>]*>?/gm, "").slice(0, 1500);
        return `RESOURCE: ${r.title}
URL: /resources/${r.slug}
CONTENT: ${cleanContent}`;
      })
      .join("

---

");
  } catch (error) {
    console.error("Context Fetch Error:", error);
    return "";
  }
}
