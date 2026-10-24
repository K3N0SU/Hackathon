"use client";

import { Check, LoaderCircle, Mic, Phone, RotateCcw, Stethoscope } from "lucide-react";
import { useEffect, useState } from "react";
import { appCopy } from "@/lib/app-copy";
import { lastScanKey, type LastScan } from "@/lib/exposure";
import { useCopy } from "@/lib/i18n";
import type { Language } from "@/lib/scan";
import { useDictation } from "@/lib/speech";

type Urgency = "911" | "poison" | "doctor" | "rest";

type Answer = { urgency: Urgency; title: string; why: string; steps: string[] };

const emergencyIndexes = [10, 11, 12, 13];

const urgencyStyle: Record<Urgency, string> = {
  "911": "bg-danger text-white",
  poison: "bg-harvest text-harvest-foreground",
  doctor: "bg-sky-700 text-white",
  rest: "bg-primary text-primary-foreground",
};

export function SymptomCheck({ language }: { language: Language }) {
  const text = useCopy(appCopy, language).symptoms;
  const [picked, setPicked] = useState<number[]>([]);
  const [note, setNote] = useState("");
  const [state, setState] = useState<"idle" | "checking" | "failed">("idle");
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [product, setProduct] = useState("");
  const dictation = useDictation(language, setNote);
  const emergency = picked.some((index) => emergencyIndexes.includes(index));

  useEffect(() => {
    const start = setTimeout(() => {
      try {
        const saved: LastScan | null = JSON.parse(localStorage.getItem(lastScanKey) ?? "null");
        if (saved?.product) setProduct(saved.product);
      } catch {}
    }, 0);
    return () => clearTimeout(start);
  }, []);

  function toggle(index: number) {
    navigator.vibrate?.(10);
    setPicked((current) =>
      current.includes(index) ? current.filter((item) => item !== index) : [...current, index],
    );
  }

  async function check() {
    setState("checking");
    try {
      const response = await fetch("/api/symptoms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          symptoms: picked.map((index) => appCopy.en.symptoms.list[index]),
          note,
          product,
        }),
      });
      if (!response.ok) throw new Error("failed");
      setAnswer(await response.json());
      setState("idle");
      navigator.vibrate?.(30);
    } catch {
      setState("failed");
    }
  }

  function reset() {
    setAnswer(null);
    setPicked([]);
    setNote("");
    setState("idle");
  }

  if (answer) {
    return (
      <section className="rise pt-6 pb-10">
        <div className={`pop rounded-3xl p-6 shadow-xl ${urgencyStyle[answer.urgency]}`}>
          <p className="font-display text-4xl font-semibold leading-tight">{answer.title}</p>
          <p className="mt-3 text-lg leading-snug opacity-90">{answer.why}</p>
          {(answer.urgency === "911" || answer.urgency === "poison") && (
            <div className="mt-5 grid grid-cols-2 gap-3">
              <a
                href="tel:911"
                className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-white text-lg font-semibold text-red-800 transition-transform active:scale-95"
              >
                <Phone className="size-5" />
                911
              </a>
              <a
                href="tel:18002221222"
                className="flex h-14 items-center justify-center rounded-2xl border-2 border-current px-2 text-center text-sm font-semibold leading-tight transition-transform active:scale-95"
              >
                {text.callPoison}
              </a>
            </div>
          )}
        </div>
        <ol className="mt-6 space-y-3">
          {answer.steps.map((step, index) => (
            <li
              key={step}
              className="rise card flex gap-4 p-4"
              style={{ animationDelay: `${100 + index * 80}ms` }}
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary font-display text-lg font-semibold text-primary-foreground">
                {index + 1}
              </span>
              <p className="text-lg leading-snug">{step}</p>
            </li>
          ))}
        </ol>
        <button
          onClick={reset}
          className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border text-base font-semibold transition-all hover:border-primary active:scale-[0.98]"
        >
          <RotateCcw className="size-5" />
          {text.again}
        </button>
      </section>
    );
  }

  return (
    <section className="rise pt-6 pb-10">
      <h1 className="font-display text-4xl font-semibold leading-[1.02] text-primary sm:text-5xl">
        {text.title}
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">{text.intro}</p>

      {emergency && (
        <a
          href="tel:911"
          className="pop mt-5 flex items-center justify-center gap-3 rounded-2xl bg-danger p-5 text-xl font-semibold text-white shadow-xl"
        >
          <span className="relative flex size-10 items-center justify-center rounded-full bg-white/20">
            <span className="pulse-ring absolute inset-0 rounded-full bg-white/40" />
            <Phone className="relative size-5" />
          </span>
          911
        </a>
      )}

      <div className="mt-6 grid grid-cols-2 gap-2.5">
        {text.list.map((symptom, index) => {
          const on = picked.includes(index);
          const urgent = emergencyIndexes.includes(index);
          return (
            <button
              key={symptom}
              onClick={() => toggle(index)}
              aria-pressed={on}
              className={`flex min-h-14 items-center gap-2 rounded-2xl border-2 px-3 py-2 text-left font-medium leading-tight transition-all active:scale-95 ${
                on
                  ? urgent
                    ? "border-danger bg-danger text-white"
                    : "border-primary bg-primary text-primary-foreground"
                  : urgent
                    ? "border-danger/30 bg-card hover:border-danger"
                    : "border-transparent bg-card shadow-sm hover:border-primary/40"
              }`}
            >
              <span
                className={`flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                  on ? "scale-110 border-current bg-white/20" : "border-current opacity-40"
                }`}
              >
                {on && <Check className="size-4" />}
              </span>
              {symptom}
            </button>
          );
        })}
      </div>

      <label className="mt-6 block">
        <span className="font-medium">{text.note}</span>
        <span className="mt-2 flex items-start gap-2 rounded-2xl border bg-card p-2 focus-within:border-primary">
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={2}
            className="min-h-12 flex-1 resize-none bg-transparent px-2 py-1.5 text-lg outline-none"
          />
          {dictation.supported && (
            <button
              type="button"
              onClick={dictation.toggle}
              aria-pressed={dictation.listening}
              aria-label={text.note}
              className={`flex size-11 shrink-0 items-center justify-center rounded-full ${
                dictation.listening ? "bg-danger text-white" : "bg-secondary text-primary"
              }`}
            >
              <Mic className="size-5" />
            </button>
          )}
        </span>
      </label>

      {state === "failed" && (
        <p role="alert" className="mt-4 rounded-2xl bg-red-50 p-4 text-red-800">
          {text.failed}
        </p>
      )}

      <button
        onClick={check}
        disabled={state === "checking" || (picked.length === 0 && !note.trim())}
        className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-40"
      >
        {state === "checking" ? (
          <LoaderCircle className="size-5 animate-spin" />
        ) : (
          <Stethoscope className="size-5" />
        )}
        {state === "checking" ? text.checking : text.check}
      </button>
    </section>
  );
}
