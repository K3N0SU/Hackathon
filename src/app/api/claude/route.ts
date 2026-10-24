import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export const maxDuration = 60;

export async function POST(req: Request) {
  const { prompt, system } = await req.json();
  if (typeof prompt !== "string" || !prompt.trim()) {
    return new Response("prompt required", { status: 400 });
  }

  const stream = client.messages.stream({
    model: process.env.CLAUDE_MODEL ?? "claude-sonnet-5-5",
    max_tokens: 1024,
    system: typeof system === "string" ? system : undefined,
    messages: [{ role: "user", content: prompt }],
  });

  const encoder = new TextEncoder();
  const body = new ReadableStream({
    async start(controller) {
      try {
        for await (const ev of stream) {
          if (ev.type === "content_block_delta" && ev.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(ev.delta.text));
          }
        }
      } catch (e) {
        controller.enqueue(encoder.encode(`\n[error: ${(e as Error).message}]`));
      }
      controller.close();
    },
  });

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
