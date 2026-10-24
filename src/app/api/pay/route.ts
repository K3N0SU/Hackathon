import { gemini, isImage, plainRules } from "@/lib/gemini";
import { isLanguage, languageNames } from "@/lib/scan";

export const maxDuration = 60;

const system = `You check a farmworker's pay stub from California and explain it in plain words. You are not a lawyer, and you say "ask about this" rather than "this is illegal".

California pay facts for 2026:
- Minimum wage is $16.90 an hour for every employer. Piece-rate pay must still average at least minimum wage for all hours worked.
- Farmworkers get overtime at 1.5 times their regular rate after 8 hours in a day or 40 hours in a week, and double time after 12 hours in a day.
- Piece-rate workers must also be paid separately for rest and recovery breaks and for nonproductive time, at their average hourly rate.
- A pay stub must show: gross pay, total hours worked, each hourly rate and the hours at that rate, piece units and piece rates if paid by the piece, every deduction, net pay, the pay period dates, the employer's name and address, and paid sick leave available.
- Workers earn at least 40 hours or 5 days of paid sick leave a year.
- Wage problems can be reported to the California Labor Commissioner, free, with interpreters, no matter your immigration status.

Rules:
- Write every text field in the requested language, but keep numbers and money exactly as printed. ${plainRules}
- Fill "hours", "rate", "gross", "net" and "period" only with what is printed, or an empty string.
- "checks" has 3 to 6 short checks: whether the rate is at least minimum wage, whether hours times rate roughly matches gross pay, whether overtime appears when hours suggest it should, whether required items are missing from the stub, and any deduction that looks unusual. "status" is "ok", "ask" or "missing". "detail" is one short sentence with the numbers.
- "verdict" is "ok" if nothing needs asking, "ask" if something should be asked about, "unclear" if the stub cannot be read well enough.
- "summary" is two short sentences: what they were paid for, and the main thing to know.
- "nextStep" is one sentence: who to ask, or that it looks fine.
- If the photo is not a pay stub, set "readable" to false and leave the rest empty.`;

const schema = {
  type: "OBJECT",
  properties: {
    readable: { type: "BOOLEAN" },
    employer: { type: "STRING" },
    period: { type: "STRING" },
    hours: { type: "STRING" },
    rate: { type: "STRING" },
    gross: { type: "STRING" },
    net: { type: "STRING" },
    checks: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          label: { type: "STRING" },
          status: { type: "STRING", enum: ["ok", "ask", "missing"] },
          detail: { type: "STRING" },
        },
        required: ["label", "status", "detail"],
      },
    },
    verdict: { type: "STRING", enum: ["ok", "ask", "unclear"] },
    summary: { type: "STRING" },
    nextStep: { type: "STRING" },
  },
  required: ["readable", "employer", "period", "hours", "rate", "gross", "net", "checks", "verdict", "summary", "nextStep"],
};

export async function POST(req: Request) {
  const { image, mediaType, language } = await req.json();
  if (!isImage(image, mediaType) || !isLanguage(language)) {
    return new Response("image, mediaType and language required", { status: 400 });
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
            { text: `Check this pay stub. Answer in ${languageNames[language]}.` },
          ],
        },
      ],
    });
    return Response.json(result);
  } catch {
    return new Response("pay check failed", { status: 502 });
  }
}
