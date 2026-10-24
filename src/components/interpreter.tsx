"use client";

import { LoaderCircle, Mic, RotateCcw, Square, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCopy } from "@/lib/i18n";
import { languages, type Language } from "@/lib/scan";
import { canRecord, recordUtterance, useSpeaker, type RecordControl } from "@/lib/speech";
import { toolsCopy } from "@/lib/tools-copy";

type Side = "me" | "them";

type Turn = { id: number; side: Side; heard: string; translation: string };

export function Interpreter({ language }: { language: Language }) {
  const text = useCopy(toolsCopy, language).interpret;
  const [other, setOther] = useState<Language>(language === "en" ? "es" : "en");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [active, setActive] = useState<{ side: Side; phase: "listening" | "translating" } | null>(null);
  const [level, setLevel] = useState(0);
  const [error, setError] = useState("");
  const [supported, setSupported] = useState(true);
  const control = useRef<RecordControl>({ finish: false, cancel: false });
  const mine = useSpeaker(language);
  const theirs = useSpeaker(other);

  useEffect(() => {
    const check = setTimeout(() => setSupported(canRecord()), 0);
    const state = control;
    return () => {
      clearTimeout(check);
      state.current.cancel = true;
    };
  }, []);

  async function talk(side: Side) {
    if (active?.side === side && active.phase === "listening") {
      control.current.finish = true;
      return;
    }
    if (active) return;
    mine.stop();
    theirs.stop();
    setError("");
    control.current = { finish: false, cancel: false };
    setActive({ side, phase: "listening" });
    try {
      const clip = await recordUtterance(control.current, setLevel);
      if (!clip) {
        setActive(null);
        return;
      }
      setActive({ side, phase: "translating" });
      const target = side === "me" ? other : language;
      const response = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audio: clip.audio, target }),
      });
      if (!response.ok) throw new Error("failed");
      const result: { heard: string; translation: string } = await response.json();
      setActive(null);
      if (!result.translation) return;
      setTurns((current) => [...current, { id: current.length, side, ...result }]);
      navigator.vibrate?.(15);
      (side === "me" ? theirs : mine).say(result.translation);
    } catch (problem) {
      setActive(null);
      setError(problem instanceof DOMException ? text.blocked : text.failed);
    }
  }

  function replay(turn: Turn) {
    (turn.side === "me" ? theirs : mine).say(turn.translation);
  }

  function Panel({ side }: { side: Side }) {
    const own = side === "me";
    const lang = own ? language : other;
    const name = languages.find((item) => item.code === lang)?.name ?? lang;
    const listening = active?.side === side && active.phase === "listening";
    const translating = active?.side === side && active.phase === "translating";
    const shown = turns.slice(-3);
    return (
      <div
        lang={lang}
        className={`flex min-h-0 flex-1 flex-col gap-3 rounded-[2rem] p-4 ${
          own ? "bg-card ring-1 ring-border" : "bg-primary text-primary-foreground max-lg:rotate-180"
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <p className="font-display text-xl font-semibold">{own ? text.me : text.them}</p>
          {own ? (
            <span className="rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-primary">{name}</span>
          ) : (
            <label className="flex items-center gap-2 text-sm">
              <span className="sr-only">{text.other}</span>
              <select
                value={other}
                onChange={(event) => setOther(event.target.value as Language)}
                className="rounded-full bg-white/15 px-3 py-1 font-semibold text-primary-foreground outline-none [&>option]:text-foreground"
              >
                {languages
                  .filter((item) => item.code !== language)
                  .map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </label>
          )}
        </div>

        <div className="flex min-h-24 flex-1 flex-col justify-end gap-2 overflow-y-auto">
          {shown.length === 0 && (
            <p className={`text-center text-sm ${own ? "text-muted-foreground" : "text-primary-foreground/70"}`}>
              {text.empty}
            </p>
          )}
          {shown.map((turn) => {
            const said = turn.side === side;
            const words = said ? turn.heard : turn.translation;
            return (
              <div
                key={turn.id}
                className={`pop flex max-w-[90%] items-end gap-2 ${said ? "ml-auto flex-row-reverse" : ""}`}
              >
                <p
                  className={`rounded-3xl px-4 py-2.5 leading-snug ${
                    said
                      ? own
                        ? "rounded-br-md bg-secondary text-base"
                        : "rounded-br-md bg-white/15 text-base"
                      : own
                        ? "rounded-bl-md bg-primary text-xl font-medium text-primary-foreground"
                        : "rounded-bl-md bg-background text-xl font-medium text-foreground"
                  }`}
                >
                  {words}
                </p>
                {!said && (
                  <button
                    onClick={() => replay(turn)}
                    aria-label={text.replay}
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
                      own ? "bg-secondary text-primary" : "bg-white/15"
                    }`}
                  >
                    <Volume2 className="size-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={() => talk(side)}
          disabled={Boolean(active && active.side !== side) || translating}
          className={`relative flex h-16 items-center justify-center gap-3 overflow-hidden rounded-2xl text-lg font-semibold transition-all active:scale-[0.98] disabled:opacity-40 ${
            listening
              ? "bg-danger text-white"
              : own
                ? "bg-primary text-primary-foreground"
                : "bg-harvest text-harvest-foreground"
          }`}
        >
          {listening && (
            <span
              className="absolute inset-y-0 left-0 bg-white/20 transition-[width] duration-100"
              style={{ width: `${Math.round(level * 100)}%` }}
            />
          )}
          <span className="relative flex items-center gap-3">
            {translating ? (
              <LoaderCircle className="size-6 animate-spin" />
            ) : listening ? (
              <Square className="size-5 fill-current" />
            ) : (
              <Mic className="size-6" />
            )}
            {translating ? text.translating : listening ? text.tapToStop : name}
          </span>
        </button>
      </div>
    );
  }

  return (
    <section className="rise flex flex-1 flex-col pt-6 pb-4">
      <div className="flex items-start justify-between gap-3">
        <h1 className="font-display text-4xl font-semibold leading-[1.02] text-primary sm:text-5xl">{text.title}</h1>
        {turns.length > 0 && (
          <button
            onClick={() => setTurns([])}
            className="flex shrink-0 items-center gap-1.5 rounded-full border bg-card px-3 py-2 text-sm font-medium transition-all hover:border-primary active:scale-95"
          >
            <RotateCcw className="size-4" />
            {text.clear}
          </button>
        )}
      </div>
      <p className="mt-2 text-muted-foreground">{text.intro}</p>
      {!supported && <p className="mt-4 rounded-2xl bg-red-50 p-4 text-red-800">{text.unsupported}</p>}
      {error && (
        <p role="alert" className="mt-4 rounded-2xl bg-red-50 p-4 text-red-800">
          {error}
        </p>
      )}
      <div className="mt-5 flex min-h-[34rem] flex-1 flex-col gap-3 lg:flex-row">
        {Panel({ side: "them" })}
        {Panel({ side: "me" })}
      </div>
    </section>
  );
}
