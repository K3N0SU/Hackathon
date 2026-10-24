"use client";

import {
  Bookmark,
  Droplets,
  LayoutGrid,
  MessageCircleQuestion,
  Phone as PhoneIcon,
  ScanLine,
  ShowerHead,
  Volume2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Mark } from "@/components/mark";
import { heatCopy } from "@/lib/heat";
import { samples } from "@/lib/samples";
import { copy } from "@/lib/scan";

const result = samples[0].results.en;
const text = copy.en;
const heat = heatCopy.en;

export function PhoneFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative aspect-[9/19] w-[17rem] shrink-0 rounded-[3rem] bg-[#0c1610] p-2.5 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.85)] ring-1 ring-white/15 sm:w-[18.5rem] ${className}`}
    >
      <div className="relative h-full overflow-hidden rounded-[2.5rem] bg-background text-foreground">
        <div className="absolute left-1/2 top-2.5 z-30 h-6 w-24 -translate-x-1/2 rounded-full bg-[#0c1610]" />
        {children}
      </div>
    </div>
  );
}

function AppBar({ active }: { active: number }) {
  const icons = [ScanLine, MessageCircleQuestion, LayoutGrid, Bookmark];
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t bg-card/95 pb-3 pt-2 backdrop-blur">
      {icons.map((Icon, index) => (
        <span
          key={index}
          className={`flex justify-center ${index === active ? "text-primary" : "text-muted-foreground/60"}`}
        >
          <Icon className="size-5" />
        </span>
      ))}
    </div>
  );
}

function Header() {
  return (
    <div className="flex items-center gap-2 px-5 pt-11 font-heading text-lg font-semibold text-primary">
      <Mark className="size-5" />
      Milpa
    </div>
  );
}

export function useTicker(start: number) {
  const [left, setLeft] = useState(start);
  useEffect(() => {
    const timer = setInterval(
      () => setLeft((value) => (value <= 1 ? start : value - 1)),
      1000,
    );
    return () => clearInterval(timer);
  }, [start]);
  return left;
}

