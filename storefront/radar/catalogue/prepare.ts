// Approved candidate → a draft in the storefront's own Product shape
// (src/lib/shopify/types.ts, identical to src/data/catalog.json entries), so it
// renders in the existing cards and pages without any visual change.
// Drafts are publishable = false until an admin marks them ready, and nothing
// here writes to the live catalogue — see radar/jobs/import.ts.

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { MIN_PHOTOS } from "../config/scoring.ts";
import { colorFamily as guessColor } from "../../catalog/lib/colors.ts";
import { writeCopy } from "../../catalog/lib/copy.ts";
import type { ColorFamily, StyleFamily } from "../../catalog/types.ts";
import type { Candidate, SupplierOffer } from "../lib/types.ts";
import { slugify } from "../normalizers/candidate.ts";
import { displayTitle } from "../normalizers/names.ts";

interface NormalizedLite {
  id: string; slug: string; fullName: string; colorway: string; colorFamily: ColorFamily; styleFamily: StyleFamily; silhouette: string;
  gender: "women" | "men" | "unisex"; description: string; shortDescription: string; tags: string[]; collections: string[];
  sizes: string[]; availableSizes: string[]; images: { file: string | null; alt: string; width: number; height: number }[]; sourceUrl: string;
}

const COLOR_LABEL: Record<string, string> = {
  "silver-white": "Argent / Blanc", "black-silver": "Noir / Argent", "black-white": "Noir / Blanc", cream: "Crème / Beige", grey: "Gris",
  brown: "Marron", burgundy: "Bordeaux", "red-white": "Rouge / Blanc", "pink-silver": "Rose / Argent", statement: "Statement",
};

export async function loadNormalized(): Promise<NormalizedLite[]> {
  try { return JSON.parse(await readFile(join(process.cwd(), "catalog/data/products.json"), "utf8")); } catch { return []; }
}

export async function prepareProduct(c: Candidate, offer: SupplierOffer | null) {
  const all = await loadNormalized();
  const linked = all.find((p) => offer?.supplier_url && p.sourceUrl === offer.supplier_url) ?? null;
  const issues: string[] = [];
  const title = displayTitle(c.brand, c.model, c.colorway);
  const handle = linked?.slug ?? slugify(title);
  const style = (linked?.styleFamily ?? c.style_family ?? "icon") as StyleFamily;
  const colorFamily: ColorFamily = linked?.colorFamily ?? guessColor(`${c.colorway ?? ""} ${offer?.note ?? ""}`);
  const copy = linked ? { description: linked.description, shortDescription: linked.shortDescription } : writeCopy(title, style, colorFamily);

  let images = (linked?.images ?? []).filter((i) => i.file).map((i) => ({ url: i.file!, altText: i.alt, width: i.width, height: i.height }));
  if (!images.length) {
    // BEYOND's own photos (uploaded in the admin) or an authorized offer's images.
    const own = [
      ...(c.image_rights === "AUTHORIZED" && c.hero_image_reference?.startsWith("/") ? [c.hero_image_reference] : []),
      ...(offer?.images_authorized ? offer.image_refs ?? [] : []),
    ];
    const dims = new Map((offer?.image_meta ?? []).map((m) => [m.url, m]));
    images = [...new Set(own)].map((url, i) => ({ url, altText: `${title} — vue ${i + 1}`, width: dims.get(url)?.width ?? 1200, height: dims.get(url)?.height ?? 1200 }));
  }
  if (images.length < MIN_PHOTOS) issues.push(`${images.length} photo(s) — il en faut au moins ${MIN_PHOTOS}.`);
  if (c.image_rights !== "AUTHORIZED" && !linked) issues.push("Droits image non établis.");
  const price = c.selling_price_mad;
  if (price == null) issues.push("Prix de vente BEYOND non fixé.");
  const sizes = [...(linked?.sizes ?? offer?.available_sizes ?? [])].sort((a, b) => Number(a) - Number(b));
  const available = linked?.availableSizes ?? offer?.available_sizes ?? [];
  if (!sizes.length) issues.push("Pointures inconnues.");
  if (!c.colorway) issues.push("Coloris non précisé (candidat au niveau modèle).");

  const id = `bp-${handle}`;
  const money = (n: number) => ({ amount: n.toFixed(2), currencyCode: "MAD" });
  const p = price ?? 0;
  const product = {
    id, handle, title, description: copy.shortDescription, descriptionHtml: `<p>${copy.description}</p>`,
    vendor: c.brand, productType: "Sneakers",
    tags: linked?.tags ?? [c.brand, c.model, style].map((t) => t.toLowerCase()),
    availableForSale: true, featuredImage: images[0] ?? null, images,
    options: [{ id: `${id}-size`, name: "Size", values: sizes }],
    variants: sizes.map((s) => ({ id: `${id}-${s}`, title: s, availableForSale: available.includes(s), quantityAvailable: null, selectedOptions: [{ name: "Size", value: s }], price: money(p), compareAtPrice: null, image: images[0] ?? null, sku: c.sku })),
    priceRange: { minVariantPrice: money(p), maxVariantPrice: money(p) },
    compareAtPriceRange: null,
    metafields: { details: "Réplique qualité Master Copy Premium 1:1. Pointures confirmées à la commande.", originalUrl: offer?.supplier_url ?? c.official_url ?? undefined },
    merch: {
      brand: c.brand, model: c.model, silhouette: linked?.silhouette ?? slugify(`${c.brand} ${c.model}`), colorway: c.colorway ?? "", color: COLOR_LABEL[colorFamily],
      gender: linked?.gender ?? c.gender ?? "unisex", style, collections: linked?.collections ?? [], label: "NEW IN" as const,
      rank: c.beyond_score ?? 0, homeRank: null,
    },
    radar: { candidateId: c.id, trendTier: c.recommendation, sourceUrl: offer?.supplier_url ?? c.official_url, sku: c.sku, publishable: false },
  };
  return { handle, product, issues };
}
