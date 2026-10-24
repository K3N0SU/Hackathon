"use client";

import { Mic, MicOff, Phone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { recordUtterance, type Clip, type RecordControl } from "@/lib/speech";

type Phase = "idle" | "listening" | "thinking" | "speaking" | "blocked" | "failed";

export type VoiceReply = { heard: string; answer: string; urgent: boolean };

type Copy = {
  title: string;
  talkHint: string;
  voiceListening: string;
  voiceThinking: string;
  voiceSpeaking: string;
  voiceTap: string;
  voiceBlocked: string;
  voiceFailed: string;
  close: string;
  call911: string;
};

export function VoiceChat({
  text,
  onAsk,
  say,
  stop,
  onClose,
}: {
  text: Copy;
  onAsk: (clip: Clip) => Promise<VoiceReply | null>;
  say: (words: string) => Promise<void>;
  stop: () => void;
  onClose: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [level, setLevel] = useState(0);
  const [caption, setCaption] = useState<{ who: "you" | "milpa"; words: string } | null>(null);
  const [urgent, setUrgent] = useState(false);
  const [muted, setMuted] = useState(false);
  const open = useRef(true);
  const control = useRef<RecordControl>({ finish: false, cancel: false });
  const running = useRef(false);

  async function converse() {
    if (running.current) return;
    running.current = true;
    while (open.current) {
      control.current = { finish: false, cancel: false };
      setPhase("listening");
      let clip: Clip | null;
      try {
        clip = await recordUtterance(control.current, setLevel);
      } catch {
        setPhase("blocked");
        break;
      }
      if (!open.current || control.current.cancel) break;
      if (!clip) {
        setPhase("idle");
        break;
      }
      setPhase("thinking");
      navigator.vibrate?.(12);
      const reply = await onAsk(clip);
      if (!open.current) break;
      if (!reply) {
        setPhase("failed");
        break;
      }
      if (reply.heard) setCaption({ who: "you", words: reply.heard });
      setUrgent(reply.urgent);
      setPhase("speaking");
      setCaption({ who: "milpa", words: reply.answer });
      await say(reply.answer);
      if (reply.urgent || control.current.cancel) {
        setPhase("idle");
        break;
      }
    }
    running.current = false;
  }

  const latest = useRef(converse);
  useEffect(() => {
    latest.current = converse;
  });

  useEffect(() => {
    open.current = true;
    const start = setTimeout(() => latest.current(), 0);
    const state = control;
    return () => {
      clearTimeout(start);
      open.current = false;
      state.current.cancel = true;
    };
  }, []);

  useEffect(() => {
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  });

  function tapOrb() {
    if (phase === "listening") control.current.finish = true;
    else if (phase === "speaking") stop();
    else if (phase !== "thinking") {
      setMuted(false);
      converse();
    }
  }

  function toggleMute() {
    if (muted) {
      setMuted(false);
      converse();
      return;
    }
    setMuted(true);
    control.current.cancel = true;
    stop();
    setPhase("idle");
  }

  function close() {
    open.current = false;
    control.current.cancel = true;
    stop();
    onClose();
  }

  const status = muted
    ? text.voiceTap
    : {
        idle: text.voiceTap,
        listening: text.voiceListening,
        thinking: text.voiceThinking,
        speaking: text.voiceSpeaking,
        blocked: text.voiceBlocked,
        failed: text.voiceFailed,
      }[phase];

  const scale = phase === "listening" ? 1 + level * 0.35 : phase === "thinking" ? 0.86 : 1;

  return (
    <div className="pop fixed inset-0 z-[70] flex flex-col bg-background">
      <div className="flex items-center justify-between px-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <p className="font-display text-xl font-semibold text-ink">{text.title}</p>
        <span
          className={`h-2.5 w-2.5 rounded-full transition-colors ${
            phase === "listening" ? "bg-danger" : phase === "speaking" ? "bg-primary" : "bg-border"
          }`}
        />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <button
          onClick={tapOrb}
          aria-label={status}
          className="relative size-64 rounded-full outline-none transition-transform duration-150 ease-out active:scale-95 sm:size-72"
          style={{ transform: `scale(${scale})` }}
        >
          <span
            className={`orb absolute inset-0 overflow-hidden rounded-full shadow-[0_30px_80px_-20px_oklch(0.5_0.21_264/0.45)] ${
              phase === "speaking" ? "orb-speaking" : phase === "thinking" ? "orb-thinking" : ""
            }`}
          >
            <span className="orb-layer orb-a absolute -inset-1/4 bg-primary" />
            <span className="orb-layer orb-b absolute -inset-1/4 bg-poppy" />
            <span className="orb-layer orb-c absolute -inset-1/4 bg-harvest" />
            <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,oklch(1_0_0/0.55),transparent_45%)]" />
          </span>
        </button>

        <p className="mt-12 text-lg font-medium text-muted-foreground" aria-live="polite">
          {status}
        </p>
        {phase === "idle" && !caption && !muted && (
          <p className="mt-2 max-w-sm text-center text-muted-foreground/80">{text.talkHint}</p>
        )}
        {caption && (
          <p
            key={caption.words}
            className={`rise mt-6 line-clamp-4 max-w-md text-center text-xl leading-relaxed ${
              caption.who === "you" ? "text-muted-foreground" : "text-ink"
            }`}
          >
            {caption.words}
          </p>
        )}
        {urgent && (
          <a
            href="tel:911"
            className="pop mt-6 flex items-center gap-2 rounded-full bg-danger px-6 py-4 text-xl font-semibold text-white shadow-xl"
          >
            <Phone className="size-6" />
            {text.call911}
          </a>
        )}
      </div>

      <div className="flex items-center justify-center gap-6 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <button
          onClick={toggleMute}
          aria-pressed={muted}
          aria-label={status}
          className={`flex size-16 items-center justify-center rounded-full transition-all active:scale-90 ${
            muted ? "bg-ink text-ink-foreground" : "bg-secondary text-ink hover:bg-border"
          }`}
        >
          {muted ? <MicOff className="size-7" /> : <Mic className="size-7" />}
        </button>
        <button
          onClick={close}
          aria-label={text.close}
          className="flex size-16 items-center justify-center rounded-full bg-danger text-white shadow-lg shadow-danger/30 transition-all hover:scale-105 active:scale-90"
        >
          <X className="size-7" />
        </button>
      </div>
    </div>
  );
}
