"use client";

import { Phone, ShowerHead, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { exposureCopy, lastScanKey, type LastScan } from "@/lib/exposure";
import { copy, type Language } from "@/lib/scan";

const rinseLength = 15 * 60 * 1000;

function clockTime(date: Date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function englishTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleString("en-US", {
    weekday: "long",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ExposureHelp({ language }: { language: Language }) {
  const text = exposureCopy[language];
  const [product, setProduct] = useState("");
  const [fromScan, setFromScan] = useState(false);
  const [time, setTime] = useState("");
  const [rinseEnds, setRinseEnds] = useState(0);
  const [now, setNow] = useState(0);
  const [card, setCard] = useState(false);

  useEffect(() => {
    const start = setTimeout(() => {
      setTime(clockTime(new Date()));
      try {
        const saved: LastScan | null = JSON.parse(
          localStorage.getItem(lastScanKey) ?? "null",
        );
        if (saved?.product) {
          setProduct(saved.product);
          setFromScan(true);
        }
      } catch {}
    }, 0);
    return () => clearTimeout(start);
  }, []);

  useEffect(() => {
    if (!rinseEnds) return;
    const timer = setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= rinseEnds) {
        clearInterval(timer);
        navigator.vibrate?.([300, 150, 300]);
      }
    }, 250);
    return () => clearInterval(timer);
  }, [rinseEnds]);

  const left = rinseEnds ? Math.max(0, rinseEnds - now) : rinseLength;
  const rinsing = rinseEnds > 0 && left > 0;
  const rinsed = rinseEnds > 0 && left === 0;
  const progress = 1 - left / rinseLength;
  const minutes = Math.floor(left / 60000);
  const seconds = Math.floor((left % 60000) / 1000);

  return (
    <section className="rise mt-8">
      <h1 className="font-display text-4xl font-semibold leading-[1.02] sm:text-5xl">
        {text.title}
      </h1>

      <div className="mt-5 rounded-2xl bg-red-700 p-5 text-white">
        <p className="text-lg font-medium leading-snug">{text.emergency}</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <a
            href="tel:911"
            className="flex h-12 items-center justify-center gap-2 rounded-lg bg-white text-base font-semibold text-red-800"
          >
            <Phone className="size-5" />
            911
          </a>
          <a
            href="tel:18002221222"
            className="flex h-12 items-center justify-center rounded-lg border-2 border-white/80 px-2 text-center text-sm font-semibold leading-tight"
          >
            {copy[language].callPoison}
          </a>
        </div>
      </div>

      <ol className="mt-6 space-y-3">
        {text.steps.map((step, index) => (
          <li
            key={step}
            className="rise flex gap-4 rounded-2xl border bg-card p-4"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary font-display text-xl font-semibold text-primary-foreground">
              {index + 1}
            </span>
            <div className="flex-1">
              <p className="text-lg leading-snug">{step}</p>
              {index === 2 && (
                <div className="mt-4">
                  <div className="h-3 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-sky-600 transition-[width] duration-300"
                      style={{ width: `${progress * 100}%` }}
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p
                      className="font-display text-4xl font-semibold tabular-nums"
                      aria-live="polite"
                    >
                      {rinsed
                        ? text.rinseDone
                        : `${minutes}:${String(seconds).padStart(2, "0")}`}
                    </p>
                    <Button
                      onClick={() => {
                        const current = Date.now();
                        setNow(current);
                        setRinseEnds(current + rinseLength);
                        navigator.vibrate?.(30);
                      }}
                      variant={rinsing ? "outline" : "default"}
                      className="h-11 gap-2"
                    >
                      <ShowerHead className="size-4" />
                      {rinsing
                        ? text.rinseKeep
                        : rinsed
                          ? text.rinseAgain
                          : text.rinseStart}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 space-y-4 rounded-2xl border bg-card p-5">
        <label className="block">
          <span className="font-medium">{text.productLabel}</span>
          <input
            value={product}
            onChange={(event) => {
              setProduct(event.target.value);
              setFromScan(false);
            }}
            className="mt-2 h-12 w-full rounded-lg border bg-background px-3 text-lg"
          />
          {fromScan && (
            <span className="mt-1 block text-sm text-muted-foreground">
              {text.productHint}
            </span>
          )}
        </label>
        <label className="block">
          <span className="font-medium">{text.timeLabel}</span>
          <input
            type="time"
            value={time}
            onChange={(event) => setTime(event.target.value)}
            className="mt-2 h-12 w-full rounded-lg border bg-background px-3 text-lg"
          />
        </label>
        <Button onClick={() => setCard(true)} className="h-12 w-full text-base">
          {text.showCard}
        </Button>
      </div>

      {card && (
        <div
          role="dialog"
          aria-modal="true"
          lang="en"
          className="fixed inset-0 z-50 overflow-y-auto bg-white p-6 text-neutral-950"
        >
          <div className="pop mx-auto max-w-xl">
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => setCard(false)}
                className="h-11 gap-2"
              >
                <X className="size-5" />
                {text.close}
              </Button>
            </div>
            <p className="mt-6 font-display text-6xl font-semibold leading-[0.9]">
              Pesticide exposure
            </p>
            <p className="mt-6 text-2xl leading-snug">
              I was exposed to a pesticide at work
              {time ? ` on ${englishTime(time)}` : ""}.
            </p>
            <dl className="mt-6 space-y-4 text-2xl">
              <div>
                <dt className="text-base text-neutral-500">Product</dt>
                <dd className="font-semibold">{product || "Unknown"}</dd>
              </div>
              <div>
                <dt className="text-base text-neutral-500">Poison Control</dt>
                <dd className="font-semibold">1-800-222-1222</dd>
              </div>
            </dl>
            {text.interpreter && (
              <p className="mt-8 rounded-2xl bg-amber-100 p-5 text-2xl font-semibold leading-snug">
                {text.interpreter}
              </p>
            )}
            <p className="mt-8 text-lg text-neutral-500">
              Please check the product label or safety data sheet for treatment
              details. My employer can provide it.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
