"use client";
import { useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

const PRESETS = [
  "Which players are we considering extending who also have a medical flag and are represented by an agent we've had friction with?",
  "Give me a readiness summary on Marcus Reyes across scouting, analytics, and medical.",
  "Who are our cleanest extension candidates with no medical concerns?",
];

export default function Home() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

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
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Request failed." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "32px 20px",
        fontFamily: "system-ui, sans-serif",
        color: "#111",
      }}
    >
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Cascades Front Office</h1>
      <p style={{ color: "#666", marginTop: 0, fontSize: 14 }}>
        Ask across scouting, analytics, medical, contracts, and coaching.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "16px 0" }}>
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => send(p)}
            disabled={loading}
            style={{
              fontSize: 12,
              padding: "6px 10px",
              borderRadius: 999,
              border: "1px solid #ddd",
              background: "#fafafa",
              cursor: "pointer",
              textAlign: "left",
              maxWidth: 240,
            }}
          >
            {p.length > 60 ? p.slice(0, 60) + "..." : p}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background: m.role === "user" ? "#111" : "#f2f2f2",
              color: m.role === "user" ? "#fff" : "#111",
              padding: "10px 14px",
              borderRadius: 12,
              maxWidth: "85%",
              whiteSpace: "pre-wrap",
              lineHeight: 1.5,
              fontSize: 14,
            }}
          >
            {m.content}
          </div>
        ))}
        {loading && <div style={{ color: "#999", fontSize: 14 }}>Thinking...</div>}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          placeholder="Ask the front office anything..."
          rows={2}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ccc",
            fontFamily: "inherit",
            fontSize: 14,
            resize: "vertical",
          }}
        />
        <button
          onClick={() => send(input)}
          disabled={loading}
          style={{
            padding: "0 18px",
            borderRadius: 8,
            border: "none",
            background: "#111",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </main>
  );
}