// Polite HTTP: robots.txt, one request per host per interval, timeout, retry
// with backoff, on-disk cache. Never sends cookies or credentials, never
// retries a 401/403/429 challenge — a block is logged and respected.

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const UA = "BeyondPlus-Catalogue/1.0 (+https://beyond-plus-gamma.vercel.app)";
const CACHE_DIR = fileURLToPath(new URL("../.cache/http/", import.meta.url));
const MIN_INTERVAL_MS = 1200;
const lastHit = new Map<string, number>();
const robotsCache = new Map<string, string[]>();

export const log: { level: string; msg: string; url?: string }[] = [];
export function note(level: "info" | "warn" | "error", msg: string, url?: string) {
  log.push({ level, msg, url });
  if (level !== "info") console.warn(`[${level}] ${msg}${url ? " — " + url : ""}`);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function throttle(host: string) {
  const wait = (lastHit.get(host) ?? 0) + MIN_INTERVAL_MS - Date.now();
  if (wait > 0) await sleep(wait);
  lastHit.set(host, Date.now());
}

async function disallowed(url: URL): Promise<boolean> {
  if (!robotsCache.has(url.host)) {
    let rules: string[] = [];
    try {
      await throttle(url.host);
      const res = await fetch(`${url.origin}/robots.txt`, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(15000) });
      if (res.ok) {
        let applies = false;
        for (const raw of (await res.text()).split("\n")) {
          const line = raw.split("#")[0].trim();
          const [k, ...rest] = line.split(":");
          const v = rest.join(":").trim();
          if (/^user-agent$/i.test(k)) applies = v === "*";
          else if (applies && /^disallow$/i.test(k) && v) rules.push(v);
        }
      }
    } catch { rules = []; }
    robotsCache.set(url.host, rules);
  }
  const path = url.pathname + url.search;
  return robotsCache.get(url.host)!.some((rule) => {
    const rx = new RegExp("^" + rule.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*"));
    return rx.test(path);
  });
}

export async function politeFetch(href: string, { binary = false, useCache = true, maxAgeH = 24 } = {}): Promise<Buffer | string | null> {
  const url = new URL(href);
  const key = createHash("sha1").update(href).digest("hex");
  const file = join(CACHE_DIR, key);
  if (useCache) {
    try {
      const meta = JSON.parse(await readFile(file + ".json", "utf8"));
      if (Date.now() - meta.at < maxAgeH * 3600e3) {
        const buf = await readFile(file);
        return binary ? buf : buf.toString("utf8");
      }
    } catch { /* miss */ }
  }
  if (await disallowed(url)) { note("warn", "robots.txt disallows", href); return null; }

  for (let attempt = 1; attempt <= 3; attempt++) {
    await throttle(url.host);
    try {
      const res = await fetch(href, { headers: { "User-Agent": UA, Accept: binary ? "image/*" : "application/json,text/html" }, signal: AbortSignal.timeout(30000) });
      if ([401, 403, 429].includes(res.status)) { note("warn", `blocked (${res.status}) — not retried`, href); return null; }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      await mkdir(CACHE_DIR, { recursive: true });
      await writeFile(file, buf);
      await writeFile(file + ".json", JSON.stringify({ href, at: Date.now() }));
      return binary ? buf : buf.toString("utf8");
    } catch (e) {
      note(attempt === 3 ? "error" : "info", `attempt ${attempt}: ${(e as Error).message}`, href);
      if (attempt < 3) await sleep(1500 * attempt);
    }
  }
  return null;
}
