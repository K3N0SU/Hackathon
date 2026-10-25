"use client";

import { MessageCircleQuestion, ScanLine, Shirt, TimerReset } from "lucide-react";
import { Tilt } from "@/components/motion";
import { useTicker } from "@/components/phone-screens";
import { samples } from "@/lib/samples";

const result = samples[0].results.en;

function clock(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function step(delay: string) {
  return { "--delay": delay, "--from-x": "-24px", "--from-y": "0px" } as React.CSSProperties;
}

export function LabelReader() {
  const left = useTicker(41920);

  return (
    <Tilt max={5} perspective={1400} className="mx-auto w-full max-w-[34rem]">
      <div className="grid grid-cols-[0.85fr_1fr] items-center gap-4 sm:gap-6">
        <div className="label-shake relative overflow-hidden rounded-xl bg-[#fbf8ef] shadow-[0_30px_60px_-24px_oklch(0.25_0.04_150/0.5)] ring-1 ring-black/10">
          <img
            src={samples[0].image}
            alt="Valley Guard 2EC pesticide label"
            className="block w-full"
          />
          <div className="label-scan absolute inset-x-0 h-16 -translate-y-full bg-gradient-to-b from-transparent via-harvest/40 to-harvest" />
          <div className="absolute inset-x-[7%] top-[50.5%] h-[7.5%] rounded-sm bg-harvest/35 mix-blend-multiply" />
          <div className="absolute inset-x-[7%] top-[83%] h-[7%] rounded-sm bg-harvest/35 mix-blend-multiply" />
        </div>

        <div className="card relative p-4 sm:p-5">
          <span
            className="callout inline-flex items-center gap-1.5 rounded-full bg-harvest px-3 py-1 text-sm font-semibold text-harvest-foreground"
            style={step("0s")}
          >
            <ScanLine className="size-4" />
            Caution
          </span>
          <div className="callout mt-4" style={step("0.2s")}>
            <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground sm:text-sm">
              <TimerReset className="size-4 shrink-0 text-primary" />
              Safe to go back in
            </p>
            <p className="mt-1 whitespace-nowrap font-display text-[clamp(2rem,3.6vw,3rem)] font-semibold leading-none text-primary">
              12 hours
            </p>
            <p className="mt-2 inline-block rounded-lg bg-danger px-2.5 py-1 font-heading text-base font-semibold tabular-nums text-white sm:text-lg">
              {clock(left)}
            </p>
          </div>
          <div className="callout mt-4 border-t pt-3" style={step("0.4s")}>
            <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground sm:text-sm">
              <Shirt className="size-4 shrink-0 text-primary" />
              What to wear
            </p>
            <ul className="mt-1.5 space-y-1 text-sm leading-snug text-ink">
              {result.gear.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div
        className="callout mx-auto mt-5 flex w-fit items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg"
        style={step("0.6s")}
      >
        <MessageCircleQuestion className="size-4 shrink-0" />
        Can I eat lunch between the rows?
      </div>
    </Tilt>
  );
}
