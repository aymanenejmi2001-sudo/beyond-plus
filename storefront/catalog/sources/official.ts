// Official brand sites — METADATA ONLY (product code, retail price, release
// year) read from the page's schema.org JSON-LD. Only the exact product URL
// set in the manifest is requested; no crawling, no pagination. Brand images
// are recorded for research and are always NOT_PUBLISHABLE.
// Most of these sites run anti-bot protection: a 403 is logged, never bypassed.

import { politeFetch, note } from "../lib/http.ts";
import type { Metadata } from "./types.ts";

export const OFFICIAL_DOMAINS: Record<string, string[]> = {
  adidas: ["adidas.com", "adidas.fr", "adidas.co.ma"],
  PUMA: ["puma.com"],
  ASICS: ["asics.com"],
  "New Balance": ["newbalance.com", "newbalance.fr"],
  Nike: ["nike.com"],
  Jordan: ["nike.com"],
  Salomon: ["salomon.com"],
  Saucony: ["saucony.com"],
  Vans: ["vans.com", "vans.fr"],
  Mizuno: ["mizuno.com"],
};

type Json = Record<string, unknown>;

function findProduct(node: unknown): Json | null {
  if (Array.isArray(node)) { for (const n of node) { const f = findProduct(n); if (f) return f; } return null; }
  if (node && typeof node === "object") {
    const o = node as Json;
    const t = o["@type"];
    if (t === "Product" || (Array.isArray(t) && t.includes("Product"))) return o;
    if (o["@graph"]) return findProduct(o["@graph"]);
  }
  return null;
}

export async function fetchOfficial(brand: string, url: string): Promise<Metadata | null> {
  const host = new URL(url).hostname.replace(/^www\./, "");
  if (!(OFFICIAL_DOMAINS[brand] ?? []).some((d) => host.endsWith(d))) {
    note("warn", `${url} n'est pas un domaine officiel ${brand} — ignoré`);
    return null;
  }
  const html = (await politeFetch(url, { maxAgeH: 24 * 7 })) as string | null;
  if (!html) return null;
  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const p = findProduct(JSON.parse(m[1]));
      if (!p) continue;
      const offers = (Array.isArray(p.offers) ? p.offers[0] : p.offers) as Json | undefined;
      const date = String(p.releaseDate ?? p.productionDate ?? "");
      const img = p.image;
      return {
        sourceUrl: url,
        sourceProductCode: (p.sku ?? p.mpn ?? p.productID ?? null) as string | null,
        releaseYear: /^\d{4}/.test(date) ? Number(date.slice(0, 4)) : null,
        retailPrice: offers?.price ? Number(offers.price) : null,
        images: (Array.isArray(img) ? img : img ? [img] : []).map(String),
      };
    } catch { /* malformed block */ }
  }
  note("warn", "aucun JSON-LD Product trouvé", url);
  return null;
}
