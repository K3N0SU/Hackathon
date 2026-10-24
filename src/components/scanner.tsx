"use client";

import {
  BellRing,
  Camera,
  ChevronDown,
  CloudCheck,
  ImageIcon,
  MessageCircleQuestion,
  Phone,
  Quote,
  Share2,
  ShieldCheck,
  ShieldQuestion,
  UserRoundCheck,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { ClockList, ClockStarter } from "@/components/clocks";
import { LiveCamera } from "@/components/live-camera";
import { SupervisorCard } from "@/components/supervisor-card";
import { askNotifications, notificationsAllowed } from "@/lib/alarms";
import { appCopy, scannerCopy } from "@/lib/app-copy";
import type { Clock } from "@/lib/clocks";
import { saveProfile, saveScan, shareScan, thumbnail } from "@/lib/cloud";
import { lastScanKey } from "@/lib/exposure";
import { pick, useCopy } from "@/lib/i18n";
import { currentPosition, fileToJpeg, toJpeg } from "@/lib/image";
import { samples } from "@/lib/samples";
import {
  copy,
  type Confidence,
  type Language,
  type ScanResult,
  type Signal,
} from "@/lib/scan";
import { useSpeaker } from "@/lib/speech";

type Photo = { dataUrl: string; sampleId?: string };

type View =
  | { step: "start" }
  | { step: "reading"; photo: Photo }
  | { step: "result"; photo: Photo; result: ScanResult; saved: boolean }
  | { step: "problem"; photo: Photo; reason: "failed" | "unreadable" };

export const signalStyle: Record<Signal, string> = {
  caution: "bg-amber-200 text-amber-950",
  warning: "bg-orange-300 text-orange-950",
  danger: "bg-danger text-white",
  unknown: "bg-secondary text-secondary-foreground",
};

const confidenceStyle: Record<Confidence, string> = {
  high: "bg-primary/10 text-primary",
  medium: "bg-harvest/25 text-harvest-foreground",
  low: "bg-red-100 text-red-800",
};

function spokenText(result: ScanResult, text: (typeof copy)["en"]) {
  return [
    result.product,
    `${text.reentry}. ${result.reentry}`,
    result.gear.length ? `${text.gear}. ${result.gear.join(". ")}.` : "",
    result.summary,
  ]
    .filter(Boolean)
    .join(" ");
}

function ReadingStatus({ steps }: { steps: string[] }) {
  const [index, setIndex] = useState(0);

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

export function Scanner({
  language,
  clocks,
  now,
  addClock,
  removeClock,
  onAsk,
}: {
  language: Language;
  clocks: Clock[];
  now: number;
  addClock: (product: string, sprayedAt: number, hours: number) => void;
  removeClock: (id: string) => void;
  onAsk: (result: ScanResult) => void;
}) {
  const [view, setView] = useState<View>({ step: "start" });
  const [cameraOpen, setCameraOpen] = useState(false);
  const [stored, setStored] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [supervisor, setSupervisor] = useState(false);
  const [shareState, setShareState] = useState<"" | "busy" | "copied" | "shared" | "failed">("");
  const [alarm, setAlarm] = useState(false);
  const galleryRef = useRef<HTMLInputElement>(null);
  const latestRun = useRef(0);
  const text = useCopy(copy, language);
  const local = useCopy(scannerCopy, language);
  const extra = useCopy(appCopy, language);
  const { speaking, missing, speak, stop } = useSpeaker(language);

  useEffect(() => {
    const start = setTimeout(() => setAlarm(notificationsAllowed()), 0);
    return () => clearTimeout(start);
  }, []);

  async function run(photo: Photo, nextLanguage: Language, fresh = true) {
    const id = ++latestRun.current;
    stop();
    setStored(false);
    setDrawer(false);
    setShareState("");
    setView({ step: "reading", photo });
    const place = fresh ? currentPosition() : Promise.resolve(null);
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
            result: { ...pick(sample.results, nextLanguage), evidence: sample.evidence, confidence: "high" },
            saved: true,
          }
        : { step: "problem", photo, reason: "failed" };
    }
    if (id !== latestRun.current) return;
    setView(next);
    if (next.step !== "result") return;
    navigator.vibrate?.(25);
    const result = next.result;
    const lastScan = { product: result.product, signal: result.signal, result, at: Date.now() };
    try {
      localStorage.setItem(lastScanKey, JSON.stringify(lastScan));
    } catch {}
    saveProfile({ lastScan }).catch(() => {});
    if (!fresh) return;
    Promise.all([thumbnail(photo.dataUrl), place])
      .then(([thumb, spot]) =>
        saveScan({
          createdAt: Date.now(),
          language: nextLanguage,
          thumb,
          result,
          ...(spot ?? {}),
        }),
      )
      .then(() => {
        if (id === latestRun.current) setStored(true);
      })
      .catch(() => {});
  }

  const rerun = useEffectEvent((next: Language) => {
    if (view.step !== "start") run(view.photo, next, false);
  });

  useEffect(() => {
    const start = setTimeout(() => rerun(language), 0);
    return () => clearTimeout(start);
  }, [language]);

  async function scanFile(file: File) {
    try {
      await run({ dataUrl: await fileToJpeg(file) }, language);
    } catch {
      setView({ step: "problem", photo: { dataUrl: "" }, reason: "unreadable" });
    }
  }

  async function scanShot(dataUrl: string) {
    setCameraOpen(false);
    await run({ dataUrl: await toJpeg(dataUrl) }, language);
  }

  async function scanSample(id: string, image: string) {
    await run({ dataUrl: await toJpeg(image), sampleId: id }, language);
  }

  function reset() {
    latestRun.current++;
    stop();
    setView({ step: "start" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function share(result: ScanResult, photo: Photo) {
    setShareState("busy");
    try {
      const id = await shareScan({
        createdAt: Date.now(),
        language,
        thumb: await thumbnail(photo.dataUrl),
        result,
      });
      const url = `${window.location.origin}/s/${id}`;
      if (navigator.share) {
        await navigator.share({ title: result.product, text: result.reentry, url }).catch(() => {});
        setShareState("shared");
      } else {
        await navigator.clipboard.writeText(url);
        setShareState("copied");
      }
    } catch {
      setShareState("failed");
    }
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
      {supervisor && view.step === "result" && (
        <SupervisorCard
          result={view.result}
          intro={extra.supervisorCard.intro}
          close={extra.supervisorCard.close}
          onClose={() => setSupervisor(false)}
        />
      )}

      {view.step === "start" && (
        <section className="rise mt-6 flex flex-1 flex-col">
          <h1 className="font-display text-4xl font-semibold leading-[1.02] text-primary sm:text-5xl">
            {text.headline}
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{text.tagline}</p>
          <button
            onClick={() => setCameraOpen(true)}
            className="group relative mt-7 flex h-44 w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-[2rem] bg-primary text-primary-foreground shadow-xl shadow-primary/25 transition-transform active:scale-[0.98]"
          >
            <span className="pulse-ring absolute size-24 rounded-full border-2 border-primary-foreground/30" />
            <span className="relative flex size-[4.5rem] items-center justify-center rounded-full bg-harvest text-harvest-foreground shadow-lg transition-transform duration-500 [transition-timing-function:var(--ease-spring)] group-hover:scale-110 group-hover:rotate-6">
              <Camera className="size-9" />
            </span>
            <span className="relative text-xl font-semibold">{text.scan}</span>
          </button>
          <button
            onClick={() => galleryRef.current?.click()}
            className="mt-3 flex items-center justify-center gap-2 py-2 text-base font-medium text-primary underline-offset-4 hover:underline"
          >
            <ImageIcon className="size-5" />
            {local.choose}
          </button>
          <input
            ref={galleryRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) scanFile(file);
            }}
          />
          <ClockList language={language} clocks={clocks} now={now} onRemove={removeClock} />
          <h2 className="mt-10 text-sm font-medium text-muted-foreground">{text.samples}</h2>
          <ul className="mt-3 space-y-3">
            {samples.map((sample, index) => {
              const preview = pick(sample.results, language);
              return (
                <li key={sample.id} className="rise" style={{ animationDelay: `${120 + index * 70}ms` }}>
                  <button
                    onClick={() => scanSample(sample.id, sample.image)}
                    className="group card flex w-full items-center gap-4 p-3 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 active:scale-[0.99]"
                  >
                    <span className="h-16 w-14 shrink-0 overflow-hidden rounded-lg border">
                      <img
                        src={sample.image}
                        alt=""
                        className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-125"
                      />
                    </span>
                    <span className="flex-1">
                      <span className="block font-medium">{sample.title}</span>
                      <span className="block text-sm text-muted-foreground">{sample.detail}</span>
                    </span>
                    <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${signalStyle[preview.signal]}`}>
                      {text.signal[preview.signal]}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {view.step === "reading" && (
        <section className="rise mt-8" aria-live="polite">
          <div className="relative mx-auto w-full max-w-xs overflow-hidden rounded-3xl border bg-card shadow-lg">
            <img src={view.photo.dataUrl} alt="" className="h-80 w-full object-cover object-top" />
            <div className="absolute inset-0 bg-primary/10" />
            <div className="scan-line absolute inset-x-0 h-24" />
          </div>
          <div className="mt-6 text-center">
            <ReadingStatus key={language} steps={local.reading} />
          </div>
          <div className="mt-6 space-y-3">
            <div className="h-24 animate-pulse rounded-2xl bg-secondary" />
            <div className="h-16 animate-pulse rounded-2xl bg-secondary" />
          </div>
        </section>
      )}

      {view.step === "problem" && (
        <section className="rise mt-8">
          {view.photo.dataUrl && (
            <img src={view.photo.dataUrl} alt="" className="h-40 w-32 rounded-xl border object-cover object-top" />
          )}
          <p role="alert" className="mt-5 text-lg leading-relaxed">
            {text[view.reason]}
          </p>
          <button
            onClick={() => setCameraOpen(true)}
            className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-lg font-semibold text-primary-foreground active:scale-[0.98]"
          >
            <Camera className="size-5" />
            {text.scan}
          </button>
        </section>
      )}

      {view.step === "result" && (
        <section className="mt-6 pb-28">
          {view.saved && (
            <p className="rise mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              {text.offline}
            </p>
          )}
          <div className="rise flex gap-4">
            <img src={view.photo.dataUrl} alt="" className="h-28 w-24 shrink-0 rounded-xl border object-cover object-top shadow-sm" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-2">
                <span className={`inline-block rounded-md px-2.5 py-1 text-sm font-semibold ${signalStyle[view.result.signal]}`}>
                  {text.signal[view.result.signal]}
                </span>
                {view.result.confidence && (
                  <button
                    onClick={() => setDrawer((open) => !open)}
                    className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-sm font-semibold transition-transform active:scale-95 ${confidenceStyle[view.result.confidence]}`}
                  >
                    {view.result.confidence === "high" ? (
                      <ShieldCheck className="size-4" />
                    ) : (
                      <ShieldQuestion className="size-4" />
                    )}
                    {extra.result.confidence[view.result.confidence]}
                  </button>
                )}
              </div>
              <h1 className="mt-2 font-heading text-2xl font-semibold leading-snug">{view.result.product}</h1>
            </div>
          </div>

          <div
            className="rise mt-6 rounded-3xl bg-primary p-5 text-primary-foreground shadow-lg shadow-primary/20"
            style={{ animationDelay: "80ms" }}
          >
            <h2 className="text-sm font-medium opacity-80">{text.reentry}</h2>
            <p className="mt-1.5 font-heading text-2xl font-semibold leading-snug">{view.result.reentry}</p>
          </div>

          {view.result.reentryHours > 0 && (
            <>
              <ClockStarter
                key={`${view.result.product}-${language}`}
                language={language}
                hours={view.result.reentryHours}
                onStart={(sprayedAt) => {
                  addClock(view.result.product, sprayedAt, view.result.reentryHours);
                  navigator.vibrate?.(30);
                }}
              />
              {!alarm && clocks.length > 0 && (
                <button
                  onClick={async () => setAlarm(await askNotifications())}
                  className="rise mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/30 py-3 font-medium text-primary transition-colors hover:border-primary"
                >
                  <BellRing className="size-5" />
                  {extra.alarms.allow}
                </button>
              )}
              {alarm && clocks.length > 0 && (
                <p className="mt-3 flex items-center justify-center gap-2 text-sm font-medium text-primary">
                  <BellRing className="size-4" />
                  {extra.alarms.on}
                </p>
              )}
            </>
          )}

          <div className="rise mt-4 grid grid-cols-1 gap-2.5" style={{ animationDelay: "120ms" }}>
            <button
              onClick={() => onAsk(view.result)}
              className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-harvest text-lg font-semibold text-harvest-foreground shadow-md transition-all hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <MessageCircleQuestion className="size-5" />
              {extra.result.askAbout}
            </button>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setSupervisor(true)}
                className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border bg-card px-2 text-sm font-semibold leading-tight transition-all hover:border-primary active:scale-95"
              >
                <UserRoundCheck className="size-5 shrink-0 text-primary" />
                {extra.result.supervisor}
              </button>
              <button
                onClick={() => share(view.result, view.photo)}
                disabled={shareState === "busy"}
                className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border bg-card px-2 text-sm font-semibold leading-tight transition-all hover:border-primary active:scale-95 disabled:opacity-60"
              >
                <Share2 className={`size-5 shrink-0 text-primary ${shareState === "busy" ? "animate-pulse" : ""}`} />
                {shareState === "copied"
                  ? extra.result.copied
                  : shareState === "shared"
                    ? extra.result.shared
                    : shareState === "failed"
                      ? extra.result.shareFailed
                      : extra.result.share}
              </button>
            </div>
          </div>

          {missing && <p className="mt-3 text-sm text-muted-foreground">{text.noVoice}</p>}

          {view.result.others && view.result.others.length > 0 && (
            <div className="rise mt-6 rounded-2xl border-2 border-harvest bg-harvest/10 p-4">
              <p className="font-semibold">{extra.result.others}</p>
              <ul className="mt-2 space-y-2">
                {view.result.others.map((other) => (
                  <li key={other.product} className="flex items-center justify-between gap-3">
                    <span className="font-medium">{other.product}</span>
                    <span className="flex shrink-0 items-center gap-2 text-sm">
                      {other.reentryHours > 0 && <span className="font-semibold">{other.reentryHours} h</span>}
                      <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${signalStyle[other.signal]}`}>
                        {text.signal[other.signal]}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {view.result.gear.length > 0 && (
            <div className="rise mt-6" style={{ animationDelay: "160ms" }}>
              <h2 className="font-heading text-xl font-semibold">{text.gear}</h2>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-lg leading-snug marker:text-primary">
                {view.result.gear.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {view.result.firstAid.length > 0 && (
            <div className="rise mt-6" style={{ animationDelay: "240ms" }}>
              <h2 className="font-heading text-xl font-semibold">{text.firstAid}</h2>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-lg leading-snug marker:text-primary">
                {view.result.firstAid.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="rise mt-6" style={{ animationDelay: "320ms" }}>
            <h2 className="font-heading text-xl font-semibold">{text.summary}</h2>
            <p className="mt-2 text-lg leading-relaxed">{view.result.summary}</p>
          </div>

          {view.result.ask && (
            <div className="mt-6 rounded-2xl border-2 border-amber-400 bg-amber-50 p-4 text-lg leading-snug text-amber-950">
              <p>{view.result.ask}</p>
            </div>
          )}

          {view.result.evidence && view.result.evidence.length > 0 && (
            <div className="rise card mt-6 overflow-hidden" style={{ animationDelay: "380ms" }}>
              <button
                onClick={() => setDrawer((open) => !open)}
                aria-expanded={drawer}
                className="flex w-full items-center justify-between gap-3 p-4 text-left font-semibold"
              >
                <span className="flex items-center gap-2">
                  <Quote className="size-5 text-primary" />
                  {extra.result.howRead}
                </span>
                <ChevronDown className={`size-5 transition-transform duration-300 ${drawer ? "rotate-180" : ""}`} />
              </button>
              {drawer && (
                <div className="rise border-t p-4">
                  {view.result.confidence && (
                    <p className={`rounded-xl px-3 py-2 text-sm font-medium ${confidenceStyle[view.result.confidence]}`}>
                      {extra.result.confidenceNote[view.result.confidence]}
                    </p>
                  )}
                  <ul className="mt-3 space-y-3">
                    {view.result.evidence.map((item, index) => (
                      <li key={`${item.field}-${index}`} className="rise" style={{ animationDelay: `${index * 60}ms` }}>
                        <p className="text-xs font-semibold text-muted-foreground">
                          {extra.result.fields[item.field] ?? item.field}
                        </p>
                        <p lang="en" className="mt-1 border-l-4 border-harvest bg-harvest/10 py-1.5 pl-3 pr-2 font-mono text-sm leading-snug">
                          {item.quote}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {stored && (
            <p className="rise mt-6 flex items-center gap-2 text-sm font-medium text-primary">
              <CloudCheck className="pop size-4" />
              {local.saved}
            </p>
          )}

          <p className="mt-8 text-sm text-muted-foreground">{text.disclaimer}</p>
          <button
            onClick={reset}
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-secondary text-base font-semibold transition-all active:scale-[0.98]"
          >
            <Camera className="size-5" />
            {text.another}
          </button>

          <div className="fixed inset-x-0 bottom-[4.75rem] z-30 px-4">
            <div className="rise mx-auto flex max-w-xl gap-2 rounded-2xl border bg-card/95 p-2 shadow-xl backdrop-blur">
              <button
                onClick={() => speak("result", spokenText(view.result, text))}
                className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-base font-semibold transition-all active:scale-95 ${
                  speaking ? "bg-primary text-primary-foreground" : "border"
                }`}
              >
                {speaking ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
                {speaking ? text.stop : text.listen}
              </button>
              <a
                href="tel:18002221222"
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-danger px-2 text-center text-sm font-semibold leading-tight text-white active:scale-95"
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
