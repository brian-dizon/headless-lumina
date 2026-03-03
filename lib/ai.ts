import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Resilient AI Content Generation
 * Supports OpenAI (Primary/Stable) and Gemini (Secondary/Free).
 * If no keys are present, it throws an error to trigger the Heuristic Fallback.
 */
export async function generateAIContent(prompt: string) {
  // 1. Try OpenAI (If key is available)
  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7
        })
      });
      const data = await response.json();
      if (data.choices?.[0]?.message?.content) {
        console.log("[AI Engine] SUCCESS: OpenAI gpt-4o-mini");
        return data.choices[0].message.content;
      }
    } catch (e) {
      console.warn("[AI Engine] OpenAI failed, falling back to Gemini...");
    }
  }

  // 2. Try Gemini (Secondary)
  if (process.env.GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      // We try 1.5 flash as it's the most likely to have a free tier
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      console.log("[AI Engine] SUCCESS: Gemini 1.5 Flash");
      return response.text();
    } catch (error: any) {
      console.error(`[AI Engine] Gemini Error: ${error.message}`);
      throw error;
    }
  }

  throw new Error("No AI Providers configured (Check API Keys)");
}
