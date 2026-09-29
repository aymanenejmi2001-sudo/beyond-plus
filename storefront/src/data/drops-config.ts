// Drops & edits: one entry each. The /drops hub, /drops/[slug], sitemap and
// promotion tracking all read this file; no component needs editing.
//
// kind "edit": an editorial selection of pairs already on sale. No date, no
//   countdown, no upcoming/live state: always "available now".
// kind "drop": a real launch. Only for pairs that cannot be bought before
//   launchAt: they are marked previewOnly in the catalogue until then (see
//   data/catalog.ts), shown "COMING SOON" with the real date and a countdown,
//   and become purchasable at launchAt (rebuild or revalidate the site then).
//   launchAt is an absolute instant with its UTC offset, so the switch happens
//   at the same moment for every visitor whatever their device timezone.

export type DropStatus = "upcoming" | "live" | "archived";
interface Base {
  slug: string;
  eyebrow: string;        // "EDIT", "DROP 02"…
  title: string;          // "LOW PROFILE"
  name: string;           // page title, e.g. "Low Profile"
  subtitle: string;
  description: string;    // meta description
  note: string;           // short editorial note on the page
  hero: { product: string; image?: number };
  products: string[];     // catalogue handles, in display order
}
export interface Edit extends Base { kind: "edit"; archived?: boolean }
export interface LaunchDrop extends Base {
  kind: "drop";
  launchAt: string;       // ISO 8601 with offset, e.g. "2026-11-06T20:00:00+01:00"
  timeZone: string;       // IANA zone used to display the date
  /** "auto": upcoming → live at launchAt. Set "archived" after the campaign. */
  status: "auto" | DropStatus;
}
export type Drop = Edit | LaunchDrop;

export const DROPS: Drop[] = [
  {
    kind: "edit",
    slug: "low-profile",
    eyebrow: "EDIT",
    title: "LOW PROFILE",
    name: "Low Profile",
    subtitle: "The slimmer rotation.",
    description: "Low Profile, la sélection BEYOND PLUS : Handball Spezial, Samba et silhouettes basses en argent, gomme, daim et imprimé animal. Disponible maintenant.",
    note: "Des silhouettes basses, venues des terrains en salle et des tribunes : argent, gomme, daim et imprimé animal. Cinq paires de la sélection, réunies en une rotation plus fine.",
    hero: { product: "adidas-handball-spezial-w-silver-violet", image: 0 },
    products: [
      "adidas-handball-spezial-w-silver-violet",
      "adidas-samba-cow-print",
      "adidas-samba-vegan-white-gum",
      "adidas-handball-spezial-shadow-brown-alumina",
      "adidas-samba-leopard-core-black",
    ],
  },
];

export const getDrop = (slug: string) => DROPS.find((d) => d.slug === slug) ?? null;
export const isPublic = (d: Drop) => (d.kind === "edit" ? !d.archived : d.status !== "archived");

/** Launch status of a real drop; an edit is always available. */
export function dropStatus(drop: Drop, now: number = Date.now()): DropStatus | "available" {
  if (drop.kind === "edit") return drop.archived ? "archived" : "available";
  if (drop.status !== "auto") return drop.status;
  return now >= Date.parse(drop.launchAt) ? "live" : "upcoming";
}

/** Handles held back until their drop launches (read by data/catalog.ts). */
export function upcomingLaunches(drops: Drop[], now: number = Date.now()) {
  const out = new Map<string, string>();
  for (const d of drops) if (d.kind === "drop" && dropStatus(d, now) === "upcoming") d.products.forEach((h) => out.set(h, d.launchAt));
  return out;
}
