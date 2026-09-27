// Supplier adapter for Shopify storefronts that expose the public
// /products.json feed (allowed by their robots.txt). Plumas Kicks is the
// authorized BEYOND PLUS supplier — its images may be republished.

import { politeFetch, note } from "../lib/http.ts";
import type { Candidate } from "./types.ts";

interface ShopifyProduct {
  id: number; title: string; handle: string; published_at: string;
  variants: { id: number; option1: string; available: boolean; price: string; compare_at_price: string | null; sku: string | null }[];
  images: { src: string; width: number; height: number }[];
}

export const SUPPLIERS = [
  { name: "Plumas Kicks", base: "https://www.plumaskicks.com", imagesAuthorized: true, bestSellerCollection: "best-sellers" },
];

async function allPages(base: string, path: string, maxAgeH: number): Promise<ShopifyProduct[]> {
  const out: ShopifyProduct[] = [];
  for (let page = 1; page <= 20; page++) {
    const body = await politeFetch(`${base}${path}?limit=250&page=${page}`, { maxAgeH });
    if (!body) break;
    const items = (JSON.parse(body as string).products ?? []) as ShopifyProduct[];
    out.push(...items);
    if (items.length < 250) break;
  }
  return out;
}

export async function fetchSupplier(s: (typeof SUPPLIERS)[number], maxAgeH = 24): Promise<Candidate[]> {
  const products = await allPages(s.base, "/products.json", maxAgeH);
  const best = new Set((await allPages(s.base, `/collections/${s.bestSellerCollection}/products.json`, maxAgeH)).map((p) => p.handle));
  note("info", `${s.name}: ${products.length} produits, ${best.size} best-sellers`);
  const seen = new Set<string>();
  return products.filter((p) => !seen.has(p.handle) && seen.add(p.handle)).map((p) => {
    const prices = p.variants.map((v) => Number(v.price)).filter((n) => n > 0);
    const compare = p.variants.map((v) => Number(v.compare_at_price)).filter((n) => n > 0);
    return {
      sourceName: s.name,
      sourceType: "supplier",
      imagesAuthorized: s.imagesAuthorized,
      sourceUrl: `${s.base}/products/${p.handle}`,
      sourceProductCode: p.variants.find((v) => v.sku)?.sku ?? null,
      handle: p.handle,
      title: p.title.trim(),
      sizes: p.variants.map((v) => String(v.option1)),
      availableSizes: p.variants.filter((v) => v.available).map((v) => String(v.option1)),
      priceMAD: prices.length ? Math.min(...prices) : null,
      compareAtMAD: compare.length ? Math.min(...compare) : null,
      images: p.images.map((i) => ({ url: i.src.split("?")[0], width: i.width, height: i.height })),
      publishedAt: p.published_at,
      bestSeller: best.has(p.handle),
    };
  });
}
