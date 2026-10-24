"use client";

import { useEffect, useRef, useState } from "react";
import { Mark } from "@/components/mark";
import { ClockList, ClockStarter } from "@/components/clocks";
import { Button } from "@/components/ui/button";
import { useClocks } from "@/lib/clocks";
import { samples } from "@/lib/samples";
import {
  copy,
  languages,
  type Language,
  type ScanResult,
  type Signal,
} from "@/lib/scan";

type Photo = { dataUrl: string; sampleId?: string };

type View =
  | { step: "start" }
  | { step: "reading"; photo: Photo }
  | { step: "result"; photo: Photo; result: ScanResult; saved: boolean }
  | { step: "problem"; photo: Photo; reason: "failed" | "unreadable" };

const signalStyle: Record<Signal, string> = {
  caution: "bg-amber-200 text-amber-950",
  warning: "bg-orange-300 text-orange-950",
  danger: "bg-red-700 text-white",
  unknown: "bg-secondary text-secondary-foreground",
};

function toJpeg(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(
        1,
        1600 / Math.max(img.naturalWidth, img.naturalHeight),
      );
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      const context = canvas.getContext("2d");
      if (!context) return reject(new Error("canvas unavailable"));
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => reject(new Error("image failed to load"));
    img.src = src;
  });
}

function spokenText(result: ScanResult, language: Language) {
  const text = copy[language];
  return [
    result.product,
    `${text.reentry}. ${result.reentry}`,
    result.gear.length ? `${text.gear}. ${result.gear.join(". ")}.` : "",
    result.summary,
  ]
    .filter(Boolean)
    .join(" ");
}

