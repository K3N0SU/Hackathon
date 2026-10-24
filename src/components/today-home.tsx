"use client";

import {
  ArrowRight,
  AudioLines,
  ChevronRight,
  MessageCircle,
  ScanLine,
  Sun,
  ShieldAlert,
  ShieldCheck,
  TimerReset,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "@/components/auth-provider";
import { PixelFarm } from "@/components/pixel-farm";
import { appCopy } from "@/lib/app-copy";
import { useChats } from "@/lib/chats";
import { timeLeft, type Clock } from "@/lib/clocks";
import { fetchHeat, manteca, type Heat } from "@/lib/heat";
import { useCopy } from "@/lib/i18n";
import { currentPosition } from "@/lib/image";
import { speechCode, type Language, type ScanResult } from "@/lib/scan";

export type QuickTool = { id: string; icon: LucideIcon; tone: string; title: string; body: string };

function greeting(hour: number, text: { morning: string; afternoon: string; evening: string }) {
  if (hour < 12) return text.morning;
  if (hour < 18) return text.afternoon;
  return text.evening;
}

const heatTone = {
  normal: "bg-leaf/15 text-leaf",
  shade: "bg-harvest/30 text-harvest-foreground",
  high: "bg-danger text-white",
};

function ClockRing({ clock, now, done }: { clock: Clock; now: number; done: boolean }) {
  const sprayedAt = Number(clock.id.split("-")[0]);
  const span = clock.endsAt - sprayedAt;
  const progress = done || !(span > 0) ? 1 : Math.min(1, Math.max(0, (now - sprayedAt) / span));
  const length = 2 * Math.PI * 16;
  return (
    <svg viewBox="0 0 40 40" className="size-10 shrink-0 -rotate-90" aria-hidden="true">
      <circle cx="20" cy="20" r="16" fill="none" strokeWidth="4" className={done ? "stroke-leaf/25" : "stroke-white/25"} />
      <circle
        cx="20"
        cy="20"
        r="16"
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={length}
        strokeDashoffset={length * (1 - progress)}
        className={done ? "stroke-leaf" : "stroke-white"}
      />
    </svg>
  );
}

export function TodayHome({
  language,
  clocks,
  now,
  lastScan,
  tools,
  onScan,
  onTalk,
  onAsk,
  onOpenChat,
  onTool,
  onAllTools,
}: {
  language: Language;
  clocks: Clock[];
  now: number;
  lastScan: ScanResult | null;
  tools: QuickTool[];
  onScan: () => void;
  onTalk: () => void;
  onAsk: (result: ScanResult) => void;
  onOpenChat: (chatId: string) => void;
  onTool: (id: string) => void;
  onAllTools: () => void;
}) {
  const text = useCopy(appCopy, language).home;
  const { user } = useSession();
  const { chats } = useChats(user?.uid);
  const [heat, setHeat] = useState<Heat | null>(null);
  const [hour, setHour] = useState(9);

  useEffect(() => {
    let active = true;
    const start = setTimeout(() => setHour(new Date().getHours()), 0);
    async function load() {
      let place = manteca;
      try {
        const permission = await navigator.permissions?.query({ name: "geolocation" });
        if (permission?.state === "granted") place = (await currentPosition()) ?? manteca;
      } catch {}
      const next = await fetchHeat(place.latitude, place.longitude);
      if (active) setHeat(next);
    }
    load().catch(() => {});
    return () => {
      active = false;
      clearTimeout(start);
    };
  }, []);

  const name = user?.displayName?.split(" ")[0] ?? "";
  const date = new Date(now).toLocaleDateString(speechCode(language), {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const closed = clocks.filter((clock) => !timeLeft(clock.endsAt, now).done).length;
  const risky = closed > 0 || heat?.level === "high";
  const RiskIcon = risky ? ShieldAlert : ShieldCheck;

  return (
    <section className="rise space-y-5 pt-5 pb-10 lg:pt-8">
      {now > 0 && (
        <div
          role="status"
          className={`flex items-start gap-3 rounded-2xl p-4 ${
            risky ? "bg-danger text-white" : heat?.level === "shade" ? "bg-harvest text-harvest-foreground" : "bg-leaf/15 text-ink"
          }`}
        >
          <RiskIcon className={`mt-0.5 size-6 shrink-0 ${risky ? "" : heat?.level === "shade" ? "" : "text-leaf"}`} />
          <p className="leading-snug">
            <span className="block font-semibold">{text.risk}</span>
            {closed === 0 ? text.allClear : closed === 1 ? text.closedOne : text.closedMany.replace("{n}", String(closed))}{" "}
            {heat && text.advice[heat.level]}
          </p>
        </div>
      )}
      <div className="relative overflow-hidden rounded-[2rem] bg-[#f6f0e0] shadow-[var(--shadow-card)] ring-1 ring-black/5">
        <div className="absolute inset-x-0 bottom-0 h-[58%] sm:h-[62%]">
          <PixelFarm />
        </div>
        <div className="relative flex min-h-[25rem] flex-col justify-between gap-6 p-6 sm:min-h-[22rem] sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="h-5 text-sm font-semibold capitalize text-ink/60">{now ? date : ""}</p>
              <h1 className="mt-1 font-display text-4xl font-semibold leading-[1] text-ink sm:text-5xl">
                {greeting(hour, text)}
                {name && <span className="text-poppy">, {name}</span>}
              </h1>
              <p className="mt-2 font-display text-xl italic text-ink/70">{text.tagline}</p>
            </div>
            {heat && (
              <div className="pop shrink-0 rounded-2xl bg-white/90 px-3 py-2 text-right shadow-lg ring-1 ring-black/5 sm:rounded-3xl sm:px-4 sm:py-3">
                <p className="flex items-center justify-end gap-1 text-xs font-semibold text-ink/60">
                  <Sun className="size-3.5 text-poppy" />
                  <span className="hidden sm:inline">{text.heat}</span>
                </p>
                <p className="font-display text-3xl font-semibold tabular-nums leading-none text-ink sm:text-4xl">
                  {Math.round(heat.now)}°
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={onScan}
              className="lift group flex h-14 items-center gap-3 rounded-2xl bg-primary pl-3 pr-5 text-lg font-semibold text-primary-foreground shadow-xl shadow-primary/30 active:scale-95"
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-white/15">
                <ScanLine className="size-5" />
              </span>
              {text.scan}
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </button>
            <button
              onClick={onTalk}
              className="lift flex h-14 items-center gap-3 rounded-2xl bg-ink pl-3 pr-5 text-lg font-semibold text-ink-foreground shadow-xl shadow-ink/25 active:scale-95"
            >
              <span className="relative flex size-9 items-center justify-center rounded-xl bg-poppy text-poppy-foreground">
                <span className="pulse-ring absolute inset-0 rounded-xl bg-poppy/50" />
                <AudioLines className="relative size-5" />
              </span>
              {text.talk}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr]">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
              <TimerReset className="size-5 text-danger" />
              {text.clocks}
            </h2>
          </div>
          {clocks.length === 0 ? (
            <p className="mt-3 text-muted-foreground">{text.noClocks}</p>
          ) : (
            <ul className="mt-4 space-y-2.5">
              {clocks.map((clock) => {
                const left = timeLeft(clock.endsAt, now);
                return (
                  <li
                    key={clock.id}
                    className={`flex items-center justify-between gap-3 rounded-2xl p-4 ${
                      left.done ? "bg-leaf/15" : "bg-danger text-white"
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <ClockRing clock={clock} now={now} done={left.done} />
                      <span className="min-w-0">
                      <span className="block truncate font-semibold">{clock.product}</span>
                      <span className={`text-sm ${left.done ? "text-leaf" : "text-white/80"}`}>
                        {new Date(clock.endsAt).toLocaleTimeString(speechCode(language), {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                      </span>
                    </span>
                    <span className={`shrink-0 font-display font-semibold tabular-nums ${left.done ? "text-xl text-leaf" : "text-3xl"}`}>
                      {left.done ? text.safeNow : `${left.hours}:${String(left.minutes).padStart(2, "0")}`}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="card p-5">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
            <Sun className="size-5 text-poppy" />
            {text.heat}
          </h2>
          {heat ? (
            <div className="mt-4">
              <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${heatTone[heat.level]}`}>
                {text.levels[heat.level]}
              </span>
              <dl className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-secondary p-3">
                  <dt className="text-sm text-muted-foreground">{text.feels}</dt>
                  <dd className="font-display text-3xl font-semibold tabular-nums">{Math.round(heat.feels)}°</dd>
                </div>
                <div className="rounded-2xl bg-secondary p-3">
                  <dt className="text-sm text-muted-foreground">{text.high}</dt>
                  <dd className="font-display text-3xl font-semibold tabular-nums">
                    {Math.round(heat.high)}°
                    <span className="ml-1 text-sm font-medium text-muted-foreground">
                      {new Date(2000, 0, 1, heat.highHour).toLocaleTimeString(speechCode(language), { hour: "numeric" })}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          ) : (
            <div className="mt-4 h-28 animate-pulse rounded-2xl bg-secondary" />
          )}
        </div>
      </div>

      {lastScan && (
        <button
          onClick={() => onAsk(lastScan)}
          className="lift group card flex w-full items-center gap-4 p-5 text-left"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-harvest text-harvest-foreground">
            <ScanLine className="size-6" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm text-muted-foreground">{text.last}</span>
            <span className="block truncate font-display text-xl font-semibold">{lastScan.product}</span>
            <span className="block truncate text-sm text-muted-foreground">{lastScan.reentry}</span>
          </span>
          <span className="hidden shrink-0 items-center gap-1 font-semibold text-primary sm:flex">
            {text.askAbout}
            <ChevronRight className="size-5 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
          </span>
        </button>
      )}

      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold">{text.aiTools}</h2>
          <button onClick={onAllTools} className="flex items-center gap-1 font-semibold text-primary hover:underline">
            {text.seeAll}
            <ChevronRight className="size-4 rtl:rotate-180" />
          </button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => onTool(tool.id)}
                className="rise group card flex min-h-36 flex-col justify-between gap-3 p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] active:scale-[0.97]"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span
                  className={`flex size-11 items-center justify-center rounded-2xl transition-transform duration-500 [transition-timing-function:var(--ease-spring)] group-hover:-rotate-6 group-hover:scale-110 ${tool.tone}`}
                >
                  <Icon className="size-5" />
                </span>
                <span>
                  <span className="block font-display text-lg font-semibold leading-tight">{tool.title}</span>
                  <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">{tool.body}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="card p-5">
        <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
          <MessageCircle className="size-5 text-primary" />
          {text.recent}
        </h2>
        {chats.length === 0 ? (
          <p className="mt-3 text-muted-foreground">{text.noRecent}</p>
        ) : (
          <ul className="mt-3 divide-y">
            {chats.slice(0, 4).map((chat) => (
              <li key={chat.id}>
                <button
                  onClick={() => onOpenChat(chat.id)}
                  className="group flex w-full items-center justify-between gap-3 py-3 text-left"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium group-hover:text-primary">{chat.title}</span>
                    <span className="block text-xs text-muted-foreground">
                      {chat.label ? `${chat.label.product} · ` : ""}
                      {chat.messages.length}
                    </span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 rtl:rotate-180" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
