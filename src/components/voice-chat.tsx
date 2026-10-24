"use client";

import { LoaderCircle, Mic, Phone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { recordUtterance, type Clip, type RecordControl } from "@/lib/speech";

type Phase = "idle" | "listening" | "thinking" | "speaking" | "blocked" | "failed";

export type VoiceReply = { heard: string; answer: string; urgent: boolean };

type Copy = {
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
  const [heard, setHeard] = useState("");
  const [answer, setAnswer] = useState("");
  const [urgent, setUrgent] = useState(false);
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
      if (!open.current) break;
      if (!clip) {
        setPhase("idle");
        break;
      }
      setPhase("thinking");
      navigator.vibrate?.(15);
      const reply = await onAsk(clip);
      if (!open.current) break;
      if (!reply) {
        setPhase("failed");
        break;
      }
      setHeard(reply.heard);
      setAnswer(reply.answer);
      setUrgent(reply.urgent);
      setPhase("speaking");
      await say(reply.answer);
      if (reply.urgent) {
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

  function tap() {
    if (phase === "listening") control.current.finish = true;
    else if (phase === "speaking") stop();
    else if (phase !== "thinking") converse();
  }

  function close() {
    open.current = false;
    control.current.cancel = true;
    stop();
    onClose();
  }

  const status = {
    idle: text.voiceTap,
    listening: text.voiceListening,
    thinking: text.voiceThinking,
    speaking: text.voiceSpeaking,
    blocked: text.voiceBlocked,
    failed: text.voiceFailed,
  }[phase];

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-primary text-primary-foreground">
      <div className="flex justify-end p-4">
        <button
          onClick={close}
          aria-label={text.close}
          className="flex size-12 items-center justify-center rounded-full bg-white/10 transition-all hover:bg-white/20 active:scale-90"
        >
          <X className="size-6" />
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-10 px-6 text-center">
        <button
          onClick={tap}
          aria-label={status}
          className="relative flex size-44 items-center justify-center rounded-full transition-transform active:scale-95"
        >
          <span
            className={`absolute inset-0 rounded-full transition-[transform,background-color] duration-150 ${
              phase === "speaking" ? "bg-harvest/40" : "bg-white/15"
            }`}
            style={{ transform: `scale(${1 + level * 0.45})` }}
          />
          {(phase === "speaking" || phase === "thinking") && (
            <span className="pulse-ring absolute inset-0 rounded-full bg-harvest/30" />
          )}
          <span
            className={`relative flex size-32 items-center justify-center rounded-full shadow-2xl transition-colors duration-300 ${
              phase === "listening"
                ? "bg-white text-primary"
                : phase === "speaking"
                  ? "bg-harvest text-harvest-foreground"
                  : "bg-white/90 text-primary"
            }`}
          >
            {phase === "thinking" ? (
              <LoaderCircle className="size-12 animate-spin" />
            ) : phase === "speaking" ? (
              <span className="flex h-12 items-center gap-1.5">
                {[0, 1, 2, 3, 4].map((bar) => (
                  <span
                    key={bar}
                    className="voice-bar w-2 rounded-full bg-current"
                    style={{ animationDelay: `${bar * 120}ms` }}
                  />
                ))}
              </span>
            ) : (
              <Mic className="size-12" />
            )}
          </span>
        </button>

        <div className="max-w-md" aria-live="polite">
          <p className="font-display text-3xl font-semibold">{status}</p>
          {phase === "idle" && !answer && (
            <p className="mt-3 text-lg text-primary-foreground/75">{text.talkHint}</p>
          )}
        </div>

        {(heard || answer) && (
          <div className="w-full max-w-md space-y-3 text-left">
            {heard && (
              <p className="ml-auto w-fit max-w-[90%] rounded-3xl rounded-br-md bg-white/15 px-4 py-3 text-lg leading-snug">
                {heard}
              </p>
            )}
            {answer && (
              <p className="max-h-48 overflow-y-auto rounded-3xl rounded-bl-md bg-background px-4 py-3 text-lg leading-relaxed text-foreground">
                {answer}
              </p>
            )}
          </div>
        )}

        {urgent && (
          <a
            href="tel:911"
            className="flex items-center gap-2 rounded-full bg-danger px-6 py-4 text-xl font-semibold text-white shadow-xl"
          >
            <Phone className="size-6" />
            {text.call911}
          </a>
        )}
      </div>
    </div>
  );
}
