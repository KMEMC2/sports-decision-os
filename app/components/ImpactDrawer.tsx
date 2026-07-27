"use client";
import { useEffect, useState } from "react";
import type { FeedEvent } from "@/lib/league";
import type { Decision } from "@/lib/history";
import type { UploadedDocument } from "@/lib/uploaded-docs";

type CountedFinding = { title: string; detail: string; sourceCount: number };
export type ImpactResult = {
  exposure: string;
  player: string | null;
  generatedAt?: string;
  changedSinceLastReview?: string;
  decisionClock?: {
    status: "monitor" | "prepare" | "act";
    deadline: string;
    nextCatalyst: string;
    evidencePending: string;
  };
  detectionTrail?: { time: string; event: string }[];
  costOfDelay?: {
    assetAtRisk: string;
    mechanism: string;
    reversibility: "low" | "medium" | "high";
  };
  decisionTension?: {
    question: string;
    sideA: string;
    sideB: string;
    resolution: string;
  };
  executiveSummary: string;
  consensus: CountedFinding[];
  disagreement: CountedFinding[];
  evidence: { name: string; finding: string; source: string; excerpt?: string }[];
  considerations: { title: string; detail: string }[];
  precedents: { title: string; outcome: "good" | "bad" | "mixed"; lesson: string }[];
  openQuestions: string[];
  nextActions?: { owner: string; action: string; due: string }[];
  recommendation: string;
  citedSourceCount: number;
  citationsVerified: boolean;
  engine?: {
    provider: string;
    model: string;
    generatedLive: boolean;
  };
};

const EMPTY: ImpactResult = {
  exposure: "", player: null, executiveSummary: "", consensus: [], disagreement: [],
  evidence: [], considerations: [], precedents: [], openQuestions: [], recommendation: "",
  citedSourceCount: 0, citationsVerified: false,
};

const PRECEDENT_COLOR = {
  good: "var(--outcome-good)", bad: "var(--outcome-bad)", mixed: "var(--outcome-mixed)",
};

const SYNTHESIS_STAGES = [
  "Retrieving permitted evidence",
  "Matching external signal to internal assets",
  "Reconciling department positions",
  "Checking organizational precedent",
  "Drafting cited decision brief",
];

function SectionLabel({ number, children }: { number: string; children: React.ReactNode }) {
  return <p className="brief-label">{number} / {children}</p>;
}

