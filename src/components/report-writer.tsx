"use client";

import { Check, ClipboardPen, Copy, LoaderCircle, Mic, Pencil, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { appCopy } from "@/lib/app-copy";
import { lastScanKey, type LastScan } from "@/lib/exposure";
import { useCopy } from "@/lib/i18n";
import type { Language } from "@/lib/scan";
import { useDictation } from "@/lib/speech";

type Report = { title: string; report: string; summary: string; missing: string[] };

function localNow() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

export function ReportWriter({ language }: { language: Language }) {
  const text = useCopy(appCopy, language).report;
  const [story, setStory] = useState("");
  const [when, setWhen] = useState("");
  const [product, setProduct] = useState("");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [copied, setCopied] = useState(false);
  const dictation = useDictation(language, setStory);

  useEffect(() => {
    const start = setTimeout(() => {
      setWhen(localNow());
      try {
        const saved: LastScan | null = JSON.parse(localStorage.getItem(lastScanKey) ?? "null");
        if (saved?.product) setProduct(saved.product);
      } catch {}
    }, 0);
    return () => clearTimeout(start);
  }, []);

  async function write() {
    setBusy(true);
    setFailed(false);
    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          story,
          product,
          when: when
            ? new Date(when).toLocaleString("en-US", {
                dateStyle: "long",
                timeStyle: "short",
              })
            : "",
        }),
      });
      if (!response.ok) throw new Error("failed");
      setReport(await response.json());
      navigator.vibrate?.(25);
    } catch {
      setFailed(true);
    }
    setBusy(false);
  }

  async function copyReport() {
    if (!report) return;
    try {
      await navigator.clipboard.writeText(`${report.title}\n\n${report.report}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  async function shareReport() {
    if (!report) return;
    const body = `${report.title}\n\n${report.report}`;
    if (navigator.share) {
      navigator.share({ title: report.title, text: body }).catch(() => {});
    } else {
      window.location.href = `mailto:?subject=${encodeURIComponent(report.title)}&body=${encodeURIComponent(body)}`;
    }
  }

  if (report) {
    return (
      <section className="rise pt-6 pb-10">
        <h1 className="font-display text-4xl font-semibold leading-[1.02] text-primary sm:text-5xl">
          {text.title}
        </h1>
        <div className="pop mt-6 rounded-3xl bg-white p-6 text-neutral-900 shadow-xl ring-1 ring-black/5" lang="en">
          <p className="text-sm font-medium text-neutral-500">{text.english}</p>
          <p className="mt-2 font-display text-2xl font-semibold">{report.title}</p>
          <p className="mt-3 whitespace-pre-line text-lg leading-relaxed">{report.report}</p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <button
            onClick={copyReport}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl border bg-card font-semibold transition-all hover:border-primary active:scale-95"
          >
            {copied ? <Check className="size-5 text-primary" /> : <Copy className="size-5" />}
            {copied ? text.copied : text.copy}
          </button>
          <button
            onClick={shareReport}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary font-semibold text-primary-foreground transition-all active:scale-95"
          >
            <Send className="size-5" />
            {text.share}
          </button>
        </div>
        <div className="rise card mt-5 p-5" style={{ animationDelay: "120ms" }}>
          <p className="font-medium text-muted-foreground">{text.yourLanguage}</p>
          <p className="mt-2 text-lg leading-relaxed">{report.summary}</p>
        </div>
        {report.missing.length > 0 && (
          <div className="rise mt-4 rounded-2xl border-2 border-harvest bg-harvest/10 p-5" style={{ animationDelay: "200ms" }}>
            <p className="font-medium">{text.missing}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-lg">
              {report.missing.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        <button
          onClick={() => setReport(null)}
          className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border font-semibold transition-all hover:border-primary active:scale-[0.98]"
        >
          <Pencil className="size-5" />
          {text.edit}
        </button>
      </section>
    );
  }

  return (
    <section className="rise pt-6 pb-10">
      <h1 className="font-display text-4xl font-semibold leading-[1.02] text-primary sm:text-5xl">
        {text.title}
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">{text.intro}</p>

      <div className="mt-6 rounded-3xl border bg-card p-3 shadow-sm focus-within:border-primary">
        <textarea
          value={story}
          onChange={(event) => setStory(event.target.value)}
          placeholder={text.placeholder}
          rows={6}
          className="w-full resize-none bg-transparent p-2 text-lg leading-relaxed outline-none placeholder:text-muted-foreground/70"
        />
        {dictation.supported && (
          <button
            type="button"
            onClick={dictation.toggle}
            aria-pressed={dictation.listening}
            className={`relative mx-auto mt-1 flex size-16 items-center justify-center rounded-full transition-all active:scale-90 ${
              dictation.listening ? "bg-danger text-white" : "bg-primary text-primary-foreground"
            }`}
            aria-label={text.placeholder}
          >
            {dictation.listening && <span className="pulse-ring absolute inset-0 rounded-full bg-danger/40" />}
            <Mic className="relative size-7" />
          </button>
        )}
      </div>

      <label className="mt-5 block">
        <span className="font-medium">{text.when}</span>
        <input
          type="datetime-local"
          value={when}
          onChange={(event) => setWhen(event.target.value)}
          className="mt-2 h-12 w-full rounded-2xl border bg-card px-4 text-lg"
        />
      </label>

      {failed && (
        <p role="alert" className="mt-4 rounded-2xl bg-red-50 p-4 text-red-800">
          {text.failed}
        </p>
      )}

      <button
        onClick={write}
        disabled={busy || !story.trim()}
        className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-40"
      >
        {busy ? <LoaderCircle className="size-5 animate-spin" /> : <ClipboardPen className="size-5" />}
        {busy ? text.writing : text.write}
      </button>
    </section>
  );
}
