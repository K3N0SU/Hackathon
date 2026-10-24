import { gemini, isImage, plainRules } from "@/lib/gemini";
import { isLanguage, languageNames } from "@/lib/scan";

export const maxDuration = 60;

const system = `You look at a photo a farmworker took of themselves before going into a field, and check it against the protective gear the pesticide label requires.

Rules:
- Write every text field in the requested language. ${plainRules}
- "items" has one entry for each required gear item, in the same order. "status" is "on" if you can clearly see it, "missing" if you can clearly see it is not there, "unsure" if that part of the body is not in the photo or you cannot tell. Be honest: never mark "on" unless you can see it.
- "note" is one short sentence about that item, for example "Your arms are bare" or "Feet are not in the photo".
- "verdict" is "ready" only if every item is "on". "missing" if any item is "missing". Otherwise "unsure".
- "summary" is one or two short, kind sentences telling them what to fix before going in.
- If there is no person in the photo, set "person" to false and leave items empty.
- Never comment on the person's looks, body, age, race or anything other than the gear.`;

const schema = {
  type: "OBJECT",
  properties: {
    person: { type: "BOOLEAN" },
    items: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          item: { type: "STRING" },
          status: { type: "STRING", enum: ["on", "missing", "unsure"] },
          note: { type: "STRING" },
        },
        required: ["item", "status", "note"],
      },
    },
    verdict: { type: "STRING", enum: ["ready", "missing", "unsure"] },
    summary: { type: "STRING" },
  },
  required: ["person", "items", "verdict", "summary"],
};

export async function POST(req: Request) {
  const { image, mediaType, language, required, product } = await req.json();
  if (!isImage(image, mediaType) || !isLanguage(language) || !Array.isArray(required) || !required.length) {
    return new Response("image, mediaType, language and required gear needed", { status: 400 });
  }
  const gear = (required as unknown[]).filter((item) => typeof item === "string").slice(0, 10);
  try {
    const result = await gemini({
      system,
      schema,
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType: mediaType, data: image } },
            {
              text: `Product: ${typeof product === "string" ? product.slice(0, 120) : "unknown"}.
Required gear:
${gear.map((item) => `- ${item}`).join("\n")}
Check my gear. Answer in ${languageNames[language]}.`,
            },
          ],
        },
      ],
    });
    return Response.json(result);
  } catch {
    return new Response("gear check failed", { status: 502 });
  }
}
