import Anthropic from "@anthropic-ai/sdk";
import { DOCS } from "@/lib/data";
import type { FeedEvent } from "@/lib/league";

export const runtime = "nodejs";

const client = new Anthropic();

const knowledgeBase = DOCS.map(
  (d) =>
    `--- DOC (Department: ${d.department} | Title: ${d.title} | ID: ${d.id}) ---\n${d.content}`
).join("\n\n");

const SYSTEM_PROMPT = `You are the decision-support assistant for the front office of a professional basketball team, the Cascades.
You can see internal documents across departments: scouting, analytics, medical, contracts, and coaching.

You are given one league event and the org's internal documents. Explain how this event affects THIS org, using only the documents, one finding per relevant department, and cite the document title it came from.

Rules:
- Use ONLY the information in the documents below. Never invent facts.
- If the event does not clearly connect to any internal document, say so plainly in "exposure" and return an empty departments array.
- Be concise and write for a busy decision-maker under time pressure.
- Respond with ONLY a JSON object, no prose before or after, no markdown code fences. Match this exact shape:

{
  "exposure": "one line: what's exposed and why it matters to us",
  "player": "the asset in question, e.g. Marcus Reyes, or null",
  "departments": [
    { "name": "Scouting", "finding": "one sentence", "source": "the doc title it came from" }
  ],
  "recommendation": "one line recommendation"
}

INTERNAL DOCUMENTS:
${knowledgeBase}`;

function extractJson(raw: string): string {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) return fenced[1].trim();
  return trimmed;
}

export async function POST(req: Request) {
  try {
    const event: FeedEvent = await req.json();
    const eventDescription = `Type: ${event.type}\nHeadline: ${event.headline}\nDetail: ${event.detail}`;

    const response = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `League event:\n${eventDescription}\n\nWhat does this mean for us?`,
        },
      ],
    });

    const text = response.content
      .filter((b) => b.type === "text")
      .map((b: any) => b.text)
      .join("\n");

    try {
      const parsed = JSON.parse(extractJson(text));
      return Response.json(parsed);
    } catch (parseErr) {
      console.error("Failed to parse impact JSON:", parseErr, text);
      return Response.json({
        exposure: "Could not analyze this event automatically. Try again shortly.",
        player: null,
        departments: [],
        recommendation: "",
      });
    }
  } catch (err) {
    console.error(err);
    return Response.json(
      {
        exposure: "Something went wrong. Check the server logs.",
        player: null,
        departments: [],
        recommendation: "",
      },
      { status: 500 }
    );
  }
}
