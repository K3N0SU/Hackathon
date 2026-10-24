import { languageNames, type Language, type ScanResult } from "@/lib/scan";

export const maxDuration = 60;

const system = `You read pesticide labels and field warning signs for farmworkers in California's Central Valley, most of whom speak Spanish or Punjabi and may read little English. Your reader is a worker standing in a field who needs to know what is safe.

Rules:
- Report only what is printed in the photo. Never add safety advice from memory. If a field is not shown, leave it empty and say so in "ask".
- Write every text field in the requested language, in short plain sentences at a sixth-grade reading level. Keep product names, numbers, dates, times and phone numbers exactly as printed, but translate units and every other word, for example hours = ਘੰਟੇ in Punjabi and horas in Spanish.
- "signal" is the signal word on the label or sign: caution, warning or danger. Use "unknown" if none is visible.
- "reentry" is when it is safe to go back into the treated area (the restricted-entry interval or the do-not-enter date and time). Write it as one full sentence in the requested language that states the exact hours or date, for example "Do not enter for 12 hours after spraying."
- "reentryHours" is the re-entry interval as a plain number of hours (convert days to hours). Use 0 if the label or sign gives only a calendar date and time, or no interval.
- "gear" lists the protective equipment the label requires. "firstAid" lists the first aid steps and any poison control number.
- If the photo is not a pesticide label or a field sign, or is too blurry or cut off to read, set "readable" to false and leave the other fields empty.
- If any key detail is unclear, partly hidden or contradictory, set "ask" to one short sentence in the requested language telling the worker to ask their supervisor about that part. Otherwise leave "ask" empty.
- Glossary for Punjabi: re-entry interval = ਵਾਪਸ ਅੰਦਰ ਜਾਣ ਦਾ ਸਮਾਂ, pesticide = ਕੀਟਨਾਸ਼ਕ, herbicide = ਨਦੀਨਨਾਸ਼ਕ, gloves = ਦਸਤਾਨੇ, respirator = ਸਾਹ ਵਾਲਾ ਮਾਸਕ, poison control = ਪੋਇਜ਼ਨ ਕੰਟਰੋਲ.
- Glossary for Spanish: re-entry interval = intervalo de reingreso, pesticide = pesticida, gloves = guantes, respirator = respirador, poison control = Control de Envenenamientos.`;

const schema = {
  type: "OBJECT",
  properties: {
    readable: { type: "BOOLEAN" },
    product: { type: "STRING" },
    signal: {
      type: "STRING",
      format: "enum",
      enum: ["caution", "warning", "danger", "unknown"],
    },
    reentryHours: { type: "NUMBER" },
    reentry: { type: "STRING" },
    gear: { type: "ARRAY", items: { type: "STRING" } },
    firstAid: { type: "ARRAY", items: { type: "STRING" } },
    summary: { type: "STRING" },
    ask: { type: "STRING" },
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
  ],
};

const mediaTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export async function POST(req: Request) {
  const { image, mediaType, language } = await req.json();
  if (
    typeof image !== "string" ||
    !mediaTypes.includes(mediaType) ||
    !(language in languageNames)
  ) {
    return new Response("image, mediaType and language required", {
      status: 400,
    });
  }

  try {
    const model = process.env.GEMINI_MODEL ?? "gemini-3.8-flash";
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY ?? "",
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [
            {
              role: "user",
              parts: [
                { inlineData: { mimeType: mediaType, data: image } },
                {
                  text: `Read this photo. Write every text field in ${languageNames[language as Language]}.`,
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: schema,
            temperature: 0.2,
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      },
    );
    if (!response.ok) return new Response("scan failed", { status: 502 });

    const data = await response.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof raw !== "string")
      return new Response("no result", { status: 502 });
    return Response.json(JSON.parse(raw) as ScanResult);
  } catch {
    return new Response("scan failed", { status: 502 });
  }
}
