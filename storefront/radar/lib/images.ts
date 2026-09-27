// Authorized supplier images → local WebP files in public/radar-products/
// (a folder the catalogue pipeline never cleans). Same rules as
// catalog/images.ts: ≥ 700 px, never enlarged, deduped, polite + cached fetch.

import { createHash } from "node:crypto";
import { mkdir, stat } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { politeFetch } from "../../catalog/lib/http.ts";

export const RADAR_IMG_DIR = "radar-products";
const MIN_EDGE = 700, MASTER_EDGE = 2000, MAX_VIEWS = 7;

export interface LocalImage { url: string; width: number; height: number }

export async function ingest(slug: string, sources: { url: string; width: number; height: number }[]): Promise<LocalImage[]> {
  const dir = join(process.cwd(), "public", RADAR_IMG_DIR);
  await mkdir(dir, { recursive: true });
  const out: LocalImage[] = [];
  const seen = new Set<string>();
  for (const s of sources) {
    if (out.length >= MAX_VIEWS) break;
    if (Math.max(s.width, s.height) < MIN_EDGE) continue;
    const buf = (await politeFetch(s.url, { binary: true, maxAgeH: 24 * 30 })) as Buffer | null;
    if (!buf) continue;
    const h = createHash("sha256").update(buf).digest("hex");
    if (seen.has(h)) continue;
    seen.add(h);
    const name = `${slug}-${String(out.length + 1).padStart(2, "0")}.webp`;
    const file = join(dir, name);
    if (!(await stat(file).then(() => true, () => false))) {
      await sharp(buf).rotate().resize({ width: MASTER_EDGE, height: MASTER_EDGE, fit: "inside", withoutEnlargement: true }).webp({ quality: 86, effort: 5 }).toFile(file);
    }
    const m = await sharp(file).metadata();
    out.push({ url: `/${RADAR_IMG_DIR}/${name}`, width: m.width!, height: m.height! });
  }
  return out;
}
