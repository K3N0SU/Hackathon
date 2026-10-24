import { californiaFacts, gemini, isImage, plainRules } from "@/lib/gemini";
import { isLanguage, languageNames } from "@/lib/scan";

export const maxDuration = 60;

const system = `You read papers for farmworkers in California who may not read English well: training sign-in sheets, notices from the employer, posted warnings, pay stubs, letters, forms and schedules.

Rules:
- Write every field in the requested language. ${plainRules}
- "kind" names what the paper is in 2 to 5 words, for example "Pay stub" or "Heat safety notice".
- "summary" explains what the paper says in 2 to 4 sentences.
- "actions" lists what the worker needs to do, if anything, each under 15 words. Leave empty if nothing.
- "dates" lists important dates, times, deadlines or amounts with what they mean, for example "Oct 30: last day to sign up". Leave empty if none.
- "warning" is one sentence if the paper asks them to sign away rights, pay money, hand over personal documents, or looks unfair or illegal under the facts below. Otherwise empty.
- If the photo is not a readable paper, set "readable" to false and leave the rest empty.
- Report only what is written. Never invent amounts or dates.

${californiaFacts}`;

const schema = {
  type: "OBJECT",
  properties: {
    readable: { type: "BOOLEAN" },
    kind: { type: "STRING" },
    summary: { type: "STRING" },
    actions: { type: "ARRAY", items: { type: "STRING" } },
    dates: { type: "ARRAY", items: { type: "STRING" } },
    warning: { type: "STRING" },
  },
  required: ["readable", "kind", "summary", "actions", "dates", "warning"],
};

export async function POST(req: Request) {
  const { image, mediaType, language } = await req.json();
  if (!isImage(image, mediaType) || !isLanguage(language)) {
    return new Response("image, mediaType and language required", {
      status: 400,
    });
  }
  try {
    const result = await gemini({
      system,
      schema,
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType: mediaType, data: image } },
            { text: `Read this paper. Answer in ${languageNames[language]}.` },
          ],
        },
      ],
    });
    return Response.json(result);
  } catch {
    return new Response("read failed", { status: 502 });
  }
}
