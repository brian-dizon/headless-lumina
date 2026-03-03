"use server";

import { generateAIContent } from "@/lib/ai";

type SummaryResponse = {
  data?: string[];
  error?: string;
  warning?: string;
};

// --- Heuristic Fallback Engine ---
// These functions provide a high-quality summary even when the AI is offline.

const namedEntityMap: Record<string, string> = {
  nbsp: " ", amp: "&", quot: "\"", apos: "'", lt: "<", gt: ">",
  mdash: "-", ndash: "-", rsquo: "'", lsquo: "'", rdquo: "\"", ldquo: "\"",
};

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&([a-zA-Z]+);/g, (_, name) => namedEntityMap[name] ?? _);
}

function clipSentence(input: string, maxLength = 220): string {
  const normalized = input.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trimEnd()}...`;
}

function firstMatchingSentence(sentences: string[], patterns: RegExp[], used: Set<number>): string | null {
  const index = sentences.findIndex((s, i) => !used.has(i) && patterns.some(p => p.test(s)));
  if (index === -1) return null;
  used.add(index);
  return sentences[index];
}

function fallbackExecutiveSummary(content: string, title: string): string[] {
  const cleanText = decodeHtmlEntities(content.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim());
  const sentences = cleanText.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(s => s.length > 40);

  if (sentences.length === 0) {
    return [
      `This resource focuses on the architectural topic: ${title}.`,
      "The article outlines a practical implementation stance for enterprise systems.",
      "The recommended direction improves scalability and security posture at a platform level.",
    ];
  }

  const used = new Set<number>();
  const challenge = firstMatchingSentence(sentences, [/challenge/i, /problem/i, /risk/i, /issue/i], used) || sentences[0];
  const stance = firstMatchingSentence(sentences, [/solution/i, /approach/i, /architecture/i], used) || sentences[Math.min(1, sentences.length - 1)];
  const impact = firstMatchingSentence(sentences, [/impact/i, /scale/i, /security/i, /performance/i], used) || sentences[Math.min(2, sentences.length - 1)];

  return [challenge, stance, impact].map(s => clipSentence(s));
}

// --- Cache Architecture ---
const summaryCache = new Map<string, string[]>();

/**
 * Generate AI Executive Summary
 * Analyzes WordPress content and extracts a 3-bullet technical summary.
 * Includes caching and a robust heuristic fallback engine.
 */
export async function generateExecutiveSummary(content: string, title: string): Promise<SummaryResponse> {
  const fallbackData = fallbackExecutiveSummary(content, title);
  const cacheKey = `${title}-${content.length}`;

  if (summaryCache.has(cacheKey)) {
    return { data: summaryCache.get(cacheKey) };
  }

  const cleanContent = content.replace(/<[^>]*>?/gm, "").slice(0, 8000);
  const prompt = `
    SYSTEM: You are the Lumina Architect. Provide a 3-bullet "Executive Summary" focusing on Architectural Impact.
    RESOURCE: ${title}
    CONTENT: ${cleanContent}
    FORMAT: JSON { "summary": ["bullet 1", "bullet 2", "bullet 3"] }
  `;

  try {
    const text = await generateAIContent(prompt);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { summary: [] };
    const summary = Array.isArray(parsed.summary) ? parsed.summary.slice(0, 3) : [];

    if (summary.length > 0) {
      summaryCache.set(cacheKey, summary);
      return { data: summary };
    }
    return { data: fallbackData, warning: "AI response empty. Using fallback." };
  } catch (error: any) {
    console.warn(`[AI Summary] Failed: ${error.message}. Using heuristic fallback.`);
    return { data: fallbackData, warning: "AI Offline. Showing standard summary." };
  }
}
