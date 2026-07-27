"use client";
import { useState } from "react";
import { FEED, type FeedEvent } from "@/lib/league";
import FeedCard from "./FeedCard";

const FILTERS: { label: string; type: FeedEvent["type"] | "All" }[] = [
  { label: "All", type: "All" },
  { label: "Trades", type: "Trade" },
  { label: "Waivers", type: "Waiver" },
  { label: "Rumors", type: "Rumor" },
  { label: "Injuries", type: "Injury" },
];

export default function LeagueFeed({
  onSeeImpact,
}: {
  onSeeImpact: (event: FeedEvent) => void;
}) {
  const [filter, setFilter] = useState<FeedEvent["type"] | "All">("All");

  const events = filter === "All" ? FEED : FEED.filter((e) => e.type === filter);

  return (
    <section className="flex flex-col gap-4 h-full min-h-0" aria-label="League activity">
      <div className="flex items-center justify-between shrink-0">
        <h2 className="font-display text-sm text-text uppercase">League Activity</h2>
      </div>

      <div className="flex flex-wrap gap-2 shrink-0">
        {FILTERS.map((f) => (
          <button
            key={f.label}
            type="button"
            onClick={() => setFilter(f.type)}
            aria-pressed={filter === f.type}
            className={`px-3 py-1 rounded-full text-xs font-mono border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-signal/60 ${
              filter === f.type
                ? "border-text-muted/40 bg-surface-2 text-text"
                : "border-hairline text-text-muted hover:text-text hover:bg-surface-2/60"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto pr-1 min-h-0">
        {events.map((event, i) => (
          <FeedCard key={event.id} event={event} index={i} onSeeImpact={onSeeImpact} />
        ))}
      </div>
    </section>
  );
}
