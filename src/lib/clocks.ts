"use client";

import { useCallback, useEffect, useState } from "react";
import { loadProfile, saveProfile } from "@/lib/cloud";

export type Clock = { id: string; product: string; endsAt: number };

const storageKey = "furrow-clocks";

function load(): Clock[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(clocks: Clock[]) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(clocks));
  } catch {}
  saveProfile({ clocks }).catch(() => {});
}

export function useClocks(uid?: string) {
  const [clocks, setClocks] = useState<Clock[]>([]);
  const [now, setNow] = useState(0);

  useEffect(() => {
    const start = setTimeout(() => {
      setClocks(load());
      setNow(Date.now());
    }, 0);
    const timer = setInterval(() => setNow(Date.now()), 15000);
    return () => {
      clearTimeout(start);
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!uid) return;
    let active = true;
    loadProfile()
      .then((profile) => {
        if (!active || !profile.clocks) return;
        setClocks(profile.clocks);
        try {
          localStorage.setItem(storageKey, JSON.stringify(profile.clocks));
        } catch {}
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [uid]);

  const add = useCallback(
    (product: string, sprayedAt: number, hours: number) => {
      setClocks((current) => {
        const next = [
          ...current,
          {
            id: `${sprayedAt}-${current.length}`,
            product,
            endsAt: sprayedAt + hours * 3600000,
          },
        ];
        save(next);
        return next;
      });
      setNow(Date.now());
    },
    [],
  );

  const remove = useCallback((id: string) => {
    setClocks((current) => {
      const next = current.filter((clock) => clock.id !== id);
      save(next);
      return next;
    });
  }, []);

  return { clocks, now, add, remove };
}

export function timeLeft(endsAt: number, now: number) {
  const minutes = Math.max(0, Math.ceil((endsAt - now) / 60000));
  return {
    done: minutes === 0,
    hours: Math.floor(minutes / 60),
    minutes: minutes % 60,
  };
}
