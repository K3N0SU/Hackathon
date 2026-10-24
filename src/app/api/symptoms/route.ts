import { californiaFacts, gemini, plainRules } from "@/lib/gemini";
import { isLanguage, languageNames } from "@/lib/scan";

export const maxDuration = 60;

const system = `You help a farmworker in California decide how urgently to get help for how they feel at work. They may have touched a pesticide or be working in heat. You are not a doctor and you never diagnose. You sort urgency and give first steps.

Urgency levels, choose exactly one:
- "911": trouble breathing, fainting or passing out, seizure, chest pain, confusion or acting strange, hot dry skin with confusion, cannot stop vomiting, pinpoint pupils with heavy sweating and drooling, or a child swallowed something.
- "poison": pesticide on skin, in eyes, breathed in or swallowed, or symptoms that started after spraying or entering a sprayed area, such as headache, dizziness, nausea, burning eyes, rash, heavy sweating or muscle twitching, without any 911 sign.
- "doctor": symptoms that are mild and not clearly linked to pesticide or heat but should be checked today.
- "rest": mild heat symptoms such as thirst, tiredness or cramps, with no 911 sign: get to shade, drink water, rest, and tell a supervisor.

Rules:
- Write "title", "why" and "steps" in the requested language. ${plainRules}
- "title" is one short command, for example "Call 911 now" or "Call Poison Control".
- "why" is one sentence that names the symptoms that led to this level.
- "steps" are 3 to 5 short actions, most important first. Include rinsing for 15 minutes when skin or eyes were exposed, getting to shade and water for heat, and telling the supervisor which product it was.
- When unsure between two levels, choose the more urgent one.

${californiaFacts}`;

const schema = {
  type: "OBJECT",
  properties: {
    urgency: {
      type: "STRING",
      format: "enum",
      enum: ["911", "poison", "doctor", "rest"],
    },
    title: { type: "STRING" },
    why: { type: "STRING" },
    steps: { type: "ARRAY", items: { type: "STRING" } },
  },
  required: ["urgency", "title", "why", "steps"],
};

export async function POST(req: Request) {
  const { language, symptoms, note, product, heat } = await req.json();
  if (!isLanguage(language) || !Array.isArray(symptoms)) {
    return new Response("language and symptoms required", { status: 400 });
  }
  const details = [
    `Symptoms tapped: ${symptoms.map(String).slice(0, 20).join(", ") || "none"}`,
    note ? `In their words: ${String(note).slice(0, 1000)}` : "",
    product
      ? `Last pesticide label they scanned: ${String(product).slice(0, 200)}`
      : "",
    heat ? `Temperature now: ${Number(heat)}°F` : "",
    `Answer in ${languageNames[language]}.`,
  ]
    .filter(Boolean)
    .join("\n");
  try {
    const result = await gemini({
      system,
      schema,
      contents: [{ role: "user", parts: [{ text: details }] }],
      temperature: 0.1,
    });
    return Response.json(result);
  } catch {
    return new Response("symptoms failed", { status: 502 });
  }
}
