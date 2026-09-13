"use client";

import { useState } from "react";
import { ComplexityCard } from "./ComplexityCard";
import { CodeWarning } from "./CodeWarning";
import type { CodeExplanation } from "@/types/code";

export function Explanation({ explanation }: { explanation: CodeExplanation }) {
  const [showDeeper, setShowDeeper] = useState(false);

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h3 className="text-sm font-medium text-[var(--muted)]">What it does</h3>
        <p className="text-[15px] leading-relaxed text-[var(--ink)]">
          {explanation.whatItDoes}
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-[var(--muted)]">How it works</h3>
        <ol className="space-y-1.5">
          {explanation.howItWorks.map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-[15px] leading-relaxed text-[var(--ink)]">
              <span className="mt-0.5 shrink-0 font-mono text-xs text-[var(--accent)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ComplexityCard label="Time complexity" value={explanation.timeComplexity} />
        <ComplexityCard label="Space complexity" value={explanation.spaceComplexity} />
      </div>

      <CodeWarning items={explanation.thingsToWatch} />

      {explanation.deeper && (
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setShowDeeper((v) => !v)}
            className="text-sm font-medium text-[var(--accent)] hover:underline"
          >
            {showDeeper ? "Hide deeper explanation" : "Go deeper"}
          </button>
          {showDeeper && (
            <p className="rounded-md border border-[var(--border)] bg-[var(--surface-raised)] p-4 text-[15px] leading-relaxed text-[var(--ink)]">
              {explanation.deeper}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
