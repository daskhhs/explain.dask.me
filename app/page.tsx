"use client";

import { useCallback, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { CodeEditor } from "@/components/CodeEditor";
import { Explanation } from "@/components/Explanation";
import type { CodeExplanation, CodeLanguage, ExplainErrorBody } from "@/types/code";

type Status = "idle" | "loading" | "error" | "missing-key" | "result";

export default function Home() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<CodeLanguage>("auto");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<CodeExplanation | null>(null);

  const reset = useCallback(() => {
    setCode("");
    setStatus("idle");
    setMessage(null);
    setExplanation(null);
  }, []);

  const handleExplain = useCallback(async () => {
    const trimmed = code.trim();
    if (!trimmed) return;

    setStatus("loading");
    setMessage(null);

    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: trimmed, language }),
      });

      if (!res.ok) {
        const body = (await res.json()) as ExplainErrorBody;
        setMessage(body.error);
        setStatus(body.code === "MISSING_API_KEY" ? "missing-key" : "error");
        return;
      }

      const body = (await res.json()) as { explanation: CodeExplanation };
      setExplanation(body.explanation);
      setStatus("result");
    } catch {
      setMessage("Network error — could not reach the explain API.");
      setStatus("error");
    }
  }, [code, language]);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[var(--bg)] text-[var(--ink)]">
      <AppHeader />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-5 py-10">
        <p className="max-w-xl text-[var(--muted)]">
          Paste in confusing code and get a human explanation of what it does.
        </p>

        <CodeEditor
          value={code}
          onChange={(v) => {
            setCode(v);
            if (status === "error" || status === "missing-key") {
              setStatus("idle");
              setMessage(null);
            }
          }}
          language={language}
          onLanguageChange={setLanguage}
          onSubmit={handleExplain}
          onClear={reset}
          disabled={status === "loading"}
        />

        {status === "loading" && (
          <div className="flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--muted)]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent)]" aria-hidden />
            Reading through the code…
          </div>
        )}

        {status === "error" && message && (
          <div className="rounded-md border border-[var(--danger-border)] bg-[var(--danger-bg)] px-3 py-2.5 text-sm text-[var(--danger)]" role="alert">
            {message}
          </div>
        )}

        {status === "missing-key" && message && (
          <div className="rounded-md border border-[var(--warn-border)] bg-[var(--warn-bg)] px-3 py-2.5 text-sm text-[var(--warn)]" role="status">
            {message}
          </div>
        )}

        {status === "result" && explanation && (
          <div className="animate-fade-in-up space-y-6 border-t border-[var(--border)] pt-8">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-lg text-[var(--ink)]">Breakdown</h2>
              <button
                type="button"
                onClick={reset}
                className="text-xs text-[var(--muted)] underline-offset-2 hover:text-[var(--ink)] hover:underline"
              >
                Clear
              </button>
            </div>
            <Explanation explanation={explanation} />
          </div>
        )}
      </main>

      <footer className="border-t border-[var(--border)] py-4 text-center text-xs text-[var(--muted)]">
        {explanation ? `Explained via ${explanation.provider}` : "Understanding first, always."}
      </footer>
    </div>
  );
}
