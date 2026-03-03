import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is not defined. AI features will be disabled.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * AI Model Configuration
 * Verified: Using gemini-2.0-flash which was confirmed in the diagnostic.
 */
const aiModel = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash" 
});

/**
 * Resilient AI Content Generation
 * A direct, stable call to the verified Gemini 2.0 Flash model.
 */
export async function generateAIContent(prompt: string) {
  try {
    const result = await aiModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error(`[AI Engine] Global Error: ${error.message}`);
    throw error;
  }
}
