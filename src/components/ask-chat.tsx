"use client";

import {
  ArrowLeft,
  ArrowUp,
  AudioLines,
  ImagePlus,
  LoaderCircle,
  MessagesSquare,
  Mic,
  Phone,
  Plus,
  RotateCcw,
  Sprout,
  Trash2,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSession } from "@/components/auth-provider";
import { VoiceChat, type VoiceReply } from "@/components/voice-chat";
import { appCopy } from "@/lib/app-copy";
import { freshChat, useChats, type Chat, type ChatMessage } from "@/lib/chats";
import type { Clock } from "@/lib/clocks";
import { useCopy } from "@/lib/i18n";
import { fileToJpeg, toJpeg } from "@/lib/image";
import { copy, isRtl, speechCode, type Language, type ScanResult } from "@/lib/scan";
import { canRecord, useDictation, useSpeaker, type Clip } from "@/lib/speech";

export type AskRequest = { chatId?: string; voice?: boolean; at: number };

function ChatList({
  chats,
  activeId,
  language,
  text,
  onPick,
  onRemove,
}: {
  chats: Chat[];
  activeId: string;
  language: Language;
  text: { noChats: string; remove: string };
  onPick: (chat: Chat) => void;
  onRemove: (chatId: string) => void;
}) {
  if (!chats.length) {
    return <p className="px-1 py-6 text-center leading-snug text-muted-foreground">{text.noChats}</p>;
  }
  return (
    <ul className="space-y-1.5">
      {chats.map((chat, index) => (
        <li key={chat.id} className="rise group relative" style={{ animationDelay: `${index * 30}ms` }}>
          <button
            onClick={() => onPick(chat)}
            className={`w-full rounded-2xl px-4 py-3 pr-12 text-left transition-all active:scale-[0.98] ${
              chat.id === activeId ? "bg-primary text-primary-foreground shadow-md" : "bg-card ring-1 ring-border hover:ring-primary/40"
            }`}
          >
            <span className="line-clamp-2 font-medium leading-snug">{chat.title}</span>
            <span
              className={`mt-0.5 block text-xs ${chat.id === activeId ? "text-primary-foreground/70" : "text-muted-foreground"}`}
            >
              {chat.label ? `${chat.label.product} · ` : ""}
              {new Date(chat.updatedAt).toLocaleDateString(speechCode(language), { month: "short", day: "numeric" })}
            </span>
          </button>
          <button
            onClick={() => onRemove(chat.id)}
            aria-label={text.remove}
            className={`absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full transition-all hover:bg-black/5 ${
              chat.id === activeId ? "text-primary-foreground/80 hover:bg-white/15" : "text-muted-foreground"
            }`}
          >
            <Trash2 className="size-4" />
          </button>
        </li>
      ))}
    </ul>
  );
}

const emergencyWords =
  /can'?t breathe|cannot breathe|not breathing|hard to breathe|chest pain|passed out|pass out|fainted|seizure|unconscious|throwing up blood|no puedo respirar|no respira|me cuesta respirar|dolor (en el|de) pecho|desmay|convuls|inconsciente/i;

