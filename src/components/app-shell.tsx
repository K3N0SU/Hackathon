"use client";

import {
  Bookmark,
  HeartPulse,
  LoaderCircle,
  ScanLine,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "@/components/auth-provider";
import { ExposureHelp } from "@/components/exposure-help";
import { HeatCheck } from "@/components/heat-check";
import { Mark } from "@/components/mark";
import { SavedScans, savedCopy } from "@/components/saved-scans";
import { Scanner } from "@/components/scanner";
import { UserMenu } from "@/components/user-menu";
import { loadProfile, saveProfile } from "@/lib/cloud";
import { exposureCopy, lastScanKey } from "@/lib/exposure";
import { heatCopy } from "@/lib/heat";
import { languages, type Language } from "@/lib/scan";

type Tab = "labels" | "heat" | "exposed" | "saved";

const tabIds: Tab[] = ["labels", "heat", "exposed", "saved"];

const labelsTab: Record<Language, string> = {
  en: "Labels",
  es: "Etiquetas",
  pa: "ਲੇਬਲ",
};

export function AppShell() {
  const [language, setLanguage] = useState<Language>("en");
  const [tab, setTab] = useState<Tab>("labels");
  const { user, ready } = useSession();
  const router = useRouter();
  const verified = Boolean(user?.emailVerified);

  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace("/sign-in");
    else if (!user.emailVerified) router.replace("/verify");
  }, [ready, user, router]);

  useEffect(() => {
    if (!verified) return;
    let active = true;
    loadProfile()
      .then((profile) => {
        if (!active) return;
        if (profile.language) setLanguage(profile.language);
        if (profile.lastScan) {
          try {
            localStorage.setItem(lastScanKey, JSON.stringify(profile.lastScan));
          } catch {}
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [verified]);

  useEffect(() => {
    const start = setTimeout(() => {
      try {
        const saved = localStorage.getItem("furrow-language");
        const browser = navigator.language.slice(0, 2);
        const pick = languages.find((item) => item.code === (saved ?? browser));
        if (pick) setLanguage(pick.code);
        const hash = window.location.hash.slice(1);
        const match = tabIds.find((id) => id === hash);
        if (match) setTab(match);
      } catch {}
    }, 0);
    return () => clearTimeout(start);
  }, []);

  function changeLanguage(next: Language) {
    setLanguage(next);
    try {
      localStorage.setItem("furrow-language", next);
    } catch {}
    saveProfile({ language: next }).catch(() => {});
  }

  function changeTab(next: Tab) {
    setTab(next);
    window.history.replaceState(null, "", next === "labels" ? " " : `#${next}`);
    window.scrollTo({ top: 0 });
  }

  const tabs = [
    { id: "labels" as const, label: labelsTab[language], icon: ScanLine },
    { id: "heat" as const, label: heatCopy[language].tab, icon: Sun },
    {
      id: "exposed" as const,
      label: exposureCopy[language].tab,
      icon: HeartPulse,
    },
    { id: "saved" as const, label: savedCopy[language].tab, icon: Bookmark },
  ];

  if (!verified) {
    return (
      <div className="flex flex-1 items-center justify-center bg-background">
        <LoaderCircle className="size-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3 px-5 py-3">
          <Link
            href="/"
            className="flex items-center gap-2 font-heading text-2xl font-semibold text-primary"
          >
            <Mark className="size-7" />
            <span className="hidden min-[400px]:inline">Furrow</span>
          </Link>
          <div className="flex items-center gap-2">
            <div
              className="flex rounded-full bg-secondary p-1"
              role="group"
              aria-label="Language"
            >
              {languages.map((item) => (
                <button
                  key={item.code}
                  onClick={() => changeLanguage(item.code)}
                  aria-pressed={item.code === language}
                  className={`rounded-full px-2.5 py-1.5 text-sm font-medium transition-all sm:px-3 ${
                    item.code === language
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
            <UserMenu language={language} compact />
          </div>
        </div>
      </header>

      <main
        lang={language}
        className="mx-auto flex w-full max-w-xl flex-1 flex-col px-5 pb-28"
      >
        <div className={tab === "labels" ? "contents" : "hidden"}>
          <Scanner language={language} />
        </div>
        {tab === "heat" && <HeatCheck language={language} />}
        {tab === "exposed" && <ExposureHelp language={language} />}
        {tab === "saved" && <SavedScans language={language} />}
      </main>

      <nav
        aria-label="Sections"
        className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
      >
        <div className="mx-auto grid max-w-xl grid-cols-4">
          {tabs.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => changeTab(item.id)}
                aria-current={active}
                className={`relative flex h-16 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <span
                  className={`absolute top-0 h-0.5 rounded-full bg-primary transition-all duration-300 ${
                    active ? "w-10" : "w-0"
                  }`}
                />
                <Icon
                  className={`size-6 transition-transform ${active ? "scale-110" : ""}`}
                />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
