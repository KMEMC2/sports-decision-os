import Anthropic from "@anthropic-ai/sdk";
import { DOCS } from "@/lib/data";

export const runtime = "nodejs";

const client = new Anthropic();

const knowledgeBase = DOCS.map(
  (d) =>
    `--- DOC (Department: ${d.department} | Title: ${d.title} | ID: ${d.id}) ---\n${d.content}`
).join("\n\n");

const SYSTEM_PROMPT = `You are the decision-support assistant for the front office of a professional basketball team, the Cascades.
You can see internal documents across departments: scouting, analytics, medical, contracts, and coaching.

Rules:
- Answer using ONLY the information in the documents below.
- When you state a fact, cite the department and title it came from, like [Medical / Injury Log: Marcus Reyes].
- Your value is connecting information ACROSS departments. When a question spans silos, pull the relevant fact from each.
- If the documents do not contain the answer, say so plainly. Never invent facts.
- Be concise and write for a busy decision-maker.

INTERNAL DOCUMENTS:
${knowledgeBase}`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const response = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
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