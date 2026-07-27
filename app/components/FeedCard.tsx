import type { FeedEvent } from "@/lib/league";

const TAG_COLORS: Record<FeedEvent["type"], string> = {
  Trade: "var(--tag-trade)",
  Waiver: "var(--tag-waiver)",
  Rumor: "var(--tag-rumor)",
  Injury: "var(--tag-injury)",
  Signing: "var(--tag-signing)",
};

function timeAgo(hoursAgo: number): string {
  if (hoursAgo < 1) return "just now";
  if (hoursAgo === 1) return "1h";
  return `${hoursAgo}h`;
}

export default function FeedCard({
  event,
  index,
  onSeeImpact,
}: {
  event: FeedEvent;
  index: number;
  onSeeImpact: (event: FeedEvent) => void;
}) {
  return (
    <article
      style={{
        animationDelay: `${index * 45}ms`,
        borderLeftColor: event.affectsUs ? "var(--signal)" : "var(--hairline)",
      }}
      className="opacity-0 [animation:feed-card-in_0.35s_ease-out_forwards] rounded-md border border-hairline bg-surface border-l-[3px] px-4 py-3 flex flex-col gap-1.5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-mono text-xs">
          <span
            style={{ color: TAG_COLORS[event.type] }}
            className="uppercase tracking-wide font-medium"
          >
            {event.type}
          </span>
          <span className="text-text-muted">· {timeAgo(event.hoursAgo)}</span>
        </div>
        {event.affectsUs && (
          <span className="flex items-center gap-1 rounded-full border border-signal/40 bg-signal/10 px-2 py-0.5 text-[11px] font-mono font-medium text-signal">
            Affects us
          </span>
        )}
      </div>

      <h3 className="text-sm font-medium leading-snug text-text">{event.headline}</h3>
      <p className="text-xs leading-relaxed text-text-muted">{event.detail}</p>

      {event.affectsUs && (
        <button
          type="button"
          onClick={() => onSeeImpact(event)}
          className="mt-1 self-start text-xs font-medium text-signal hover:text-text transition-colors flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-signal/60 rounded"
        >
          See impact
          <span aria-hidden="true">›</span>
        </button>
      )}
    </article>
  );
}
