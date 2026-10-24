"use client";

import { LoaderCircle, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { appCopy } from "@/lib/app-copy";
import { listScans, type SavedScan } from "@/lib/cloud";
import { useCopy } from "@/lib/i18n";
import type { Language, Signal } from "@/lib/scan";

type Pinned = SavedScan & { latitude: number; longitude: number };

const pinColor: Record<Signal, string> = {
  danger: "bg-danger",
  warning: "bg-orange-500",
  caution: "bg-harvest",
  unknown: "bg-primary",
};

function world(latitude: number, longitude: number, zoom: number) {
  const scale = 256 * 2 ** zoom;
  const sin = Math.sin((latitude * Math.PI) / 180);
  return {
    x: ((longitude + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale,
  };
}

function layout(points: Pinned[]) {
  let zoom = 16;
  for (; zoom > 3; zoom--) {
    const spots = points.map((point) => world(point.latitude, point.longitude, zoom));
    const width = Math.max(...spots.map((s) => s.x)) - Math.min(...spots.map((s) => s.x));
    const height = Math.max(...spots.map((s) => s.y)) - Math.min(...spots.map((s) => s.y));
    if (width < 440 && height < 440) break;
  }
  const spots = points.map((point) => world(point.latitude, point.longitude, zoom));
  const centerX = spots.reduce((sum, s) => sum + s.x, 0) / spots.length;
  const centerY = spots.reduce((sum, s) => sum + s.y, 0) / spots.length;
  const originX = centerX - 384;
  const originY = centerY - 384;
  const firstTileX = Math.floor(originX / 256);
  const firstTileY = Math.floor(originY / 256);
  const tiles = [];
  for (let row = 0; row < 4; row++) {
    for (let column = 0; column < 4; column++) {
      const x = firstTileX + column;
      const y = firstTileY + row;
      tiles.push({
        key: `${x}-${y}`,
        src: `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`,
        left: ((x * 256 - originX) / 768) * 100,
        top: ((y * 256 - originY) / 768) * 100,
      });
    }
  }
  const pins = spots.map((spot) => ({
    left: ((spot.x - originX) / 768) * 100,
    top: ((spot.y - originY) / 768) * 100,
  }));
  return { tiles, pins };
}

export function SprayMap({ language }: { language: Language }) {
  const text = useCopy(appCopy, language).map;
  const [scans, setScans] = useState<SavedScan[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let alive = true;
    listScans()
      .then((items) => alive && setScans(items))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, []);

  const pinned = (scans ?? []).filter(
    (scan): scan is Pinned =>
      typeof scan.latitude === "number" && typeof scan.longitude === "number",
  );
  const map = pinned.length ? layout(pinned) : null;
  const selected = pinned[active];

  return (
    <section className="rise pt-6 pb-10">
      <h1 className="font-display text-4xl font-semibold leading-[1.02] text-primary sm:text-5xl">
        {text.title}
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">{text.intro}</p>

      {failed && (
        <p role="alert" className="mt-6 rounded-2xl bg-red-50 p-4 text-red-800">
          {text.failed}
        </p>
      )}
      {!failed && !scans && (
        <p className="mt-10 flex items-center justify-center gap-2 text-muted-foreground">
          <LoaderCircle className="size-5 animate-spin" />
          {text.loading}
        </p>
      )}
      {scans && pinned.length === 0 && (
        <p className="mt-6 rounded-2xl border border-dashed p-6 text-center text-muted-foreground">
          {text.empty}
        </p>
      )}

      {map && (
        <>
          <div className="pop relative mt-6 aspect-square w-full overflow-hidden rounded-3xl border bg-secondary shadow-lg">
            {map.tiles.map((tile) => (
              <img
                key={tile.key}
                src={tile.src}
                alt=""
                className="absolute w-1/3 max-w-none select-none saturate-[0.6]"
                style={{ left: `${tile.left}%`, top: `${tile.top}%` }}
                draggable={false}
              />
            ))}
            {map.pins.map((pin, index) => {
              const scan = pinned[index];
              const on = index === active;
              return (
                <button
                  key={scan.id}
                  onClick={() => setActive(index)}
                  aria-label={scan.result.product}
                  className="absolute -translate-x-1/2 -translate-y-full transition-transform duration-300 [transition-timing-function:var(--ease-spring)] hover:scale-110"
                  style={{ left: `${pin.left}%`, top: `${pin.top}%`, zIndex: on ? 20 : 10 }}
                >
                  <span
                    className={`flex items-center justify-center rounded-full border-[3px] border-white text-white shadow-lg transition-all ${pinColor[scan.result.signal]} ${on ? "size-11" : "size-8"}`}
                  >
                    <MapPin className={on ? "size-5" : "size-4"} />
                  </span>
                  {on && <span className="pulse-ring absolute inset-0 rounded-full bg-white/50" />}
                </button>
              );
            })}
            <p className="absolute bottom-1 right-2 rounded bg-white/80 px-1.5 text-[10px] text-neutral-600">
              © OpenStreetMap contributors
            </p>
          </div>
          {selected && (
            <div key={selected.id} className="pop card mt-4 flex items-center gap-4 p-3">
              <img src={selected.thumb} alt="" className="h-16 w-14 rounded-lg border object-cover object-top" />
              <div className="min-w-0">
                <p className="truncate font-semibold">{selected.result.product}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(selected.createdAt).toLocaleString(language, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
                <p className="mt-1 text-sm">{selected.result.reentry}</p>
              </div>
            </div>
          )}
          {scans && scans.length > pinned.length && (
            <p className="mt-4 text-sm text-muted-foreground">
              {text.noPlace} ({scans.length - pinned.length})
            </p>
          )}
        </>
      )}
    </section>
  );
}
