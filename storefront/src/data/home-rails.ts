// Builds the homepage rails from data/merchandising.ts and the catalogue's own
// merch.label. A pair appears in one rail only (first rail wins).
import { CATALOG, PRODUCT_BY_HANDLE } from "./catalog";
import { HOME_MERCHANDISING as M } from "./merchandising";
import type { Product } from "@/lib/shopify/types";

const byRank = (a: Product, b: Product) => (b.merch?.rank ?? 0) - (a.merch?.rank ?? 0);

export function homeRails() {
  const seen = new Set<string>();
  const take = (list: Product[], max: number) => {
    const out = list.filter((p) => p.availableForSale && !seen.has(p.handle)).slice(0, max);
    out.forEach((p) => seen.add(p.handle));
    return out;
  };
  const trending = take(M.trending.map((h) => PRODUCT_BY_HANDLE.get(h)).filter((p): p is Product => !!p), 8);
  const newIn = take(CATALOG.filter((p) => p.merch?.label === M.newIn.label).sort(byRank), M.newIn.max);
  const picks = take(CATALOG.filter((p) => p.merch?.label === M.beyondPick.label).sort(byRank), M.beyondPick.max);
  return { trending, newIn, picks };
}
