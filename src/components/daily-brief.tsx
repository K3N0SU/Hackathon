"use client";

import { LoaderCircle, RefreshCw, Sunrise, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { appCopy } from "@/lib/app-copy";
import type { Clock } from "@/lib/clocks";
import { lastScanKey, type LastScan } from "@/lib/exposure";
import { useCopy } from "@/lib/i18n";
import { currentPosition } from "@/lib/image";
import type { Language } from "@/lib/scan";
import { useSpeaker } from "@/lib/speech";

type Brief = { greeting: string; items: string[]; spoken: string };

export function DailyBrief({ language, clocks }: { language: Language; clocks: Clock[] }) {
  const text = useCopy(appCopy, language).brief;
  const [state, setState] = useState<"idle" | "making" | "failed">("idle");
  const [brief, setBrief] = useState<Brief | null>(null);
  const { speaking, speak } = useSpeaker(language);

  async function make() {
    setState("making");
    let lastProduct = "";
    try {
      const saved: LastScan | null = JSON.parse(localStorage.getItem(lastScanKey) ?? "null");
      lastProduct = saved?.product ?? "";
    } catch {}
    const place = await currentPosition();
    try {
      const response = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          clocks,
          latitude: place?.latitude,
          longitude: place?.longitude,
          lastProduct,
        }),
      });
      if (!response.ok) throw new Error("failed");
      const next: Brief = await response.json();
      setBrief(next);
      setState("idle");
      speak("brief", next.spoken);
    } catch {
      setState("failed");
    }
  }

  return (
    <section className="rise pt-6 pb-10">
      <h1 className="font-display text-4xl font-semibold leading-[1.02] text-primary sm:text-5xl">
        {text.title}
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">{text.intro}</p>

      {!brief && (
        <button
          onClick={make}
          disabled={state === "making"}
          className="group mt-6 flex h-36 w-full flex-col items-center justify-center gap-3 rounded-3xl bg-primary text-primary-foreground shadow-xl shadow-primary/20 transition-transform active:scale-[0.98] disabled:opacity-80"
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-harvest text-harvest-foreground transition-transform group-hover:scale-110">
            {state === "making" ? <LoaderCircle className="size-7 animate-spin" /> : <Sunrise className="size-7" />}
          </span>
          <span className="text-xl font-semibold">{state === "making" ? text.making : text.make}</span>
        </button>
      )}

      {state === "failed" && (
        <p role="alert" className="mt-4 rounded-2xl bg-red-50 p-4 text-red-800">
          {text.failed}
        </p>
      )}

      {brief && (
        <div className="mt-6">
          <p className="pop font-display text-3xl font-semibold leading-tight text-primary">
            {brief.greeting}
          </p>
          <ul className="mt-5 space-y-3">
            {brief.items.map((item, index) => (
              <li
                key={item}
                className="rise card flex gap-4 p-4 text-lg leading-snug"
                style={{ animationDelay: `${120 + index * 90}ms` }}
              >
                <span className="mt-2 size-2.5 shrink-0 rounded-full bg-harvest" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              onClick={() => speak("brief", brief.spoken)}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary font-semibold text-primary-foreground active:scale-95"
            >
              {speaking ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
              {text.listen}
            </button>
            <button
              onClick={make}
              disabled={state === "making"}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl border bg-card font-semibold transition-all hover:border-primary active:scale-95"
            >
              <RefreshCw className={`size-5 ${state === "making" ? "animate-spin" : ""}`} />
              {text.again}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
