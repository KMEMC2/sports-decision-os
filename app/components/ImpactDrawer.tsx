"use client";
import { useEffect, useState } from "react";
import type { FeedEvent } from "@/lib/league";
import type { Decision } from "@/lib/history";

type ImpactResult = {
  exposure: string;
  player: string | null;
  departments: { name: string; finding: string; source: string }[];
  precedents: { title: string; outcome: "good" | "bad" | "mixed"; lesson: string }[];
  recommendation: string;
};

const PRECEDENT_COLOR: Record<"good" | "bad" | "mixed", string> = {
  good: "var(--outcome-good)",
  bad: "var(--outcome-bad)",
  mixed: "var(--outcome-mixed)",
};

export default function ImpactDrawer({
  event,
  history,
  onClose,
  onRecordDecision,
}: {
  event: FeedEvent | null;
  history: Decision[];
  onClose: () => void;
  onRecordDecision: (decision: Decision) => void;
}) {
  const [result, setResult] = useState<ImpactResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [recorded, setRecorded] = useState(false);

  useEffect(() => {
    if (!event) return;
    let cancelled = false;
    setLoading(true);
    setResult(null);
    setRecorded(false);

    fetch("/api/impact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, history }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setResult(data);
      })
      .catch(() => {
        if (!cancelled)
          setResult({
            exposure: "Request failed. Try again.",
            player: null,
            departments: [],
            precedents: [],
            recommendation: "",
          });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (event) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [event, onClose]);

  if (!event) return null;

  function handleRecord() {
    if (!event || !result) return;
    const decision: Decision = {
      id: `dec-${event.id}-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      situation: event.headline,
      decision: result.recommendation || "Recorded from live impact analysis.",
      rationale: result.exposure,
      outcome: "pending",
      outcomeNote: "",
      snapshot: result.player
        ? `Cap: $8.2M below the apron. Asset in question: ${result.player}.`
        : "Cap: $8.2M below the apron.",
      tags: [event.type, ...(result.player ? [result.player] : [])],
    };
    onRecordDecision(decision);
    setRecorded(true);
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <button
        type="button"
        aria-label="Close impact panel"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Cross-silo impact"
        className="relative h-full w-full max-w-md bg-surface border-l border-hairline [animation:drawer-in_0.28s_ease-out] flex flex-col"
      >
        <div className="h-[3px] w-full bg-gradient-to-r from-signal via-signal/60 to-transparent shrink-0" />

        <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-hairline shrink-0">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wide text-text-muted">
              {event.type} · Cross-silo impact
            </p>
            <h2 className="text-sm font-medium text-text mt-1 leading-snug">{event.headline}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 text-text-muted hover:text-text transition-colors text-lg leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-signal/60 rounded"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          {loading && (
            <div className="flex flex-col gap-3">
              <div className="h-4 w-3/4 rounded bg-surface-2 animate-pulse" />
              <div className="h-3 w-1/2 rounded bg-surface-2 animate-pulse" />
              <div className="h-20 w-full rounded bg-surface-2 animate-pulse mt-2" />
              <div className="h-20 w-full rounded bg-surface-2 animate-pulse" />
            </div>
          )}

          {!loading && result && (
            <>
              <div className="flex flex-col gap-2">
                <p className="font-display text-base leading-snug text-text">
                  {result.exposure}
                </p>
                {result.player && (
                  <span className="self-start rounded-full border border-signal/40 bg-signal/10 px-2.5 py-0.5 font-mono text-xs text-signal">
                    {result.player}
                  </span>
                )}
              </div>

              {result.departments.length > 0 && (
                <div className="flex flex-col gap-2">
                  {result.departments.map((dept, i) => (
                    <div
                      key={dept.name + i}
                      style={{ animationDelay: `${i * 60}ms` }}
                      className="opacity-0 [animation:chip-in_0.3s_ease-out_forwards] rounded-md border border-hairline bg-surface-2 px-4 py-3 flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[11px] uppercase tracking-wide text-text-muted">
                          {dept.name}
                        </span>
                      </div>
                      <p className="text-sm text-text leading-relaxed">{dept.finding}</p>
                      <span className="self-start font-mono text-[10px] text-text-muted border border-hairline rounded px-1.5 py-0.5">
                        {dept.source}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {result.precedents && result.precedents.length > 0 && (
                <div className="border-t border-hairline pt-4 flex flex-col gap-2">
                  <p className="font-mono text-[11px] uppercase tracking-wide text-text-muted mb-1">
                    What our history says
                  </p>
                  {result.precedents.map((p, i) => (
                    <div
                      key={p.title + i}
                      style={{ animationDelay: `${(result.departments.length + i) * 60}ms` }}
                      className="opacity-0 [animation:chip-in_0.3s_ease-out_forwards] rounded-md border border-hairline bg-surface-2 px-4 py-3 flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm text-text font-medium leading-snug">
                          {p.title}
                        </span>
                        <span
                          style={{ color: PRECEDENT_COLOR[p.outcome], borderColor: `${PRECEDENT_COLOR[p.outcome]}66` }}
                          className="shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide"
                        >
                          {p.outcome}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed">{p.lesson}</p>
                    </div>
                  ))}
                </div>
              )}

              {result.recommendation && (
                <div className="mt-1 border-t border-hairline pt-4">
                  <p className="font-mono text-[11px] uppercase tracking-wide text-signal mb-1.5">
                    Recommendation
                  </p>
                  <p className="text-sm text-text leading-relaxed">{result.recommendation}</p>
                </div>
              )}

              <div className="border-t border-hairline pt-4">
                {recorded ? (
                  <p className="text-xs font-mono text-text-muted">
                    Recorded to Decision History ✓
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleRecord}
                    className="text-xs font-medium text-text-muted hover:text-text border border-hairline rounded-md px-3 py-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-signal/60"
                  >
                    Record decision
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
