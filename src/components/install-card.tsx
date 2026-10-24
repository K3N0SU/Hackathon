"use client";

import { Check, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { appCopy } from "@/lib/app-copy";
import { useCopy } from "@/lib/i18n";
import type { Language } from "@/lib/scan";

type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export function InstallCard({ language }: { language: Language }) {
  const text = useCopy(appCopy, language).install;
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [installed, setInstalled] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    const start = setTimeout(() => {
      setInstalled(window.matchMedia("(display-mode: standalone)").matches);
      setIos(/iphone|ipad|ipod/i.test(navigator.userAgent));
    }, 0);
    function onPrompt(event: Event) {
      event.preventDefault();
      setPrompt(event as InstallPrompt);
    }
    function onInstalled() {
      setInstalled(true);
    }
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      clearTimeout(start);
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  return (
    <section className="rise pt-6 pb-10">
      <div className="pop mx-auto flex size-24 items-center justify-center rounded-[1.75rem] bg-primary text-primary-foreground shadow-xl">
        <Smartphone className="size-11" />
      </div>
      <h1 className="mt-6 text-center font-display text-4xl font-semibold leading-[1.02] text-primary">
        {text.title}
      </h1>
      <p className="mx-auto mt-3 max-w-sm text-center text-lg text-muted-foreground">{text.body}</p>
      {installed ? (
        <p className="pop mt-8 flex items-center justify-center gap-2 rounded-2xl bg-primary/10 p-4 text-lg font-semibold text-primary">
          <Check className="size-5" />
          {text.done}
        </p>
      ) : prompt ? (
        <button
          onClick={async () => {
            await prompt.prompt();
            const choice = await prompt.userChoice;
            if (choice.outcome === "accepted") setInstalled(true);
            setPrompt(null);
          }}
          className="mt-8 flex h-14 w-full items-center justify-center rounded-2xl bg-primary text-lg font-semibold text-primary-foreground shadow-lg transition-all hover:-translate-y-0.5 active:scale-[0.98]"
        >
          {text.button}
        </button>
      ) : (
        ios && <p className="mt-8 rounded-2xl border bg-card p-5 text-center text-lg">{text.ios}</p>
      )}
    </section>
  );
}
