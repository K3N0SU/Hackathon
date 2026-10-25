"use client";

import { Apple, ArrowRight, Barcode, Check, ImageIcon, Info, Keyboard, Leaf, MapPin, RotateCcw, ShieldAlert, Sprout, Store, TriangleAlert, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { appCopy } from "@/lib/app-copy";
import { useCopy } from "@/lib/i18n";
import { LiveCamera } from "@/components/live-camera";
import { fileToJpeg, toJpeg } from "@/lib/image";
import type { Language } from "@/lib/scan";
import { useSpeaker } from "@/lib/speech";
import { toolsCopy } from "@/lib/tools-copy";
import { remember } from "@/lib/history";

const allergyIds = ["milk", "eggs", "fish", "shellfish", "tree nuts", "peanuts", "wheat", "soy", "sesame"];
const storageKey = "furrow-allergies";

type Food = {
  readable: boolean;
  product: string;
  allergens: { name: string; level: "contains" | "may" }[];
  mine: string[];
  organic: "yes" | "no" | "unknown";
  pesticides: string;
  flags: string[];
  verdict: "safe" | "caution" | "avoid";
  summary: string;
  barcode?: string;
  about?: string;
  facts?: string[];
  catalog?: { name: string; brand: string; quantity: string; nutriscore: string } | null;
};

type Shop = { name: string; kind: string; address: string; miles: number };

const zipKey = "furrow-zip";

async function findBarcode(photo: string) {
  try {
    const Detector = (window as unknown as { BarcodeDetector?: new (options: { formats: string[] }) => { detect: (image: HTMLImageElement) => Promise<{ rawValue: string }[]> } }).BarcodeDetector;
    if (!Detector) return "";
    const image = new Image();
    image.src = photo;
    await image.decode();
    const codes = await new Detector({ formats: ["ean_13", "ean_8", "upc_a", "upc_e"] }).detect(image);
    return codes[0]?.rawValue ?? "";
  } catch {
    return "";
  }
}

type State =
  | { step: "start" }
  | { step: "checking"; photo: string | null; name: string }
  | { step: "done"; photo: string | null; food: Food }
  | { step: "problem"; message: string };

const verdictStyle = {
  safe: "bg-leaf text-white",
  caution: "bg-harvest text-harvest-foreground",
  avoid: "bg-danger text-white",
};

const verdictIcon = { safe: Check, caution: TriangleAlert, avoid: ShieldAlert };

export function FoodCheck({ language }: { language: Language }) {
  const text = useCopy(toolsCopy, language).food;
  const listen = useCopy(appCopy, language).brief.listen;
  const [state, setState] = useState<State>({ step: "start" });
  const [allergies, setAllergies] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [zip, setZip] = useState("");
  const [shops, setShops] = useState<{ status: "idle" | "loading" | "done" | "failed"; list: Shop[] }>({ status: "idle", list: [] });

  useEffect(() => {
    const start = setTimeout(() => {
      try {
        setZip(localStorage.getItem(zipKey) ?? "");
      } catch {}
    }, 0);
    return () => clearTimeout(start);
  }, []);

  async function findShops(event: React.FormEvent) {
    event.preventDefault();
    const code = zip.trim();
    if (!/^\d{5}$/.test(code)) return;
    try {
      localStorage.setItem(zipKey, code);
    } catch {}
    setShops({ status: "loading", list: [] });
    try {
      const response = await fetch(`/api/shops?zip=${code}`);
      if (!response.ok) throw new Error("shops");
      const data: { shops: Shop[] } = await response.json();
      setShops({ status: "done", list: data.shops });
    } catch {
      setShops({ status: "failed", list: [] });
    }
  }
  const [cameraOpen, setCameraOpen] = useState(false);
  const gallery = useRef<HTMLInputElement>(null);
  const { speaking, speak } = useSpeaker(language);

  useEffect(() => {
    const start = setTimeout(() => {
      try {
        const saved = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
        if (Array.isArray(saved)) setAllergies(saved.filter((item) => allergyIds.includes(item)));
      } catch {}
    }, 0);
    return () => clearTimeout(start);
  }, []);

  function toggle(id: string) {
    navigator.vibrate?.(8);
    setAllergies((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  async function check(source: Promise<string>) {
    let photo: string;
    try {
      photo = await source;
    } catch {
      setState({ step: "problem", message: text.failed });
      return;
    }
    setState({ step: "checking", photo, name: "" });
    const barcode = await findBarcode(photo);
    await send({ image: photo.split(",")[1], mediaType: "image/jpeg", ...(barcode ? { barcode } : {}) }, photo);
  }

  async function checkName(event: React.FormEvent) {
    event.preventDefault();
    const typed = name.trim();
    if (!typed) return;
    setState({ step: "checking", photo: null, name: typed });
    await send({ name: typed }, null);
  }

  async function send(body: Record<string, string>, photo: string | null) {
    try {
      const response = await fetch("/api/food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, language, allergies }),
      });
      if (!response.ok) throw new Error("failed");
      const food: Food = await response.json();
      if (!food.readable) {
        setState({ step: "problem", message: text.notFood });
        return;
      }
      setState({ step: "done", photo, food });
      remember("food check", { product: food.product, verdict: food.verdict, summary: food.summary, allergens: food.allergens.map((item) => `${item.level} ${item.name}`), organic: food.organic, pesticides: food.pesticides, about: food.about, barcode: food.barcode });
      navigator.vibrate?.(food.verdict === "avoid" ? [150, 80, 150] : 25);
    } catch {
      setState({ step: "problem", message: text.failed });
    }
  }

  return (
    <section className="rise pt-6 pb-10">
      <input
        ref={gallery}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) check(fileToJpeg(file));
        }}
      />
      {cameraOpen && (
        <LiveCamera
          language={language}
          mode="food"
          onCapture={(shot) => {
            setCameraOpen(false);
            check(toJpeg(shot));
          }}
          onFile={(file) => {
            setCameraOpen(false);
            check(fileToJpeg(file));
          }}
          onClose={() => setCameraOpen(false)}
        />
      )}
      <h1 className="font-display text-4xl font-semibold leading-[1.02] text-ink sm:text-5xl">{text.title}</h1>

      {(state.step === "start" || state.step === "problem") && (
        <>
          <p className="mt-3 text-lg text-muted-foreground">{text.intro}</p>
          <div className="card mt-6 p-5">
            <p className="font-semibold">{text.allergiesTitle}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {allergyIds.map((id, index) => {
                const on = allergies.includes(id);
                return (
                  <button
                    key={id}
                    onClick={() => toggle(id)}
                    aria-pressed={on}
                    className={`flex h-10 items-center gap-1.5 rounded-full border-2 px-4 text-sm font-semibold transition-all active:scale-95 ${
                      on ? "border-danger bg-danger text-white" : "border-border bg-background hover:border-danger/50"
                    }`}
                  >
                    {on && <Check className="size-4" />}
                    {text.allergyNames[index]}
                  </button>
                );
              })}
            </div>
          </div>
          {state.step === "problem" && (
            <p role="alert" className="mt-4 rounded-2xl bg-red-50 p-4 text-red-800">
              {state.message}
            </p>
          )}
          <button
            onClick={() => setCameraOpen(true)}
            className="group mt-5 flex h-36 w-full flex-col items-center justify-center gap-3 rounded-3xl bg-leaf text-white shadow-xl shadow-leaf/25 transition-transform active:scale-[0.98]"
          >
            <span className="flex size-14 items-center justify-center rounded-full bg-white text-leaf transition-transform duration-500 [transition-timing-function:var(--ease-spring)] group-hover:scale-110">
              <Apple className="size-7" />
            </span>
            <span className="text-xl font-semibold">{text.take}</span>
          </button>
          <button
            onClick={() => gallery.current?.click()}
            className="mt-3 flex w-full items-center justify-center gap-2 py-2 font-medium text-primary underline-offset-4 hover:underline"
          >
            <ImageIcon className="size-5" />
            {text.choose}
          </button>
          <form onSubmit={checkName} className="card mt-4 p-5">
            <label htmlFor="food-name" className="flex items-center gap-2 font-semibold">
              <Keyboard className="size-5 text-leaf" />
              {text.typeTitle}
            </label>
            <div className="mt-3 flex gap-2">
              <input
                id="food-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={text.typePlaceholder}
                maxLength={120}
                enterKeyHint="go"
                className="h-12 min-w-0 flex-1 rounded-xl border bg-background px-4 text-base outline-none transition-shadow focus:border-leaf focus:ring-4 focus:ring-leaf/15"
              />
              <button
                type="submit"
                disabled={!name.trim()}
                className="flex h-12 shrink-0 items-center gap-1.5 rounded-xl bg-leaf px-5 font-semibold text-white transition-all active:scale-95 disabled:opacity-40"
              >
                {text.typeCheck}
                <ArrowRight className="size-4" />
              </button>
            </div>
          </form>
        </>
      )}

      {state.step === "checking" && (
        <div className="mt-6" aria-live="polite">
          <div className="relative mx-auto max-w-xs overflow-hidden rounded-3xl border bg-card shadow-lg">
            {state.photo ? (
              <img src={state.photo} alt="" className="h-80 w-full object-cover" />
            ) : (
              <div className="flex h-80 flex-col items-center justify-center gap-4 bg-leaf/10 px-6 text-center">
                <span className="flex size-16 items-center justify-center rounded-full bg-leaf text-white">
                  <Apple className="size-8" />
                </span>
                <p className="font-display text-2xl font-semibold text-ink">{state.name}</p>
              </div>
            )}
            <div className="scan-line absolute inset-x-0 h-24" />
          </div>
          <p className="mt-5 text-center text-lg font-medium">{text.checking}</p>
        </div>
      )}

      {state.step === "done" && (() => {
        const { food } = state;
        const Icon = verdictIcon[food.verdict];
        return (
          <div className="mt-6 space-y-4">
            <div className={`pop flex items-center gap-4 rounded-3xl p-4 shadow-xl ${verdictStyle[food.verdict]}`}>
              {state.photo ? (
                <img src={state.photo} alt="" className="size-24 shrink-0 rounded-2xl object-cover ring-2 ring-white/40" />
              ) : (
                <span className="flex size-24 shrink-0 items-center justify-center rounded-2xl bg-white/20 ring-2 ring-white/40">
                  <Apple className="size-10" />
                </span>
              )}
              <div className="min-w-0">
                <p className="flex items-center gap-2 font-display text-2xl font-semibold leading-tight">
                  <Icon className="size-6 shrink-0" />
                  {text.verdict[food.verdict]}
                </p>
                <p className="mt-0.5 font-semibold opacity-90">{food.product}</p>
                <p className="mt-1 leading-snug opacity-90">{food.summary}</p>
              </div>
            </div>

            {!state.photo && (
              <p className="flex items-start gap-2 rounded-2xl bg-secondary p-4 text-muted-foreground">
                <Keyboard className="mt-0.5 size-5 shrink-0" />
                {text.byName}
              </p>
            )}

            {(food.about || food.catalog || food.barcode) && (
              <div className="rise card p-5">
                <p className="flex items-center gap-2 font-display text-xl font-semibold">
                  <Info className="size-5 text-primary" />
                  {text.about}
                </p>
                {food.catalog && (
                  <p className="mt-2 font-semibold">
                    {[food.catalog.brand, food.catalog.name, food.catalog.quantity].filter(Boolean).join(" · ")}
                  </p>
                )}
                {food.about && <p className="mt-2 leading-relaxed">{food.about}</p>}
                {food.facts && food.facts.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {food.facts.map((fact) => (
                      <li key={fact} className="flex gap-2">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                        {fact}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-3 flex flex-wrap gap-2 text-sm">
                  {food.barcode ? (
                    <span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 font-medium">
                      <Barcode className="size-4" />
                      {text.barcode} {food.barcode}
                    </span>
                  ) : (
                    state.photo && <span className="text-muted-foreground">{text.noBarcode}</span>
                  )}
                  {food.catalog && <span className="rounded-full bg-leaf/15 px-3 py-1 font-medium text-leaf">{text.catalog}</span>}
                  {food.catalog?.nutriscore && (
                    <span className="rounded-full bg-harvest/30 px-3 py-1 font-semibold text-harvest-foreground">
                      Nutri-Score {food.catalog.nutriscore}
                    </span>
                  )}
                </div>
              </div>
            )}

            {food.mine.length > 0 && (
              <div className="rise rounded-2xl border-2 border-danger bg-red-50 p-4 text-red-900">
                <p className="font-semibold">{text.yours}</p>
                <p className="mt-1 text-lg">{food.mine.join(", ")}</p>
              </div>
            )}

            <div className="rise card p-5" style={{ animationDelay: "80ms" }}>
              <p className="font-display text-xl font-semibold">{text.allergens}</p>
              {food.allergens.length === 0 ? (
                <p className="mt-2 text-muted-foreground">{text.noAllergens}</p>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {food.allergens.map((item) => (
                    <span
                      key={item.name}
                      className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                        item.level === "contains" ? "bg-danger/10 text-danger" : "bg-harvest/30 text-harvest-foreground"
                      }`}
                    >
                      {item.level === "contains" ? text.contains : text.may}: {item.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="rise card p-5" style={{ animationDelay: "160ms" }}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="flex items-center gap-2 font-display text-xl font-semibold">
                  <Sprout className="size-5 text-leaf" />
                  {text.pesticides}
                </p>
                <span
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${
                    food.organic === "yes" ? "bg-leaf/15 text-leaf" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <Leaf className="size-4" />
                  {text.organic[food.organic]}
                </span>
              </div>
              <p className="mt-2 leading-relaxed">{food.pesticides}</p>
            </div>

            {food.flags.length > 0 && (
              <div className="rise card p-5" style={{ animationDelay: "240ms" }}>
                <p className="font-display text-xl font-semibold">{text.flags}</p>
                <ul className="mt-2 space-y-1.5">
                  {food.flags.map((flag) => (
                    <li key={flag} className="flex gap-2">
                      <TriangleAlert className="mt-0.5 size-4 shrink-0 text-poppy" />
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rise card p-5">
              <p className="flex items-center gap-2 font-display text-xl font-semibold">
                <Store className="size-5 text-primary" />
                {text.shops}
              </p>
              <form onSubmit={findShops} className="mt-3 flex gap-2">
                <input
                  value={zip}
                  onChange={(event) => setZip(event.target.value.replace(/\D/g, "").slice(0, 5))}
                  inputMode="numeric"
                  placeholder={text.zip}
                  aria-label={text.zip}
                  className="h-12 w-32 rounded-xl border bg-background px-3 text-lg"
                />
                <button
                  type="submit"
                  disabled={zip.length !== 5 || shops.status === "loading"}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground transition-all active:scale-95 disabled:opacity-50"
                >
                  <MapPin className="size-4" />
                  {text.findShops}
                </button>
              </form>
              {shops.status === "loading" && <div className="mt-3 h-20 animate-pulse rounded-xl bg-secondary" />}
              {shops.status === "failed" && <p className="mt-3 text-danger">{text.shopsFailed}</p>}
              {shops.status === "done" && shops.list.length === 0 && <p className="mt-3 text-muted-foreground">{text.noShops}</p>}
              {shops.list.length > 0 && (
                <ul className="mt-3 divide-y">
                  {shops.list.map((shop) => (
                    <li key={`${shop.name}-${shop.miles}`}>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${shop.name} ${shop.address || zip}`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between gap-3 py-3 hover:text-primary"
                      >
                        <span className="min-w-0">
                          <span className="block truncate font-semibold">{shop.name}</span>
                          {shop.address && <span className="block truncate text-sm text-muted-foreground">{shop.address}</span>}
                        </span>
                        <span className="shrink-0 text-sm font-semibold tabular-nums text-muted-foreground">{shop.miles} mi</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => speak("food", [text.verdict[food.verdict], food.product, food.summary, food.pesticides].join(". "))}
                className={`flex h-14 items-center justify-center gap-2 rounded-2xl font-semibold transition-all active:scale-95 ${
                  speaking ? "bg-primary text-primary-foreground" : "border bg-card"
                }`}
              >
                {speaking ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
                {listen}
              </button>
              <button
                onClick={() => {
                  setName("");
                  setState({ step: "start" });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-leaf font-semibold text-white transition-all active:scale-95"
              >
                <RotateCcw className="size-5" />
                {text.again}
              </button>
            </div>
          </div>
        );
      })()}
    </section>
  );
}
