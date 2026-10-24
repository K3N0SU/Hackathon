"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [out, setOut] = useState("");
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    setOut("");
    const res = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const reader = res.body!.getReader();
    const dec = new TextDecoder();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      setOut((o) => o + dec.decode(value));
    }
    setBusy(false);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-4 p-6">
      <h1 className="text-3xl font-bold">SierraHacks Starter</h1>
      <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ask Claude…" />
      <Button onClick={run} disabled={busy || !prompt.trim()}>
        {busy ? "Thinking…" : "Send"}
      </Button>
      {out && <Card className="whitespace-pre-wrap p-4">{out}</Card>}
    </main>
  );
}
