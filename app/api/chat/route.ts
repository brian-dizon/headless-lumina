import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { getWordPressContext } from "@/lib/wordpress-context";

export const maxDuration = 30;

/**
 * Chat API Route
 * Handles streaming AI responses with RAG context injection.
 * Supports fallback logic between OpenAI and Google.
 */
export async function POST(req: Request) {
  const { messages } = await req.json();
  
  // 1. Fetch Knowledge Hub Context
  const context = await getWordPressContext();

  const systemPrompt = `
    SYSTEM: You are the Lumina Assistant, a technical solutions architect for the Lumina Enterprise Hub.
    Your goal is to guide users through technical challenges using only Lumina's knowledge hub resources.
    
    GUIDELINES:
    - If the user's question isn't covered in the context, guide them to relevant sections or suggest contacting an expert.
    - Be concise, professional, and cite specific resources by name.
    - Focus on architectural trade-offs, scalability, and security.

    LUMINA KNOWLEDGE HUB CONTEXT:
    ${context}
  `;

  try {
    // 2. Determine Primary Provider (Prefer OpenAI for stability if key exists)
    const provider = process.env.OPENAI_API_KEY ? openai("gpt-4o-mini") : google("gemini-1.5-flash");

    const result = await streamText({
      model: provider,
      system: systemPrompt,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error("Chat API Error:", error.message);
    return new Response(
      JSON.stringify({ error: "The Assistant is currently recalibrating. Please try again in a moment." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
