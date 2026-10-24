import { isLanguage, languageNames } from "@/lib/scan";

export const maxDuration = 60;

function wav(pcm: Buffer, rate: number) {
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(rate, 24);
  header.writeUInt32LE(rate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

export async function POST(req: Request) {
  const { text, language } = await req.json();
  if (typeof text !== "string" || !text.trim() || !isLanguage(language)) {
    return new Response("text and language required", { status: 400 });
  }
  const model = process.env.GEMINI_TTS_MODEL ?? "gemini-3.8-flash-tts";
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY ?? "",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Read this aloud in ${languageNames[language]}, in a warm, calm and friendly voice, at an easy pace, like a kind coworker explaining something in the field:\n\n${text.slice(0, 1500)}`,
              },
            ],
          },
        ],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Sulafat" } },
          },
        },
      }),
    },
  );
  if (!response.ok) return new Response("speak failed", { status: 502 });
  const data = await response.json();
  const audio = data.candidates?.[0]?.content?.parts?.[0]?.inlineData;
  if (typeof audio?.data !== "string") return new Response("speak failed", { status: 502 });
  const bytes = Buffer.from(audio.data, "base64");
  const mimeType: string = audio.mimeType ?? "";
  const body = mimeType.startsWith("audio/L16")
    ? wav(bytes, Number(mimeType.match(/rate=(\d+)/)?.[1] ?? 24000))
    : bytes;
  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": mimeType.startsWith("audio/L16") ? "audio/wav" : mimeType || "audio/wav",
      "Cache-Control": "private, max-age=86400",
    },
  });
}
