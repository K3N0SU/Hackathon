"use client";

import {
  Camera,
  CloudCheck,
  ImageIcon,
  Phone,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { ClockList, ClockStarter } from "@/components/clocks";
import { LiveCamera } from "@/components/live-camera";
import { Button } from "@/components/ui/button";
import { useClocks } from "@/lib/clocks";
import { saveProfile, saveScan, thumbnail } from "@/lib/cloud";
import { lastScanKey } from "@/lib/exposure";
import { samples } from "@/lib/samples";
import { copy, type Language, type ScanResult, type Signal } from "@/lib/scan";

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

const readingSteps: Record<Language, string[]> = {
  en: [
    "Reading the label",
    "Finding the re-entry time",
    "Putting it in plain words",
  ],
  es: [
    "Leyendo la etiqueta",
    "Buscando el tiempo de reingreso",
    "Escribiéndolo en palabras sencillas",
  ],
  pa: [
    "ਲੇਬਲ ਪੜ੍ਹ ਰਹੇ ਹਾਂ",
    "ਵਾਪਸ ਜਾਣ ਦਾ ਸਮਾਂ ਲੱਭ ਰਹੇ ਹਾਂ",
    "ਸੌਖੇ ਸ਼ਬਦਾਂ ਵਿੱਚ ਲਿਖ ਰਹੇ ਹਾਂ",
  ],
};

const savedNote: Record<Language, string> = {
  en: "Saved to your history",
  es: "Guardado en tu historial",
  pa: "ਤੁਹਾਡੇ ਇਤਿਹਾਸ ਵਿੱਚ ਸੰਭਾਲਿਆ ਗਿਆ",
};

const choosePhoto: Record<Language, string> = {
  en: "Choose a photo instead",
  es: "Elegir una foto guardada",
  pa: "ਗੈਲਰੀ ਵਿੱਚੋਂ ਫੋਟੋ ਚੁਣੋ",
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

function ReadingStatus({ language }: { language: Language }) {
  const [index, setIndex] = useState(0);
  const steps = readingSteps[language];

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((current) => Math.min(current + 1, steps.length - 1)),
      1600,
    );
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <p key={index} className="rise text-lg font-medium">
      {steps[index]}...
    </p>
  );
}

