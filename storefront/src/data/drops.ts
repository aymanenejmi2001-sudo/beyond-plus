// Drops: one entry per drop. To create Drop 02, add an object here (and point
// data/merchandising.ts at its slug). No component needs editing.
//
// launchAt is an absolute instant with its UTC offset (Casablanca), so every
// visitor switches at the same moment whatever their device timezone.
import { PRODUCT_BY_HANDLE } from "./catalog";
import type { Product } from "@/lib/shopify/types";

export type DropStatus = "upcoming" | "live" | "archived";
export interface Drop {
  slug: string;
  eyebrow: string;        // "DROP 01"
  title: string;          // "LOW PROFILE"
  subtitle: string;
  name: string;           // page title, e.g. "Low Profile Drop 01"
  description: string;    // meta description of the drop page
  note: string;           // short editorial note on the page
  launchAt: string;       // ISO 8601 with offset
  timeZone: string;       // IANA zone used to display the date
  /** "auto" switches from upcoming to live at launchAt. */
  status: "auto" | DropStatus;
  hero: { product: string; image?: number };
  products: string[];     // catalogue handles, in display order
}

export const DROPS: Drop[] = [
  {
    slug: "low-profile-drop-01",
    eyebrow: "DROP 01",
    title: "LOW PROFILE",
    subtitle: "The slimmer rotation.",
    name: "Low Profile Drop 01",
    description: "Low Profile Drop 01 : Handball Spezial, Samba et silhouettes basses en argent, gomme et imprimé animal. Lancement le 2 octobre 2026 à 20 h.",
    note: "Des silhouettes basses, venues des terrains en salle et des tribunes : argent, gomme, daim et imprimé animal. Cinq paires déjà dans la sélection, réunies en une rotation plus fine.",
    launchAt: "2026-10-02T20:00:00+01:00",
    timeZone: "Africa/Casablanca",
    status: "auto",
    hero: { product: "adidas-handball-spezial-w-silver-violet", image: 0 },
    products: [
      "adidas-handball-spezial-w-silver-violet",
      "adidas-samba-cow-print",
      "adidas-samba-vegan-white-gum",
      "adidas-handball-spezial-shadow-brown-alumina",
      "adidas-samba-leopard-core-black-1",
    ],
  },
];

export const getDrop = (slug: string) => DROPS.find((d) => d.slug === slug) ?? null;

export function dropStatus(drop: Drop, now: number = Date.now()): DropStatus {
  if (drop.status !== "auto") return drop.status;
  return now >= Date.parse(drop.launchAt) ? "live" : "upcoming";
}

/** Only real catalogue products; an unknown handle is skipped, never invented. */
export function dropProducts(drop: Drop): Product[] {
  return drop.products.map((h) => PRODUCT_BY_HANDLE.get(h)).filter((p): p is Product => !!p);
}

export function dropHeroImage(drop: Drop) {
  const p = PRODUCT_BY_HANDLE.get(drop.hero.product) ?? dropProducts(drop)[0];
  return p?.images[drop.hero.image ?? 0] ?? p?.featuredImage ?? null;
}

/** "vendredi 2 octobre 2026, 20 h 00" in the drop's own timezone. */
export function dropDate(drop: Drop) {
  return new Intl.DateTimeFormat("fr-FR", { timeZone: drop.timeZone, weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })
    .format(new Date(drop.launchAt)).replace(/ à (\d\d):(\d\d)/, ", $1 h $2");
}