export default function ImpactDrawer({
  event, history, onClose, onRecordDecision, embedded = false, preloadedResult,
  uploadedDocuments = [],
}: {
  event: FeedEvent | null;
  history: Decision[];
  onClose: () => void;
  onRecordDecision: (decision: Decision) => void;
  embedded?: boolean;
  preloadedResult?: ImpactResult;
  uploadedDocuments?: UploadedDocument[];
}) {
  const [result, setResult] = useState<ImpactResult | null>(preloadedResult ?? null);
  const [loading, setLoading] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [liveSynthesis, setLiveSynthesis] = useState(false);
  const [liveError, setLiveError] = useState("");
  const [synthesisStage, setSynthesisStage] = useState(0);

  async function requestImpact() {
    if (!event) return;
    setLoading(true);
    setLiveError("");
    setSynthesisStage(0);
    try {
      const response = await fetch("/api/impact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event, history, uploadedDocuments }),
      });
      const data = await response.json();
      const validBrief =
        typeof data?.executiveSummary === "string" &&
        data.executiveSummary.trim().length > 0 &&
        Array.isArray(data.evidence) &&
        data.evidence.length > 0 &&
        Array.isArray(data.disagreement) &&
        data.disagreement.length > 0;
      if (!response.ok || !validBrief) {
        throw new Error(data?.exposure || "Live synthesis returned an incomplete brief.");
      }
      setResult({ ...EMPTY, ...data });
      setLiveSynthesis(true);
    } catch (error) {
      setLiveSynthesis(false);
      setLiveError(error instanceof Error ? error.message : "Live synthesis failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!event) return;
    if (preloadedResult) return;
    let cancelled = false;
    // Reset the previous event before starting its external request.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true); setResult(null); setRecorded(false);
    fetch("/api/impact", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, history, uploadedDocuments }),
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
    if (!loading || !result) return;
    const interval = window.setInterval(() => {
      setSynthesisStage((current) => Math.min(current + 1, SYNTHESIS_STAGES.length - 1));
    }, 2400);
    return () => window.clearInterval(interval);
  }, [loading, result]);

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
          <div><small>{embedded ? "AUTO-DETECTED SIGNAL" : "ACTIVE REQUEST"}</small><p>{event.headline}</p></div>
          <span className="brief-prepared">{loading ? "SYNTHESIZING" : embedded ? "BRIEF DELIVERED" : "BRIEF PREPARED"}</span>
          {!embedded && <button type="button" onClick={onClose} aria-label="Close" className="brief-close">×</button>}
        </header>

        <div className={`ai-engine-strip${loading ? " is-running" : ""}${liveSynthesis ? " is-complete" : ""}`}>
          <div className="ai-engine-identity">
            <span className="ai-orbit" aria-hidden="true"><i /><i /><i /></span>
            <div>
              <small>AIGM DECISION ENGINE</small>
              <strong>
                {result?.engine?.generatedLive
                  ? "Cross-department synthesis / live"
                  : "Decision synthesis ready"}
              </strong>
            </div>
          </div>
          <div className="ai-engine-state">
            <span>{loading ? "PROCESSING LIVE" : liveError ? "RETRY AVAILABLE" : liveSynthesis ? "LIVE BRIEF VERIFIED" : "READY"}</span>
            <p>
              {loading
                ? SYNTHESIS_STAGES[synthesisStage]
                : liveError
                  ? "Existing decision brief preserved"
                  : liveSynthesis
                    ? `${result?.citedSourceCount ?? 0} sources reconciled · disagreement required · citations checked`
                    : "Run a fresh synthesis against current evidence and decision history"}
            </p>
          </div>
          <div className="ai-stage-track" aria-hidden="true">
            {SYNTHESIS_STAGES.map((stage, index) => (
              <i
                key={stage}
                className={loading && index <= synthesisStage ? "active" : liveSynthesis ? "complete" : ""}
              />
            ))}
          </div>
        </div>

        {loading && !result ? (
          <div className="brief-loading"><i /><i /><i /><i /></div>
        ) : result && (
          <div className="brief-scroll">
            <div className="brief-title-row">
              <div>
                <p className="brief-label">
                  {event.type.toUpperCase()} IMPACT / {result.player?.toUpperCase() || "ORGANIZATION"}
                  {result.generatedAt ? ` / ${result.generatedAt.toUpperCase()}` : ""}
                </p>
                <h2>Decision brief</h2>
              </div>
              <div className="brief-heading-actions">
                {uploadedDocuments.length > 0 && (
                  <span className="session-source-count">
                    +{uploadedDocuments.length} SESSION {uploadedDocuments.length === 1 ? "DOCUMENT" : "DOCUMENTS"}
                  </span>
                )}
                {embedded && (
                  <button type="button" className="live-synthesis" onClick={requestImpact} disabled={loading}>
                    <i />{loading ? "SYNTHESIZING" : liveError ? "SYNTHESIS FAILED · RETRY" : liveSynthesis ? "LIVE SYNTHESIS COMPLETE" : "RUN LIVE SYNTHESIS"}
                  </button>
                )}
                <div className="brief-source-total"><strong>{result.citedSourceCount}</strong><span>CITED INTERNAL<br />SOURCES</span></div>
              </div>
            </div>
            {liveError && <div className="live-error" role="status">{liveError} The delivered brief has been preserved.</div>}

            <section className="proactive-alert">
              <div>
                <span>DELIVERED BEFORE REQUEST</span>
                <strong>New league intelligence changed an active internal decision.</strong>
              </div>
              <p>{result.changedSinceLastReview || result.exposure}</p>
            </section>

            {(result.decisionClock || result.costOfDelay) && (
              <section className="decision-snapshot">
                <div className="clock-status"><span>DECISION STATUS</span><strong>{result.decisionClock?.status || "prepare"}</strong></div>
                <div><span>WINDOW</span><strong>{result.decisionClock?.deadline || "Unknown"}</strong></div>
                <div><span>ASSET AT RISK</span><strong>{result.costOfDelay?.assetAtRisk || result.player}</strong></div>
                <div><span>REVERSIBILITY</span><strong>{result.costOfDelay?.reversibility || "Unknown"}</strong></div>
              </section>
            )}

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

            {result.decisionTension && (
              <section className="tension-section">
                <SectionLabel number="04">Decision tension</SectionLabel>
                <h3>{result.decisionTension.question}</h3>
                <div className="tension-sides">
                  <article><span>ACT NOW</span><p>{result.decisionTension.sideA}</p></article>
                  <article><span>WAIT FOR EVIDENCE</span><p>{result.decisionTension.sideB}</p></article>
                </div>
                <div className="resolution-line"><span>RESOLUTION PATH</span>{result.decisionTension.resolution}</div>
              </section>
            )}

            <section className="brief-section">
              <SectionLabel number="05">Evidence / performance</SectionLabel>
              <div className="evidence-grid">
                {result.evidence.map((item, i) => <details key={item.name + i}>
                  <summary><span>{item.name}</span><strong>{item.finding}</strong><em>{item.source}</em></summary>
                  <blockquote>{item.excerpt || item.finding}</blockquote>
                </details>)}
              </div>
            </section>

            <section className="brief-section">
              <SectionLabel number="06">Scenarios / considerations</SectionLabel>
              {result.considerations.map((item, i) => <article className="consideration" key={item.title + i}><h3>{item.title}</h3><p>{item.detail}</p></article>)}
            </section>

            <section className="brief-section">
              <SectionLabel number="07">What our history says</SectionLabel>
              <div className="precedent-grid">
                {result.precedents.map((item, i) => <article key={item.title + i}>
                  <div><h3>{item.title}</h3><span style={{ color: PRECEDENT_COLOR[item.outcome] }}>{item.outcome}</span></div>
                  <p>{item.lesson}</p>
                </article>)}
              </div>
            </section>

            <section className="brief-section">
              <SectionLabel number="08">Open questions</SectionLabel>
              <ol className="open-questions">{result.openQuestions.map((q, i) => <li key={q + i}>{q}</li>)}</ol>
            </section>

            {result.detectionTrail && result.detectionTrail.length > 0 && (
              <section className="brief-section">
                <SectionLabel number="09">Why this brief appeared</SectionLabel>
                <ol className="detection-trail">
                  {result.detectionTrail.map((step, i) => <li key={step.time + i}><time>{step.time}</time><span>{step.event}</span></li>)}
                </ol>
              </section>
            )}

            {result.nextActions && result.nextActions.length > 0 && (
              <section className="brief-section">
                <SectionLabel number="10">Owned next actions</SectionLabel>
                <div className="action-table">
                  {result.nextActions.map((item, i) => <div key={item.owner + i}>
                    <span>{item.owner}</span><p>{item.action}</p><strong>{item.due}</strong><button type="button">ASSIGN ↗</button>
                  </div>)}
                </div>
              </section>
            )}

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
