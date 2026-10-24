"use client";

import {
  ArrowLeft,
  Bookmark,
  Check,
  ClipboardPen,
  FileText,
  Globe,
  HeartPulse,
  LayoutGrid,
  LoaderCircle,
  MapPinned,
  MessageCircleQuestion,
  ScanLine,
  Smartphone,
  Stethoscope,
  Sun,
  Sunrise,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AskChat } from "@/components/ask-chat";
import { useSession } from "@/components/auth-provider";
import { DailyBrief } from "@/components/daily-brief";
import { ExposureHelp } from "@/components/exposure-help";
import { HeatCheck } from "@/components/heat-check";
import { InstallCard } from "@/components/install-card";
import { Mark } from "@/components/mark";
import { ReadPaper } from "@/components/read-paper";
import { ReportWriter } from "@/components/report-writer";
import { SavedScans } from "@/components/saved-scans";
import { Scanner } from "@/components/scanner";
import { SprayMap } from "@/components/spray-map";
import { SymptomCheck } from "@/components/symptom-check";
import { UserMenu } from "@/components/user-menu";
import { useClockAlarms } from "@/lib/alarms";
import { appCopy } from "@/lib/app-copy";
import { useClocks } from "@/lib/clocks";
import { loadProfile, saveProfile } from "@/lib/cloud";
import { lastScanKey, type LastScan } from "@/lib/exposure";
import { translateStrings, useCopy } from "@/lib/i18n";
import {
  isCore,
  isLanguage,
  isRtl,
  languages,
  type Language,
  type ScanResult,
} from "@/lib/scan";

type Tab = "scan" | "ask" | "tools" | "saved";

type Tool = "heat" | "symptoms" | "exposed" | "paper" | "report" | "brief" | "map" | "install";

const tabIds: Tab[] = ["scan", "ask", "tools", "saved"];

const toolList: { id: Tool; icon: LucideIcon; tone: string }[] = [
  { id: "symptoms", icon: Stethoscope, tone: "bg-danger text-white" },
  { id: "exposed", icon: HeartPulse, tone: "bg-danger/10 text-danger" },
  { id: "heat", icon: Sun, tone: "bg-harvest text-harvest-foreground" },
  { id: "brief", icon: Sunrise, tone: "bg-harvest/25 text-harvest-foreground" },
  { id: "paper", icon: FileText, tone: "bg-primary text-primary-foreground" },
  { id: "report", icon: ClipboardPen, tone: "bg-primary/10 text-primary" },
  { id: "map", icon: MapPinned, tone: "bg-sky-700 text-white" },
  { id: "install", icon: Smartphone, tone: "bg-secondary text-primary" },
];

const toolIds = toolList.map((tool) => tool.id);

function readLastResult(): ScanResult | null {
  try {
    const saved: LastScan | null = JSON.parse(localStorage.getItem(lastScanKey) ?? "null");
    return saved?.result ?? null;
  } catch {
    return null;
  }
}