export function Scanner({ language }: { language: Language }) {
  const [view, setView] = useState<View>({ step: "start" });
  const [speaking, setSpeaking] = useState(false);
  const [voiceMissing, setVoiceMissing] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [stored, setStored] = useState(false);
  const galleryRef = useRef<HTMLInputElement>(null);
  const latestRun = useRef(0);
  const { clocks, now, add, remove } = useClocks();
  const text = copy[language];

  function stopSpeaking() {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }

  async function run(photo: Photo, nextLanguage: Language, fresh = true) {
    const id = ++latestRun.current;
    stopSpeaking();
    setVoiceMissing(false);
    setStored(false);
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
    if (id !== latestRun.current) return;
    setView(next);
    if (next.step === "result") {
      navigator.vibrate?.(25);
      const lastScan = {
        product: next.result.product,
        signal: next.result.signal,
      };
      try {
        localStorage.setItem(lastScanKey, JSON.stringify(lastScan));
      } catch {}
      saveProfile({ lastScan }).catch(() => {});
      if (fresh) {
        const result = next.result;
        thumbnail(photo.dataUrl)
          .then((thumb) =>
            saveScan({
              createdAt: Date.now(),
              language: nextLanguage,
              thumb,
              result,
            }),
          )
          .then(() => {
            if (id === latestRun.current) setStored(true);
          })
          .catch(() => {});
      }
    }
  }

  const rerun = useEffectEvent((next: Language) => {
    if (view.step !== "start") run(view.photo, next, false);
  });

  useEffect(() => {
    const start = setTimeout(() => rerun(language), 0);
    return () => clearTimeout(start);
  }, [language]);

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

  async function scanShot(dataUrl: string) {
    setCameraOpen(false);
    await run({ dataUrl: await toJpeg(dataUrl) }, language);
  }

  async function scanSample(id: string, image: string) {
    const dataUrl = await toJpeg(image);
    await run({ dataUrl, sampleId: id }, language);
  }

  function reset() {
    latestRun.current++;
    stopSpeaking();
    setVoiceMissing(false);
    setView({ step: "start" });
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  function onPicked(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) scanFile(file);
  }

  return (
    <>
      {cameraOpen && (
        <LiveCamera
          language={language}
          onCapture={scanShot}
          onFile={(file) => {
            setCameraOpen(false);
            scanFile(file);
          }}
          onClose={() => setCameraOpen(false)}
        />
      )}
      {view.step === "start" && (
        <section className="rise mt-8 flex flex-1 flex-col">
          <h1 className="font-display text-4xl font-semibold leading-[1.02] sm:text-5xl">
            {text.headline}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {text.tagline}
          </p>
          <button
            onClick={() => setCameraOpen(true)}
            className="group relative mt-8 flex h-40 w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl bg-primary text-primary-foreground shadow-xl shadow-primary/25 transition-transform active:scale-[0.98]"
          >
            <span className="pulse-ring absolute size-24 rounded-full border-2 border-primary-foreground/30" />
            <span className="relative flex size-16 items-center justify-center rounded-full bg-harvest text-harvest-foreground transition-transform group-hover:scale-110">
              <Camera className="size-8" />
            </span>
            <span className="relative text-xl font-semibold">{text.scan}</span>
          </button>
          <button
            onClick={() => galleryRef.current?.click()}
            className="mt-3 flex items-center justify-center gap-2 py-2 text-base font-medium text-primary underline-offset-4 hover:underline"
          >
            <ImageIcon className="size-5" />
            {choosePhoto[language]}
          </button>
          <input
            ref={galleryRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPicked}
          />
          <ClockList
            language={language}
            clocks={clocks}
            now={now}
            onRemove={remove}
          />
          <h2 className="mt-10 text-sm font-medium text-muted-foreground">
            {text.samples}
          </h2>
          <ul className="mt-3 space-y-3">
            {samples.map((sample, index) => (
              <li
                key={sample.id}
                className="rise"
                style={{ animationDelay: `${120 + index * 70}ms` }}
              >
                <button
                  onClick={() => scanSample(sample.id, sample.image)}
                  className="flex w-full items-center gap-4 rounded-2xl border bg-card p-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
                >
                  <img
                    src={sample.image}
                    alt=""
                    className="h-16 w-14 rounded-md border object-cover object-top"
                  />
                  <span className="flex-1">
                    <span className="block font-medium">{sample.title}</span>
                    <span className="block text-sm text-muted-foreground">
                      {sample.detail}
                    </span>
                  </span>
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-semibold ${signalStyle[sample.results[language].signal]}`}
                  >
                    {text.signal[sample.results[language].signal]}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {view.step === "reading" && (
        <section className="rise mt-8" aria-live="polite">
          <div className="relative mx-auto w-full max-w-xs overflow-hidden rounded-2xl border bg-card shadow-lg">
            <img
              src={view.photo.dataUrl}
              alt=""
              className="h-80 w-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-primary/10" />
            <div className="scan-line absolute inset-x-0 h-24" />
          </div>
          <div className="mt-6 text-center">
            <ReadingStatus key={language} language={language} />
          </div>
          <div className="mt-6 space-y-3">
            <div className="h-24 animate-pulse rounded-2xl bg-secondary" />
            <div className="h-16 animate-pulse rounded-2xl bg-secondary" />
          </div>
        </section>
      )}

      {view.step === "problem" && (
        <section className="rise mt-8">
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
        <section className="mt-6 pb-24">
          {view.saved && (
            <p className="rise mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              {text.offline}
            </p>
          )}
          <div className="rise flex gap-4">
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

          <div
            className="rise mt-6 rounded-2xl bg-primary p-5 text-primary-foreground shadow-lg shadow-primary/20"
            style={{ animationDelay: "80ms" }}
          >
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
              onStart={(sprayedAt) => {
                add(view.result.product, sprayedAt, view.result.reentryHours);
                navigator.vibrate?.(30);
              }}
            />
          )}

          {voiceMissing && (
            <p className="mt-3 text-sm text-muted-foreground">{text.noVoice}</p>
          )}

          {view.result.gear.length > 0 && (
            <div className="rise mt-6" style={{ animationDelay: "160ms" }}>
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
            <div className="rise mt-6" style={{ animationDelay: "240ms" }}>
              <h2 className="font-heading text-xl font-semibold">
                {text.firstAid}
              </h2>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-lg leading-snug marker:text-primary">
                {view.result.firstAid.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="rise mt-6" style={{ animationDelay: "320ms" }}>
            <h2 className="font-heading text-xl font-semibold">
              {text.summary}
            </h2>
            <p className="mt-2 text-lg leading-relaxed">
              {view.result.summary}
            </p>
          </div>

          {view.result.ask && (
            <div className="mt-6 rounded-2xl border-2 border-amber-400 bg-amber-50 p-4 text-lg leading-snug text-amber-950">
              <p>{view.result.ask}</p>
            </div>
          )}

          {stored && (
            <p className="rise mt-6 flex items-center gap-2 text-sm font-medium text-primary">
              <CloudCheck className="size-4" />
              {savedNote[language]}
            </p>
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

          <div className="fixed inset-x-0 bottom-[4.75rem] z-30 px-4">
            <div className="rise mx-auto flex max-w-xl gap-2 rounded-2xl border bg-card/95 p-2 shadow-xl backdrop-blur">
              <Button
                variant={speaking ? "default" : "outline"}
                onClick={() => toggleSpeech(view.result)}
                className="h-12 flex-1 gap-2 text-base"
              >
                {speaking ? (
                  <VolumeX className="size-5" />
                ) : (
                  <Volume2 className="size-5" />
                )}
                {speaking ? text.stop : text.listen}
              </Button>
              <a
                href="tel:18002221222"
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-red-700 px-2 text-center text-sm font-semibold leading-tight text-white"
              >
                <Phone className="size-4 shrink-0" />
                {text.callPoison}
              </a>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
