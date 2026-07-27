"use client";
import { useEffect, useState } from "react";
import type { FeedEvent } from "@/lib/league";

type ImpactResult = {
  exposure: string;
  player: string | null;
  departments: { name: string; finding: string; source: string }[];
  recommendation: string;
};

export default function ImpactDrawer({
  event,
  onClose,
}: {
  event: FeedEvent | null;
  onClose: () => void;
}) {
  const [result, setResult] = useState<ImpactResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!event) return;
    let cancelled = false;
    setLoading(true);
    setResult(null);

    fetch("/api/impact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
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
            recommendation: "",
          });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [event]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (event) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [event, onClose]);

  if (!event) return null;

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

              {result.recommendation && (
                <div className="mt-1 border-t border-hairline pt-4">
                  <p className="font-mono text-[11px] uppercase tracking-wide text-signal mb-1.5">
                    Recommendation
                  </p>
                  <p className="text-sm text-text leading-relaxed">{result.recommendation}</p>
                </div>
              )}
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
