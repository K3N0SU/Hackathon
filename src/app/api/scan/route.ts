import Anthropic from "@anthropic-ai/sdk";
import { languageNames, type Language, type ScanResult } from "@/lib/scan";

const client = new Anthropic();

export const maxDuration = 60;

const system = `You read pesticide labels and field warning signs for farmworkers in California's Central Valley, most of whom speak Spanish or Punjabi and may read little English. Your reader is a worker standing in a field who needs to know what is safe.

Rules:
- Report only what is printed in the photo. Never add safety advice from memory. If a field is not shown, leave it empty and say so in "ask".
- Write every text field in the requested language, in short plain sentences at a sixth-grade reading level. Keep product names, numbers, dates, times and phone numbers exactly as printed.
- "signal" is the signal word on the label or sign: caution, warning or danger. Use "unknown" if none is visible.
- "reentry" is when it is safe to go back into the treated area (the restricted-entry interval or the do-not-enter date and time). Quote the exact hours or date.
- "gear" lists the protective equipment the label requires. "firstAid" lists the first aid steps and any poison control number.
- If the photo is not a pesticide label or a field sign, or is too blurry or cut off to read, set "readable" to false and leave the other fields empty.
- If any key detail is unclear, partly hidden or contradictory, set "ask" to one short sentence in the requested language telling the worker to ask their supervisor about that part. Otherwise leave "ask" empty.
- Glossary for Punjabi: re-entry interval = ਵਾਪਸ ਅੰਦਰ ਜਾਣ ਦਾ ਸਮਾਂ, pesticide = ਕੀਟਨਾਸ਼ਕ, herbicide = ਨਦੀਨਨਾਸ਼ਕ, gloves = ਦਸਤਾਨੇ, respirator = ਸਾਹ ਵਾਲਾ ਮਾਸਕ, poison control = ਪੋਇਜ਼ਨ ਕੰਟਰੋਲ.
- Glossary for Spanish: re-entry interval = intervalo de reingreso, pesticide = pesticida, gloves = guantes, respirator = respirador, poison control = Control de Envenenamientos.`;

const tool: Anthropic.Tool = {
  name: "report_scan",
  description: "Report what the label or sign says, in the requested language.",
  input_schema: {
    type: "object",
    properties: {
      readable: { type: "boolean" },
      product: { type: "string" },
      signal: { type: "string", enum: ["caution", "warning", "danger", "unknown"] },
      reentry: { type: "string" },
      gear: { type: "array", items: { type: "string" } },
      firstAid: { type: "array", items: { type: "string" } },
      summary: { type: "string" },
      ask: { type: "string" },
    },
    required: ["readable", "product", "signal", "reentry", "gear", "firstAid", "summary", "ask"],
  },
};

const mediaTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;

export async function POST(req: Request) {
  const { image, mediaType, language } = await req.json();
  if (
    typeof image !== "string" ||
    !mediaTypes.includes(mediaType) ||
    !(language in languageNames)
  ) {
    return new Response("image, mediaType and language required", { status: 400 });
  }

  try {
    const message = await client.messages.create({
      model: process.env.CLAUDE_MODEL ?? "claude-sonnet-5-5",
      max_tokens: 1500,
      system,
      tools: [tool],
      tool_choice: { type: "tool", name: tool.name },
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType, data: image } },
            {
              type: "text",
              text: `Read this photo. Write every text field in ${languageNames[language as Language]}.`,
            },
          ],
        },
      ],
    });

    const block = message.content.find((part) => part.type === "tool_use");
    if (!block || block.type !== "tool_use") {
      return new Response("no result", { status: 502 });
    }
    return Response.json(block.input as ScanResult);
  } catch {
    return new Response("scan failed", { status: 502 });
  }
}
