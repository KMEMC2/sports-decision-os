import Anthropic from "@anthropic-ai/sdk";
import { DOCS } from "@/lib/data";
import { HISTORY, type Decision } from "@/lib/history";

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

Rules:
- Answer using ONLY the information in the documents and decision ledger below.
- When you state a fact, cite the department and title it came from, like [Medical / Injury Log: Marcus Reyes].
- Your value is connecting information ACROSS departments. When a question spans silos, pull the relevant fact from each.
- When a past decision is relevant, cite it and weigh its outcome: treat bad outcomes as cautions and good outcomes as support for a similar call.
- This is retrieval over a decision ledger, not model learning or training. Never describe it as the model learning, training, or improving.
- If the documents do not contain the answer, say so plainly. Never invent facts.
- Be concise and write for a busy decision-maker.

INTERNAL DOCUMENTS:
${knowledgeBase}

DECISION LEDGER:
${historyBlock(history)}`;
}

export async function POST(req: Request) {
  try {
    const { messages, history } = await req.json();
    const response = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 1024,
      system: buildSystemPrompt(history ?? HISTORY),
      messages,
    });
    const text = response.content
      .filter((b) => b.type === "text")
      .map((b: any) => b.text)
      .join("\n");
    return Response.json({ reply: text });
  } catch (err) {
    console.error(err);
    return Response.json(
      { reply: "Something went wrong. Check the server logs." },
      { status: 500 }
    );
  }
}