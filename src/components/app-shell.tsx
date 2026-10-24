"use client";

import {
  Apple,
  ArrowLeft,
  ArrowUpRight,
  Banknote,
  Bookmark,
  Check,
  ClipboardPen,
  FileText,
  Globe,
  HeartPulse,
  House,
  Languages,
  LayoutGrid,
  LoaderCircle,
  MapPinned,
  ScanLine,
  Shirt,
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
import { AskChat, type AskRequest } from "@/components/ask-chat";
import { useSession } from "@/components/auth-provider";
import { DailyBrief } from "@/components/daily-brief";
import { ExposureHelp } from "@/components/exposure-help";
import { FoodCheck } from "@/components/food-check";
import { GearCheck } from "@/components/gear-check";
import { HeatCheck } from "@/components/heat-check";
import { InstallCard } from "@/components/install-card";
import { Interpreter } from "@/components/interpreter";
import { Mark } from "@/components/mark";
import { PayCheck } from "@/components/pay-check";
import { ReadPaper } from "@/components/read-paper";
import { ReportWriter } from "@/components/report-writer";
import { SavedScans } from "@/components/saved-scans";
import { Scanner } from "@/components/scanner";
import { SprayMap } from "@/components/spray-map";
import { SymptomCheck } from "@/components/symptom-check";
import { TodayHome } from "@/components/today-home";
import { UserMenu } from "@/components/user-menu";
import { useClockAlarms } from "@/lib/alarms";
import { appCopy } from "@/lib/app-copy";
import { useClocks } from "@/lib/clocks";
import { loadProfile, saveProfile } from "@/lib/cloud";
import { lastScanKey, type LastScan } from "@/lib/exposure";
import { preloadLanguages, translateStrings, useCopy } from "@/lib/i18n";
import {
  isCore,
  isLanguage,
  isRtl,
  languages,
  type Language,
  type ScanResult,
} from "@/lib/scan";

type Tab = "home" | "scan" | "tools" | "saved";

type Tool =
  | "heat"
  | "symptoms"
  | "exposed"
  | "paper"
  | "report"
  | "brief"
  | "map"
  | "install"
  | "gear"
  | "pay"
  | "interpret"
  | "food";

const tabIds: Tab[] = ["home", "scan", "tools", "saved"];

const quickIds: Tool[] = ["food", "interpret", "gear", "pay"];

const toolList: { id: Tool; icon: LucideIcon; tone: string }[] = [
  { id: "food", icon: Apple, tone: "bg-leaf text-white" },
  { id: "interpret", icon: Languages, tone: "bg-primary text-primary-foreground" },
  { id: "gear", icon: Shirt, tone: "bg-poppy text-poppy-foreground" },
  { id: "pay", icon: Banknote, tone: "bg-harvest text-harvest-foreground" },
  { id: "symptoms", icon: Stethoscope, tone: "bg-danger text-white" },
  { id: "exposed", icon: HeartPulse, tone: "bg-danger/10 text-danger" },
  { id: "heat", icon: Sun, tone: "bg-harvest text-harvest-foreground" },
  { id: "brief", icon: Sunrise, tone: "bg-poppy/15 text-poppy" },
  { id: "paper", icon: FileText, tone: "bg-ink text-ink-foreground" },
  { id: "report", icon: ClipboardPen, tone: "bg-primary/10 text-primary" },
  { id: "map", icon: MapPinned, tone: "bg-ink text-ink-foreground" },
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
  const [chatOpen, setChatOpen] = useState(false);
  const [tool, setTool] = useState<Tool | null>(null);
  const [picker, setPicker] = useState(false);
  const [focus, setFocus] = useState<ScanResult | null>(null);
  const [request, setRequest] = useState<AskRequest | null>(null);
  const { user, ready } = useSession();
  const router = useRouter();
  const verified = Boolean(user?.emailVerified);
  const text = useCopy(appCopy, language);
  const { clocks, now, add, remove } = useClocks(user?.uid);

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
    function back() {
      const hash = window.location.hash.slice(1);
      if (toolIds.includes(hash as Tool)) {
        setTab("tools");
        setTool(hash as Tool);
      } else {
        setTab(tabIds.includes(hash as Tab) ? (hash as Tab) : "scan");
        setTool(null);
      }
    }
    window.addEventListener("popstate", back);
    return () => window.removeEventListener("popstate", back);
  }, []);

  useEffect(() => {
    preloadLanguages([language]);
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
    const url = next === "scan" ? " " : `#${nextTool ?? next}`;
    if (nextTool) window.history.pushState(null, "", url);
    else window.history.replaceState(null, "", url);
    window.scrollTo({ top: 0 });
    navigator.vibrate?.(8);
  }

  function ask(result: ScanResult) {
    setFocus(result);
    setChatOpen(true);
  }

  function openAsk(next: Omit<AskRequest, "at">) {
    setRequest({ ...next, at: Date.now() });
    setChatOpen(true);
  }

  const tabs: { id: Tab; label: string; icon: LucideIcon; tool?: Tool }[] = [
    { id: "home", label: text.tabs.home, icon: House },
    { id: "tools", label: text.tabs.tools, icon: LayoutGrid },
    { id: "scan", label: text.tabs.scan, icon: ScanLine },
    { id: "saved", label: text.tabs.saved, icon: Bookmark },
    { id: "tools", label: text.tools.map.title, icon: MapPinned, tool: "map" },
  ];
  const sideTabs = [tabs[2], tabs[0], tabs[1], tabs[3], tabs[4]];
  const isActive = (item: { id: Tab; tool?: Tool }) =>
    item.tool ? tab === "tools" && tool === item.tool : tab === item.id && !(item.id === "tools" && tool === "map");

  const current = languages.find((item) => item.code === language) ?? languages[0];
  const wide = tab === "home" || (tab === "tools" && (!tool || tool === "interpret"));

  if (!verified) {
    return (
      <div className="flex flex-1 items-center justify-center bg-background">
        <LoaderCircle className="size-10 animate-spin text-primary" />
      </div>
    );
  }

  const languageButton = (dark: boolean) => (
    <button
      onClick={() => setPicker(true)}
      onPointerEnter={() => preloadLanguages(languages.map((item) => item.code))}
      onFocus={() => preloadLanguages(languages.map((item) => item.code))}
      aria-label={text.language}
      className={`flex h-10 items-center gap-2 rounded-full px-3.5 text-sm font-semibold transition-all active:scale-95 ${
        dark ? "bg-white/10 text-ink-foreground hover:bg-white/15" : "border bg-card shadow-sm hover:border-primary"
      }`}
    >
      <Globe className={`size-4 ${dark ? "text-poppy" : "text-primary"}`} />
      {current.name}
    </button>
  );

  return (
    <div className="dots flex flex-1 flex-col bg-background lg:pl-72">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col overflow-y-auto bg-ink text-ink-foreground [scrollbar-width:none] lg:flex">
        <div className="flex items-center justify-between px-6 pt-6">
          <Link href="/" className="wiggle-hover flex items-center gap-2.5 font-display text-2xl font-semibold">
            <Mark className="wiggle-target size-8 text-poppy" />
            Milpa
          </Link>
          <UserMenu language={language} compact />
        </div>
        <nav aria-label="Sections" className="mt-8 space-y-1 px-3">
          {sideTabs.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <button
                key={item.tool ?? item.id}
                onClick={() => go(item.id, item.tool ?? null)}
                aria-current={active}
                className={`group relative flex h-12 w-full items-center gap-3 rounded-2xl px-4 text-left font-semibold transition-all active:scale-[0.98] ${
                  active ? "bg-white text-ink shadow-lg" : "text-ink-foreground/70 hover:bg-white/5 hover:text-ink-foreground"
                }`}
              >
                <Icon
                  className={`size-5 transition-transform duration-500 [transition-timing-function:var(--ease-spring)] group-hover:scale-110 ${
                    active ? "text-primary" : ""
                  }`}
                />
                {item.label}
                {item.id === "scan" && (
                  <span
                    className={`ml-auto rounded-full px-2 py-0.5 text-xs font-bold ${
                      active ? "bg-poppy text-poppy-foreground" : "bg-poppy/20 text-poppy"
                    }`}
                  >
                    5s
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        <p className="mt-8 px-7 text-sm font-semibold text-ink-foreground/50">{text.home.aiTools}</p>
        <div className="mt-2 space-y-1 px-3">
          {toolList.filter((item) => item.id !== "map").slice(0, 7).map((item) => {
            const Icon = item.icon;
            const active = tab === "tools" && tool === item.id;
            return (
              <button
                key={item.id}
                onClick={() => go("tools", item.id)}
                className={`group flex h-12 w-full shrink-0 items-center gap-3 rounded-2xl px-4 text-left text-[15px] font-medium transition-all ${
                  active ? "bg-white/10 text-ink-foreground" : "text-ink-foreground/65 hover:bg-white/5 hover:text-ink-foreground"
                }`}
              >
                <span className={`flex size-8 shrink-0 items-center justify-center rounded-xl transition-transform duration-500 [transition-timing-function:var(--ease-spring)] group-hover:scale-110 ${item.tone}`}>
                  <Icon className="size-4" />
                </span>
                {text.tools[item.id].title}
              </button>
            );
          })}
        </div>
        <div className="mt-auto shrink-0 px-6 pb-6 pt-8">{languageButton(true)}</div>
      </aside>

      <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3 px-5 py-3">
          <Link href="/" className="wiggle-hover flex items-center gap-2 font-display text-2xl font-semibold text-ink">
            <Mark className="wiggle-target size-8 text-primary" />
            <span className="hidden min-[400px]:inline">Milpa</span>
          </Link>
          <div className="flex items-center gap-2">
            {languageButton(false)}
            <UserMenu language={language} compact />
          </div>
        </div>
      </header>

      <main
        lang={language}
        dir={isRtl(language) ? "rtl" : "ltr"}
        className={`relative mx-auto flex w-full flex-1 flex-col px-5 pb-32 lg:px-10 lg:pb-12 ${
          wide ? "max-w-xl lg:max-w-6xl" : "max-w-xl lg:max-w-3xl"
        }`}
      >
        {tab === "tools" && tool && (
          <button
            onClick={() => go("tools")}
            className="mt-4 flex h-10 w-fit items-center gap-1.5 rounded-full border bg-card pl-3 pr-4 text-sm font-semibold text-primary shadow-sm transition-all hover:border-primary active:scale-95 lg:mt-8"
          >
            <ArrowLeft className="size-4 rtl:rotate-180" />
            {text.back}
          </button>
        )}
        {tab === "home" && (
          <TodayHome
            language={language}
            clocks={clocks}
            now={now}
            lastScan={focus}
            tools={toolList
              .filter((item) => quickIds.includes(item.id))
              .map((item) => ({ ...item, ...text.tools[item.id] }))}
            onScan={() => go("scan")}
            onTalk={() => openAsk({ voice: true })}
            onAsk={ask}
            onOpenChat={(chatId) => openAsk({ chatId })}
            onTool={(id) => go("tools", id as Tool)}
            onAllTools={() => go("tools")}
          />
        )}
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
        {tab === "saved" && <SavedScans language={language} />}
        {tab === "tools" && !tool && (
          <section className="rise pt-6 pb-6 lg:pt-10">
            <h1 className="font-display text-4xl font-semibold leading-[1.02] text-ink sm:text-5xl">
              {text.toolsTitle}
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">{text.toolsIntro}</p>
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {toolList.map((item, index) => {
                const Icon = item.icon;
                const copy = text.tools[item.id];
                return (
                  <button
                    key={item.id}
                    onClick={() => go("tools", item.id)}
                    className="rise group card relative flex min-h-40 flex-col items-start justify-between gap-5 overflow-hidden p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--shadow-lift)] active:scale-[0.97]"
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <ArrowUpRight className="absolute right-4 top-4 size-5 -translate-x-1 translate-y-1 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-primary group-hover:opacity-100" />
                    <span
                      className={`relative flex size-11 items-center justify-center rounded-2xl shadow-sm transition-transform duration-500 [transition-timing-function:var(--ease-spring)] group-hover:-rotate-6 group-hover:scale-110 ${item.tone}`}
                    >
                      <Icon className="size-6" />
                    </span>
                    <span className="relative">
                      <span className="block font-display text-lg font-semibold leading-tight text-ink">
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
        {tab === "tools" && tool === "gear" && <GearCheck language={language} />}
        {tab === "tools" && tool === "pay" && <PayCheck language={language} />}
        {tab === "tools" && tool === "interpret" && <Interpreter language={language} />}
        {tab === "tools" && tool === "food" && <FoodCheck language={language} />}
      </main>

      <AskChat
        language={language}
        focus={focus}
        clocks={clocks}
        request={request}
        open={chatOpen}
        onOpen={() => setChatOpen(true)}
        onClose={() => setChatOpen(false)}
      />

      {picker && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/50 backdrop-blur-sm sm:items-center"
          onClick={() => setPicker(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={text.chooseLanguage}
            onClick={(event) => event.stopPropagation()}
            className="pop flex max-h-[85svh] w-full max-w-2xl flex-col rounded-t-[2rem] bg-background p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-[2rem]"
          >
            <div className="flex items-center justify-between">
              <p className="font-display text-2xl font-semibold text-ink">{text.chooseLanguage}</p>
              <button
                onClick={() => setPicker(false)}
                aria-label={text.back}
                className="flex size-10 items-center justify-center rounded-full bg-secondary active:scale-90"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2.5 overflow-y-auto sm:grid-cols-3">
              {languages.map((item, index) => {
                const on = item.code === language;
                return (
                  <button
                    key={item.code}
                    onClick={() => changeLanguage(item.code)}
                    className={`rise flex min-h-16 items-center justify-between gap-2 rounded-2xl border-2 px-4 py-2 text-left transition-all active:scale-95 ${
                      on
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-transparent bg-card shadow-sm hover:border-primary/40"
                    }`}
                    style={{ animationDelay: `${index * 25}ms` }}
                  >
                    <span>
                      <span className="block text-lg font-semibold leading-tight">{item.name}</span>
                      <span className={`block text-xs ${on ? "opacity-75" : "text-muted-foreground"}`}>
                        {item.english}
                      </span>
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
        className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 mx-auto max-w-md rounded-[1.75rem] bg-ink p-1.5 shadow-[0_24px_48px_-16px_oklch(0.2_0.05_268/0.6)] lg:hidden"
      >
        <div className="grid grid-cols-5 items-end">
          {tabs.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            if (item.id === "scan") {
              return (
                <button
                  key={item.id}
                  onClick={() => go(item.id)}
                  aria-current={active}
                  className="flex flex-col items-center"
                >
                  <span
                    className={`-mt-7 flex size-16 items-center justify-center rounded-full ring-[5px] ring-background transition-all duration-500 [transition-timing-function:var(--ease-spring)] active:scale-90 ${
                      active ? "scale-105 bg-primary text-primary-foreground" : "bg-poppy text-poppy-foreground"
                    }`}
                  >
                    <Icon className="size-7" />
                  </span>
                  <span className="mt-0.5 pb-1 text-[11px] font-semibold text-ink-foreground/80">{item.label}</span>
                </button>
              );
            }
            return (
              <button
                key={item.tool ?? item.id}
                onClick={() => go(item.id, item.tool ?? null)}
                aria-current={active}
                className={`relative flex h-14 flex-col items-center justify-center gap-0.5 rounded-[1.25rem] text-[11px] font-semibold transition-all duration-300 active:scale-90 ${
                  active ? "bg-white text-ink" : "text-ink-foreground/60"
                }`}
              >
                <Icon className={`size-5 ${active ? "text-primary" : ""}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
