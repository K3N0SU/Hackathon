import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
const root = path.join(import.meta.dirname, "..", "src", "lib");
const server = process.env.FURROW_URL || "http://localhost:3000";
function load(file) {
  const js = ts.transpileModule(fs.readFileSync(path.join(root, file), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const m = { exports: {} };
  new Function("module", "exports", "require", js)(m, m.exports, () => ({}));
  return m.exports;
}
function fingerprint(value) {
  const source = JSON.stringify(value);
  let hash = 0;
  for (let i = 0; i < source.length; i++) hash = (hash * 31 + source.charCodeAt(i)) | 0;
  return (hash >>> 0).toString(36);
}
function same(a, b) {
  if (typeof a === "string") return typeof b === "string";
  if (Array.isArray(a)) return Array.isArray(b) && a.length === b.length && a.every((x, i) => same(x, b[i]));
  if (a && typeof a === "object") return !!b && typeof b === "object" && Object.keys(a).every((k) => same(a[k], b[k]));
  return a === b;
}
const dictionaries = [
  load("scan.ts").copy, load("heat.ts").heatCopy, load("exposure.ts").exposureCopy, load("auth-copy.ts").authCopy,
  load("app-copy.ts").appCopy, load("app-copy.ts").scannerCopy, load("camera-copy.ts").cameraCopy, load("saved-copy.ts").savedCopy, load("tools-copy.ts").toolsCopy,
].map((d) => d.en);
const languages = (process.argv[2] || "hmn,tl,hi,ar,vi,fr,ur,zh,ko,ru,hy,fa,ja,pt").split(",");
async function translate(language, strings) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const r = await fetch(`${server}/api/translate`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ language, strings }) });
    if (r.ok) { const out = await r.json(); if (same(strings, out)) return out; }
  }
  throw new Error(`failed ${language}`);
}
(async () => {
  await Promise.all(languages.map(async (language) => {
    const file = path.join(root, "translations", `${language}.json`);
    const bundle = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {};
    const next = {};
    for (const strings of dictionaries) {
      const key = fingerprint(strings);
      next[key] = bundle[key] && same(strings, bundle[key]) ? bundle[key] : await translate(language, strings);
    }
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(next, null, 1) + "\n");
    console.log("done", language, Object.keys(next).length);
  }));
})().catch((e) => { console.error(e.message); process.exit(1); });