export function AskChat({
  language,
  focus,
  clocks,
  request,
  open,
  onOpen,
  onClose,
}: {
  language: Language;
  focus: ScanResult | null;
  clocks: Clock[];
  request: AskRequest | null;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const text = useCopy(appCopy, language).ask;
  const noVoice = useCopy(copy, language).noVoice;
  const { user } = useSession();
  const { chats, store, remove } = useChats(user?.uid);
  const [current, setCurrent] = useState<Chat>(() => freshChat(focus));
  const [draft, setDraft] = useState("");
  const [photo, setPhoto] = useState("");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [followUps, setFollowUps] = useState<string[]>([]);
  const [listView, setListView] = useState(false);
  const [voice, setVoice] = useState(false);
  const [recordable, setRecordable] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const picker = useRef<HTMLInputElement>(null);
  const live = useRef(current);
  const handled = useRef(0);
  const seenFocus = useRef(focus?.product ?? "");
  const { speaking, loading, missing, speak, say, stop } = useSpeaker(language);
  const dictation = useDictation(language, setDraft);

  useEffect(() => {
    const check = setTimeout(() => setRecordable(canRecord()), 0);
    return () => clearTimeout(check);
  }, []);

  useEffect(() => {
    live.current = current;
  }, [current]);

  useEffect(() => {
    const product = focus?.product ?? "";
    if (!product || product === seenFocus.current) return;
    const start = setTimeout(() => {
      seenFocus.current = product;
      setCurrent(freshChat(focus));
      setFollowUps([]);
      setFailed(false);
      setListView(false);
    }, 0);
    return () => clearTimeout(start);
  }, [focus]);

  useEffect(() => {
    if (!request || handled.current === request.at) return;
    const chat = request.chatId ? chats.find((item) => item.id === request.chatId) : undefined;
    if (request.chatId && !chat) return;
    const start = setTimeout(() => {
      handled.current = request.at;
      if (chat) {
        setCurrent(chat);
        setFollowUps([]);
        setFailed(false);
      }
      setListView(false);
      if (request.voice) setVoice(true);
    }, 0);
    return () => clearTimeout(start);
  }, [request, chats]);

  useEffect(() => {
    if (open) end.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [current.messages.length, busy, open, listView]);

  useEffect(() => {
    if (!open) return;
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [open, onClose]);

  function openChat(chat: Chat) {
    stop();
    setCurrent(chat);
    setFollowUps([]);
    setFailed(false);
    setListView(false);
  }

  function startNew() {
    openChat(freshChat(null));
  }

  function removeChat(chatId: string) {
    remove(chatId);
    if (chatId === current.id) setCurrent(freshChat(null));
  }

  async function attach(file: File) {
    try {
      setPhoto(await fileToJpeg(file));
    } catch {
      setFailed(true);
    }
  }

  async function ask(
    question: string,
    clip?: Clip,
    base: Chat = live.current,
    image = "",
  ): Promise<VoiceReply | null> {
    const trimmed = question.trim() || (image ? text.photoAsk : "");
    if ((!trimmed && !clip) || busy) return null;
    const thumb = image ? await toJpeg(image, 360).catch(() => "") : "";
    const asked: ChatMessage[] = trimmed
      ? [
          ...base.messages,
          { id: `${base.messages.length}-u`, role: "user", text: trimmed, ...(thumb ? { image: thumb } : {}) },
        ]
      : base.messages;
    setCurrent({ ...base, messages: asked });
    setDraft("");
    setPhoto("");
    setBusy(true);
    setFailed(false);
    setFollowUps([]);
    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          audio: clip?.audio,
          image: image ? image.split(",")[1] : undefined,
          messages: asked.slice(-12).map(({ role, text }) => ({ role, text })),
          context: {
            scannedLabel: base.label,
            reentryClocks: clocks.map((clock) => ({
              product: clock.product,
              endsAt: new Date(clock.endsAt).toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
            })),
          },
        }),
      });
      if (!response.ok) throw new Error("ask failed");
      const reply: { answer: string; followUps: string[]; urgent: boolean; heard?: string } = await response.json();
      const heard = reply.heard?.trim() ?? "";
      const spoken: ChatMessage[] = clip && heard ? [{ id: `${asked.length}-u`, role: "user", text: heard }] : [];
      const messages: ChatMessage[] = [
        ...asked,
        ...spoken,
        { id: `${asked.length + spoken.length}-m`, role: "model", text: reply.answer, urgent: reply.urgent },
      ];
      const next = { ...base, messages };
      setCurrent(next);
      store(next);
      setFollowUps(reply.followUps.slice(0, 3));
      navigator.vibrate?.(reply.urgent ? [200, 100, 200] : 15);
      setBusy(false);
      return { heard, answer: reply.answer, urgent: reply.urgent };
    } catch {
      setFailed(true);
      setBusy(false);
      return null;
    }
  }

  function retry() {
    const last = current.messages.at(-1);
    if (last?.role !== "user") return;
    ask(last.text, undefined, { ...current, messages: current.messages.slice(0, -1) });
  }

  const messages = current.messages;
  const suggestions = followUps.length ? followUps : messages.length ? [] : text.starters;

  return (
    <>
      <button
        onClick={onOpen}
        aria-label={text.title}
        className={`fixed bottom-[calc(6.25rem+env(safe-area-inset-bottom))] right-4 z-50 flex items-center gap-2 rounded-full bg-primary p-2 text-primary-foreground sm:pr-5 shadow-[0_18px_40px_-12px_oklch(0.5_0.21_264/0.7)] transition-all duration-500 [transition-timing-function:var(--ease-spring)] hover:-translate-y-1 hover:shadow-[0_24px_48px_-12px_oklch(0.5_0.21_264/0.8)] active:scale-95 lg:bottom-6 lg:right-6 rtl:left-4 rtl:right-auto ${
          open ? "pointer-events-none translate-y-6 scale-75 opacity-0" : ""
        }`}
      >
        <span className="relative flex size-11 items-center justify-center rounded-full bg-poppy text-poppy-foreground">
          <span className="pulse-ring absolute inset-0 rounded-full bg-poppy/50" />
          <Sprout className="relative size-6" />
        </span>
        <span className="hidden font-semibold sm:inline">{text.title}</span>
      </button>

      <section
        lang={language}
        dir={isRtl(language) ? "rtl" : "ltr"}
        aria-label={text.title}
        aria-hidden={!open}
        className={`fixed inset-0 z-[65] flex flex-col overflow-hidden bg-background transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] lg:inset-auto lg:bottom-6 lg:right-6 lg:h-[min(46rem,calc(100svh-3rem))] lg:w-[28rem] lg:rounded-[2rem] lg:shadow-[0_40px_80px_-20px_oklch(0.2_0.05_268/0.45)] lg:ring-1 lg:ring-black/5 rtl:lg:left-6 rtl:lg:right-auto ${
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-8 opacity-0 lg:translate-y-4 lg:scale-95"
        } lg:origin-bottom-right`}
      >
        <header className="flex items-center gap-3 bg-ink px-4 pb-4 pt-[max(1rem,env(safe-area-inset-top))] text-ink-foreground">
          {listView ? (
            <button
              onClick={() => setListView(false)}
              aria-label={text.close}
              className="flex size-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/15 active:scale-90"
            >
              <ArrowLeft className="size-5 rtl:rotate-180" />
            </button>
          ) : (
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-poppy text-poppy-foreground">
              <Sprout className="size-6" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="font-display text-xl font-semibold leading-tight">{listView ? text.chats : text.title}</p>
            {!listView && (
              <p className="truncate text-sm text-ink-foreground/65">
                {current.label ? `${text.about} ${current.label.product}` : text.general}
              </p>
            )}
          </div>
          {!listView && (
            <>
              <button
                onClick={() => setListView(true)}
                aria-label={text.chats}
                className="flex size-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/15 active:scale-90"
              >
                <MessagesSquare className="size-5" />
              </button>
              <button
                onClick={startNew}
                aria-label={text.clear}
                className="flex size-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/15 active:scale-90"
              >
                <Plus className="size-5" />
              </button>
            </>
          )}
          <button
            onClick={onClose}
            aria-label={text.close}
            className="flex size-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/15 active:scale-90"
          >
            <X className="size-5" />
          </button>
        </header>

        {listView ? (
          <div className="flex-1 overflow-y-auto p-4">
            <button
              onClick={startNew}
              className="mb-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary font-semibold text-primary-foreground shadow-lg shadow-primary/25 active:scale-[0.98]"
            >
              <Plus className="size-5" />
              {text.clear}
            </button>
            <ChatList
              chats={chats}
              activeId={current.id}
              language={language}
              text={{ noChats: text.noChats, remove: text.remove }}
              onPick={openChat}
              onRemove={removeChat}
            />
          </div>
        ) : (
          <>
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-5" aria-live="polite">
              {messages.length === 0 && (
                <div className="rise flex flex-col items-center px-4 pt-6 text-center">
                  <span className="relative flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="pulse-ring absolute inset-0 rounded-full bg-primary/15" />
                    <Sprout className="relative size-10" />
                  </span>
                  <p className="mt-4 font-display text-2xl font-semibold">{text.title}</p>
                  <p className="mt-1 text-muted-foreground">{text.general}</p>
                  {recordable && (
                    <button
                      onClick={() => setVoice(true)}
                      className="lift mt-5 flex items-center gap-3 rounded-2xl bg-ink py-3 pl-3 pr-5 text-left text-ink-foreground shadow-lg active:scale-95"
                    >
                      <span className="flex size-10 items-center justify-center rounded-xl bg-poppy text-poppy-foreground">
                        <AudioLines className="size-5" />
                      </span>
                      <span>
                        <span className="block font-semibold">{text.talk}</span>
                        <span className="block text-xs text-ink-foreground/70">{text.talkHint}</span>
                      </span>
                    </button>
                  )}
                </div>
              )}
              {messages.map((message) =>
                message.role === "user" ? (
                  <div key={message.id} className="pop ml-auto flex max-w-[85%] flex-col items-end gap-1.5">
                    {message.image && (
                      <img src={message.image} alt="" className="max-h-52 rounded-2xl object-cover shadow-md ring-1 ring-black/5" />
                    )}
                    <p className="rounded-3xl rounded-br-md bg-primary px-4 py-3 text-lg leading-snug text-primary-foreground">
                      {message.text}
                    </p>
                    {emergencyWords.test(message.text) && (
                      <a
                        href="tel:911"
                        className="pop flex items-center gap-1.5 rounded-full bg-danger px-4 py-2 font-semibold text-white shadow-md"
                      >
                        <Phone className="size-4" />
                        {text.call911}
                      </a>
                    )}
                  </div>
                ) : (
                  <div key={message.id} className="pop flex max-w-[92%] gap-2">
                    <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-poppy/15 text-poppy">
                      <Sprout className="size-4" />
                    </span>
                    <div
                      className={`rounded-3xl rounded-tl-md px-4 py-3 text-lg leading-relaxed ${
                        message.urgent ? "border-2 border-danger bg-red-50" : "bg-card shadow-sm ring-1 ring-border"
                      }`}
                    >
                      <p>{message.text}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          onClick={() => speak(message.id, message.text)}
                          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all active:scale-95 ${
                            speaking === message.id ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"
                          }`}
                        >
                          {speaking === message.id && loading ? (
                            <LoaderCircle className="size-4 animate-spin" />
                          ) : speaking === message.id ? (
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
                  </div>
                ),
              )}
              {busy && (
                <div className="pop flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-full bg-poppy/15 text-poppy">
                    <Sprout className="size-4" />
                  </span>
                  <span className="flex gap-1 rounded-3xl rounded-tl-md bg-card px-4 py-4 shadow-sm ring-1 ring-border">
                    {[0, 1, 2].map((dot) => (
                      <span
                        key={dot}
                        className="size-2 animate-bounce rounded-full bg-primary/60"
                        style={{ animationDelay: `${dot * 140}ms` }}
                      />
                    ))}
                  </span>
                </div>
              )}
              {failed && (
                <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-red-50 px-4 py-3 text-red-800">
                  <p>{text.failed}</p>
                  {messages.at(-1)?.role === "user" && (
                    <button
                      onClick={retry}
                      className="flex items-center gap-1.5 rounded-full bg-red-800 px-3 py-1.5 text-sm font-semibold text-white active:scale-95"
                    >
                      <RotateCcw className="size-4" />
                      {text.retry}
                    </button>
                  )}
                </div>
              )}
              {missing && <p className="text-sm text-muted-foreground">{noVoice}</p>}
              <div ref={end} />
            </div>

            <div className="border-t bg-background px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
              {suggestions.length > 0 && !photo && (
                <div className="mb-2 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={suggestion}
                      onClick={() => ask(suggestion)}
                      className="rise shrink-0 rounded-full border bg-card px-4 py-2 text-sm font-medium shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary active:scale-95"
                      style={{ animationDelay: `${index * 60}ms` }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
              {photo && (
                <div className="pop relative mb-2 w-fit">
                  <img src={photo} alt="" className="h-24 rounded-2xl object-cover shadow-md ring-1 ring-black/5" />
                  <button
                    onClick={() => setPhoto("")}
                    aria-label={text.removePhoto}
                    className="absolute -right-2 -top-2 flex size-7 items-center justify-center rounded-full bg-ink text-ink-foreground shadow"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              )}
              <input
                ref={picker}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (file) attach(file);
                }}
              />
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  ask(draft, undefined, live.current, photo);
                }}
                className="flex items-center gap-1 rounded-[1.6rem] border bg-card p-1.5 shadow-sm focus-within:border-primary focus-within:shadow-md"
              >
                <button
                  type="button"
                  onClick={() => picker.current?.click()}
                  aria-label={text.attach}
                  className="flex size-10 shrink-0 items-center justify-center rounded-full text-primary transition-colors hover:bg-secondary"
                >
                  <ImagePlus className="size-5" />
                </button>
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder={dictation.listening ? text.listening : text.placeholder}
                  className="h-10 min-w-0 flex-1 bg-transparent px-1 text-lg outline-none placeholder:text-muted-foreground"
                />
                {dictation.supported && (
                  <button
                    type="button"
                    onClick={dictation.toggle}
                    aria-label={text.listening}
                    aria-pressed={dictation.listening}
                    className={`relative flex size-10 shrink-0 items-center justify-center rounded-full transition-colors ${
                      dictation.listening ? "bg-danger text-white" : "text-primary hover:bg-secondary"
                    }`}
                  >
                    {dictation.listening && <span className="pulse-ring absolute inset-0 rounded-full bg-danger/40" />}
                    <Mic className="relative size-5" />
                  </button>
                )}
                {draft.trim() || photo ? (
                  <button
                    type="submit"
                    disabled={busy}
                    aria-label={text.send}
                    className="pop flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:scale-105 active:scale-90 disabled:opacity-40"
                  >
                    <ArrowUp className="size-5 rtl:-scale-x-100" />
                  </button>
                ) : (
                  recordable && (
                    <button
                      type="button"
                      onClick={() => setVoice(true)}
                      aria-label={text.talk}
                      className="pop flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-ink-foreground transition-all hover:scale-105 active:scale-90"
                    >
                      <AudioLines className="size-5" />
                    </button>
                  )
                )}
              </form>
            </div>
          </>
        )}
      </section>

      {voice && (
        <VoiceChat text={text} onAsk={(clip) => ask("", clip)} say={say} stop={stop} onClose={() => setVoice(false)} />
      )}
    </>
  );
}
