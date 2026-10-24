"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/lib/i18n";
import { timeLeft, type Clock } from "@/lib/clocks";
import { copy, type Language } from "@/lib/scan";

function clockTime(date: Date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function sprayedTimestamp(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  if (date.getTime() > Date.now()) date.setDate(date.getDate() - 1);
  return date.getTime();
}

export function ClockStarter({
  language,
  hours,
  onStart,
}: {
  language: Language;
  hours: number;
  onStart: (sprayedAt: number) => void;
}) {
  const text = useCopy(copy, language);
  const [time, setTime] = useState(() => clockTime(new Date()));
  const [started, setStarted] = useState(false);

  if (started) return null;

  return (
    <div className="mt-4 rounded-xl border bg-card p-4">
      <label htmlFor="sprayed-at" className="font-medium">
        {text.sprayedAt}
      </label>
      <div className="mt-2 flex gap-3">
        <input
          id="sprayed-at"
          type="time"
          value={time}
          onChange={(event) => setTime(event.target.value)}
          className="h-12 flex-1 rounded-lg border bg-background px-3 text-lg"
        />
        <Button
          onClick={() => {
            setStarted(true);
            onStart(sprayedTimestamp(time));
          }}
          disabled={!time}
          className="h-12 px-5 text-base"
        >
          {text.startClock}
        </Button>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {hours} {text.hoursUnit}
      </p>
    </div>
  );
}

export function ClockList({
  language,
  clocks,
  now,
  onRemove,
}: {
  language: Language;
  clocks: Clock[];
  now: number;
  onRemove: (id: string) => void;
}) {
  const text = useCopy(copy, language);
  if (clocks.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="text-sm font-medium text-muted-foreground">
        {text.clocksHeading}
      </h2>
      <ul className="mt-3 space-y-3">
        {clocks.map((clock) => {
          const left = timeLeft(clock.endsAt, now);
          return (
            <li
              key={clock.id}
              className={`rounded-xl p-4 ${
                left.done
                  ? "bg-primary text-primary-foreground"
                  : "bg-red-700 text-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium">{clock.product}</p>
                <button
                  onClick={() => onRemove(clock.id)}
                  className="text-sm underline opacity-80"
                >
                  {text.clearClock}
                </button>
              </div>
              <p className="mt-1 font-heading text-3xl font-semibold tabular-nums">
                {left.done
                  ? text.safeNow
                  : `${left.hours} ${text.hoursUnit} ${left.minutes} ${text.minutesUnit} ${text.leftWord}`}
              </p>
              {!left.done && (
                <p className="mt-1 text-sm opacity-90">
                  {text.safeAt}{" "}
                  {new Date(clock.endsAt).toLocaleTimeString(language, {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