function clock(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function LabelsScreen() {
  const left = useTicker(42128);
  return (
    <>
      <Header />
      <div className="px-5 pb-20 pt-4">
        <div className="screen-in flex gap-3">
          <img
            src={samples[0].image}
            alt=""
            className="h-20 w-16 rounded-md border object-cover object-top"
          />
          <div>
            <span className="inline-block rounded-md bg-amber-200 px-2 py-0.5 text-xs font-semibold text-amber-950">
              {text.signal.caution}
            </span>
            <p className="mt-1 font-heading text-base font-semibold leading-snug">
              {result.product}
            </p>
          </div>
        </div>
        <div
          className="screen-in mt-3 rounded-xl bg-primary p-3.5 text-primary-foreground"
          style={{ "--delay": "0.12s" } as React.CSSProperties}
        >
          <p className="text-[11px] opacity-80">{text.reentry}</p>
          <p className="mt-1 font-heading text-[15px] font-semibold leading-snug">
            {result.reentry}
          </p>
        </div>
        <div
          className="screen-in mt-3 rounded-xl bg-red-700 p-3.5 text-white"
          style={{ "--delay": "0.24s" } as React.CSSProperties}
        >
          <p className="text-xs font-medium opacity-90">North block</p>
          <p className="mt-0.5 font-heading text-2xl font-semibold tabular-nums">
            {clock(left)}
          </p>
        </div>
        <div
          className="screen-in mt-3"
          style={{ "--delay": "0.36s" } as React.CSSProperties}
        >
          <p className="font-heading text-sm font-semibold">{text.gear}</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs leading-snug marker:text-primary">
            {result.gear.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div
          className="screen-in mt-4 flex gap-2"
          style={{ "--delay": "0.48s" } as React.CSSProperties}
        >
          <span className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border text-xs font-medium">
            <Volume2 className="size-4" />
            {text.listen}
          </span>
          <span className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-700 text-xs font-semibold text-white">
            <PhoneIcon className="size-3.5" />
            Poison Control
          </span>
        </div>
      </div>
      <AppBar active={0} />
    </>
  );
}

export function ClockScreen() {
  const left = useTicker(26280);
  return (
    <>
      <Header />
      <div className="px-5 pt-4">
        <p className="screen-in font-display text-3xl font-semibold leading-none">
          Your blocks
        </p>
        <div
          className="screen-in mt-4 rounded-xl bg-red-700 p-4 text-white shadow-lg shadow-red-900/30"
          style={{ "--delay": "0.1s" } as React.CSSProperties}
        >
          <p className="text-sm font-medium">Valley Guard 2EC, north block</p>
          <p className="mt-1 font-heading text-3xl font-semibold tabular-nums">
            {clock(left)}
          </p>
          <p className="mt-1 text-xs opacity-90">{text.safeAt} 4:30 PM</p>
        </div>
        <div
          className="screen-in mt-3 rounded-xl bg-primary p-4 text-primary-foreground"
          style={{ "--delay": "0.22s" } as React.CSSProperties}
        >
          <p className="text-sm font-medium">Rowkill, east block</p>
          <p className="mt-1 font-heading text-2xl font-semibold">
            {text.safeNow}
          </p>
        </div>
        <div
          className="screen-in mt-3 rounded-xl border p-4"
          style={{ "--delay": "0.34s" } as React.CSSProperties}
        >
          <p className="text-sm font-medium">Block 14 sign, west rows</p>
          <p className="mt-1 font-heading text-xl font-semibold tabular-nums text-red-700">
            1 day 6 h left
          </p>
        </div>
      </div>
      <AppBar active={0} />
    </>
  );
}

export function HeatScreen() {
  return (
    <>
      <Header />
      <div className="px-5 pt-4">
        <p className="screen-in font-display text-3xl font-semibold leading-none">
          {heat.title}
        </p>
        <div
          className="screen-in mt-4 grid grid-cols-3 divide-x rounded-xl border bg-card text-center"
          style={{ "--delay": "0.1s" } as React.CSSProperties}
        >
          {[
            { value: "91°", label: heat.now },
            { value: "96°", label: heat.feels },
            { value: "99°", label: "4 PM" },
          ].map((item) => (
            <div key={item.label} className="px-1 py-3">
              <p className="font-display text-3xl font-semibold">
                {item.value}
              </p>
              <p className="text-[10px] text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
        <div
          className="screen-in mt-3 rounded-xl bg-red-700 p-4 text-white"
          style={{ "--delay": "0.22s" } as React.CSSProperties}
        >
          <p className="font-display text-xl font-semibold">
            {heat.levels.high.title}
          </p>
          <p className="mt-1 text-xs leading-snug">{heat.levels.high.body}</p>
        </div>
        <div
          className="screen-in mt-3 flex gap-2 rounded-xl border bg-sky-50 p-3"
          style={{ "--delay": "0.34s" } as React.CSSProperties}
        >
          <Droplets className="size-5 shrink-0 text-sky-700" />
          <p className="text-xs leading-snug">{heat.water}</p>
        </div>
      </div>
      <AppBar active={2} />
    </>
  );
}

export function ExposedScreen() {
  return (
    <>
      <Header />
      <div className="px-5 pt-4">
        <div className="screen-in rounded-xl bg-red-700 p-3.5 text-white">
          <p className="text-xs font-medium leading-snug">
            Trouble breathing or passed out? Call 911 now.
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <span className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-white text-sm font-semibold text-red-800">
              <PhoneIcon className="size-3.5" />
              911
            </span>
            <span className="flex h-9 items-center justify-center rounded-lg border-2 border-white/80 text-xs font-semibold">
              Poison Control
            </span>
          </div>
        </div>
        <div
          className="screen-in mt-3 rounded-xl border bg-card p-3.5"
          style={{ "--delay": "0.12s" } as React.CSSProperties}
        >
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-primary font-display text-base font-semibold text-primary-foreground">
              3
            </span>
            <p className="text-sm font-medium">Rinse for 15 minutes</p>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-secondary">
            <div className="fill-bar h-full w-2/3 rounded-full bg-sky-600" />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="font-display text-2xl font-semibold tabular-nums">
              4:52
            </p>
            <span className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium">
              <ShowerHead className="size-3.5" />
              Keep rinsing
            </span>
          </div>
        </div>
        <div
          className="screen-in mt-3 rounded-xl bg-white p-3.5 text-neutral-950 shadow-lg ring-1 ring-black/5"
          style={{ "--delay": "0.24s" } as React.CSSProperties}
        >
          <p className="font-display text-xl font-semibold">
            Pesticide exposure
          </p>
          <p className="mt-1 text-xs">Product: {result.product}</p>
          <p className="mt-2 rounded-lg bg-amber-100 p-2 text-xs font-semibold">
            I speak Spanish. Please get me an interpreter.
          </p>
        </div>
      </div>
      <AppBar active={2} />
    </>
  );
}

export function SavedScreen() {
  const rows = [
    { sample: samples[0], when: "Today, 6:42 AM" },
    { sample: samples[1], when: "Yesterday, 2:15 PM" },
    { sample: samples[2], when: "Oct 21, 7:05 AM" },
  ];
  return (
    <>
      <Header />
      <div className="px-5 pt-4">
        <p className="screen-in font-display text-3xl font-semibold leading-none">
          Your scans
        </p>
        <ul className="mt-4 space-y-2.5">
          {rows.map((row, index) => {
            const saved = row.sample.results.en;
            return (
              <li
                key={row.sample.id}
                className="screen-in flex items-center gap-3 rounded-xl border bg-card p-2.5"
                style={
                  { "--delay": `${0.1 + index * 0.12}s` } as React.CSSProperties
                }
              >
                <img
                  src={row.sample.image}
                  alt=""
                  className="h-12 w-10 rounded border object-cover object-top"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {saved.product}
                  </span>
                  <span className="block text-[11px] text-muted-foreground">
                    {row.when}
                  </span>
                </span>
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                    saved.signal === "danger"
                      ? "bg-red-700 text-white"
                      : saved.signal === "warning"
                        ? "bg-orange-300 text-orange-950"
                        : "bg-amber-200 text-amber-950"
                  }`}
                >
                  {text.signal[saved.signal]}
                </span>
              </li>
            );
          })}
        </ul>
        <p
          className="screen-in mt-4 text-center text-xs text-muted-foreground"
          style={{ "--delay": "0.5s" } as React.CSSProperties}
        >
          Saved to your account, on any phone
        </p>
      </div>
      <AppBar active={3} />
    </>
  );
}

export function CameraScreen() {
  return (
    <div className="absolute inset-0 bg-[#111]">
      <img
        src={samples[0].image}
        alt=""
        className="absolute inset-0 size-full scale-110 object-cover object-top opacity-80 blur-[1px]"
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-x-6 bottom-28 top-16">
        {[
          "left-0 top-0 border-l-4 border-t-4 rounded-tl-xl",
          "right-0 top-0 border-r-4 border-t-4 rounded-tr-xl",
          "bottom-0 left-0 border-b-4 border-l-4 rounded-bl-xl",
          "bottom-0 right-0 border-b-4 border-r-4 rounded-br-xl",
        ].map((corner) => (
          <span
            key={corner}
            className={`absolute size-8 border-harvest ${corner}`}
          />
        ))}
        <div className="scan-line absolute inset-x-0 h-20" />
      </div>
      <p className="absolute inset-x-0 top-11 text-center">
        <span className="rounded-full bg-black/50 px-3 py-1.5 text-xs text-white backdrop-blur">
          Reading the label...
        </span>
      </p>
      <div className="absolute inset-x-0 bottom-6 flex items-center justify-center">
        <span className="flex size-16 items-center justify-center rounded-full border-4 border-white">
          <span className="size-12 rounded-full bg-white" />
        </span>
      </div>
    </div>
  );
}

export function AskScreen() {
  return (
    <>
      <Header />
      <div className="px-5 pt-4">
        <p className="screen-in font-display text-3xl font-semibold leading-none text-primary">
          Ask Milpa
        </p>
        <p
          className="screen-in mt-1 text-[11px] text-muted-foreground"
          style={{ "--delay": "0.05s" } as React.CSSProperties}
        >
          About Valley Guard 2EC
        </p>
        <p
          className="screen-in ml-auto mt-4 w-fit max-w-[85%] rounded-2xl rounded-br-md bg-primary px-3 py-2 text-xs text-primary-foreground"
          style={{ "--delay": "0.15s" } as React.CSSProperties}
        >
          My gloves ripped. Can I keep working?
        </p>
        <p
          className="screen-in mt-2 max-w-[90%] rounded-2xl rounded-bl-md bg-secondary px-3 py-2 text-xs leading-snug"
          style={{ "--delay": "0.6s" } as React.CSSProperties}
        >
          No. The label says chemical-resistant gloves are required. Stop, wash
          your hands, and ask your supervisor for a new pair. They have to give
          you one.
        </p>
        <div
          className="screen-in mt-3 flex flex-wrap gap-1.5"
          style={{ "--delay": "0.9s" } as React.CSSProperties}
        >
          {["Who pays for gloves?", "Can I eat here?"].map((chip) => (
            <span key={chip} className="rounded-full border bg-card px-2.5 py-1 text-[10px]">
              {chip}
            </span>
          ))}
        </div>
      </div>
      <AppBar active={1} />
    </>
  );
}
