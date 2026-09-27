// Pairs published from Radar live in src/data/radar-products.json (merged
// into the catalogue by src/data/catalog.ts), not in catalog.json — so
// `npm run catalog`, which rewrites catalog.json, can never erase them.
// Also keeps their entries in the site search index.

import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getStore } from "../lib/store.ts";

type P = { handle: string; title: string; vendor: string; images: { url: string }[]; priceRange: { minVariantPrice: { amount: string } }; merch?: { model?: string; color?: string; style?: string } };
const file = (f: string) => join(process.cwd(), f);
const readJson = async <T,>(f: string, d: T): Promise<T> => { try { return JSON.parse(await readFile(file(f), "utf8")); } catch { return d; } };

export async function writeSiteFiles() {
  const drafts = await getStore().list("catalogue_products", { eq: { status: "IMPORTED" } });
  const base = new Set((await readJson<P[]>("src/data/catalog.json", [])).map((p) => p.handle));
  const products = drafts
    .map((d) => { const { radar: _r, ...p } = d.product as Record<string, unknown>; return p as unknown as P; })
    .filter((p, i, all) => !base.has(p.handle) && all.findIndex((x) => x.handle === p.handle) === i);
  await writeFile(file("src/data/radar-products.json"), JSON.stringify(products));

  const idx = (await readJson<{ h: string; r?: number }[]>("public/search-index.json", [])).filter((e) => !e.r);
  const have = new Set(idx.map((e) => e.h));
  for (const p of products) if (!have.has(p.handle)) idx.push({ h: p.handle, t: p.title, b: p.vendor, m: p.merch?.model, c: p.merch?.color, s: p.merch?.style, p: Number(p.priceRange.minVariantPrice.amount), i: p.images[0]?.url ?? null, r: 1 } as never);
  await writeFile(file("public/search-index.json"), JSON.stringify(idx));

  // Owner photos on products already on the site.
  const extra: Record<string, { url: string; altText: string | null; width: number; height: number }[]> = {};
  for (const ph of await getStore().list("site_photos", { order: { col: "created_at", asc: true } })) {
    (extra[ph.handle] ??= []).push({ url: ph.url, altText: ph.alt_text, width: ph.width, height: ph.height });
  }
  await writeFile(file("src/data/extra-images.json"), JSON.stringify(extra, null, 1));
  return products.length;
}

export async function siteHandles(): Promise<Set<string>> {
  const a = await readJson<P[]>("src/data/catalog.json", []), b = await readJson<P[]>("src/data/radar-products.json", []);
  return new Set([...a, ...b].map((p) => p.handle));
}
