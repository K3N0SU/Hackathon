"use client";

import { BellRing, Droplets, MapPin, Phone, RefreshCw, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { askNotifications, notify } from "@/lib/alarms";
import { appCopy } from "@/lib/app-copy";
import { Button } from "@/components/ui/button";
import { fetchHeat, heatCopy, manteca, type Heat } from "@/lib/heat";
import { useCopy } from "@/lib/i18n";
import type { Language } from "@/lib/scan";

type State =
  | { step: "idle" }
  | { step: "checking" }
  | { step: "done"; heat: Heat; approximate: boolean }
  | { step: "failed" };

const levelStyle = {
  normal: "bg-primary text-primary-foreground",
  shade: "bg-amber-300 text-amber-950",
  high: "bg-red-700 text-white",
};

function position(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("no geolocation"));
    navigator.geolocation.getCurrentPosition(
      (result) => resolve(result.coords),
      reject,
      { timeout: 8000, maximumAge: 600000 },
    );
  });
}

function hourLabel(hour: number, language: Language) {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  return date.toLocaleTimeString(language, { hour: "numeric" });
}

export function HeatCheck({ language }: { language: Language }) {
  const text = useCopy(heatCopy, language);
  const [state, setState] = useState<State>({ step: "idle" });
  const alarms = useCopy(appCopy, language).alarms;
  const [water, setWater] = useState(false);

  useEffect(() => {
    if (!water) return;
    const timer = setInterval(
      () => notify(alarms.waterTitle, alarms.waterBody, "water"),
      3600000,
    );
    return () => clearInterval(timer);
  }, [water, alarms.waterTitle, alarms.waterBody]);

  async function check() {
    setState({ step: "checking" });
    let place = manteca;
    let approximate = true;
    try {
      place = await position();
      approximate = false;
    } catch {}
    try {
      const heat = await fetchHeat(place.latitude, place.longitude);
      setState({ step: "done", heat, approximate });
      navigator.vibrate?.(20);
    } catch {
      setState({ step: "failed" });
    }
  }

  return (
    <section className="rise mt-8">
      <h1 className="font-display text-4xl font-semibold leading-[1.02] sm:text-5xl">
        {text.title}
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
        {text.intro}
      </p>

      {state.step !== "done" && (
        <Button
          onClick={check}
          disabled={state.step === "checking"}
          className="mt-6 h-14 w-full gap-2 text-base"
        >
          {state.step === "checking" ? (
            <RefreshCw className="size-5 animate-spin" />
          ) : (
            <Sun className="size-5" />
          )}
          {state.step === "checking" ? text.checking : text.check}
        </Button>
      )}

      {state.step === "failed" && (
        <p role="alert" className="mt-4 text-lg">
          {text.failed}
        </p>
      )}

      {state.step === "done" && (
        <div className="mt-6 space-y-4">
          <div className="rise grid grid-cols-3 divide-x rounded-2xl border bg-card text-center">
            {[
              { label: text.now, value: state.heat.now },
              { label: text.feels, value: state.heat.feels },
              {
                label: `${text.high}, ${hourLabel(state.heat.highHour, language)}`,
                value: state.heat.high,
              },
            ].map((item) => (
              <div key={item.label} className="px-2 py-4">
                <p className="font-display text-4xl font-semibold tabular-nums">
                  {item.value}°
                </p>
                <p className="mt-1 text-xs leading-tight text-muted-foreground">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
          {state.approximate && (
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4" />
              {text.nearManteca}
            </p>
          )}
          <div
            className={`rise rounded-2xl p-5 ${levelStyle[state.heat.level]}`}
            style={{ animationDelay: "80ms" }}
          >
            <p className="font-display text-3xl font-semibold">
              {text.levels[state.heat.level].title}
            </p>
            <p className="mt-2 text-lg leading-snug">
              {text.levels[state.heat.level].body}
            </p>
          </div>
          <div
            className="rise flex gap-3 rounded-2xl border bg-card p-5"
            style={{ animationDelay: "160ms" }}
          >
            <Droplets className="mt-0.5 size-6 shrink-0 text-sky-700" />
            <div className="flex-1">
              <p className="text-lg leading-snug">{text.water}</p>
              {state.heat.level !== "normal" && (
                <button
                  onClick={async () => {
                    await askNotifications();
                    setWater(true);
                    navigator.vibrate?.(20);
                  }}
                  disabled={water}
                  className="mt-3 flex items-center gap-2 rounded-full bg-sky-700 px-4 py-2 text-sm font-semibold text-white transition-all active:scale-95 disabled:bg-sky-700/15 disabled:text-sky-800"
                >
                  <BellRing className="size-4" />
                  {water ? alarms.waterOff : alarms.waterOn}
                </button>
              )}
            </div>
          </div>
          <div
            className="rise rounded-2xl border bg-card p-5"
            style={{ animationDelay: "240ms" }}
          >
            <p className="font-medium">{text.signsTitle}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-lg leading-snug marker:text-red-700">
              {text.signs.map((sign) => (
                <li key={sign}>{sign}</li>
              ))}
            </ul>
            <a
              href="tel:911"
              className="mt-4 flex h-12 items-center justify-center gap-2 rounded-lg bg-red-700 text-base font-semibold text-white"
            >
              <Phone className="size-5" />
              {text.call911}
            </a>
          </div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">{text.rules}</p>
            <Button variant="outline" onClick={check} className="h-10 gap-2">
              <RefreshCw className="size-4" />
              {text.again}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
