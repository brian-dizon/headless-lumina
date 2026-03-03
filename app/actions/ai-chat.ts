"use server";

import { generateAIContent } from "@/lib/ai";
import { getWordPressContext } from "@/lib/wordpress-context";

/**
 * Technical Assistant Server Action
 * A high-reliability alternative to streaming, ensuring compatibility 
 * with all development environments.
 */
export async function assistantChat(messages: { role: string; content: string }[]) {
  if (!process.env.GEMINI_API_KEY && !process.env.OPENAI_API_KEY) {
    return { error: "AI Engine not configured." };
  }

  const context = await getWordPressContext();
  const lastUserMessage = messages[messages.length - 1]?.content;

  const prompt = `
    SYSTEM: You are the Lumina Assistant, a solutions architect. 
    Answer using ONLY the provided Lumina Knowledge Hub context. 
    Cite the resource names in your answer.

    CONTEXT:
    ${context}

    USER QUESTION:
    ${lastUserMessage}
  `;

  try {
    const answer = await generateAIContent(prompt);
    return { answer };
  } catch {
    console.warn("[Assistant Action] AI Failed, using Concierge Fallback...");
    
    // Concierge Fallback: Simple keyword match in the context
    const keywords = lastUserMessage.toLowerCase().split(" ");
    const matches = context.split("\n\n---\n\n")
      .filter(block => keywords.some(k => k.length > 3 && block.toLowerCase().includes(k)))
      .map(block => block.split("\n")[0].replace("RESOURCE: ", "")) // Extract title
      .slice(0, 2);

    if (matches.length > 0) {
      return { 
        answer: `I'm currently recalibrating my AI core, but based on your question, I recommend exploring these resources in our library: ${matches.join(", ")}. Would you like me to take you there?` 
      };
    }

    return { 
      answer: "I'm having a brief connectivity issue with my AI core. Please try again in a few minutes, or browse our full Library for immediate technical guides." 
    };
  }
}
