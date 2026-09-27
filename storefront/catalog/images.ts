// Authorized images only. Original resolution in, one WebP master out per
// view (never enlarged, never recoloured, never retouched). Next/Image then
// serves AVIF/WebP at the right width for each device.

import { createHash } from "node:crypto";
import { mkdir, stat } from "node:fs/promises";
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { politeFetch, note } from "./lib/http.ts";
import type { ImageAsset } from "./types.ts";

const OUT_DIR = fileURLToPath(new URL("../public/products/", import.meta.url));
export const MIN_EDGE = 700;         // below this: visibly soft, rejected
export const TARGET_EDGE = 1400;     // below this: accepted, flagged lowRes
const MASTER_EDGE = 2000;
const MAX_VIEWS = 7;
const seenHashes = new Map<string, string>();   // sha256 → file (global dedupe)

export async function ingestImages(slug: string, alt: string, sources: { url: string; width: number; height: number }[], authorized: boolean): Promise<ImageAsset[]> {
  if (!authorized) {
    return sources.map((s) => ({ file: null, sourceUrl: s.url, width: s.width, height: s.height, sha256: null, lowRes: Math.max(s.width, s.height) < TARGET_EDGE, alt }));
  }
  await mkdir(OUT_DIR, { recursive: true });
  const out: ImageAsset[] = [];
  const local = new Set<string>();
  for (const s of sources) {
    if (out.length >= MAX_VIEWS) break;
    if (Math.max(s.width, s.height) < MIN_EDGE) { note("warn", `image rejetée (${s.width}px)`, s.url); continue; }
    const buf = (await politeFetch(s.url, { binary: true, maxAgeH: 24 * 30 })) as Buffer | null;
    if (!buf) continue;
    const sha256 = createHash("sha256").update(buf).digest("hex");
    if (local.has(sha256)) continue;
    local.add(sha256);

    const n = String(out.length + 1).padStart(2, "0");
    const name = `${slug}-${n}.webp`;
    const file = `/products/${name}`;
    const prior = seenHashes.get(sha256);
    if (prior && prior !== file) note("info", `image partagée avec ${prior}`, s.url);
    seenHashes.set(sha256, file);

    const meta = await sharp(buf).metadata();
    const w = meta.width ?? s.width, h = meta.height ?? s.height;
    const exists = await stat(OUT_DIR + name).then(() => true, () => false);
    let size = { width: w, height: h };
    if (!exists) {
      const info = await sharp(buf).rotate().resize({ width: MASTER_EDGE, height: MASTER_EDGE, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 86, effort: 5 }).toFile(OUT_DIR + name);
      size = { width: info.width, height: info.height };
    } else {
      const m = await sharp(OUT_DIR + name).metadata();
      size = { width: m.width!, height: m.height! };
    }
    out.push({ file, sourceUrl: s.url, ...size, sha256, lowRes: Math.max(w, h) < TARGET_EDGE, alt: `${alt}, vue ${out.length + 1}` });
  }
  return out;
}
