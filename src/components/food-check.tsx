"use client";

import { Apple, Camera, Check, ImageIcon, Leaf, ShieldAlert, Sprout, TriangleAlert, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { appCopy } from "@/lib/app-copy";
import { useCopy } from "@/lib/i18n";
import { fileToJpeg } from "@/lib/image";
import type { Language } from "@/lib/scan";
import { useSpeaker } from "@/lib/speech";
import { toolsCopy } from "@/lib/tools-copy";

const allergyIds = ["milk", "eggs", "fish", "shellfish", "tree nuts", "peanuts", "wheat", "soy", "sesame"];
const storageKey = "furrow-allergies";

type Food = {
  readable: boolean;
  product: string;
  allergens: { name: string; level: "contains" | "may" }[];
  mine: string[];
  organic: "yes" | "no" | "unknown";
  pesticides: string;
  flags: string[];
  verdict: "safe" | "caution" | "avoid";
  summary: string;
};

type State =
  | { step: "start" }
  | { step: "checking"; photo: string }
  | { step: "done"; photo: string; food: Food }
  | { step: "problem"; message: string };

const verdictStyle = {
  safe: "bg-leaf text-white",
  caution: "bg-harvest text-harvest-foreground",
  avoid: "bg-danger text-white",
};

const verdictIcon = { safe: Check, caution: TriangleAlert, avoid: ShieldAlert };

export function FoodCheck({ language }: { language: Language }) {
  const text = useCopy(toolsCopy, language).food;
  const listen = useCopy(appCopy, language).brief.listen;
  const [state, setState] = useState<State>({ step: "start" });
  const [allergies, setAllergies] = useState<string[]>([]);
  const camera = useRef<HTMLInputElement>(null);
  const gallery = useRef<HTMLInputElement>(null);
  const { speaking, speak } = useSpeaker(language);

  useEffect(() => {
    const start = setTimeout(() => {
      try {
        const saved = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
        if (Array.isArray(saved)) setAllergies(saved.filter((item) => allergyIds.includes(item)));
      } catch {}
    }, 0);
    return () => clearTimeout(start);
  }, []);

  function toggle(id: string) {
    navigator.vibrate?.(8);
    setAllergies((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {}
      return next;
    });
  }

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
      const response = await fetch("/api/food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: photo.split(",")[1], mediaType: "image/jpeg", language, allergies }),
      });
      if (!response.ok) throw new Error("failed");
      const food: Food = await response.json();
      if (!food.readable) {
        setState({ step: "problem", message: text.notFood });
        return;
      }
      setState({ step: "done", photo, food });
      navigator.vibrate?.(food.verdict === "avoid" ? [150, 80, 150] : 25);
    } catch {
      setState({ step: "problem", message: text.failed });
    }
  }

  const input = (ref: React.RefObject<HTMLInputElement | null>, capture?: "environment") => (
    <input
      ref={ref}
      type="file"
      accept="image/*"
      capture={capture}
      className="hidden"
      onChange={(event) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (file) check(file);
      }}
    />
  );

  return (
    <section className="rise pt-6 pb-10">
      {input(camera, "environment")}
      {input(gallery)}
      <h1 className="font-display text-4xl font-semibold leading-[1.02] text-ink sm:text-5xl">{text.title}</h1>

      {(state.step === "start" || state.step === "problem") && (
        <>
          <p className="mt-3 text-lg text-muted-foreground">{text.intro}</p>
          <div className="card mt-6 p-5">
            <p className="font-semibold">{text.allergiesTitle}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {allergyIds.map((id, index) => {
                const on = allergies.includes(id);
                return (
                  <button
                    key={id}
                    onClick={() => toggle(id)}
                    aria-pressed={on}
                    className={`flex h-10 items-center gap-1.5 rounded-full border-2 px-4 text-sm font-semibold transition-all active:scale-95 ${
                      on ? "border-danger bg-danger text-white" : "border-border bg-background hover:border-danger/50"
                    }`}
                  >
                    {on && <Check className="size-4" />}
                    {text.allergyNames[index]}
                  </button>
                );
              })}
            </div>
          </div>
          {state.step === "problem" && (
            <p role="alert" className="mt-4 rounded-2xl bg-red-50 p-4 text-red-800">
              {state.message}
            </p>
          )}
          <button
            onClick={() => camera.current?.click()}
            className="group mt-5 flex h-36 w-full flex-col items-center justify-center gap-3 rounded-3xl bg-leaf text-white shadow-xl shadow-leaf/25 transition-transform active:scale-[0.98]"
          >
            <span className="flex size-14 items-center justify-center rounded-full bg-white text-leaf transition-transform duration-500 [transition-timing-function:var(--ease-spring)] group-hover:scale-110">
              <Apple className="size-7" />
            </span>
            <span className="text-xl font-semibold">{text.take}</span>
          </button>
          <button
            onClick={() => gallery.current?.click()}
            className="mt-3 flex w-full items-center justify-center gap-2 py-2 font-medium text-primary underline-offset-4 hover:underline"
          >
            <ImageIcon className="size-5" />
            {text.choose}
          </button>
        </>
      )}

      {state.step === "checking" && (
        <div className="mt-6" aria-live="polite">
          <div className="relative mx-auto max-w-xs overflow-hidden rounded-3xl border bg-card shadow-lg">
            <img src={state.photo} alt="" className="h-80 w-full object-cover" />
            <div className="scan-line absolute inset-x-0 h-24" />
          </div>
          <p className="mt-5 text-center text-lg font-medium">{text.checking}</p>
        </div>
      )}

      {state.step === "done" && (() => {
        const { food } = state;
        const Icon = verdictIcon[food.verdict];
        return (
          <div className="mt-6 space-y-4">
            <div className={`pop flex items-center gap-4 rounded-3xl p-4 shadow-xl ${verdictStyle[food.verdict]}`}>
              <img src={state.photo} alt="" className="size-24 shrink-0 rounded-2xl object-cover ring-2 ring-white/40" />
              <div className="min-w-0">
                <p className="flex items-center gap-2 font-display text-2xl font-semibold leading-tight">
                  <Icon className="size-6 shrink-0" />
                  {text.verdict[food.verdict]}
                </p>
                <p className="mt-0.5 font-semibold opacity-90">{food.product}</p>
                <p className="mt-1 leading-snug opacity-90">{food.summary}</p>
              </div>
            </div>

            {food.mine.length > 0 && (
              <div className="rise rounded-2xl border-2 border-danger bg-red-50 p-4 text-red-900">
                <p className="font-semibold">{text.yours}</p>
                <p className="mt-1 text-lg">{food.mine.join(", ")}</p>
              </div>
            )}

            <div className="rise card p-5" style={{ animationDelay: "80ms" }}>
              <p className="font-display text-xl font-semibold">{text.allergens}</p>
              {food.allergens.length === 0 ? (
                <p className="mt-2 text-muted-foreground">{text.noAllergens}</p>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {food.allergens.map((item) => (
                    <span
                      key={item.name}
                      className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                        item.level === "contains" ? "bg-danger/10 text-danger" : "bg-harvest/30 text-harvest-foreground"
                      }`}
                    >
                      {item.level === "contains" ? text.contains : text.may}: {item.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="rise card p-5" style={{ animationDelay: "160ms" }}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="flex items-center gap-2 font-display text-xl font-semibold">
                  <Sprout className="size-5 text-leaf" />
                  {text.pesticides}
                </p>
                <span
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${
                    food.organic === "yes" ? "bg-leaf/15 text-leaf" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <Leaf className="size-4" />
                  {text.organic[food.organic]}
                </span>
              </div>
              <p className="mt-2 leading-relaxed">{food.pesticides}</p>
            </div>

            {food.flags.length > 0 && (
              <div className="rise card p-5" style={{ animationDelay: "240ms" }}>
                <p className="font-display text-xl font-semibold">{text.flags}</p>
                <ul className="mt-2 space-y-1.5">
                  {food.flags.map((flag) => (
                    <li key={flag} className="flex gap-2">
                      <TriangleAlert className="mt-0.5 size-4 shrink-0 text-poppy" />
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => speak("food", [text.verdict[food.verdict], food.product, food.summary, food.pesticides].join(". "))}
                className={`flex h-14 items-center justify-center gap-2 rounded-2xl font-semibold transition-all active:scale-95 ${
                  speaking ? "bg-primary text-primary-foreground" : "border bg-card"
                }`}
              >
                {speaking ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
                {listen}
              </button>
              <button
                onClick={() => camera.current?.click()}
                className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-leaf font-semibold text-white transition-all active:scale-95"
              >
                <Camera className="size-5" />
                {text.again}
              </button>
            </div>
          </div>
        );
      })()}
    </section>
  );
}
