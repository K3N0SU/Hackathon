"use client";

import { useEffect, useState } from "react";
import { isCore, type CoreLanguage, type Language } from "@/lib/scan";

function fingerprint(value: unknown) {
  const source = JSON.stringify(value);
  let hash = 0;
  for (let index = 0; index < source.length; index++) {
    hash = (hash * 31 + source.charCodeAt(index)) | 0;
  }
  return (hash >>> 0).toString(36);
}

function sameShape(a: unknown, b: unknown): boolean {
  if (typeof a === "string") return typeof b === "string";
  if (Array.isArray(a)) {
    return (
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((item, index) => sameShape(item, b[index]))
    );
  }
  if (a && typeof a === "object") {
    if (!b || typeof b !== "object") return false;
    return Object.keys(a).every((key) =>
      sameShape(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key],
      ),
    );
  }
  return a === b;
}

const pending = new Map<string, Promise<unknown>>();

export async function translateStrings<T>(
  strings: T,
  language: Language,
): Promise<T> {
  if (language === "en") return strings;
  const print = fingerprint(strings);
  try {
    const bundle: Record<string, unknown> = (
      await import(`./translations/${language}.json`)
    ).default;
    if (sameShape(strings, bundle[print])) return bundle[print] as T;
  } catch {}
  const key = `furrow-ui-${language}-${print}`;
  try {
    const cached = localStorage.getItem(key);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (sameShape(strings, parsed)) return parsed as T;
    }
  } catch {}
  let request = pending.get(key) as Promise<T> | undefined;
  if (!request) {
    request = fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, strings }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("translate failed");
        return response.json();
      })
      .then((translated: T) => {
        if (!sameShape(strings, translated)) throw new Error("shape changed");
        try {
          localStorage.setItem(key, JSON.stringify(translated));
        } catch {}
        return translated;
      })
      .finally(() => pending.delete(key));
    pending.set(key, request);
  }
  return request;
}

export function useCopy<T>(dictionary: Record<CoreLanguage, T>, language: Language) {
  const [extra, setExtra] = useState<{ language: Language; value: T } | null>(
    null,
  );

  useEffect(() => {
    if (isCore(language)) return;
    let active = true;
    translateStrings(dictionary.en, language)
      .then((value) => {
        if (active) setExtra({ language, value });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [dictionary, language]);

  if (isCore(language)) return dictionary[language];
  return extra?.language === language ? extra.value : dictionary.en;
}

export function pick<T>(dictionary: Record<CoreLanguage, T>, language: Language) {
  return isCore(language) ? dictionary[language] : dictionary.en;
}
