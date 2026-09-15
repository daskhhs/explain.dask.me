"use client";

import { LanguageSelector } from "./LanguageSelector";
import type { CodeLanguage } from "@/types/code";

const SAMPLE = `function uniqueVisitors(logs) {
  const seen = {};
  const result = [];
  for (let i = 0; i < logs.length; i++) {
    if (!seen[logs[i].userId]) {
      seen[logs[i].userId] = true;
      result.push(logs[i]);
    }
  }
  return result;
}`;

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: CodeLanguage;
  onLanguageChange: (language: CodeLanguage) => void;
  onSubmit: () => void;
  onClear: () => void;
  disabled?: boolean;
}

export function CodeEditor({
  value,
  onChange,
  language,
  onLanguageChange,
  onSubmit,
  onClear,
  disabled,
}: CodeEditorProps) {
  return (
    <section className="space-y-4">
      <label className="block space-y-2">
        <span className="font-display text-lg text-[var(--ink)]">Paste your code</span>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          rows={12}
          spellCheck={false}
          placeholder="Paste a function, a file, or a confusing snippet"
          className="w-full resize-y rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 font-mono text-base sm:text-sm leading-relaxed text-[var(--ink)] placeholder:text-[var(--muted)] outline-none transition focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] disabled:opacity-60"
        />
      </label>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(SAMPLE)}
          className="rounded border border-[var(--border)] bg-transparent px-2.5 py-1 text-xs text-[var(--muted)] transition hover:border-[var(--accent-soft)] hover:text-[var(--ink)] disabled:opacity-50"
        >
          Try a sample
        </button>
        <LanguageSelector value={language} onChange={onLanguageChange} disabled={disabled} />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
          className="inline-flex h-11 items-center justify-center rounded-md bg-[var(--accent)] px-5 text-sm font-medium text-[var(--accent-fg)] transition duration-200 hover:bg-[var(--accent-hover)] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_var(--accent)] active:translate-y-0 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          Explain this
        </button>
        {value && (
          <button
            type="button"
            onClick={onClear}
            disabled={disabled}
            className="text-xs text-[var(--muted)] underline-offset-2 hover:text-[var(--ink)] hover:underline disabled:opacity-50"
          >
            Clear
          </button>
        )}
      </div>
    </section>
  );
}
