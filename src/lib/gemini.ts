type Part =
  | { text: string }
  | { inlineData: { mimeType: string; data: string } };

type Turn = { role: "user" | "model"; parts: Part[] };

export async function gemini<T>({
  system,
  contents,
  schema,
  temperature = 0.2,
}: {
  system: string;
  contents: Turn[];
  schema?: object;
  temperature?: number;
}): Promise<T> {
  const model = process.env.GEMINI_MODEL ?? "gemini-3.8-flash";
  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: system }] },
    contents,
    generationConfig: {
      responseMimeType: "application/json",
      ...(schema ? { responseSchema: schema } : {}),
      temperature,
      thinkingConfig: { thinkingBudget: 0 },
    },
  });
  let problem: unknown;
  for (const delay of [0, 700, 1800]) {
    if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": process.env.GEMINI_API_KEY ?? "",
          },
          body,
        },
      );
      if (!response.ok) {
        problem = new Error(`gemini ${response.status}`);
        if (response.status === 400 || response.status === 403) break;
        continue;
      }
      const data = await response.json();
      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (typeof raw !== "string") {
        problem = new Error(`gemini empty ${data.candidates?.[0]?.finishReason ?? data.promptFeedback?.blockReason ?? ""}`);
        continue;
      }
      return JSON.parse(raw) as T;
    } catch (error) {
      problem = error;
    }
  }
  console.error(problem);
  throw problem;
}

export function text(value: string): Turn {
  return { role: "user", parts: [{ text: value }] };
}

export const imageMediaTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export function isImage(image: unknown, mediaType: unknown) {
  return (
    typeof image === "string" &&
    image.length > 0 &&
    image.length < 8_000_000 &&
    (imageMediaTypes as readonly unknown[]).includes(mediaType)
  );
}

export const plainRules = `Write in short, plain sentences at a sixth-grade reading level. Keep product names, numbers, dates, times and phone numbers exactly as written. Never use markdown, asterisks or bullet symbols inside text fields.`;

export const californiaFacts = `Facts you may rely on, for California farm work:
- Restricted-entry interval (REI): workers may not enter a treated area until the REI on the label has passed, unless they are trained early-entry workers wearing the label's early-entry PPE. Treated fields may be posted with signs.
- Employers must provide, clean and replace the PPE the label requires, at no cost, and must provide decontamination supplies (water, soap, single-use towels) near the work area.
- Workers have the right to see the pesticide application record and the safety data sheet, and to get pesticide safety training in a language they understand.
- If a worker may have been poisoned, the employer must take them to a doctor right away and tell the doctor which pesticide it was.
- Heat (California outdoor heat illness standard): above 80°F shade must be available; at 95°F and above high-heat procedures apply, someone watches workers for heat illness, and farmworkers get a 10-minute cool-down rest every two hours; fresh water must be free and close, about 1 quart per hour per worker; workers may take a cool-down rest whenever they feel they need it.
- It is illegal to punish or fire a worker for asking about pesticides, reporting a problem or using these rights. Complaints can go to the County Agricultural Commissioner, Cal/OSHA, or the California Department of Pesticide Regulation (1-87PestLine, 1-877-378-5463).
- Poison Control: 1-800-222-1222, free, private, 24 hours, with interpreters. Emergencies: 911.`;
