"use client";

import {
  ArrowUp,
  LoaderCircle,
  Mic,
  Phone,
  RotateCcw,
  Sprout,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { appCopy } from "@/lib/app-copy";
import type { Clock } from "@/lib/clocks";
import { useCopy } from "@/lib/i18n";
import type { Language, ScanResult } from "@/lib/scan";
import { useDictation, useSpeaker } from "@/lib/speech";

type Message = { id: string; role: "user" | "model"; text: string; urgent?: boolean };

function storageKey(product: string) {
  return `furrow-chat-${product || "general"}`;
}

function loadChat(product: string): Message[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey(product)) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function AskChat({
  language,
  focus,
  clocks,
}: {
  language: Language;
  focus: ScanResult | null;
  clocks: Clock[];
}) {
  const text = useCopy(appCopy, language).ask;
  const product = focus?.product ?? "";
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [followUps, setFollowUps] = useState<string[]>([]);
  const end = useRef<HTMLDivElement>(null);
  const { speaking, speak } = useSpeaker(language);
  const dictation = useDictation(language, setDraft);

  useEffect(() => {
    const start = setTimeout(() => {
      setMessages(loadChat(product));
      setFollowUps([]);
    }, 0);
    return () => clearTimeout(start);
  }, [product]);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  function remember(next: Message[]) {
    setMessages(next);
    try {
      localStorage.setItem(storageKey(product), JSON.stringify(next.slice(-30)));
    } catch {}
  }

  async function send(question: string) {
    const trimmed = question.trim();
    if (!trimmed || busy) return;
    const asked: Message = { id: `${messages.length}-u`, role: "user", text: trimmed };
    const history = [...messages, asked];
    remember(history);
    setDraft("");
    setBusy(true);
    setFailed(false);
    setFollowUps([]);
    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          messages: history.slice(-12).map(({ role, text }) => ({ role, text })),
          context: {
            scannedLabel: focus,
            reentryClocks: clocks.map((clock) => ({
              product: clock.product,
              endsAt: new Date(clock.endsAt).toLocaleString("en-US", {
                timeZone: "America/Los_Angeles",
              }),
            })),
          },
        }),
      });
      if (!response.ok) throw new Error("ask failed");
      const reply: { answer: string; followUps: string[]; urgent: boolean } =
        await response.json();
      const answered: Message = {
        id: `${history.length}-m`,
        role: "model",
        text: reply.answer,
        urgent: reply.urgent,
      };
      remember([...history, answered]);
      setFollowUps(reply.followUps.slice(0, 3));
      navigator.vibrate?.(reply.urgent ? [200, 100, 200] : 15);
    } catch {
      setFailed(true);
    }
    setBusy(false);
  }

  const suggestions = followUps.length ? followUps : messages.length ? [] : text.starters;

  return (
    <section className="rise flex flex-1 flex-col pt-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-semibold leading-[1.02] text-primary sm:text-5xl">
            {text.title}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {focus ? (
              <>
                {text.about}{" "}
                <span className="font-semibold text-foreground">{focus.product}</span>
              </>
            ) : (
              text.general
            )}
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => {
              remember([]);
              setFollowUps([]);
            }}
            className="flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-primary active:scale-95"
          >
            <RotateCcw className="size-4" />
            {text.clear}
          </button>
        )}
      </div>

      <div className="mt-6 flex flex-1 flex-col gap-3 pb-44" aria-live="polite">
        {messages.length === 0 && (
          <div className="pop mx-auto mt-6 flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sprout className="size-10" />
          </div>
        )}
        {messages.map((message) =>
          message.role === "user" ? (
            <p
              key={message.id}
              className="pop ml-auto max-w-[85%] rounded-3xl rounded-br-md bg-primary px-4 py-3 text-lg leading-snug text-primary-foreground"
            >
              {message.text}
            </p>
          ) : (
            <div
              key={message.id}
              className={`pop max-w-[92%] rounded-3xl rounded-bl-md px-4 py-3 text-lg leading-relaxed ${
                message.urgent ? "border-2 border-danger bg-red-50" : "bg-secondary"
              }`}
            >
              <p>{message.text}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => speak(message.id, message.text)}
                  className="flex items-center gap-1.5 rounded-full bg-background px-3 py-1.5 text-sm font-medium text-primary transition-transform active:scale-95"
                >
                  {speaking === message.id ? (
                    <VolumeX className="size-4" />
                  ) : (
                    <Volume2 className="size-4" />
                  )}
                  {text.listen}
                </button>
                {message.urgent && (
                  <a
                    href="tel:911"
                    className="flex items-center gap-1.5 rounded-full bg-danger px-3 py-1.5 text-sm font-semibold text-white"
                  >
                    <Phone className="size-4" />
                    {text.call911}
                  </a>
                )}
              </div>
            </div>
          ),
        )}
        {busy && (
          <p className="pop flex w-fit items-center gap-2 rounded-3xl rounded-bl-md bg-secondary px-4 py-3 text-muted-foreground">
            <LoaderCircle className="size-4 animate-spin" />
            {text.thinking}
          </p>
        )}
        {failed && (
          <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-red-800">
            {text.failed}
          </p>
        )}
        <div ref={end} />
      </div>

      <div className="fixed inset-x-0 bottom-[4.5rem] z-30 bg-gradient-to-t from-background via-background to-transparent px-4 pb-3 pt-6">
        <div className="mx-auto max-w-xl">
          {suggestions.length > 0 && (
            <div className="mb-2 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion}
                  onClick={() => send(suggestion)}
                  className="rise shrink-0 rounded-full border bg-card px-4 py-2 text-sm font-medium shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary active:scale-95"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              send(draft);
            }}
            className="flex items-center gap-2 rounded-full border bg-card p-1.5 pl-5 shadow-lg focus-within:border-primary"
          >
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={dictation.listening ? text.listening : text.placeholder}
              className="h-11 min-w-0 flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
            />
            {dictation.supported && (
              <button
                type="button"
                onClick={dictation.toggle}
                aria-label={text.listening}
                aria-pressed={dictation.listening}
                className={`relative flex size-11 shrink-0 items-center justify-center rounded-full transition-colors ${
                  dictation.listening ? "bg-danger text-white" : "text-primary hover:bg-secondary"
                }`}
              >
                {dictation.listening && (
                  <span className="pulse-ring absolute inset-0 rounded-full bg-danger/40" />
                )}
                <Mic className="relative size-5" />
              </button>
            )}
            <button
              type="submit"
              disabled={!draft.trim() || busy}
              aria-label={text.send}
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:scale-105 active:scale-90 disabled:opacity-40"
            >
              <ArrowUp className="size-5" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
