// Photos for guides: the products of the collections a guide links to.
import type { Product } from "@/lib/shopify/types";
import { COLLECTION_BY_HANDLE } from "./collections";
import type { Guide } from "./guides";

/** Up to n products from the guide's linked collections, one per collection first. */
export function guideProducts(g: Guide, n = 4): Product[] {
  const lists = g.links
    .map((l) => l.href.match(/^\/collections\/([a-z0-9-]+)/)?.[1])
    .filter(Boolean)
    .map((h) => COLLECTION_BY_HANDLE.get(h!)?.products ?? []);
  const out: Product[] = [];
  for (let round = 0; out.length < n && round < 8; round++) {
    for (const list of lists) {
      const p = list[round];
      if (p && !out.some((o) => o.handle === p.handle)) out.push(p);
      if (out.length >= n) break;
    }
  }
  return out;
}

export const guideCover = (g: Guide) => guideProducts(g, 1)[0]?.featuredImage ?? null;