export function Scanner() {
  const [language, setLanguage] = useState<Language>("en");
  const [view, setView] = useState<View>({ step: "start" });
  const [speaking, setSpeaking] = useState(false);
  const [voiceMissing, setVoiceMissing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const latestRun = useRef(0);
  const { clocks, now, add, remove } = useClocks();
  const text = copy[language];

  useEffect(() => {
    const start = setTimeout(() => {
      try {
        const saved = localStorage.getItem("furrow-language");
        const browser = navigator.language.slice(0, 2);
        const pick = languages.find((item) => item.code === (saved ?? browser));
        if (pick) setLanguage(pick.code);
      } catch {}
    }, 0);
    return () => clearTimeout(start);
  }, []);

  function stopSpeaking() {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }

  async function run(photo: Photo, nextLanguage: Language) {
    const id = ++latestRun.current;
    stopSpeaking();
    setVoiceMissing(false);
    setView({ step: "reading", photo });
    let next: View;
    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: photo.dataUrl.split(",")[1],
          mediaType: "image/jpeg",
          language: nextLanguage,
        }),
      });
      if (!response.ok) throw new Error("scan failed");
      const result: ScanResult = await response.json();
      next = result.readable
        ? { step: "result", photo, result, saved: false }
        : { step: "problem", photo, reason: "unreadable" };
    } catch {
      const sample = samples.find((item) => item.id === photo.sampleId);
      next = sample
        ? {
            step: "result",
            photo,
            result: sample.results[nextLanguage],
            saved: true,
          }
        : { step: "problem", photo, reason: "failed" };
    }
    if (id === latestRun.current) setView(next);
  }

  async function scanFile(file: File) {
    const url = URL.createObjectURL(file);
    try {
      const dataUrl = await toJpeg(url);
      await run({ dataUrl }, language);
    } catch {
      setView({
        step: "problem",
        photo: { dataUrl: url },
        reason: "unreadable",
      });
    }
  }

  async function scanSample(id: string, image: string) {
    const dataUrl = await toJpeg(image);
    await run({ dataUrl, sampleId: id }, language);
  }

  function changeLanguage(next: Language) {
    if (next === language) return;
    setLanguage(next);
    try {
      localStorage.setItem("furrow-language", next);
    } catch {}
    if (view.step === "start") return;
    run(view.photo, next);
  }

  function reset() {
    latestRun.current++;
    stopSpeaking();
    setVoiceMissing(false);
    setView({ step: "start" });
  }

  function toggleSpeech(result: ScanResult) {
    if (speaking) return stopSpeaking();
    const synth = window.speechSynthesis;
    const voice = synth
      .getVoices()
      .find((item) =>
        item.lang.replace("_", "-").toLowerCase().startsWith(language),
      );
    if (!voice) return setVoiceMissing(true);
    setVoiceMissing(false);
    const utterance = new SpeechSynthesisUtterance(
      spokenText(result, language),
    );
    utterance.voice = voice;
    utterance.lang = voice.lang;
    utterance.rate = 0.9;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    synth.cancel();
    synth.speak(utterance);
    setSpeaking(true);
  }

  return (
    <main
      lang={language}
      className="mx-auto flex w-full max-w-xl flex-1 flex-col px-5 pb-12 pt-5"
    >
      <header className="flex items-center justify-between">
        <button
          onClick={reset}
          className="flex items-center gap-2 font-heading text-2xl font-semibold text-primary"
        >
          <Mark className="size-7" />
          Furrow
        </button>
        <div
          className="flex rounded-lg bg-secondary p-1"
          role="group"
          aria-label="Language"
        >
          {languages.map((item) => (
            <button
              key={item.code}
              onClick={() => changeLanguage(item.code)}
              aria-pressed={item.code === language}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                item.code === language
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </header>

      {view.step === "start" && (
        <section className="mt-12 flex flex-1 flex-col">
          <h1 className="font-heading text-4xl font-semibold leading-tight tracking-tight">
            {text.headline}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {text.tagline}
          </p>
          <Button
            onClick={() => inputRef.current?.click()}
            className="mt-8 h-14 w-full text-base"
          >
            {text.scan}
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) scanFile(file);
            }}
          />
          <h2 className="mt-10 text-sm font-medium text-muted-foreground">
            {text.samples}
          </h2>
          <ul className="mt-3 divide-y divide-border rounded-xl border bg-card">
            {samples.map((sample) => (
              <li key={sample.id}>
                <button
                  onClick={() => scanSample(sample.id, sample.image)}
                  className="flex w-full items-center gap-4 p-3 text-left transition-colors hover:bg-muted"
                >
                  <img
                    src={sample.image}
                    alt=""
                    className="h-16 w-14 rounded-md border object-cover object-top"
                  />
                  <span>
                    <span className="block font-medium">{sample.title}</span>
                    <span className="block text-sm text-muted-foreground">
                      {sample.detail}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <ClockList
            language={language}
            clocks={clocks}
            now={now}
            onRemove={remove}
          />
        </section>
      )}

      {view.step === "reading" && (
        <section className="mt-8" aria-live="polite">
          <div className="flex gap-4">
            <img
              src={view.photo.dataUrl}
              alt=""
              className="h-28 w-24 rounded-lg border object-cover object-top"
            />
            <div className="flex-1 space-y-3 pt-1">
              <p className="font-medium">{text.reading}</p>
              <div className="h-3 w-3/4 animate-pulse rounded bg-secondary" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-secondary" />
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <div className="h-28 animate-pulse rounded-xl bg-secondary" />
            <div className="h-24 animate-pulse rounded-xl bg-secondary" />
            <div className="h-24 animate-pulse rounded-xl bg-secondary" />
          </div>
        </section>
      )}

      {view.step === "problem" && (
        <section className="mt-8">
          <img
            src={view.photo.dataUrl}
            alt=""
            className="h-40 w-32 rounded-lg border object-cover object-top"
          />
          <p role="alert" className="mt-5 text-lg leading-relaxed">
            {text[view.reason]}
          </p>
          <Button onClick={reset} className="mt-6 h-12 w-full text-base">
            {text.scan}
          </Button>
        </section>
      )}

      {view.step === "result" && (
        <section className="mt-6">
          {view.saved && (
            <p className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              {text.offline}
            </p>
          )}
          <div className="flex gap-4">
            <img
              src={view.photo.dataUrl}
              alt=""
              className="h-28 w-24 rounded-lg border object-cover object-top"
            />
            <div className="flex-1">
              <span
                className={`inline-block rounded-md px-2.5 py-1 text-sm font-semibold ${signalStyle[view.result.signal]}`}
              >
                {text.signal[view.result.signal]}
              </span>
              <h1 className="mt-2 font-heading text-2xl font-semibold leading-snug">
                {view.result.product}
              </h1>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-primary p-5 text-primary-foreground">
            <h2 className="text-sm font-medium opacity-80">{text.reentry}</h2>
            <p className="mt-1.5 font-heading text-2xl font-semibold leading-snug">
              {view.result.reentry}
            </p>
          </div>

          {view.result.reentryHours > 0 && (
            <ClockStarter
              key={`${view.result.product}-${language}`}
              language={language}
              hours={view.result.reentryHours}
              onStart={(sprayedAt) =>
                add(view.result.product, sprayedAt, view.result.reentryHours)
              }
            />
          )}

          <div className="mt-4 flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => toggleSpeech(view.result)}
              className="h-11 flex-1 text-base"
            >
              {speaking ? text.stop : text.listen}
            </Button>
          </div>
          {voiceMissing && (
            <p className="mt-2 text-sm text-muted-foreground">{text.noVoice}</p>
          )}

          {view.result.gear.length > 0 && (
            <div className="mt-6">
              <h2 className="font-heading text-xl font-semibold">
                {text.gear}
              </h2>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-lg leading-snug marker:text-primary">
                {view.result.gear.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {view.result.firstAid.length > 0 && (
            <div className="mt-6">
              <h2 className="font-heading text-xl font-semibold">
                {text.firstAid}
              </h2>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-lg leading-snug marker:text-primary">
                {view.result.firstAid.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <a
                href="tel:18002221222"
                className="mt-3 flex h-12 items-center justify-center rounded-lg border-2 border-primary text-base font-medium text-primary"
              >
                {text.callPoison} 1-800-222-1222
              </a>
            </div>
          )}

          <div className="mt-6">
            <h2 className="font-heading text-xl font-semibold">
              {text.summary}
            </h2>
            <p className="mt-2 text-lg leading-relaxed">
              {view.result.summary}
            </p>
          </div>

          {view.result.ask && (
            <div className="mt-6 rounded-xl border-2 border-amber-400 bg-amber-50 p-4 text-lg leading-snug text-amber-950">
              <p>{view.result.ask}</p>
            </div>
          )}

          <p className="mt-8 text-sm text-muted-foreground">
            {text.disclaimer}
          </p>
          <Button
            onClick={reset}
            variant="secondary"
            className="mt-4 h-12 w-full text-base"
          >
            {text.another}
          </Button>
        </section>
      )}
    </main>
  );
}
