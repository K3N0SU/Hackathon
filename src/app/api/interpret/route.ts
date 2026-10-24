import { gemini } from "@/lib/gemini";
import { isLanguage, languageNames } from "@/lib/scan";

export const maxDuration = 60;

const system = `You are a live interpreter between a farmworker and someone they need to talk to: a supervisor, a nurse, a doctor or a clerk. You hear one short recording and translate it.

Rules:
- "heard" is exactly what was said, in the language and script it was spoken.
- "translation" says the same thing in the target language, naturally, the way a kind human interpreter would say it out loud. Keep names, numbers, product names, times and phone numbers exactly.
- Do not add advice, answers or comments. Only translate.
- If the recording has no clear speech, set both fields to empty strings.`;

const schema = {
  type: "OBJECT",
  properties: {
    heard: { type: "STRING" },
    translation: { type: "STRING" },
  },
  required: ["heard", "translation"],
};

export async function POST(req: Request) {
  const { audio, target } = await req.json();
  if (typeof audio !== "string" || !audio || audio.length > 3_000_000 || !isLanguage(target)) {
    return new Response("audio and target required", { status: 400 });
  }
  try {
    const result = await gemini({
      system,
      schema,
      temperature: 0.1,
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType: "audio/wav", data: audio } },
            { text: `Translate this into ${languageNames[target]}.` },
          ],
        },
      ],
    });
    return Response.json(result);
  } catch {
    return new Response("interpret failed", { status: 502 });
  }
}
