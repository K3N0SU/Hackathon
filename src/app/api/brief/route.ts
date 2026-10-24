import { californiaFacts, gemini, plainRules } from "@/lib/gemini";
import { fetchHeat, manteca } from "@/lib/heat";
import { isLanguage, languageNames } from "@/lib/scan";

export const maxDuration = 60;

type ClockInput = { product: string; endsAt: number };

const system = `You give a farmworker in California a short spoken safety plan for today, the way a friendly crew leader would at the start of the shift.

Rules:
- Write in the requested language. ${plainRules}
- "greeting" is one short warm sentence for the time of day.
- "items" are 2 to 5 short sentences, most important first: blocks that are still closed and when each opens, blocks that are open now, the hottest hour and what the heat rule means today, and how much water to drink. Only use the data given. Never invent blocks or products.
- If there are no clocks, say there are no closed blocks saved on their phone and remind them to check posted signs.
- "spoken" is the greeting and items joined into one natural paragraph for reading out loud.

${californiaFacts}`;

const schema = {
  type: "OBJECT",
  properties: {
    greeting: { type: "STRING" },
    items: { type: "ARRAY", items: { type: "STRING" } },
    spoken: { type: "STRING" },
  },
  required: ["greeting", "items", "spoken"],
};

export async function POST(req: Request) {
  const { language, clocks, latitude, longitude, lastProduct } =
    await req.json();
  if (!isLanguage(language)) {
    return new Response("language required", { status: 400 });
  }
  const now = Date.now();
  const blocks = (Array.isArray(clocks) ? (clocks as ClockInput[]) : [])
    .slice(0, 10)
    .map((clock) => {
      const minutes = Math.round((Number(clock.endsAt) - now) / 60000);
      const name = String(clock.product).slice(0, 120);
      return minutes > 0
        ? `${name}: closed, ${Math.floor(minutes / 60)} h ${minutes % 60} min left`
        : `${name}: open now`;
    });
  let weather = "unavailable";
  try {
    const heat = await fetchHeat(
      Number.isFinite(latitude) ? latitude : manteca.latitude,
      Number.isFinite(longitude) ? longitude : manteca.longitude,
    );
    weather = `now ${heat.now}°F, feels like ${heat.feels}°F, high ${heat.high}°F at ${heat.highHour}:00`;
  } catch {}
  const details = [
    `Local time: ${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })}`,
    `Re-entry clocks: ${blocks.join("; ") || "none"}`,
    `Weather: ${weather}`,
    lastProduct ? `Last label scanned: ${String(lastProduct).slice(0, 200)}` : "",
    `Answer in ${languageNames[language]}.`,
  ]
    .filter(Boolean)
    .join("\n");
  try {
    const result = await gemini({
      system,
      schema,
      contents: [{ role: "user", parts: [{ text: details }] }],
      temperature: 0.4,
    });
    return Response.json(result);
  } catch {
    return new Response("brief failed", { status: 502 });
  }
}
