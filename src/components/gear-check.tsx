"use client";

import { Camera, CheckCircle2, CircleHelp, Shirt, Volume2, VolumeX, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { appCopy } from "@/lib/app-copy";
import { lastScanKey, type LastScan } from "@/lib/exposure";
import { useCopy } from "@/lib/i18n";
import { fileToJpeg } from "@/lib/image";
import type { Language } from "@/lib/scan";
import { useSpeaker } from "@/lib/speech";
import { toolsCopy } from "@/lib/tools-copy";

type Status = "on" | "missing" | "unsure";

type Check = {
  person: boolean;
  items: { item: string; status: Status; note: string }[];
  verdict: "ready" | "missing" | "unsure";
  summary: string;
};

type State =
  | { step: "start" }
  | { step: "checking"; photo: string }
  | { step: "done"; photo: string; check: Check }
  | { step: "problem"; message: string };

const statusStyle: Record<Status, { pill: string; icon: typeof CheckCircle2 }> = {
  on: { pill: "bg-emerald-100 text-emerald-800", icon: CheckCircle2 },
  missing: { pill: "bg-red-100 text-red-800", icon: XCircle },
  unsure: { pill: "bg-amber-100 text-amber-900", icon: CircleHelp },
};

const verdictStyle = {
  ready: "bg-primary text-primary-foreground",
  missing: "bg-danger text-white",
  unsure: "bg-harvest text-harvest-foreground",
};

export function GearCheck({ language }: { language: Language }) {
  const text = useCopy(toolsCopy, language).gear;
  const listen = useCopy(appCopy, language).brief.listen;
  const [state, setState] = useState<State>({ step: "start" });
  const [label, setLabel] = useState<{ product: string; gear: string[] } | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const { speaking, speak } = useSpeaker(language);

  useEffect(() => {
    const start = setTimeout(() => {
      try {
        const saved: LastScan | null = JSON.parse(localStorage.getItem(lastScanKey) ?? "null");
        if (saved?.result?.gear?.length) setLabel({ product: saved.product, gear: saved.result.gear });
      } catch {}
    }, 0);
    return () => clearTimeout(start);
  }, []);

  const gear = label?.gear ?? text.defaultGear;

  async function check(file: File) {
    let photo: string;
    try {
      photo = await fileToJpeg(file);
    } catch {
      setState({ step: "problem", message: text.failed });
      return;
    }
    setState({ step: "checking", photo });
    try {
      const response = await fetch("/api/gear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: photo.split(",")[1],
          mediaType: "image/jpeg",
          language,
          required: gear,
          product: label?.product,
        }),
      });
      if (!response.ok) throw new Error("failed");
      const result: Check = await response.json();
      if (!result.person) {
        setState({ step: "problem", message: text.noPerson });
        return;
      }
      setState({ step: "done", photo, check: result });
      navigator.vibrate?.(result.verdict === "ready" ? 25 : [120, 60, 120]);
    } catch {
      setState({ step: "problem", message: text.failed });
    }
  }

  return (
    <section className="rise pt-6 pb-10">
      <input
        ref={input}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) check(file);
        }}
      />
      <h1 className="font-display text-4xl font-semibold leading-[1.02] text-primary sm:text-5xl">
        {text.title}
      </h1>

      {(state.step === "start" || state.step === "problem") && (
        <>
          <p className="mt-3 text-lg text-muted-foreground">{text.intro}</p>
          <div className="card mt-6 p-5">
            <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Shirt className="size-4 text-primary" />
              {label ? (
                <>
                  {text.forProduct} <span className="font-semibold text-foreground">{label.product}</span>
                </>
              ) : (
                text.noLabel
              )}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {gear.map((item, index) => (
                <li
                  key={item}
                  className="rise rounded-full bg-secondary px-3 py-1.5 text-sm font-medium"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {state.step === "problem" && (
            <p role="alert" className="mt-4 rounded-2xl bg-red-50 p-4 text-red-800">
              {state.message}
            </p>
          )}
          <button
            onClick={() => input.current?.click()}
            className="group mt-5 flex h-40 w-full flex-col items-center justify-center gap-3 rounded-3xl bg-primary text-primary-foreground shadow-xl shadow-primary/20 transition-transform active:scale-[0.98]"
          >
            <span className="relative flex size-16 items-center justify-center rounded-full bg-harvest text-harvest-foreground transition-transform duration-500 [transition-timing-function:var(--ease-spring)] group-hover:scale-110">
              <span className="pulse-ring absolute inset-0 rounded-full bg-harvest/50" />
              <Camera className="relative size-8" />
            </span>
            <span className="text-xl font-semibold">{text.take}</span>
          </button>
          <p className="mt-3 text-center text-sm text-muted-foreground">{text.hint}</p>
        </>
      )}

      {state.step === "checking" && (
        <div className="mt-6" aria-live="polite">
          <div className="relative mx-auto max-w-xs overflow-hidden rounded-3xl border bg-card shadow-lg">
            <img src={state.photo} alt="" className="h-96 w-full object-cover" />
            <div className="scan-line absolute inset-x-0 h-24" />
          </div>
          <p className="mt-5 text-center text-lg font-medium">{text.checking}</p>
        </div>
      )}

      {state.step === "done" && (
        <div className="mt-6 space-y-4">
          <div className={`pop flex items-center gap-4 rounded-3xl p-4 shadow-xl ${verdictStyle[state.check.verdict]}`}>
            <img src={state.photo} alt="" className="h-24 w-20 shrink-0 rounded-2xl object-cover ring-2 ring-white/40" />
            <div>
              <p className="font-display text-2xl font-semibold leading-tight">
                {text.verdict[state.check.verdict]}
              </p>
              <p className="mt-1 leading-snug opacity-90">{state.check.summary}</p>
            </div>
          </div>
          <ul className="space-y-2">
            {state.check.items.map((item, index) => {
              const style = statusStyle[item.status];
              const Icon = style.icon;
              return (
                <li
                  key={`${item.item}-${index}`}
                  className="rise card flex items-start gap-3 p-4"
                  style={{ animationDelay: `${120 + index * 70}ms` }}
                >
                  <Icon className={`mt-0.5 size-6 shrink-0 ${style.pill.split(" ")[1]}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold">{item.item}</p>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${style.pill}`}>
                        {text.status[item.status]}
                      </span>
                    </div>
                    <p className="mt-1 text-muted-foreground">{item.note}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() =>
                speak(
                  "gear",
                  [text.verdict[state.check.verdict], state.check.summary, ...state.check.items.map((item) => `${item.item}: ${item.note}`)].join(". "),
                )
              }
              className={`flex h-14 items-center justify-center gap-2 rounded-2xl font-semibold transition-all active:scale-95 ${
                speaking ? "bg-primary text-primary-foreground" : "border bg-card"
              }`}
            >
              {speaking ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
              {listen}
            </button>
            <button
              onClick={() => input.current?.click()}
              className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-primary font-semibold text-primary-foreground transition-all active:scale-95"
            >
              <Camera className="size-5" />
              {text.again}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
