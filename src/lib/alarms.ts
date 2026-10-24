"use client";

import { useEffect } from "react";
import type { Clock } from "@/lib/clocks";

const notifiedKey = "furrow-notified";

export function notificationsAllowed() {
  return typeof Notification !== "undefined" && Notification.permission === "granted";
}

export async function askNotifications() {
  if (typeof Notification === "undefined") return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  return (await Notification.requestPermission()) === "granted";
}

export async function notify(title: string, body: string, tag: string) {
  navigator.vibrate?.([300, 150, 300, 150, 300]);
  if (!notificationsAllowed()) return;
  try {
    const registration = await navigator.serviceWorker?.getRegistration();
    if (registration) {
      await registration.showNotification(title, {
        body,
        tag,
        icon: "/icon-192.png",
        badge: "/icon-192.png",
      });
      return;
    }
  } catch {}
  new Notification(title, { body, tag, icon: "/icon-192.png" });
}

function notified(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(notifiedKey) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useClockAlarms(
  clocks: Clock[],
  text: { safeTitle: string; safeBody: string },
) {
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    function fire(clock: Clock) {
      const done = notified();
      if (done.includes(clock.id)) return;
      try {
        localStorage.setItem(notifiedKey, JSON.stringify([...done, clock.id].slice(-50)));
      } catch {}
      notify(text.safeTitle, `${text.safeBody} ${clock.product}`, clock.id);
    }
    const now = Date.now();
    for (const clock of clocks) {
      const wait = clock.endsAt - now;
      if (wait <= 0 && wait > -10 * 60000) fire(clock);
      else if (wait > 0 && wait < 2 ** 31 - 1) timers.push(setTimeout(() => fire(clock), wait));
    }
    return () => timers.forEach(clearTimeout);
  }, [clocks, text.safeTitle, text.safeBody]);
}
