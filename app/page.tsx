"use client";
import { useState } from "react";
import DepartmentRail, { type RailView } from "./components/DepartmentRail";
import LeagueFeed from "./components/LeagueFeed";
import ImpactDrawer from "./components/ImpactDrawer";
import CockpitWidgets from "./components/CockpitWidgets";
import AskDrawer from "./components/AskDrawer";
import DecisionHistoryView from "./components/DecisionHistoryView";
import { FEED, type FeedEvent } from "@/lib/league";
import { HISTORY, type Decision } from "@/lib/history";
import { DELIVERED_REYES_BRIEF } from "@/lib/delivered-brief";

export default function Home() {
  const [activeEvent, setActiveEvent] = useState<FeedEvent | null>(null);
  const [askOpen, setAskOpen] = useState(false);
  const [view, setView] = useState<RailView>("brief");
  const [history, setHistory] = useState<Decision[]>(HISTORY);

  function recordDecision(decision: Decision) {
    setHistory((prev) => [decision, ...prev]);
  }

  return (
    <div className="workspace-shell">
      <header className="workspace-header">
        <div className="brand-lockup">
          <span className="brand-mark">A</span>
          <h1>AIGM / Cascades Decision Room</h1>
        </div>
        <button
          type="button"
          onClick={() => setAskOpen(true)}
          className="ask-trigger"
        >
          Ask across every department <kbd>⌘K</kbd>
        </button>
      </header>

      <div className="workspace-grid">
        <div className="workspace-rail">
          <DepartmentRail view={view} onChangeView={setView} />
        </div>

        <main className="workspace-main">
          {view === "brief" ? (
            <ImpactDrawer
              embedded
              event={FEED[0]}
              preloadedResult={DELIVERED_REYES_BRIEF}
              history={history}
              onClose={() => undefined}
              onRecordDecision={recordDecision}
            />
          ) : view === "feed" ? (
            <LeagueFeed onSeeImpact={setActiveEvent} />
          ) : (
            <DecisionHistoryView history={history} />
          )}
        </main>

        <div className="workspace-widgets">
          <CockpitWidgets />
        </div>
      </div>

      <ImpactDrawer
        event={activeEvent}
        history={history}
        onClose={() => setActiveEvent(null)}
        onRecordDecision={recordDecision}
      />
      <AskDrawer open={askOpen} onClose={() => setAskOpen(false)} history={history} />
    </div>
  );
}
