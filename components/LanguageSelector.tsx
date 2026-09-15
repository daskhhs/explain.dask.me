import type { CodeLanguage } from "@/types/code";

const LANGUAGES: { value: CodeLanguage; label: string }[] = [
  { value: "auto", label: "Auto-detect" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "java", label: "Java" },
  { value: "other", label: "Other" },
];

export function LanguageSelector({
  value,
  onChange,
  disabled,
}: {
  value: CodeLanguage;
  onChange: (language: CodeLanguage) => void;
  disabled?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-xs text-[var(--muted)]">
      Language
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as CodeLanguage)}
        disabled={disabled}
        className="rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-base sm:text-xs text-[var(--ink)] outline-none focus:border-[var(--accent)] disabled:opacity-50"
      >
        {LANGUAGES.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
