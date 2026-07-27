"use client";
import { useState } from "react";
import type { Decision } from "@/lib/history";

const OUTCOME_COLOR: Record<Decision["outcome"], string> = {
  good: "var(--outcome-good)",
  bad: "var(--outcome-bad)",
  mixed: "var(--outcome-mixed)",
  pending: "var(--text-muted)",
};

function OutcomePill({ outcome }: { outcome: Decision["outcome"] }) {
  const color = OUTCOME_COLOR[outcome];
  return (
    <span
      style={{ color, borderColor: `${color}66` }}
      className={`shrink-0 rounded-full border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide ${
        outcome === "pending" ? "border-dashed" : ""
      }`}
    >
      {outcome}
    </span>
  );
}

export default function DecisionHistoryView({ history }: { history: Decision[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const sorted = [...history].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <section className="flex flex-col gap-4 h-full min-h-0" aria-label="Decision history">
      <h2 className="font-display text-sm text-text uppercase shrink-0">Decision History</h2>

      <div className="flex flex-col gap-2 overflow-y-auto pr-1 min-h-0">
        {sorted.map((d) => {
          const isExpanded = expandedId === d.id;
          return (
            <div
              key={d.id}
              className="rounded-md border border-hairline bg-surface overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : d.id)}
                aria-expanded={isExpanded}
                className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-surface-2/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-signal/60"
              >
                <span className="font-mono text-xs text-text-muted shrink-0 pt-0.5">{d.date}</span>
                <span className="flex-1 text-sm text-text leading-snug">{d.situation}</span>
                <OutcomePill outcome={d.outcome} />
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 pt-1 flex flex-col gap-3 border-t border-hairline">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-wide text-text-muted mb-1">
                      Decision
                    </p>
                    <p className="text-sm text-text leading-relaxed">{d.decision}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-wide text-text-muted mb-1">
                      Rationale
                    </p>
                    <p className="text-sm text-text leading-relaxed">{d.rationale}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-wide text-text-muted mb-1">
                      Outcome
                    </p>
                    <p className="text-sm text-text leading-relaxed">
                      {d.outcomeNote || "Pending — no outcome recorded yet."}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-wide text-text-muted mb-1">
                      What we knew at the time
                    </p>
                    <p className="text-sm text-text-muted leading-relaxed">{d.snapshot}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {d.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] text-text-muted border border-hairline rounded px-1.5 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
