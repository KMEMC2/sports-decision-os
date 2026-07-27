"use client";
import { useEffect, useState } from "react";
import type { Decision } from "@/lib/history";

type Msg = { role: "user" | "assistant"; content: string };

const PRESETS = [
  "Which players are we considering extending who also have a medical flag and are represented by an agent we've had friction with?",
  "Give me a readiness summary on Marcus Reyes across scouting, analytics, and medical.",
  "Who are our cleanest extension candidates with no medical concerns?",
];

export default function AskDrawer({
  open,
  onClose,
  history,
}: {
  open: boolean;
  onClose: () => void;
  history: Decision[];
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, history }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Request failed." }]);
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <button
        type="button"
        aria-label="Close ask panel"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Ask across every department"
        className="relative h-full w-full max-w-lg bg-surface border-l border-hairline [animation:drawer-in_0.28s_ease-out] flex flex-col"
      >
        <div className="flex items-center justify-between gap-4 px-6 pt-5 pb-4 border-b border-hairline shrink-0">
          <h2 className="font-display text-sm text-text uppercase">Ask across every department</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 text-text-muted hover:text-text transition-colors text-lg leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-signal/60 rounded"
          >
            ×
          </button>
        </div>

        <div className="px-6 pt-4 flex flex-wrap gap-2 shrink-0">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => send(p)}
              disabled={loading}
              className="text-left text-xs px-3 py-1.5 rounded-full border border-hairline bg-surface-2 text-text-muted hover:text-text transition-colors max-w-[220px] focus:outline-none focus-visible:ring-2 focus-visible:ring-signal/60"
            >
              {p.length > 60 ? p.slice(0, 60) + "…" : p}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2.5 rounded-lg max-w-[85%] whitespace-pre-wrap leading-relaxed text-sm ${
                  m.role === "user"
                    ? "bg-signal text-ink font-medium"
                    : "bg-surface-2 text-text"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && <div className="text-text-muted text-sm">Thinking…</div>}
        </div>

        <div className="flex gap-2 px-6 py-4 border-t border-hairline shrink-0">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Ask the front office anything…"
            rows={2}
            className="flex-1 resize-y rounded-md border border-hairline bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-signal/60"
          />
          <button
            onClick={() => send(input)}
            disabled={loading}
            className="px-4 rounded-md bg-signal text-ink font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-signal/60"
          >
            Send
          </button>
        </div>
      </aside>
    </div>
  );
}
