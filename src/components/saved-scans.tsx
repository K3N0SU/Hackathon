"use client";

import { ChevronDown, LoaderCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { deleteScan, listScans, type SavedScan } from "@/lib/cloud";
import { useCopy } from "@/lib/i18n";
import { savedCopy } from "@/lib/saved-copy";
import { copy, type Language, type Signal } from "@/lib/scan";

const signalStyle: Record<Signal, string> = {
  caution: "bg-amber-200 text-amber-950",
  warning: "bg-orange-300 text-orange-950",
  danger: "bg-red-700 text-white",
  unknown: "bg-secondary text-secondary-foreground",
};

export function SavedScans({ language }: { language: Language }) {
  const text = useCopy(savedCopy, language);
  const labels = useCopy(copy, language);
  const [scans, setScans] = useState<SavedScan[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [open, setOpen] = useState("");

  useEffect(() => {
    let active = true;
    listScans()
      .then((items) => {
        if (active) setScans(items);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, []);

  async function remove(id: string) {
    setScans((current) => current?.filter((scan) => scan.id !== id) ?? null);
    await deleteScan(id).catch(() => {});
  }

  return (
    <section className="rise mt-8">
      <h1 className="font-display text-4xl font-semibold leading-[1.02] sm:text-5xl">
        {text.title}
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">{text.intro}</p>

      {failed && (
        <p role="alert" className="mt-8 rounded-2xl bg-red-50 p-4 text-red-800">
          {text.failed}
        </p>
      )}
      {!failed && !scans && (
        <div className="mt-12 flex justify-center">
          <LoaderCircle className="size-8 animate-spin text-primary" />
        </div>
      )}
      {scans?.length === 0 && (
        <p className="mt-8 rounded-2xl border border-dashed p-6 text-center text-muted-foreground">
          {text.empty}
        </p>
      )}

      <ul className="mt-6 space-y-3">
        {scans?.map((scan, index) => {
          const expanded = open === scan.id;
          return (
            <li
              key={scan.id}
              className="rise overflow-hidden rounded-2xl border bg-card shadow-sm"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <button
                onClick={() => setOpen(expanded ? "" : scan.id)}
                aria-expanded={expanded}
                className="flex w-full items-center gap-4 p-3 text-left"
              >
                <img
                  src={scan.thumb}
                  alt=""
                  className="h-16 w-14 shrink-0 rounded-md border object-cover object-top"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">
                    {scan.result.product}
                  </span>
                  <span className="block text-sm text-muted-foreground">
                    {new Date(scan.createdAt).toLocaleString(
                      language,
                      { dateStyle: "medium", timeStyle: "short" },
                    )}
                  </span>
                </span>
                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-semibold ${signalStyle[scan.result.signal]}`}
                >
                  {labels.signal[scan.result.signal]}
                </span>
                <ChevronDown
                  className={`size-5 shrink-0 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
                />
              </button>
              {expanded && (
                <div lang={scan.language} className="rise border-t p-4">
                  <div className="rounded-xl bg-primary p-4 text-primary-foreground">
                    <p className="text-sm opacity-80">{labels.reentry}</p>
                    <p className="mt-1 font-heading text-xl font-semibold leading-snug">
                      {scan.result.reentry}
                    </p>
                  </div>
                  {scan.result.gear.length > 0 && (
                    <>
                      <h2 className="mt-4 font-heading text-lg font-semibold">
                        {labels.gear}
                      </h2>
                      <ul className="mt-1 list-disc space-y-1 pl-5 leading-snug marker:text-primary">
                        {scan.result.gear.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  {scan.result.firstAid.length > 0 && (
                    <>
                      <h2 className="mt-4 font-heading text-lg font-semibold">
                        {labels.firstAid}
                      </h2>
                      <ul className="mt-1 list-disc space-y-1 pl-5 leading-snug marker:text-primary">
                        {scan.result.firstAid.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  <p className="mt-4 leading-relaxed">{scan.result.summary}</p>
                  <button
                    onClick={() => remove(scan.id)}
                    className="mt-4 flex items-center gap-2 text-sm font-medium text-red-700"
                  >
                    <Trash2 className="size-4" />
                    {text.remove}
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
