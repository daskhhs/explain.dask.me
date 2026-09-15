import { NextResponse } from "next/server";
import { explainCode, MissingApiKeyError, AiProviderError } from "@/lib/code-analysis";
import type { CodeLanguage } from "@/types/code";

const VALID_LANGUAGES: CodeLanguage[] = [
  "auto",
  "javascript",
  "typescript",
  "python",
  "go",
  "rust",
  "java",
  "other",
];

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Request body must be JSON." }, { status: 400 });
  }

  const { code, language } = (body as { code?: unknown; language?: unknown }) ?? {};

  if (typeof code !== "string" || !code.trim()) {
    return NextResponse.json(
      { error: "Paste some code first.", code: "EMPTY_INPUT" },
      { status: 400 }
    );
  }

  if (code.length > 12000) {
    return NextResponse.json(
      { error: "That's a lot of code — try under 12,000 characters at a time.", code: "EMPTY_INPUT" },
      { status: 400 }
    );
  }

  const lang: CodeLanguage = VALID_LANGUAGES.includes(language as CodeLanguage)
    ? (language as CodeLanguage)
    : "auto";

  try {
    const explanation = await explainCode(code, lang);
    return NextResponse.json({ explanation });
  } catch (err) {
    if (err instanceof MissingApiKeyError) {
      console.error("Explain My Code: missing API key", err);
      return NextResponse.json(
        { error: "This tool isn't fully set up yet — please check back soon.", code: "MISSING_API_KEY" },
        { status: 503 }
      );
    }
    if (err instanceof AiProviderError) {
      console.error("Explain My Code: upstream AI provider error", err);
      return NextResponse.json(
        { error: "Something went wrong while explaining that code. Please try again in a moment.", code: "UPSTREAM_ERROR" },
        { status: 502 }
      );
    }
    return NextResponse.json(
      { error: "Couldn't explain that code. Try again.", code: "UPSTREAM_ERROR" },
      { status: 500 }
    );
  }
}
