import { gemini, isImage, plainRules } from "@/lib/gemini";
import { isLanguage, languageNames, type ScanResult } from "@/lib/scan";

export const maxDuration = 60;

const system = `You read pesticide labels and field warning signs for farmworkers in California's Central Valley. Many read Spanish, Punjabi, Hmong or another language first and may read little English. Your reader is a worker standing in a field who needs to know what is safe.

Rules:
- Report only what is printed in the photo. Never add safety advice from memory. If a field is not shown, leave it empty and say so in "ask".
- Write every text field except "evidence" quotes in the requested language. ${plainRules} Translate units and every other word, for example hours = ਘੰਟੇ in Punjabi and horas in Spanish.
- "signal" is the signal word on the label or sign: caution, warning or danger. Use "unknown" if none is visible.
- "reentry" is when it is safe to go back into the treated area (the restricted-entry interval or the do-not-enter date and time). Write it as one full sentence that states the exact hours or date, for example "Do not enter for 12 hours after spraying."
- "reentryHours" is the re-entry interval as a plain number of hours (convert days to hours). Use 0 if the label or sign gives only a calendar date and time, or no interval.
- "gear" lists the protective equipment the label requires. "firstAid" lists the first aid steps and any poison control number.
- "evidence" proves where each answer came from. Add one item for each of product, signal, reentry, gear and firstAid that you filled in. "field" is that field name. "quote" is the exact words copied from the label in the label's own language, at most 25 words.
- "confidence" is high when the photo is sharp and every key field is clearly printed, medium when something is small, partly hidden or needed interpretation, low when you are unsure about the re-entry time or signal word.
- "others" lists any other different pesticide products whose labels are also visible in the same photo, with their product name, signal word and re-entry hours. Leave it empty if there is only one.
- If the photo is not a pesticide label or a field sign, or is too blurry or cut off to read, set "readable" to false and leave the other fields empty.
- If any key detail is unclear, partly hidden or contradictory, set "ask" to one short sentence telling the worker to ask their supervisor about that part. Otherwise leave "ask" empty.
- Glossary for Punjabi: re-entry interval = ਵਾਪਸ ਅੰਦਰ ਜਾਣ ਦਾ ਸਮਾਂ, pesticide = ਕੀਟਨਾਸ਼ਕ, herbicide = ਨਦੀਨਨਾਸ਼ਕ, gloves = ਦਸਤਾਨੇ, respirator = ਸਾਹ ਵਾਲਾ ਮਾਸਕ, poison control = ਪੋਇਜ਼ਨ ਕੰਟਰੋਲ.
- Glossary for Spanish: re-entry interval = intervalo de reingreso, pesticide = pesticida, gloves = guantes, respirator = respirador, poison control = Control de Envenenamientos.`;

const signal = {
  type: "STRING",
  format: "enum",
  enum: ["caution", "warning", "danger", "unknown"],
};

const schema = {
  type: "OBJECT",
  properties: {
    readable: { type: "BOOLEAN" },
    product: { type: "STRING" },
    signal,
    reentryHours: { type: "NUMBER" },
    reentry: { type: "STRING" },
    gear: { type: "ARRAY", items: { type: "STRING" } },
    firstAid: { type: "ARRAY", items: { type: "STRING" } },
    summary: { type: "STRING" },
    ask: { type: "STRING" },
    confidence: { type: "STRING", format: "enum", enum: ["high", "medium", "low"] },
    evidence: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: { field: { type: "STRING" }, quote: { type: "STRING" } },
        required: ["field", "quote"],
      },
    },
    others: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          product: { type: "STRING" },
          signal,
          reentryHours: { type: "NUMBER" },
        },
        required: ["product", "signal", "reentryHours"],
      },
    },
  },
  required: [
    "readable",
    "product",
    "signal",
    "reentryHours",
    "reentry",
    "gear",
    "firstAid",
    "summary",
    "ask",
    "confidence",
    "evidence",
    "others",
  ],
};

export async function POST(req: Request) {
  const { image, mediaType, language } = await req.json();
  if (!isImage(image, mediaType) || !isLanguage(language)) {
    return new Response("image, mediaType and language required", {
      status: 400,
    });
  }
  try {
    const result = await gemini<ScanResult>({
      system,
      schema,
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType: mediaType, data: image } },
            {
              text: `Read this photo. Write every text field in ${languageNames[language]}.`,
            },
          ],
        },
      ],
    });
    return Response.json(result);
  } catch {
    return new Response("scan failed", { status: 502 });
  }
}
