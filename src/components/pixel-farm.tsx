"use client";

import { useEffect, useRef } from "react";

const colors = {
  sky: ["#f6f0e0", "#f2e8cf", "#eedfbd", "#ead6aa"],
  sun: "#f2c14e",
  sunCore: "#f8dc8a",
  cloud: "#fffdf7",
  cloudShade: "#e8dfc8",
  farHill: "#c8d3b2",
  farHillShade: "#bac7a3",
  midHill: "#a3bb87",
  tree: "#6e9a59",
  treeLight: "#86b06a",
  treeDark: "#567f45",
  trunk: "#6b4f32",
  barn: "#b4472f",
  barnRoof: "#7b2f22",
  trim: "#f5efe0",
  tower: "#8a8f86",
  soil: "#a8794b",
  soilDark: "#8d6340",
  crop: "#5f8f45",
  cropLight: "#80ae56",
  cropDark: "#41703a",
  tractor: "#d9a23a",
  tractorDark: "#2b3a2f",
  fence: "#7a5a3a",
  grass: "#365f3d",
  grassLight: "#4b7a4b",
  bird: "#3b4a40",
};

function hash(n: number) {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

function ridge(x: number, seed: number, scale: number) {
  return (
    Math.sin(x / (scale * 1.0) + seed) * 0.5 +
    Math.sin(x / (scale * 0.47) + seed * 2.3) * 0.3 +
    Math.sin(x / (scale * 0.21) + seed * 4.1) * 0.2
  );
}

const cloudShape = [
  "....XXXX......",
  "..XXXXXXXX.XX.",
  ".XXXXXXXXXXXXX",
  "XXXXXXXXXXXXXX",
  ".SSSSSSSSSSSS.",
];

const tractorShape = [
  "....DDD.....",
  "....D.D.....",
  ".YYYYYYYYY..",
  ".YYYYYYYYYY.",
  "DDD.YYYY.DDD",
  "DDD......DDD",
];

function sprite(
  ctx: CanvasRenderingContext2D,
  shape: string[],
  x: number,
  y: number,
  palette: Record<string, string>,
) {
  shape.forEach((row, dy) => {
    for (let dx = 0; dx < row.length; dx++) {
      const fill = palette[row[dx]];
      if (!fill) continue;
      ctx.fillStyle = fill;
      ctx.fillRect(Math.round(x) + dx, Math.round(y) + dy, 1, 1);
    }
  });
}

function draw(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  ctx.clearRect(0, 0, w, h);
  const horizon = Math.round(h * 0.52);

  const bands = colors.sky.length;
  for (let i = 0; i < bands; i++) {
    const top = Math.round(horizon * (0.35 + (i / bands) * 0.65));
    ctx.fillStyle = colors.sky[i];
    ctx.fillRect(0, top, w, horizon - top + 2);
    if (i > 0) {
      ctx.fillStyle = colors.sky[i];
      for (let x = (i % 2); x < w; x += 2) ctx.fillRect(x, top - 1, 1, 1);
    }
  }

  const sunX = Math.round(w * 0.78);
  const sunY = Math.round(horizon * 0.5 + Math.sin(t / 4000) * 1.5);
  const radius = Math.max(5, Math.round(h * 0.07));
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const d = dx * dx + dy * dy;
      if (d > radius * radius) continue;
      ctx.fillStyle = d < (radius * 0.6) ** 2 ? colors.sunCore : colors.sun;
      ctx.fillRect(sunX + dx, sunY + dy, 1, 1);
    }
  }

  const cloudSpan = w + 40;
  for (let i = 0; i < 4; i++) {
    const x = ((hash(i + 3) * cloudSpan + t * (0.0016 + i * 0.0006)) % cloudSpan) - 20;
    const y = Math.round(horizon * (0.12 + hash(i + 9) * 0.45));
    sprite(ctx, cloudShape, x, y, { X: colors.cloud, S: colors.cloudShade });
  }

  const far = t * 0.002;
  for (let x = 0; x < w; x++) {
    const top = Math.round(horizon - 6 - (ridge(x + far, 1.7, 26) + 1) * h * 0.06);
    ctx.fillStyle = colors.farHill;
    ctx.fillRect(x, top, 1, horizon - top + 4);
    ctx.fillStyle = colors.farHillShade;
    ctx.fillRect(x, top, 1, 1);
  }

  const mid = t * 0.006;
  const midBase = horizon + 4;
  for (let x = 0; x < w; x++) {
    const top = Math.round(midBase - 2 - (ridge(x + mid, 5.2, 40) + 1) * h * 0.025);
    ctx.fillStyle = colors.midHill;
    ctx.fillRect(x, top, 1, h);
  }

  const treeGap = 7;
  const firstTree = Math.floor(mid / treeGap);
  for (let k = firstTree - 1; k < firstTree + w / treeGap + 2; k++) {
    const x = Math.round(k * treeGap - mid);
    const seed = hash(k);
    if (seed > 0.08 && seed < 0.14) {
      const bx = x;
      const by = midBase - 9;
      ctx.fillStyle = colors.barn;
      ctx.fillRect(bx, by + 3, 11, 7);
      ctx.fillStyle = colors.barnRoof;
      for (let r = 0; r < 4; r++) ctx.fillRect(bx - 1 + r, by + 3 - r, 13 - r * 2, 1);
      ctx.fillStyle = colors.trim;
      ctx.fillRect(bx + 4, by + 6, 3, 4);
      ctx.fillRect(bx + 1, by + 4, 1, 1);
      ctx.fillRect(bx + 9, by + 4, 1, 1);
      continue;
    }
    if (seed > 0.5 && seed < 0.53) {
      ctx.fillStyle = colors.tower;
      ctx.fillRect(x + 1, midBase - 14, 1, 12);
      ctx.fillRect(x + 5, midBase - 14, 1, 12);
      ctx.fillRect(x, midBase - 18, 7, 4);
      ctx.fillStyle = colors.trim;
      ctx.fillRect(x + 1, midBase - 17, 5, 1);
      continue;
    }
    const size = seed > 0.7 ? 3 : 2;
    const ty = midBase - 3 - size * 2;
    ctx.fillStyle = colors.trunk;
    ctx.fillRect(x + size, ty + size * 2, 1, 3);
    ctx.fillStyle = colors.treeDark;
    ctx.fillRect(x, ty + 1, size * 2 + 1, size * 2 - 1);
    ctx.fillStyle = colors.tree;
    ctx.fillRect(x + 1, ty, size * 2 - 1, size * 2 - 1);
    ctx.fillStyle = colors.treeLight;
    ctx.fillRect(x + 1, ty, 1, 1);
  }

  const fieldTop = midBase + 2;
  const fence = h - Math.max(6, Math.round(h * 0.1));
  const rows = Math.max(4, Math.round((fence - fieldTop) / 5));
  const rowHeight = (fence - fieldTop) / rows;
  for (let r = 0; r < rows; r++) {
    const y = Math.round(fieldTop + r * rowHeight);
    const next = Math.round(fieldTop + (r + 1) * rowHeight);
    const speed = 0.01 + (r / rows) * 0.025;
    const shift = t * speed;
    ctx.fillStyle = r % 2 ? colors.soilDark : colors.soil;
    ctx.fillRect(0, y, w, next - y);
    const gap = 3 + Math.round(r / 2);
    const first = Math.floor(shift / gap);
    for (let k = first - 1; k < first + w / gap + 2; k++) {
      const x = Math.round(k * gap - shift);
      const sway = Math.sin(t / 900 + k * 0.7) > 0.6 ? 1 : 0;
      const tall = Math.max(2, next - y - 1);
      ctx.fillStyle = colors.cropDark;
      ctx.fillRect(x, next - tall, 2, tall);
      ctx.fillStyle = hash(k + r * 31) > 0.5 ? colors.crop : colors.cropLight;
      ctx.fillRect(x + sway, next - tall - 1, 1, 2);
    }
  }

  const tractorRow = Math.round(fieldTop + rowHeight * Math.min(2, rows - 1));
  const tractorX = ((t * 0.012) % (w + 60)) - 30;
  sprite(ctx, tractorShape, tractorX, tractorRow - 5 + (Math.floor(t / 180) % 2), {
    Y: colors.tractor,
    D: colors.tractorDark,
  });
  ctx.fillStyle = colors.soilDark;
  for (let i = 1; i < 5; i++) {
    if (hash(Math.floor(t / 120) + i) > 0.5) ctx.fillRect(Math.round(tractorX - i * 2), tractorRow - 1 - (i % 2), 1, 1);
  }

  const fore = t * 0.05;
  ctx.fillStyle = colors.grass;
  ctx.fillRect(0, fence, w, h - fence);
  for (let x = 0; x < w; x++) {
    const blade = hash(Math.floor(x + fore)) > 0.6 ? 1 : 0;
    ctx.fillStyle = colors.grassLight;
    ctx.fillRect(x, fence - blade, 1, 1);
  }
  const postGap = 18;
  const firstPost = Math.floor(fore / postGap);
  ctx.fillStyle = colors.fence;
  ctx.fillRect(0, fence - 4, w, 1);
  ctx.fillRect(0, fence - 2, w, 1);
  for (let k = firstPost - 1; k < firstPost + w / postGap + 2; k++) {
    ctx.fillRect(Math.round(k * postGap - fore), fence - 6, 2, 7);
  }

  for (let i = 0; i < 3; i++) {
    const span = w + 30;
    const x = ((t * (0.01 + i * 0.003) + hash(i + 20) * span) % span) - 15;
    const y = Math.round(horizon * (0.25 + hash(i + 40) * 0.35) + Math.sin(t / 700 + i) * 2);
    const up = Math.floor(t / 220 + i) % 2 === 0;
    ctx.fillStyle = colors.bird;
    ctx.fillRect(Math.round(x), y, 1, 1);
    ctx.fillRect(Math.round(x) - 1, y - (up ? 1 : 0), 1, 1);
    ctx.fillRect(Math.round(x) + 1, y - (up ? 1 : 0), 1, 1);
    ctx.fillRect(Math.round(x) - 2, y - (up ? 2 : -1), 1, 1);
    ctx.fillRect(Math.round(x) + 2, y - (up ? 2 : -1), 1, 1);
  }
}

export function PixelFarm({ className = "" }: { className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = canvas.current;
    const ctx = element?.getContext("2d");
    if (!element || !ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let last = 0;
    const started = performance.now();

    function size() {
      if (!element) return;
      const scale = window.innerWidth < 640 ? 3 : 4;
      element.width = Math.ceil(element.clientWidth / scale);
      element.height = Math.ceil(element.clientHeight / scale);
    }

    function tick(now: number) {
      frame = requestAnimationFrame(tick);
      if (document.hidden || now - last < 33) return;
      last = now;
      draw(ctx!, element!.width, element!.height, now - started + 60000);
    }

    size();
    draw(ctx, element.width, element.height, 60000);
    if (!still) frame = requestAnimationFrame(tick);
    const resize = () => {
      size();
      draw(ctx, element.width, element.height, performance.now() - started + 60000);
    };
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvas}
      aria-hidden
      className={`pointer-events-none block h-full w-full [image-rendering:pixelated] ${className}`}
    />
  );
}
