"use client";

import { AlertTriangle, CalendarDays, Camera, CheckCircle2, ImageIcon, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useRef, useState } from "react";
import { LiveCamera } from "@/components/live-camera";
import { appCopy } from "@/lib/app-copy";
import { useCopy } from "@/lib/i18n";
import { fileToJpeg, toJpeg } from "@/lib/image";
import type { Language } from "@/lib/scan";
import { useSpeaker } from "@/lib/speech";

type Reading = {
  readable: boolean;
  kind: string;
  summary: string;
  actions: string[];
  dates: string[];
  warning: string;
};

type State =
  | { step: "start" }
  | { step: "reading"; photo: string }
  | { step: "done"; photo: string; reading: Reading }
  | { step: "problem"; photo: string; message: string };

export function ReadPaper({ language }: { language: Language }) {
  const text = useCopy(appCopy, language).paper;
  const listen = useCopy(appCopy, language).brief.listen;
  const [state, setState] = useState<State>({ step: "start" });
  const [cameraOpen, setCameraOpen] = useState(false);
  const gallery = useRef<HTMLInputElement>(null);
  const { speaking, speak } = useSpeaker(language);

  async function read(photo: string) {
    setState({ step: "reading", photo });
    try {
      const response = await fetch("/api/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: photo.split(",")[1], mediaType: "image/jpeg", language }),
      });
      if (!response.ok) throw new Error("failed");
      const reading: Reading = await response.json();
      setState(
        reading.readable
          ? { step: "done", photo, reading }
          : { step: "problem", photo, message: text.unreadable },
      );
      navigator.vibrate?.(25);
    } catch {
      setState({ step: "problem", photo, message: text.failed });
    }
  }

  return (
    <section className="rise pt-6 pb-10">
      {cameraOpen && (
        <LiveCamera
          language={language}
          onCapture={async (shot) => {
            setCameraOpen(false);
            read(await toJpeg(shot));
          }}
          onFile={async (file) => {
            setCameraOpen(false);
            read(await fileToJpeg(file));
          }}
          onClose={() => setCameraOpen(false)}
        />
      )}
      <h1 className="font-display text-4xl font-semibold leading-[1.02] text-primary sm:text-5xl">
        {text.title}
      </h1>

      {state.step === "start" && (
        <>
          <p className="mt-3 text-lg text-muted-foreground">{text.intro}</p>
          <button
            onClick={() => setCameraOpen(true)}
            className="group mt-6 flex h-36 w-full flex-col items-center justify-center gap-3 rounded-3xl bg-primary text-primary-foreground shadow-xl shadow-primary/20 transition-transform active:scale-[0.98]"
          >
            <span className="flex size-14 items-center justify-center rounded-full bg-harvest text-harvest-foreground transition-transform group-hover:scale-110">
              <Camera className="size-7" />
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
          <input
            ref={gallery}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) read(await fileToJpeg(file));
            }}
          />
        </>
      )}

      {state.step === "reading" && (
        <div className="mt-6" aria-live="polite">
          <div className="relative mx-auto max-w-xs overflow-hidden rounded-2xl border bg-card shadow-lg">
            <img src={state.photo} alt="" className="h-72 w-full object-cover object-top" />
            <div className="scan-line absolute inset-x-0 h-24" />
          </div>
          <p className="mt-5 text-center text-lg font-medium">{text.reading}</p>
        </div>
      )}

      {state.step === "problem" && (
        <div className="mt-6">
          <img src={state.photo} alt="" className="h-40 w-32 rounded-xl border object-cover object-top" />
          <p role="alert" className="mt-4 text-lg">{state.message}</p>
          <button
            onClick={() => setState({ step: "start" })}
            className="mt-5 flex h-12 w-full items-center justify-center rounded-2xl bg-primary font-semibold text-primary-foreground active:scale-[0.98]"
          >
            {text.take}
          </button>
        </div>
      )}

      {state.step === "done" && (
        <div className="mt-6 space-y-4">
          <div className="rise flex gap-4">
            <img src={state.photo} alt="" className="h-24 w-20 shrink-0 rounded-xl border object-cover object-top" />
            <div>
              <p className="inline-block rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-primary">
                {state.reading.kind}
              </p>
              <p className="mt-2 text-lg leading-relaxed">{state.reading.summary}</p>
              <button
                onClick={() =>
                  speak(
                    "paper",
                    [state.reading.summary, ...state.reading.actions, ...state.reading.dates].join(". "),
                  )
                }
                className="mt-2 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium text-primary active:scale-95"
              >
                {speaking ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                {listen}
              </button>
            </div>
          </div>
          {state.reading.warning && (
            <div className="pop flex gap-3 rounded-2xl border-2 border-danger bg-red-50 p-4 text-red-900">
              <AlertTriangle className="mt-0.5 size-6 shrink-0" />
              <p className="text-lg leading-snug">{state.reading.warning}</p>
            </div>
          )}
          {state.reading.actions.length > 0 && (
            <div className="rise card p-5" style={{ animationDelay: "100ms" }}>
              <p className="font-display text-xl font-semibold text-primary">{text.actions}</p>
              <ul className="mt-3 space-y-2">
                {state.reading.actions.map((item) => (
                  <li key={item} className="flex gap-3 text-lg leading-snug">
                    <CheckCircle2 className="mt-1 size-5 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {state.reading.dates.length > 0 && (
            <div className="rise card p-5" style={{ animationDelay: "200ms" }}>
              <p className="font-display text-xl font-semibold text-primary">{text.dates}</p>
              <ul className="mt-3 space-y-2">
                {state.reading.dates.map((item) => (
                  <li key={item} className="flex gap-3 text-lg leading-snug">
                    <CalendarDays className="mt-1 size-5 shrink-0 text-harvest-foreground" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button
            onClick={() => setState({ step: "start" })}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border font-semibold transition-all hover:border-primary active:scale-[0.98]"
          >
            <RotateCcw className="size-5" />
            {text.another}
          </button>
        </div>
      )}
    </section>
  );
}
