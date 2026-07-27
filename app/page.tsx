"use client";
import { useState } from "react";
import DepartmentRail from "./components/DepartmentRail";
import LeagueFeed from "./components/LeagueFeed";
import ImpactDrawer from "./components/ImpactDrawer";
import CockpitWidgets from "./components/CockpitWidgets";
import AskDrawer from "./components/AskDrawer";
import type { FeedEvent } from "@/lib/league";

export default function Home() {
  const [activeEvent, setActiveEvent] = useState<FeedEvent | null>(null);
  const [askOpen, setAskOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between gap-4 px-5 py-3 border-b border-hairline bg-surface shrink-0">
        <h1 className="font-display text-sm text-text uppercase tracking-wide">
          Cascades <span className="text-text-muted mx-1">·</span> Front Office
        </h1>
        <button
          type="button"
          onClick={() => setAskOpen(true)}
          className="flex items-center gap-3 rounded-md border border-hairline bg-surface-2 px-4 py-1.5 text-sm text-text-muted hover:text-text transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-signal/60"
        >
          Ask across every department
          <kbd className="font-mono text-[11px] text-text-muted border border-hairline rounded px-1.5 py-0.5">
            ⌘K
          </kbd>
        </button>
      </header>

      <div className="flex flex-1 min-h-0">
        <div className="w-52 shrink-0">
          <DepartmentRail />
        </div>

        <main className="flex-1 min-w-0 px-6 py-5 overflow-hidden">
          <LeagueFeed onSeeImpact={setActiveEvent} />
        </main>

        <div className="w-72 shrink-0 border-l border-hairline bg-surface px-4 py-5 overflow-y-auto">
          <CockpitWidgets />
        </div>
      </div>

      <ImpactDrawer event={activeEvent} onClose={() => setActiveEvent(null)} />
      <AskDrawer open={askOpen} onClose={() => setAskOpen(false)} />
    </div>
  );
}
