"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import type { ScanResult } from "@/lib/scan";

const signalWord = {
  caution: "CAUTION",
  warning: "WARNING",
  danger: "DANGER",
  unknown: "Not shown",
};

export function SupervisorCard({
  result,
  intro,
  close,
  onClose,
}: {
  result: ScanResult;
  intro: string;
  close: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-[70] overflow-y-auto bg-white text-neutral-950">
      <div className="pop mx-auto max-w-xl p-6 pb-12">
        <div className="flex items-center justify-between gap-4">
          <p className="text-base text-neutral-500">{intro}</p>
          <button
            onClick={onClose}
            className="flex h-11 shrink-0 items-center gap-2 rounded-full border px-4 font-medium active:scale-95"
          >
            <X className="size-5" />
            {close}
          </button>
        </div>
        <div lang="en">
          <p className="mt-8 text-lg text-neutral-500">I scanned this pesticide label:</p>
          <p className="mt-1 font-display text-5xl font-semibold leading-[1.02]">{result.product}</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-neutral-100 p-4">
              <p className="text-sm text-neutral-500">Signal word</p>
              <p className="mt-1 text-2xl font-bold">{signalWord[result.signal]}</p>
            </div>
            <div className="rounded-2xl bg-neutral-100 p-4">
              <p className="text-sm text-neutral-500">Re-entry interval</p>
              <p className="mt-1 text-2xl font-bold">
                {result.reentryHours > 0 ? `${result.reentryHours} hours` : "See label"}
              </p>
            </div>
          </div>
          <p className="mt-8 text-lg font-semibold">My questions:</p>
          <ol className="mt-3 space-y-3 text-2xl leading-snug">
            <li className="rounded-2xl border-2 border-neutral-900 p-4">When was this block sprayed?</li>
            <li className="rounded-2xl border-2 border-neutral-900 p-4">When is it safe for us to go back in?</li>
            <li className="rounded-2xl border-2 border-neutral-900 p-4">
              Can you give me the protective gear the label requires?
            </li>
          </ol>
          <p className="mt-8 text-base text-neutral-500">
            Workers have the right to see the application record and the safety data sheet, and
            to receive required PPE at no cost.
          </p>
        </div>
      </div>
    </div>
  );
}
