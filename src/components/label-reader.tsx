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

function vars(delay: string, fromX: string, fromY: string) {
  return {
    "--delay": delay,
    "--from-x": fromX,
    "--from-y": fromY,
  } as React.CSSProperties;
}

export function LabelReader() {
  const left = useTicker(41920);

  return (
    <Tilt max={6} perspective={1400} className="relative mx-auto w-full max-w-[34rem]">
      <div className="relative aspect-[10/9]">
        <div className="label-shake absolute left-0 top-[6%] w-[58%] rotate-[-3deg] overflow-hidden rounded-xl bg-[#fbf8ef] shadow-[0_30px_60px_-24px_oklch(0.25_0.04_150/0.5)] ring-1 ring-black/10">
          <img
            src={samples[0].image}
            alt="Valley Guard 2EC pesticide label"
            className="block w-full"
          />
          <div className="label-scan absolute inset-x-0 h-20 -translate-y-full bg-gradient-to-b from-transparent via-harvest/40 to-harvest" />
          <div className="absolute inset-x-[7%] top-[50.5%] h-[7.5%] rounded-sm bg-harvest/35 mix-blend-multiply" />
          <div className="absolute inset-x-[7%] top-[83%] h-[7%] rounded-sm bg-harvest/35 mix-blend-multiply" />
        </div>

        <div
          className="callout absolute right-[2%] top-[2%] flex items-center gap-2 rounded-full bg-harvest px-4 py-2 font-semibold text-harvest-foreground shadow-lg"
          style={vars("0s", "-120px", "90px")}
        >
          <ScanLine className="size-5" />
          Caution
        </div>

        <div
          className="callout card absolute right-0 top-[17%] w-[52%] p-5"
          style={vars("0.25s", "-140px", "40px")}
        >
          <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <TimerReset className="size-4 text-primary" />
            When you can go back in
          </p>
          <p className="mt-2 font-display text-5xl font-semibold leading-none text-primary">
            12 hours
          </p>
          <p className="mt-3 inline-block rounded-lg bg-danger px-3 py-1.5 font-heading text-xl font-semibold tabular-nums text-white">
            {clock(left)}
          </p>
        </div>

        <div
          className="callout card absolute right-[4%] top-[56%] w-[50%] p-4"
          style={vars("0.5s", "-60px", "-80px")}
        >
          <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Shirt className="size-4 text-primary" />
            What to wear
          </p>
          <ul className="mt-2 space-y-1 text-[15px] leading-snug">
            {result.gear.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="callout absolute bottom-[2%] left-[6%] flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xl"
          style={vars("0.75s", "40px", "-60px")}
        >
          <MessageCircleQuestion className="size-4" />
          Can I eat lunch between the rows?
        </div>
      </div>
    </Tilt>
  );
}
