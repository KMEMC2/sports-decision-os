"use client";
import { useEffect, useState } from "react";
import type { FeedEvent } from "@/lib/league";
import type { Decision } from "@/lib/history";

type CountedFinding = { title: string; detail: string; sourceCount: number };
export type ImpactResult = {
  exposure: string;
  player: string | null;
  executiveSummary: string;
  consensus: CountedFinding[];
  disagreement: CountedFinding[];
  evidence: { name: string; finding: string; source: string }[];
  considerations: { title: string; detail: string }[];
  precedents: { title: string; outcome: "good" | "bad" | "mixed"; lesson: string }[];
  openQuestions: string[];
  recommendation: string;
  citedSourceCount: number;
  citationsVerified: boolean;
};

const EMPTY: ImpactResult = {
  exposure: "", player: null, executiveSummary: "", consensus: [], disagreement: [],
  evidence: [], considerations: [], precedents: [], openQuestions: [], recommendation: "",
  citedSourceCount: 0, citationsVerified: false,
};

const PRECEDENT_COLOR = {
  good: "var(--outcome-good)", bad: "var(--outcome-bad)", mixed: "var(--outcome-mixed)",
};

function SectionLabel({ number, children }: { number: string; children: React.ReactNode }) {
  return <p className="brief-label">{number} / {children}</p>;
}

export default function ImpactDrawer({
  event, history, onClose, onRecordDecision, embedded = false, preloadedResult,
}: {
  event: FeedEvent | null;
  history: Decision[];
  onClose: () => void;
  onRecordDecision: (decision: Decision) => void;
  embedded?: boolean;
  preloadedResult?: ImpactResult;
}) {
  const [result, setResult] = useState<ImpactResult | null>(preloadedResult ?? null);
  const [loading, setLoading] = useState(false);
  const [recorded, setRecorded] = useState(false);

  useEffect(() => {
    if (!event) return;
    if (preloadedResult) return;
    let cancelled = false;
    // Reset the previous event before starting its external request.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true); setResult(null); setRecorded(false);
    fetch("/api/impact", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, history }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data?.exposure || "Impact request failed");
        return data;
      })
      .then((data) => { if (!cancelled) setResult({ ...EMPTY, ...data }); })
      .catch(() => { if (!cancelled) setResult({ ...EMPTY, exposure: "Request failed. Try again." }); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
    // The analysis reruns only when a new event is selected.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, preloadedResult]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    if (event) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [event, onClose]);

  if (!event) return null;

  function handleRecord() {
    if (!event || !result) return;
    onRecordDecision({
      id: `dec-${event.id}-${Date.now()}`, date: new Date().toISOString().slice(0, 10),
      situation: event.headline, decision: result.recommendation || "Recorded from impact analysis.",
      rationale: result.executiveSummary || result.exposure, outcome: "pending", outcomeNote: "",
      snapshot: result.player ? `Cap: $8.2M below the apron. Asset: ${result.player}.` : "Cap: $8.2M below the apron.",
      tags: [event.type, ...(result.player ? [result.player] : [])],
    });
    setRecorded(true);
  }

  return (
    <div className={embedded ? "delivered-brief" : "brief-overlay"}>
      {!embedded && <button type="button" aria-label="Close decision brief" onClick={onClose} className="brief-scrim" />}
      <aside
        role={embedded ? undefined : "dialog"}
        aria-modal={embedded ? undefined : "true"}
        aria-label="Decision brief"
        className={`decision-brief${embedded ? " decision-brief--embedded" : ""}`}
      >
        <header className="brief-request">
          <span className="brief-glyph">⌁</span>
          <div><small>ACTIVE REQUEST</small><p>{event.headline}</p></div>
          <span className="brief-prepared">{loading ? "SYNTHESIZING" : "BRIEF PREPARED"}</span>
          {!embedded && <button type="button" onClick={onClose} aria-label="Close" className="brief-close">×</button>}
        </header>

        {loading ? (
          <div className="brief-loading"><i /><i /><i /><i /></div>
        ) : result && (
          <div className="brief-scroll">
            <div className="brief-title-row">
              <div>
                <p className="brief-label">{event.type.toUpperCase()} IMPACT / {result.player?.toUpperCase() || "ORGANIZATION"}</p>
                <h2>Decision brief</h2>
              </div>
              <div className="brief-source-total"><strong>{result.citedSourceCount}</strong><span>CITED INTERNAL<br />SOURCES</span></div>
            </div>

            <section className="brief-summary">
              <SectionLabel number="01">Executive summary</SectionLabel>
              <p>{result.executiveSummary || result.exposure}</p>
              {result.player && <span className="asset-chip">{result.player}</span>}
            </section>

            <div className="brief-two-col">
              <section>
                <SectionLabel number="02">Organizational consensus</SectionLabel>
                {result.consensus.map((item, i) => <article key={item.title + i}>
                  <h3>{item.title}</h3><p>{item.detail}</p>
                  <span className="source-count">{item.sourceCount} supporting sources ↗</span>
                </article>)}
              </section>
              <section className="brief-disagreement">
                <SectionLabel number="03">Key disagreement</SectionLabel>
                {result.disagreement.length ? result.disagreement.map((item, i) => <article key={item.title + i}>
                  <h3>{item.title}</h3><p>{item.detail}</p>
                  <span className="source-count">{item.sourceCount} contrasting sources ↗</span>
                </article>) : <article><h3>Tension requires resolution</h3><p>The available evidence does not establish a shared risk threshold.</p><span className="source-count">0 contrasting sources ↗</span></article>}
              </section>
            </div>

            <section className="brief-section">
              <SectionLabel number="04">Evidence / performance</SectionLabel>
              <div className="evidence-grid">
                {result.evidence.map((item, i) => <article key={item.name + i}>
                  <h3>{item.name}</h3><p>{item.finding}</p><span className="source-chip">{item.source}</span>
                </article>)}
              </div>
            </section>

            <section className="brief-section">
              <SectionLabel number="05">Scenarios / considerations</SectionLabel>
              {result.considerations.map((item, i) => <article className="consideration" key={item.title + i}><h3>{item.title}</h3><p>{item.detail}</p></article>)}
            </section>

            <section className="brief-section">
              <SectionLabel number="06">What our history says</SectionLabel>
              <div className="precedent-grid">
                {result.precedents.map((item, i) => <article key={item.title + i}>
                  <div><h3>{item.title}</h3><span style={{ color: PRECEDENT_COLOR[item.outcome] }}>{item.outcome}</span></div>
                  <p>{item.lesson}</p>
                </article>)}
              </div>
            </section>

            <section className="brief-section">
              <SectionLabel number="07">Open questions</SectionLabel>
              <ol className="open-questions">{result.openQuestions.map((q, i) => <li key={q + i}>{q}</li>)}</ol>
            </section>

            <footer className="brief-footer">
              <div><span>RECOMMENDATION</span><p>{result.recommendation}</p></div>
              <div className="verification">{result.citedSourceCount} CITATIONS {result.citationsVerified ? "VERIFIED ✓" : "REVIEW REQUIRED"}</div>
              <button type="button" onClick={handleRecord} disabled={recorded}>{recorded ? "RECORDED ✓" : "RECORD DECISION"}</button>
            </footer>
          </div>
        )}
      </aside>
    </div>
  );
}
