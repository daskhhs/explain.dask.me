import { callGemini } from "./ai/gemini";
import { callGroq } from "./ai/groq";
import { callOpenRouter } from "./ai/openrouter";
import {
  AiProviderError,
  MissingApiKeyError,
  resolveProvider,
  type AiProviderName,
  type ChatMessage,
} from "./ai/provider";
import type { CodeExplanation, CodeLanguage } from "@/types/code";

export {
  resolveProvider,
  getPreferredProvider,
  getAvailableProviders,
  providerEnvVar,
  MissingApiKeyError,
  AiProviderError,
} from "./ai/provider";

const SYSTEM_PROMPT = `You are a sharp, patient senior developer explaining code to someone sitting next to you.
Understanding is the goal — never rewrite or "fix" the code, just explain it clearly.

Return ONLY valid JSON with this exact shape:
{
  "whatItDoes": string,
  "howItWorks": string[],
  "timeComplexity": string,
  "spaceComplexity": string,
  "thingsToWatch": string[],
  "deeper": string
}

Rules:
- whatItDoes: one or two plain-English sentences, no jargon a beginner wouldn't know.
- howItWorks: 3-8 short steps walking through the logic in order.
- timeComplexity / spaceComplexity: Big-O with a short reason (e.g. "O(n) — one pass over the array"). If genuinely not applicable (e.g. static config), say "Not meaningful here" and explain why in one clause.
- thingsToWatch: potential bugs, edge cases, or surprising behavior. Empty array only if the code is truly trivial.
- deeper: a more detailed walkthrough for someone who wants the full picture — can reference specific lines/variables. Keep it grounded in the actual code.
- Be specific to the code given. Do not describe a generic version of what similar code usually does.`;

function buildUserPrompt(code: string, language: CodeLanguage): string {
  return [
    `Language hint: ${language === "auto" ? "detect from the code" : language}`,
    "",
    "```",
    code.trim(),
    "```",
  ].join("\n");
}

async function callProvider(
  provider: AiProviderName,
  messages: ChatMessage[]
): Promise<string> {
  switch (provider) {
    case "gemini":
      return callGemini(messages);
    case "groq":
      return callGroq(messages);
    case "openrouter":
      return callOpenRouter(messages);
  }
}

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenced?.[1]) return JSON.parse(fenced[1].trim());
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(trimmed.slice(start, end + 1));
    throw new Error("Model response was not valid JSON.");
  }
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string" && v.trim().length > 0).map((v) => v.trim());
}

function normalize(raw: unknown, provider: string): CodeExplanation {
  if (!raw || typeof raw !== "object") {
    throw new Error("Model returned an unexpected shape.");
  }
  const obj = raw as Record<string, unknown>;
  const whatItDoes = asString(obj.whatItDoes);
  const timeComplexity = asString(obj.timeComplexity, "Not stated");
  const spaceComplexity = asString(obj.spaceComplexity, "Not stated");
  const howItWorks = asStringArray(obj.howItWorks);

  if (!whatItDoes || howItWorks.length === 0) {
    throw new Error("Model skipped required explanation fields.");
  }

  return {
    whatItDoes,
    howItWorks,
    timeComplexity,
    spaceComplexity,
    thingsToWatch: asStringArray(obj.thingsToWatch),
    deeper: asString(obj.deeper) || undefined,
    provider,
  };
}

export async function explainCode(
  code: string,
  language: CodeLanguage
): Promise<CodeExplanation> {
  const provider = resolveProvider();
  if (!provider) {
    throw new MissingApiKeyError("gemini", "GEMINI_API_KEY");
  }

  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: buildUserPrompt(code, language) },
  ];

  try {
    const rawText = await callProvider(provider, messages);
    return normalize(extractJson(rawText), provider);
  } catch (err) {
    if (err instanceof MissingApiKeyError || err instanceof AiProviderError) {
      throw err;
    }
    const message = err instanceof Error ? err.message : "Something went sideways explaining that.";
    throw new AiProviderError(provider, message);
  }
}
