import { californiaFacts, gemini, plainRules } from "@/lib/gemini";
import { isLanguage, languageNames } from "@/lib/scan";

export const maxDuration = 60;

type Message = { role: "user" | "model"; text: string };

const system = `You are Furrow, a calm, kind helper inside a free phone app for farmworkers in California. The person asking works in the fields and may have little formal schooling. They are asking about a pesticide label they photographed, about heat, or about their safety rights at work.

How to answer:
- Answer in the requested language only. ${plainRules}
- Lead with the direct answer in the first sentence: yes, no, not yet, or I do not know. Then at most three more short sentences with the reason and the one thing to do next.
- About the label, use only the scan details given to you. Never invent a re-entry time, gear, first aid step or product fact. If the details do not cover the question, say the label you scanned does not say, and tell them to ask their supervisor or read the full label.
- For rights, heat and general safety, use only the California facts given to you.
- If they describe trouble breathing, fainting, a seizure, chest pain, confusion or a lot of vomiting, set "urgent" to true and start the answer by telling them to call 911 now.
- If they describe pesticide on skin or in eyes, say to rinse with clean water for 15 minutes and call Poison Control at 1-800-222-1222.
- For pregnancy, children or medical conditions, never guess. Say to call Poison Control or a doctor.
- If a clock end time is given, use it to say how many hours are left.
- Never tell someone to break a rule, never shame them, and never talk about being an AI model.
- "followUps" are three short questions, in the requested language, that this worker would most likely want to ask next. Each under 9 words.

${californiaFacts}`;

const schema = {
  type: "OBJECT",
  properties: {
    answer: { type: "STRING" },
    followUps: { type: "ARRAY", items: { type: "STRING" } },
    urgent: { type: "BOOLEAN" },
  },
  required: ["answer", "followUps", "urgent"],
};

export async function POST(req: Request) {
  const { language, messages, context } = await req.json();
  if (
    !isLanguage(language) ||
    !Array.isArray(messages) ||
    messages.length === 0 ||
    messages.length > 30
  ) {
    return new Response("language and messages required", { status: 400 });
  }
  const turns = (messages as Message[])
    .filter((item) => typeof item?.text === "string" && item.text.trim())
    .map((item) => ({
      role: item.role === "model" ? ("model" as const) : ("user" as const),
      parts: [{ text: item.text.slice(0, 2000) }],
    }));
  const background = `Answer in ${languageNames[language]}.
Current time in California: ${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })}.
What the worker has in the app right now:
${JSON.stringify(context ?? {}).slice(0, 8000)}`;
  try {
    const reply = await gemini<{
      answer: string;
      followUps: string[];
      urgent: boolean;
    }>({
      system: `${system}\n\n${background}`,
      schema,
      contents: turns,
      temperature: 0.3,
    });
    return Response.json(reply);
  } catch {
    return new Response("ask failed", { status: 502 });
  }
}
