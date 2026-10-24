"use client";

import { ArrowRight, Globe, LoaderCircle, Phone, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { signalStyle } from "@/components/scanner";
import { Mark } from "@/components/mark";
import { loadShare, type SharedScan } from "@/lib/cloud";
import { translateStrings, useCopy } from "@/lib/i18n";
import { copy, isLanguage, isRtl, languages, type Language, type ScanResult } from "@/lib/scan";
import { useSpeaker } from "@/lib/speech";

type Translatable = Pick<ScanResult, "product" | "reentry" | "gear" | "firstAid" | "summary">;

export function SharedScanView({ id }: { id: string }) {
  const [share, setShare] = useState<SharedScan | null>(null);
  const [missing, setMissing] = useState(false);
  const [language, setLanguage] = useState<Language>("en");
  const [shown, setShown] = useState<Translatable | null>(null);
  const [translating, setTranslating] = useState(false);
  const text = useCopy(copy, language);
  const { speaking, speak } = useSpeaker(language);

  useEffect(() => {
    loadShare(id)
      .then((found) => {
        if (!found) return setMissing(true);
        setShare(found);
        const browser = navigator.language.slice(0, 2);
        const saved = localStorage.getItem("furrow-language");
        const choice = saved ?? browser;
        setLanguage(isLanguage(choice) ? choice : found.language);
      })
      .catch(() => setMissing(true));
  }, [id]);

  useEffect(() => {
    if (!share) return;
    const original: Translatable = {
      product: share.result.product,
      reentry: share.result.reentry,
      gear: share.result.gear,
      firstAid: share.result.firstAid,
      summary: share.result.summary,
    };
    if (language === share.language) {
      const now = setTimeout(() => setShown(original), 0);
      return () => clearTimeout(now);
    }
    let active = true;
    const start = setTimeout(() => setTranslating(true), 0);
    translateStrings(original, language)
      .then((value) => active && setShown(value))
      .catch(() => active && setShown(original))
      .finally(() => active && setTranslating(false));
    return () => {
      active = false;
      clearTimeout(start);
    };
  }, [share, language]);

  if (missing) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-background p-6 text-center">
        <Mark className="size-14 text-primary" />
        <p className="max-w-sm text-lg">This link has expired or does not exist.</p>
        <Link href="/" className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">
          Rowen
        </Link>
      </div>
    );
  }

  if (!share || !shown) {
    return (
      <div className="flex flex-1 items-center justify-center bg-background">
        <LoaderCircle className="size-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background" dir={isRtl(language) ? "rtl" : "ltr"} lang={language}>
      <header className="border-b bg-background/90">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3 px-5 py-3">
          <Link href="/" className="flex items-center gap-2 font-display text-2xl font-semibold text-primary">
            <Mark className="size-7" />
            Rowen
          </Link>
          <label className="flex h-10 items-center gap-2 rounded-full border bg-card px-3 text-sm font-semibold shadow-sm">
            <Globe className="size-4 text-primary" />
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value as Language)}
              className="bg-transparent outline-none"
            >
              {languages.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>
      <main className={`mx-auto max-w-xl px-5 pb-16 pt-6 transition-opacity ${translating ? "opacity-50" : ""}`}>
        <div className="rise flex gap-4">
          <img src={share.thumb} alt="" className="h-28 w-24 shrink-0 rounded-xl border object-cover object-top" />
          <div>
            <span className={`inline-block rounded-md px-2.5 py-1 text-sm font-semibold ${signalStyle[share.result.signal]}`}>
              {text.signal[share.result.signal]}
            </span>
            <h1 className="mt-2 font-heading text-2xl font-semibold leading-snug">{shown.product}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {new Date(share.createdAt).toLocaleString(language, { dateStyle: "medium", timeStyle: "short" })}
            </p>
          </div>
        </div>
        <div className="rise mt-6 rounded-3xl bg-primary p-5 text-primary-foreground shadow-lg" style={{ animationDelay: "80ms" }}>
          <p className="text-sm opacity-80">{text.reentry}</p>
          <p className="mt-1.5 font-heading text-2xl font-semibold leading-snug">{shown.reentry}</p>
        </div>
        {shown.gear.length > 0 && (
          <div className="rise mt-6" style={{ animationDelay: "160ms" }}>
            <h2 className="font-heading text-xl font-semibold">{text.gear}</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-lg leading-snug marker:text-primary">
              {shown.gear.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        {shown.firstAid.length > 0 && (
          <div className="rise mt-6" style={{ animationDelay: "240ms" }}>
            <h2 className="font-heading text-xl font-semibold">{text.firstAid}</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-lg leading-snug marker:text-primary">
              {shown.firstAid.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        <p className="rise mt-6 text-lg leading-relaxed" style={{ animationDelay: "320ms" }}>
          {shown.summary}
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3">
          <button
            onClick={() => speak("share", [shown.product, shown.reentry, ...shown.gear, shown.summary].join(". "))}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl border bg-card font-semibold active:scale-95"
          >
            {speaking ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
            {speaking ? text.stop : text.listen}
          </button>
          <a
            href="tel:18002221222"
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-danger px-2 text-center text-sm font-semibold leading-tight text-white active:scale-95"
          >
            <Phone className="size-4 shrink-0" />
            {text.callPoison}
          </a>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">{text.disclaimer}</p>
        <Link
          href="/sign-up"
          className="group mt-8 flex h-14 items-center justify-center gap-2 rounded-2xl bg-primary text-lg font-semibold text-primary-foreground shadow-lg"
        >
          Rowen
          <ArrowRight className="size-5 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
        </Link>
      </main>
    </div>
  );
}
