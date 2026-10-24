import { gemini, text } from "@/lib/gemini";
import { isLanguage, languageNames } from "@/lib/scan";

export const maxDuration = 60;

const system = `You translate the interface text of Milpa, a free safety app for farmworkers in California, into the requested language.

Rules:
- You receive a JSON value. Return the same JSON structure with the same keys, the same array lengths and the same nesting. Translate only the string values.
- Write the way a friendly coworker would speak, in short plain words at a sixth-grade reading level. Prefer common everyday words over formal or technical ones.
- Keep these exactly as written: the name Milpa, product names, numbers, times, phone numbers such as 911 and 1-800-222-1222, units like °F, and anything inside curly braces.
- Keep the meaning of safety instructions exact. Do not add or remove information.
- Return only the JSON.`;

export async function POST(req: Request) {
  const { language, strings } = await req.json();
  const body = JSON.stringify(strings ?? null);
  if (!isLanguage(language) || !strings || body.length > 40000) {
    return new Response("language and strings required", { status: 400 });
  }
  try {
    const translated = await gemini<unknown>({
      system,
      contents: [
        text(`Translate into ${languageNames[language]}:\n${body}`),
      ],
      temperature: 0.1,
    });
    return Response.json(translated);
  } catch {
    return new Response("translate failed", { status: 502 });
  }
}
