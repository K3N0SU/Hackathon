"use client";

import { Camera, CheckCircle2, CircleHelp, ImageIcon, Lock, Phone, Volume2, VolumeX, XCircle } from "lucide-react";
import { useRef, useState } from "react";
import { appCopy } from "@/lib/app-copy";
import { useCopy } from "@/lib/i18n";
import { LiveCamera } from "@/components/live-camera";
import { fileToJpeg, toJpeg } from "@/lib/image";
import type { Language } from "@/lib/scan";
import { useSpeaker } from "@/lib/speech";
import { toolsCopy } from "@/lib/tools-copy";

type Status = "ok" | "ask" | "missing";

type Stub = {
  readable: boolean;
  employer: string;
  period: string;
  hours: string;
  rate: string;
  gross: string;
  net: string;
  checks: { label: string; status: Status; detail: string }[];
  verdict: "ok" | "ask" | "unclear";
  summary: string;
  nextStep: string;
};

type State =
  | { step: "start" }
  | { step: "reading"; photo: string }
  | { step: "done"; photo: string; stub: Stub }
  | { step: "problem"; message: string };

const statusStyle: Record<Status, { tone: string; icon: typeof CheckCircle2 }> = {
  ok: { tone: "text-emerald-700", icon: CheckCircle2 },
  ask: { tone: "text-danger", icon: XCircle },
  missing: { tone: "text-amber-700", icon: CircleHelp },
};

const verdictStyle = {
  ok: "bg-primary text-primary-foreground",
  ask: "bg-danger text-white",
  unclear: "bg-harvest text-harvest-foreground",
};

export function PayCheck({ language }: { language: Language }) {
  const text = useCopy(toolsCopy, language).pay;
  const listen = useCopy(appCopy, language).brief.listen;
  const [state, setState] = useState<State>({ step: "start" });
  const [cameraOpen, setCameraOpen] = useState(false);
  const gallery = useRef<HTMLInputElement>(null);
  const { speaking, speak } = useSpeaker(language);

  async function read(source: Promise<string>) {
    let photo: string;
    try {
      photo = await source;
    } catch {
      setState({ step: "problem", message: text.failed });
      return;
    }
    setState({ step: "reading", photo });
    try {
      const response = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: photo.split(",")[1], mediaType: "image/jpeg", language }),
      });
      if (!response.ok) throw new Error("failed");
      const stub: Stub = await response.json();
      if (!stub.readable) {
        setState({ step: "problem", message: text.notStub });
        return;
      }
      setState({ step: "done", photo, stub });
      navigator.vibrate?.(25);
    } catch {
      setState({ step: "problem", message: text.failed });
    }
  }

  return (
    <section className="rise pt-6 pb-10">
      <input
        ref={gallery}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) read(fileToJpeg(file));
        }}
      />
      {cameraOpen && (
        <LiveCamera
          language={language}
          mode="stub"
          onCapture={(shot) => {
            setCameraOpen(false);
            read(toJpeg(shot));
          }}
          onFile={(file) => {
            setCameraOpen(false);
            read(fileToJpeg(file));
          }}
          onClose={() => setCameraOpen(false)}
        />
      )}
      <h1 className="font-display text-4xl font-semibold leading-[1.02] text-primary sm:text-5xl">
        {text.title}
      </h1>

      {(state.step === "start" || state.step === "problem") && (
        <>
          <p className="mt-3 text-lg text-muted-foreground">{text.intro}</p>
          {state.step === "problem" && (
            <p role="alert" className="mt-4 rounded-2xl bg-red-50 p-4 text-red-800">
              {state.message}
            </p>
          )}
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
          <p className="mt-4 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
            <Lock className="size-4" />
            {text.privacy}
          </p>
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

      {state.step === "done" && (
        <div className="mt-6 space-y-4">
          <div className={`pop rounded-3xl p-5 shadow-xl ${verdictStyle[state.stub.verdict]}`}>
            <p className="font-display text-3xl font-semibold leading-tight">{text.verdict[state.stub.verdict]}</p>
            <p className="mt-2 text-lg leading-snug opacity-90">{state.stub.summary}</p>
          </div>

          <dl className="rise card grid grid-cols-2 gap-px overflow-hidden bg-border p-0" style={{ animationDelay: "80ms" }}>
            {(
              [
                [text.net, state.stub.net],
                [text.gross, state.stub.gross],
                [text.hours, state.stub.hours],
                [text.rate, state.stub.rate],
              ] as const
            ).map(([name, value], index) => (
              <div key={name} className={`bg-card p-4 ${index === 0 ? "col-span-2" : ""}`}>
                <dt className="text-sm text-muted-foreground">{name}</dt>
                <dd className={`font-display font-semibold tabular-nums text-primary ${index === 0 ? "text-4xl" : "text-2xl"}`}>
                  {value || "—"}
                </dd>
              </div>
            ))}
          </dl>
          {(state.stub.period || state.stub.employer) && (
            <p className="text-sm text-muted-foreground">
              {[state.stub.employer, state.stub.period && `${text.period}: ${state.stub.period}`].filter(Boolean).join(" · ")}
            </p>
          )}

          <ul className="space-y-2">
            {state.stub.checks.map((check, index) => {
              const style = statusStyle[check.status];
              const Icon = style.icon;
              return (
                <li
                  key={`${check.label}-${index}`}
                  className="rise card flex items-start gap-3 p-4"
                  style={{ animationDelay: `${160 + index * 70}ms` }}
                >
                  <Icon className={`mt-0.5 size-6 shrink-0 ${style.tone}`} />
                  <div className="min-w-0">
                    <p className="font-semibold">{check.label}</p>
                    <p className="mt-0.5 text-muted-foreground">{check.detail}</p>
                    <p className={`mt-1 text-xs font-semibold ${style.tone}`}>{text.status[check.status]}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          <p className="rounded-2xl bg-secondary p-4 text-lg leading-snug">{state.stub.nextStep}</p>

          {state.stub.verdict === "ask" && (
            <a
              href="tel:18335264636"
              className="flex h-14 items-center justify-center gap-2 rounded-2xl border-2 border-danger font-semibold text-danger transition-all active:scale-95"
            >
              <Phone className="size-5" />
              {text.labor}
            </a>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => speak("pay", [text.verdict[state.stub.verdict], state.stub.summary, state.stub.nextStep].join(". "))}
              className={`flex h-14 items-center justify-center gap-2 rounded-2xl font-semibold transition-all active:scale-95 ${
                speaking ? "bg-primary text-primary-foreground" : "border bg-card"
              }`}
            >
              {speaking ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
              {listen}
            </button>
            <button
              onClick={() => setState({ step: "start" })}
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