export function AppShell() {
  const [language, setLanguage] = useState<Language>("en");
  const [tab, setTab] = useState<Tab>("scan");
  const [tool, setTool] = useState<Tool | null>(null);
  const [picker, setPicker] = useState(false);
  const [focus, setFocus] = useState<ScanResult | null>(null);
  const { user, ready } = useSession();
  const router = useRouter();
  const verified = Boolean(user?.emailVerified);
  const text = useCopy(appCopy, language);
  const { clocks, now, add, remove } = useClocks();

  useClockAlarms(clocks, text.alarms);

  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace("/sign-in");
    else if (!user.emailVerified) router.replace("/verify");
  }, [ready, user, router]);

  useEffect(() => {
    navigator.serviceWorker?.register("/sw.js").catch(() => {});
  }, []);

  useEffect(() => {
    if (!verified) return;
    let active = true;
    loadProfile()
      .then((profile) => {
        if (!active) return;
        if (profile.language && isLanguage(profile.language)) setLanguage(profile.language);
        if (profile.lastScan) {
          try {
            localStorage.setItem(lastScanKey, JSON.stringify(profile.lastScan));
          } catch {}
          if (profile.lastScan.result) setFocus(profile.lastScan.result);
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
        setFocus(readLastResult());
        const saved = localStorage.getItem("furrow-language");
        const browser = navigator.language.slice(0, 2);
        const choice = saved ?? (browser === "fil" ? "tl" : browser);
        if (isLanguage(choice)) setLanguage(choice);
        const hash = window.location.hash.slice(1);
        if (tabIds.includes(hash as Tab)) setTab(hash as Tab);
        if (toolIds.includes(hash as Tool)) {
          setTab("tools");
          setTool(hash as Tool);
        }
      } catch {}
    }, 0);
    return () => clearTimeout(start);
  }, []);

  useEffect(() => {
    document.documentElement.dir = isRtl(language) ? "rtl" : "ltr";
    return () => {
      document.documentElement.dir = "ltr";
    };
  }, [language]);

  function changeLanguage(next: Language) {
    setLanguage(next);
    setPicker(false);
    navigator.vibrate?.(15);
    try {
      localStorage.setItem("furrow-language", next);
    } catch {}
    saveProfile({ language: next }).catch(() => {});
    if (!isCore(next)) translateStrings(appCopy.en, next).catch(() => {});
  }

  function go(next: Tab, nextTool: Tool | null = null) {
    setTab(next);
    setTool(nextTool);
    window.history.replaceState(null, "", next === "scan" ? " " : `#${nextTool ?? next}`);
    window.scrollTo({ top: 0 });
    navigator.vibrate?.(8);
  }

  function ask(result: ScanResult) {
    setFocus(result);
    go("ask");
  }

  const tabs: { id: Tab; label: string; icon: LucideIcon }[] = [
    { id: "scan", label: text.tabs.scan, icon: ScanLine },
    { id: "ask", label: text.tabs.ask, icon: MessageCircleQuestion },
    { id: "tools", label: text.tabs.tools, icon: LayoutGrid },
    { id: "saved", label: text.tabs.saved, icon: Bookmark },
  ];

  const current = languages.find((item) => item.code === language) ?? languages[0];

  if (!verified) {
    return (
      <div className="flex flex-1 items-center justify-center bg-background">
        <LoaderCircle className="size-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3 px-5 py-3">
          {tab === "tools" && tool ? (
            <button
              onClick={() => go("tools")}
              className="flex h-10 items-center gap-1.5 rounded-full pr-3 font-semibold text-primary transition-transform active:scale-95"
            >
              <ArrowLeft className="size-5 rtl:rotate-180" />
              {text.back}
            </button>
          ) : (
            <Link href="/" className="wiggle-hover flex items-center gap-2 font-display text-2xl font-semibold text-primary">
              <Mark className="wiggle-target size-7" />
              <span className="hidden min-[400px]:inline">Furrow</span>
            </Link>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPicker(true)}
              aria-label={text.language}
              className="flex h-10 items-center gap-2 rounded-full border bg-card px-3.5 text-sm font-semibold shadow-sm transition-all hover:border-primary active:scale-95"
            >
              <Globe className="size-4 text-primary" />
              {current.name}
            </button>
            <UserMenu language={language} compact />
          </div>
        </div>
      </header>

      <main
        lang={language}
        dir={isRtl(language) ? "rtl" : "ltr"}
        className="mx-auto flex w-full max-w-xl flex-1 flex-col px-5 pb-28"
      >
        <div className={tab === "scan" ? "contents" : "hidden"}>
          <Scanner
            language={language}
            clocks={clocks}
            now={now}
            addClock={add}
            removeClock={remove}
            onAsk={ask}
          />
        </div>
        {tab === "ask" && <AskChat language={language} focus={focus} clocks={clocks} />}
        {tab === "saved" && <SavedScans language={language} />}
        {tab === "tools" && !tool && (
          <section className="rise pt-6 pb-6">
            <h1 className="font-display text-4xl font-semibold leading-[1.02] text-primary sm:text-5xl">
              {text.toolsTitle}
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">{text.toolsIntro}</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {toolList.map((item, index) => {
                const Icon = item.icon;
                const copy = text.tools[item.id];
                return (
                  <button
                    key={item.id}
                    onClick={() => go("tools", item.id)}
                    className="rise group card flex min-h-40 flex-col items-start justify-between p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--shadow-lift)] active:scale-[0.97]"
                    style={{ animationDelay: `${index * 45}ms` }}
                  >
                    <span
                      className={`flex size-12 items-center justify-center rounded-2xl transition-transform duration-500 [transition-timing-function:var(--ease-spring)] group-hover:-rotate-6 group-hover:scale-110 ${item.tone}`}
                    >
                      <Icon className="size-6" />
                    </span>
                    <span>
                      <span className="block font-display text-xl font-semibold leading-tight text-primary">
                        {copy.title}
                      </span>
                      <span className="mt-1 block text-sm leading-snug text-muted-foreground">{copy.body}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}
        {tab === "tools" && tool === "heat" && <HeatCheck language={language} />}
        {tab === "tools" && tool === "symptoms" && <SymptomCheck language={language} />}
        {tab === "tools" && tool === "exposed" && <ExposureHelp language={language} />}
        {tab === "tools" && tool === "paper" && <ReadPaper language={language} />}
        {tab === "tools" && tool === "report" && <ReportWriter language={language} />}
        {tab === "tools" && tool === "brief" && <DailyBrief language={language} clocks={clocks} />}
        {tab === "tools" && tool === "map" && <SprayMap language={language} />}
        {tab === "tools" && tool === "install" && <InstallCard language={language} />}
      </main>

      {picker && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center" onClick={() => setPicker(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={text.chooseLanguage}
            onClick={(event) => event.stopPropagation()}
            className="pop w-full max-w-md rounded-t-[2rem] bg-background p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-[2rem]"
          >
            <div className="flex items-center justify-between">
              <p className="font-display text-2xl font-semibold text-primary">{text.chooseLanguage}</p>
              <button
                onClick={() => setPicker(false)}
                aria-label={text.back}
                className="flex size-10 items-center justify-center rounded-full bg-secondary active:scale-90"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              {languages.map((item, index) => {
                const on = item.code === language;
                return (
                  <button
                    key={item.code}
                    onClick={() => changeLanguage(item.code)}
                    className={`rise flex min-h-16 items-center justify-between gap-2 rounded-2xl border-2 px-4 py-2 text-left transition-all active:scale-95 ${
                      on ? "border-primary bg-primary text-primary-foreground" : "border-transparent bg-card shadow-sm hover:border-primary/40"
                    }`}
                    style={{ animationDelay: `${index * 35}ms` }}
                  >
                    <span>
                      <span className="block text-lg font-semibold leading-tight">{item.name}</span>
                      <span className={`block text-xs ${on ? "opacity-75" : "text-muted-foreground"}`}>{item.english}</span>
                    </span>
                    {on && <Check className="size-5 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <nav
        aria-label="Sections"
        className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md"
      >
        <div className="mx-auto grid max-w-xl grid-cols-4">
          {tabs.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                aria-current={active}
                className={`relative flex h-[4.25rem] flex-col items-center justify-center gap-1 text-xs font-semibold transition-colors active:scale-90 ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <span
                  className={`absolute top-0 h-[3px] rounded-full bg-primary transition-all duration-500 [transition-timing-function:var(--ease-spring)] ${
                    active ? "w-12" : "w-0"
                  }`}
                />
                <span
                  className={`flex h-8 w-14 items-center justify-center rounded-full transition-all duration-500 [transition-timing-function:var(--ease-spring)] ${
                    active ? "scale-110 bg-primary/10" : ""
                  }`}
                >
                  <Icon className="size-6" />
                </span>
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
