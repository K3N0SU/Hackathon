"use client";

import { loadProfile, saveProfile } from "@/lib/cloud";

export type HistoryEntry = { tool: string; at: string; details: Record<string, unknown> };

const historyKey = "furrow-history";

export function readHistory(): HistoryEntry[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(historyKey) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function remember(tool: string, details: Record<string, unknown>) {
  const entry: HistoryEntry = {
    tool,
    at: new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
    details,
  };
  const next = [entry, ...readHistory()].slice(0, 20);
  try {
    localStorage.setItem(historyKey, JSON.stringify(next));
  } catch {}
  saveProfile({ history: next }).catch(() => {});
}

export async function syncHistory() {
  try {
    const profile = await loadProfile();
    if (!profile.history?.length) return;
    const local = readHistory();
    const merged = [...local, ...profile.history.filter((item) => !local.some((mine) => mine.at === item.at && mine.tool === item.tool))].slice(0, 20);
    localStorage.setItem(historyKey, JSON.stringify(merged));
  } catch {}
}
