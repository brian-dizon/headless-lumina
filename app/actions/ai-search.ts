"use server";

import { generateAIContent } from "@/lib/ai";
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

type ResourceNode = {
  title: string;
  slug: string;
  content: string;
};

type ResourcesQueryResult = {
  resources: {
    nodes: ResourceNode[];
  };
};

/**
 * Smart Search (RAG) Action
 * Fetches resource content and uses it as context for a targeted AI answer.
 */
export async function smartSearch(query: string) {
  if (!process.env.GEMINI_API_KEY) {
    return { error: "AI Engine not configured." };
  }

  try {
    // 1. Fetch "Source Truth" from WordPress
    const { data } = await getClient().query<ResourcesQueryResult>({
      query: GET_ALL_CONTEXT 
    });
    const resources = data?.resources?.nodes || [];

    // 2. Build Context Block
    const context = resources.map((r) => {
      const cleanContent = r.content.replace(/<[^>]*>?/gm, "").slice(0, 1500);
      return `RESOURCE: ${r.title}\nURL: /resources/${r.slug}\nCONTENT: ${cleanContent}`;
    }).join("\n\n---\n\n");

    // 3. Prompt AI with RAG constraints
    const prompt = `
      SYSTEM: You are the Lumina Architect, a high-level technical advisor for an enterprise knowledge hub. 
      Your tone is professional, concise, and focused on architectural impact, scalability, and security.

      Answer the user's question using ONLY the provided context from Lumina's knowledge hub.
      
      RULES:
      1. If the answer is not in the context, say: "I'm sorry, Lumina hasn't published a specific stance on that yet. Would you like me to connect you with an expert?"
      2. If you find the answer, be concise and professional.
      3. CITATIONS: You MUST cite the Resource Title at the end of your answer.

      CONTEXT:
      ${context}

      USER QUESTION:
      ${query}
    `;

    const answer = await generateAIContent(prompt);
    
    return { answer };
  } catch (error) {
    console.error("RAG Search Error:", error);
    return { error: "Failed to perform smart search." };
  }
}
