// Catalogue-aware drop helpers. The drops themselves are configured in
// data/drops-config.ts (kept free of imports so the catalogue can read it).
import { PRODUCT_BY_HANDLE } from "./catalog";
import type { Product } from "@/lib/shopify/types";
import type { Drop, LaunchDrop } from "./drops-config";

export * from "./drops-config";

/** Only real catalogue products; an unknown handle is skipped, never invented. */
export function dropProducts(drop: Drop): Product[] {
  return drop.products.map((h) => PRODUCT_BY_HANDLE.get(h)).filter((p): p is Product => !!p);
}

export function dropHeroImage(drop: Drop) {
  const p = PRODUCT_BY_HANDLE.get(drop.hero.product) ?? dropProducts(drop)[0];
  return p?.images[drop.hero.image ?? 0] ?? p?.featuredImage ?? null;
}

/** "vendredi 2 octobre 2026, 20 h 00" in the drop's own timezone. */
export function dropDate(drop: LaunchDrop) {
  return new Intl.DateTimeFormat("fr-FR", { timeZone: drop.timeZone, weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })
    .format(new Date(drop.launchAt)).replace(/ à (\d\d):(\d\d)/, ", $1 h $2");
}
