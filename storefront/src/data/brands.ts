// SEO hierarchy: Sneakers → Marque → Modèle → Produit.
// Brand and model pages are generated from the catalogue; a page only exists
// when it has at least MIN_PRODUCTS pairs, so there are no thin pages.

import type { Product } from "@/lib/shopify/types";
import { CATALOG } from "./catalog";

const MIN_PRODUCTS = 2;

export interface BrandDef { handle: string; name: string; match: string; intro: string }
export interface ModelDef { handle: string; brand: string; name: string; match: RegExp }

export const BRAND_DEFS: BrandDef[] = [
  { handle: "adidas", name: "adidas", match: "adidas", intro: "Les silhouettes terrace et les classiques des tribunes : Samba, Handball Spezial, Gazelle, Campus. Des lignes basses, du daim et de la gomme." },
  { handle: "nike", name: "Nike", match: "Nike", intro: "Des runners d’archive aux icônes du basket : Vomero 5, P-6000, Dunk Low, Air Force 1, Air Max Dn." },
  { handle: "new-balance", name: "New Balance", match: "New Balance", intro: "Le confort running devenu uniforme de la rue : 9060, 530, 550, 1906R, 1000." },
  { handle: "asics", name: "ASICS", match: "ASICS", intro: "L’archive running japonaise : Gel-Kayano 14, Gel-NYC, Gel-Quantum. Mesh, overlays métallisés, amorti GEL." },
  { handle: "jordan", name: "Jordan", match: "Jordan", intro: "L’héritage du basket : Air Jordan 1 et Air Jordan 4, les silhouettes qui ont fait la culture sneaker." },
  { handle: "on", name: "On", match: "On", intro: "Les runners suisses à semelle CloudTec, portées en ville : Cloudtilt, Cloudsurfer." },
  { handle: "converse", name: "Converse", match: "Converse", intro: "La Chuck Taylor, toile et caoutchouc, intemporelle." },
  { handle: "vans", name: "Vans", match: "Vans", intro: "Les bases skate : Old Skool, Knu Skool." },
  { handle: "puma", name: "PUMA", match: "PUMA", intro: "Speedcat, Cali : les silhouettes PUMA de la sélection." },
];

export const MODEL_DEFS: ModelDef[] = [
  { handle: "adidas-samba", brand: "adidas", name: "Samba", match: /samba/i },
  { handle: "handball-spezial", brand: "adidas", name: "Handball Spezial", match: /spezial/i },
  { handle: "adidas-gazelle", brand: "adidas", name: "Gazelle", match: /gazelle/i },
  { handle: "adidas-campus-00s", brand: "adidas", name: "Campus 00s", match: /campus/i },
  { handle: "adidas-superstar", brand: "adidas", name: "Superstar", match: /superstar/i },
  { handle: "adidas-stan-smith", brand: "adidas", name: "Stan Smith", match: /stan smith/i },
  { handle: "adidas-adizero", brand: "adidas", name: "Adizero Evo SL", match: /adizero/i },
  { handle: "adidas-adistar", brand: "adidas", name: "Adistar BYD", match: /adistar/i },
  { handle: "asics-gel-kayano-14", brand: "ASICS", name: "Gel-Kayano 14", match: /kayano\s*14/i },
  { handle: "asics-gel-nyc", brand: "ASICS", name: "Gel-NYC", match: /gel[- ]?nyc/i },
  { handle: "asics-gel-quantum", brand: "ASICS", name: "Gel-Quantum", match: /quantum/i },
  { handle: "new-balance-9060", brand: "New Balance", name: "9060", match: /9060/i },
  { handle: "new-balance-530", brand: "New Balance", name: "530", match: /\b(mr)?530/i },
  { handle: "new-balance-550", brand: "New Balance", name: "550", match: /\b(bb)?550\b/i },
  { handle: "new-balance-1906r", brand: "New Balance", name: "1906R", match: /1906/i },
  { handle: "new-balance-1000", brand: "New Balance", name: "1000", match: /\b1000\b/i },
  { handle: "new-balance-860", brand: "New Balance", name: "860v2", match: /\b860/i },
  { handle: "nike-vomero-5", brand: "Nike", name: "Vomero 5", match: /vomero/i },
  { handle: "nike-p-6000", brand: "Nike", name: "P-6000", match: /p[- ]?6000/i },
  { handle: "nike-dunk-low", brand: "Nike", name: "Dunk Low", match: /dunk low/i },
  { handle: "nike-air-force-1", brand: "Nike", name: "Air Force 1", match: /air force 1/i },
  { handle: "nike-air-max-dn", brand: "Nike", name: "Air Max Dn", match: /air max dn/i },
  { handle: "nike-air-humara", brand: "Nike", name: "Air Humara", match: /humara/i },
  { handle: "nike-zoomx-invincible", brand: "Nike", name: "ZoomX Invincible", match: /invincible/i },
  { handle: "nike-mind-002", brand: "Nike", name: "Mind 002", match: /mind 002/i },
  { handle: "air-jordan-1", brand: "Jordan", name: "Air Jordan 1", match: /jordan\s*1\b/i },
  { handle: "air-jordan-4", brand: "Jordan", name: "Air Jordan 4", match: /jordan\s*4\b/i },
  { handle: "on-cloudtilt", brand: "On", name: "Cloudtilt", match: /cloudtilt/i },
  { handle: "converse-chuck-taylor", brand: "Converse", name: "Chuck Taylor", match: /chuck/i },
];

const brandOf = (p: Product) => p.merch?.brand ?? p.vendor;
const byRank = (a: Product, b: Product) => (b.merch?.rank ?? 0) - (a.merch?.rank ?? 0);

export const BRANDS = BRAND_DEFS
  .map((b) => ({ ...b, products: CATALOG.filter((p) => brandOf(p) === b.match).sort(byRank) }))
  .filter((b) => b.products.length >= MIN_PRODUCTS);

export const MODELS = MODEL_DEFS
  .map((m) => ({ ...m, products: CATALOG.filter((p) => brandOf(p) === m.brand && m.match.test(p.title)).sort(byRank) }))
  .filter((m) => m.products.length >= MIN_PRODUCTS && BRANDS.some((b) => b.match === m.brand));

export const brandPage = (brand: string) => BRANDS.find((b) => b.match === brand) ?? null;
export const modelPageFor = (p: Product) => MODELS.find((m) => m.brand === brandOf(p) && m.match.test(p.title)) ?? null;

/** Where a product URL that left the catalogue should send people. */
export function retiredTarget(brand: string, title: string) {
  const model = MODELS.find((m) => m.brand === brand && m.match.test(title));
  if (model) return `/collections/${model.handle}`;
  const b = brandPage(brand);
  return b ? `/collections/${b.handle}` : "/collections/nouveautes";
}

/** Factual description of a model page, computed from its products. */
export function describeModel(m: (typeof MODELS)[number]) {
  const prices = m.products.map((p) => Number(p.priceRange.minVariantPrice.amount));
  const sizes = m.products.flatMap((p) => p.variants.filter((v) => v.availableForSale).map((v) => Number(v.title))).filter((n) => !Number.isNaN(n));
  const colors = [...new Set(m.products.map((p) => p.merch?.color).filter(Boolean))];
  return {
    count: m.products.length,
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
    minSize: sizes.length ? Math.min(...sizes) : null,
    maxSize: sizes.length ? Math.max(...sizes) : null,
    colors: colors as string[],
  };
}
