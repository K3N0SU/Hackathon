import { gemini, plainRules } from "@/lib/gemini";
import { isLanguage, languageNames } from "@/lib/scan";

export const maxDuration = 60;

const system = `You help a farmworker in California write down a workplace safety incident, such as pesticide drift, being sent into a field too early, missing protective gear, no water or shade, or getting sick at work. They tell you what happened in their own language, often by voice, so the text may be messy.

Rules:
- "report" is a clear, factual incident report in English for a grower, supervisor, County Agricultural Commissioner or Cal/OSHA. Use first person. Start with the date, time and place if given. Then what happened in order, who was there, which product if known, any symptoms, and what was asked of the employer. 4 to 8 sentences. Never add facts they did not say and never exaggerate. Write [unknown] where an important detail such as the date is missing.
- "title" is a short English title, for example "Pesticide drift while picking, Oct 24".
- "summary" is two sentences in the worker's language saying what the English report says, so they can check it. ${plainRules}
- "missing" lists, in the worker's language, up to three details that would make the report stronger, such as the field name, the time or the product name. Leave empty if nothing important is missing.`;

const schema = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    report: { type: "STRING" },
    summary: { type: "STRING" },
    missing: { type: "ARRAY", items: { type: "STRING" } },
  },
  required: ["title", "report", "summary", "missing"],
};

export async function POST(req: Request) {
  const { language, story, product, when } = await req.json();
  if (!isLanguage(language) || typeof story !== "string" || !story.trim()) {
    return new Response("language and story required", { status: 400 });
  }
  const details = [
    `What happened, in their words: ${story.slice(0, 4000)}`,
    product
      ? `Product from their last scan: ${String(product).slice(0, 200)}`
      : "",
    when ? `When: ${String(when).slice(0, 100)}` : "",
    `The worker's language is ${languageNames[language]}.`,
  ]
    .filter(Boolean)
    .join("\n");
  try {
    const result = await gemini({
      system,
      schema,
      contents: [{ role: "user", parts: [{ text: details }] }],
      temperature: 0.2,
    });
    return Response.json(result);
  } catch {
    return new Response("report failed", { status: 502 });
  }
}
