import Anthropic from "@anthropic-ai/sdk";
import { DOCS } from "@/lib/data";
import { HISTORY, type Decision } from "@/lib/history";
import type { FeedEvent } from "@/lib/league";

export const runtime = "nodejs";

const client = new Anthropic();

const knowledgeBase = DOCS.map(
  (d) =>
    `--- DOC (Department: ${d.department} | Title: ${d.title} | ID: ${d.id}) ---\n${d.content}`
).join("\n\n");

function historyBlock(history: Decision[]): string {
  return history
    .map(
      (h) =>
        `--- DECISION (ID: ${h.id} | Date: ${h.date} | Outcome: ${h.outcome}) ---\nSituation: ${h.situation}\nDecision: ${h.decision}\nRationale: ${h.rationale}\nOutcome note: ${h.outcomeNote}\nSnapshot at the time: ${h.snapshot}\nTags: ${h.tags.join(", ")}`
    )
    .join("\n\n");
}

function buildSystemPrompt(history: Decision[]): string {
  return `You are the decision-support assistant for the front office of a professional basketball team, the Cascades.
You can see internal documents across departments: scouting, analytics, medical, contracts, and coaching. You also have the org's past decisions and their outcomes.

You are given one league event, the org's internal documents, and its decision ledger. Prepare a structured decision brief about how this event affects THIS org, using only the supplied evidence. Cite every evidence finding with its source title. When relevant, surface the most applicable precedents and let them shape the recommendation. Weight bad outcomes as cautions and good outcomes as support.

Rules:
- Use ONLY the information in the documents and decision ledger below. Never invent facts.
- This is retrieval over a decision ledger, not model learning or training. Never describe it as the model learning, training, or improving.
- The "disagreement" section is REQUIRED. Identify genuine cross-department tension: different risk tolerances, timing, conditions, or priorities. Do not merely restate agreement. If evidence is thin, explicitly name the unresolved tension rather than inventing facts.
- Source counts are integers and must reflect the number of supplied sources supporting or contrasting the item.
- Executive summary must be 2-3 short lines/sentences.
- Evidence contains one finding per relevant department.
- Only include a precedent if it is genuinely relevant to this event; an empty precedents array is fine.
- Be concise and write for a busy decision-maker under time pressure.
- Respond with ONLY a JSON object, no prose before or after, no markdown code fences. Match this exact shape:

{
  "exposure": "one line: what's exposed and why it matters to us",
  "player": "the asset in question, e.g. Marcus Reyes, or null",
  "executiveSummary": "2-3 concise sentences",
  "consensus": [
    { "title": "short agreement headline", "detail": "where departments align", "sourceCount": 2 }
  ],
  "disagreement": [
    { "title": "short tension headline", "detail": "which departments differ and why", "sourceCount": 2 }
  ],
  "evidence": [
    { "name": "Scouting", "finding": "one sentence", "source": "the doc title it came from" }
  ],
  "considerations": [
    { "title": "scenario or option", "detail": "decision consequence or timing consideration" }
  ],
  "precedents": [
    { "title": "short label, e.g. Deferred on a Kessler wing (2024)", "outcome": "good | bad | mixed", "lesson": "one line: what it teaches for the current call" }
  ],
  "openQuestions": ["specific unresolved question"],
  "recommendation": "one line recommendation",
  "citedSourceCount": 5,
  "citationsVerified": true
}

INTERNAL DOCUMENTS:
${knowledgeBase}

DECISION LEDGER:
${historyBlock(history)}`;
}

function extractJson(raw: string): string {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) return fenced[1].trim();
  return trimmed;
}

const EMPTY_RESULT = {
  exposure: "",
  player: null,
  executiveSummary: "",
  consensus: [],
  disagreement: [],
  evidence: [],
  considerations: [],
  precedents: [],
  openQuestions: [],
  recommendation: "",
  citedSourceCount: 0,
  citationsVerified: false,
};

function normalizeResult(value: unknown) {
  if (!value || typeof value !== "object") return EMPTY_RESULT;
  const data = value as Record<string, unknown>;
  const array = (key: string) => (Array.isArray(data[key]) ? data[key] : []);
  return {
    exposure: typeof data.exposure === "string" ? data.exposure : "",
    player: typeof data.player === "string" ? data.player : null,
    executiveSummary:
      typeof data.executiveSummary === "string"
        ? data.executiveSummary
        : typeof data.exposure === "string"
          ? data.exposure
          : "",
    consensus: array("consensus"),
    disagreement: array("disagreement"),
    evidence: array("evidence").length ? array("evidence") : array("departments"),
    considerations: array("considerations"),
    precedents: array("precedents"),
    openQuestions: array("openQuestions"),
    recommendation: typeof data.recommendation === "string" ? data.recommendation : "",
    citedSourceCount:
      typeof data.citedSourceCount === "number"
        ? Math.max(0, Math.trunc(data.citedSourceCount))
        : array("evidence").length,
    citationsVerified: data.citationsVerified === true,
  };
}

export async function POST(req: Request) {
  try {
    const body: { event: FeedEvent; history?: Decision[] } = await req.json();
    const event = body.event;
    const history = body.history ?? HISTORY;
    const eventDescription = `Type: ${event.type}\nHeadline: ${event.headline}\nDetail: ${event.detail}`;

    const response = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 3500,
      system: buildSystemPrompt(history),
      messages: [
        {
          role: "user",
          content: `League event:\n${eventDescription}\n\nWhat does this mean for us?`,
        },
      ],
    });

    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    try {
      const parsed = JSON.parse(extractJson(text));
      return Response.json(normalizeResult(parsed));
    } catch (parseErr) {
      console.error("Failed to parse impact JSON:", parseErr, text);
      return Response.json({
        ...EMPTY_RESULT,
        exposure: "Could not analyze this event automatically. Try again shortly.",
      });
    }
  } catch (err) {
    console.error(err);
    return Response.json(
      { ...EMPTY_RESULT, exposure: "Something went wrong. Check the server logs." },
      { status: 500 }
    );
  }
}
