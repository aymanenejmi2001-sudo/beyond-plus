// Target manifest — what BEYOND PLUS wants to carry. Edit this file, rerun
// `npm run catalog`. Signals are 0–5. Every hand-set signal is
// EDITORIAL_JUDGMENT: BEYOND PLUS has no sales data yet. Supplier signals
// (best-seller list, publication date) are added at build time as VERIFIED_DATA.

import type { CuratedCollection, StyleFamily, TrendTier } from "./types.ts";

export interface Family {
  id: string;
  brand: string;
  model: string;
  match: RegExp;                 // against the supplier title
  strip?: RegExp;                // removed from the title to get the colorway (default: match)
  exclude?: RegExp;
  styleFamily: StyleFamily;
  tier: TrendTier;
  collections: CuratedCollection[];
  maxColorways: number;          // curation: 2–5
  pick?: boolean;                // BEYOND PICK label on its best colorway
  signals: { globalDemand: number; versatility: number; socialPotential: number; marginPotential: number; moroccanMarket: number };
  officialUrl?: string;          // optional, metadata only (see sources/official.ts)
}

// Collabs and luxury houses: highest legal exposure for replicas — never auto-selected.
export const COLLAB = /travis|off[- ]?white|dior|sacai|union|fragment|kasina|jarritos|futura|sean|loewe|balenciaga|mcqueen|supreme|stussy|comme des|wales bonner|joe freshgoods|wukong|aime leon|kith|jacquemus|imran potato|\bx\b/i;

const S = (globalDemand: number, moroccanMarket: number, versatility: number, socialPotential: number, marginPotential: number) =>
  ({ globalDemand, moroccanMarket, versatility, socialPotential, marginPotential });

export const FAMILIES: Family[] = [
  // ---- Priority A — core demand
  { id: "asics-gel-1130", brand: "ASICS", model: "Gel-1130", match: /gel[- ]?1130/i, styleFamily: "retro-runner", tier: "CORE", collections: ["retro-runners"], maxColorways: 5, pick: true, signals: S(5, 4, 5, 4, 4) },
  { id: "asics-gel-kayano-14", brand: "ASICS", model: "Gel-Kayano 14", match: /kayano\s*14/i, styleFamily: "y2k-runner", tier: "CORE", collections: ["retro-runners"], maxColorways: 5, signals: S(5, 4, 4, 5, 4) },
  { id: "asics-gel-nyc", brand: "ASICS", model: "Gel-NYC", match: /gel[- ]?nyc/i, styleFamily: "retro-runner", tier: "CORE", collections: ["retro-runners"], maxColorways: 5, signals: S(4, 4, 5, 4, 4) },
  { id: "adidas-samba-og", brand: "adidas", model: "Samba", match: /samba/i, exclude: /wales bonner|comme des|pony|leopard/i, styleFamily: "terrace", tier: "CORE", collections: ["low-profile", "icons"], maxColorways: 5, pick: true, signals: S(5, 5, 5, 4, 4) },
  { id: "adidas-handball-spezial", brand: "adidas", model: "Handball Spezial", match: /spezial/i, styleFamily: "terrace", tier: "CORE", collections: ["low-profile"], maxColorways: 5, signals: S(5, 5, 5, 4, 4) },
  { id: "adidas-gazelle-indoor", brand: "adidas", model: "Gazelle Indoor", match: /gazelle/i, styleFamily: "terrace", tier: "CORE", collections: ["low-profile"], maxColorways: 3, signals: S(4, 4, 5, 4, 4) },
  { id: "nb-530", brand: "New Balance", model: "530", match: /\b(mr|u)?530(sg|ka|[a-z]{2})?\b/i, styleFamily: "y2k-runner", tier: "CORE", collections: ["retro-runners"], maxColorways: 3, signals: S(4, 5, 5, 3, 4) },
  { id: "nb-9060", brand: "New Balance", model: "9060", match: /9060/i, styleFamily: "y2k-runner", tier: "CORE", collections: ["retro-runners"], maxColorways: 5, signals: S(5, 4, 4, 5, 4) },
  { id: "puma-speedcat", brand: "PUMA", model: "Speedcat OG", match: /speedcat/i, styleFamily: "low-profile", tier: "CORE", collections: ["low-profile"], maxColorways: 3, pick: true, signals: S(5, 4, 4, 5, 4) },
  { id: "nike-vomero-5", brand: "Nike", model: "Zoom Vomero 5", match: /vomero\s*5|vomero/i, styleFamily: "y2k-runner", tier: "CORE", collections: ["retro-runners"], maxColorways: 5, signals: S(5, 4, 4, 5, 4) },
  { id: "nike-p-6000", brand: "Nike", model: "P-6000", match: /p[- ]?6000/i, styleFamily: "y2k-runner", tier: "CORE", collections: ["retro-runners"], maxColorways: 3, signals: S(4, 4, 4, 4, 4) },

  // ---- Priority B — 2026 growth
  { id: "nb-204l", brand: "New Balance", model: "204L", match: /204l/i, styleFamily: "low-profile", tier: "RISING", collections: ["low-profile"], maxColorways: 3, signals: S(4, 3, 4, 4, 3) },
  { id: "nike-total-90", brand: "Nike", model: "Total 90", match: /total\s*90/i, styleFamily: "low-profile", tier: "RISING", collections: ["low-profile"], maxColorways: 3, signals: S(4, 3, 3, 4, 3) },
  { id: "saucony-progrid-omni-9", brand: "Saucony", model: "ProGrid Omni 9", match: /saucony.*omni\s*9|progrid omni/i, styleFamily: "retro-runner", tier: "RISING", collections: ["retro-runners"], maxColorways: 3, signals: S(4, 2, 4, 3, 4) },
  { id: "saucony-progrid-triumph-4", brand: "Saucony", model: "ProGrid Triumph 4", match: /triumph\s*4/i, styleFamily: "retro-runner", tier: "RISING", collections: ["retro-runners"], maxColorways: 3, signals: S(3, 2, 4, 3, 4) },
  { id: "salomon-xt-6", brand: "Salomon", model: "XT-6", match: /xt[- ]?6\b/i, styleFamily: "technical", tier: "RISING", collections: ["retro-runners"], maxColorways: 3, signals: S(4, 3, 3, 4, 3) },
  { id: "salomon-xt-whisper", brand: "Salomon", model: "XT-Whisper", match: /xt[- ]?whisper/i, styleFamily: "technical", tier: "RISING", collections: ["retro-runners"], maxColorways: 2, signals: S(3, 2, 3, 4, 3) },
  { id: "vans-old-skool", brand: "Vans", model: "Old Skool", match: /old skool/i, styleFamily: "skate", tier: "RISING", collections: ["skate", "icons"], maxColorways: 3, signals: S(4, 5, 5, 3, 4) },
  { id: "vans-knu-skool", brand: "Vans", model: "Knu Skool", match: /knu\s*skool/i, styleFamily: "skate", tier: "RISING", collections: ["skate"], maxColorways: 3, signals: S(4, 4, 4, 4, 4) },
  { id: "vans-authentic", brand: "Vans", model: "Authentic", match: /vans authentic/i, styleFamily: "skate", tier: "RISING", collections: ["skate"], maxColorways: 2, signals: S(3, 3, 5, 2, 4) },
  { id: "jordan-4", brand: "Jordan", model: "Air Jordan 4 Retro", match: /jordan\s*4\b|\baj\s*4\b/i, exclude: COLLAB, styleFamily: "basketball-retro", tier: "RISING", collections: ["icons", "basketball"], maxColorways: 5, signals: S(5, 4, 3, 5, 3) },
  { id: "jordan-5", brand: "Jordan", model: "Air Jordan 5 Retro", match: /jordan\s*5\b/i, styleFamily: "basketball-retro", tier: "RISING", collections: ["icons"], maxColorways: 2, signals: S(3, 3, 3, 4, 3) },
  { id: "jordan-11", brand: "Jordan", model: "Air Jordan 11 Retro", match: /jordan\s*11\b/i, styleFamily: "basketball-retro", tier: "RISING", collections: ["icons"], maxColorways: 2, signals: S(4, 3, 3, 4, 3) },

  // ---- Priority C — trend testing
  { id: "mizuno-mxr", brand: "Mizuno", model: "MXR", match: /mizuno.*(mxr|wave)/i, styleFamily: "retro-runner", tier: "EXPERIMENTAL", collections: ["retro-runners"], maxColorways: 2, signals: S(3, 1, 3, 3, 3) },
  { id: "adidas-taekwondo", brand: "adidas", model: "Taekwondo", match: /taekwondo/i, styleFamily: "low-profile", tier: "EXPERIMENTAL", collections: ["low-profile"], maxColorways: 2, signals: S(3, 2, 3, 4, 3) },
  { id: "nike-shox", brand: "Nike", model: "Shox", match: /shox/i, styleFamily: "y2k-runner", tier: "EXPERIMENTAL", collections: [], maxColorways: 2, signals: S(3, 2, 2, 4, 3) },
  // ---- Volume — ce qui se vend au Maroc (ajout 24/09/2026)
  { id: "nike-dunk-low", brand: "Nike", model: "Dunk Low", match: /dunk low/i, exclude: COLLAB, styleFamily: "basketball-retro", tier: "CORE", collections: ["basketball", "icons"], maxColorways: 6, signals: S(4, 5, 5, 4, 4) },
  { id: "jordan-1", brand: "Jordan", model: "Air Jordan 1", match: /jordan\s*1\b|\baj\s*1\b/i, exclude: COLLAB, styleFamily: "basketball-retro", tier: "CORE", collections: ["basketball", "icons"], maxColorways: 6, signals: S(4, 5, 4, 5, 3) },
  { id: "nike-air-force-1", brand: "Nike", model: "Air Force 1", match: /air force 1/i, exclude: COLLAB, styleFamily: "icon", tier: "CORE", collections: ["icons"], maxColorways: 4, signals: S(3, 5, 5, 3, 4) },
  { id: "nb-550", brand: "New Balance", model: "550", match: /\b(bb)?550\b/i, exclude: COLLAB, styleFamily: "basketball-retro", tier: "CORE", collections: ["basketball"], maxColorways: 4, signals: S(3, 4, 5, 3, 4) },
  { id: "adidas-campus-00s", brand: "adidas", model: "Campus 00s", match: /campus\s*00s?/i, exclude: COLLAB, styleFamily: "skate", tier: "CORE", collections: ["skate", "low-profile"], maxColorways: 4, signals: S(4, 4, 5, 4, 4) },
  { id: "adidas-superstar", brand: "adidas", model: "Superstar", match: /superstar/i, exclude: /camo|allover|\bx\b/i, styleFamily: "icon", tier: "RISING", collections: ["icons"], maxColorways: 3, signals: S(3, 4, 5, 3, 4) },
  { id: "adidas-stan-smith", brand: "adidas", model: "Stan Smith", match: /stan smith/i, exclude: COLLAB, styleFamily: "icon", tier: "RISING", collections: ["icons"], maxColorways: 2, signals: S(3, 4, 5, 2, 4) },
  { id: "adidas-forum-low", brand: "adidas", model: "Forum Low", match: /forum (low|84)/i, exclude: COLLAB, styleFamily: "basketball-retro", tier: "RISING", collections: ["basketball"], maxColorways: 3, signals: S(3, 3, 4, 3, 4) },
  { id: "converse-chuck", brand: "Converse", model: "Chuck Taylor", match: /chuck (taylor|70)|run star/i, exclude: COLLAB, styleFamily: "skate", tier: "RISING", collections: ["skate", "icons"], maxColorways: 4, signals: S(3, 4, 5, 3, 4) },

  // ---- Niche & désirable
  { id: "nb-1000", brand: "New Balance", model: "1000", match: /new balance 1000|\bm1000/i, strip: /\bm?1000\b/i, exclude: COLLAB, styleFamily: "y2k-runner", tier: "RISING", collections: ["retro-runners"], maxColorways: 4, pick: true, signals: S(4, 3, 4, 5, 4) },
  { id: "nb-1906r", brand: "New Balance", model: "1906R", match: /1906r?/i, exclude: COLLAB, styleFamily: "y2k-runner", tier: "RISING", collections: ["retro-runners"], maxColorways: 3, signals: S(4, 3, 4, 5, 4) },
  { id: "nb-860", brand: "New Balance", model: "860v2", match: /\b860/i, exclude: COLLAB, styleFamily: "y2k-runner", tier: "EXPERIMENTAL", collections: ["retro-runners"], maxColorways: 2, signals: S(3, 2, 4, 4, 4) },
  { id: "nike-air-max-dn", brand: "Nike", model: "Air Max Dn", match: /air max dn/i, exclude: COLLAB, styleFamily: "y2k-runner", tier: "RISING", collections: ["tech-runners"], maxColorways: 3, signals: S(4, 3, 3, 5, 3) },
  { id: "asics-gel-quantum", brand: "ASICS", model: "Gel-Quantum", match: /gel[- ]?quantum/i, exclude: COLLAB, styleFamily: "technical", tier: "EXPERIMENTAL", collections: ["tech-runners"], maxColorways: 2, signals: S(3, 2, 3, 4, 4) },
  { id: "nike-air-humara", brand: "Nike", model: "Air Humara", match: /humara/i, exclude: COLLAB, styleFamily: "technical", tier: "EXPERIMENTAL", collections: ["tech-runners"], maxColorways: 2, signals: S(3, 2, 3, 4, 3) },
  { id: "adidas-adistar-byd", brand: "adidas", model: "Adistar BYD", match: /adistar/i, strip: /adistar\s*(byd)?|\bbyd\b/gi, exclude: COLLAB, styleFamily: "technical", tier: "EXPERIMENTAL", collections: ["tech-runners"], maxColorways: 2, signals: S(3, 2, 3, 4, 3) },
  { id: "adidas-adizero-evo", brand: "adidas", model: "Adizero Evo SL", match: /adizero/i, exclude: COLLAB, styleFamily: "racing", tier: "RISING", collections: ["tech-runners"], maxColorways: 2, signals: S(4, 2, 4, 4, 3) },
  { id: "nike-zoomx-invincible", brand: "Nike", model: "ZoomX Invincible", match: /invincible/i, strip: /zoomx|invincible( run)?( flyknit)?/gi, exclude: COLLAB, styleFamily: "technical", tier: "EXPERIMENTAL", collections: ["tech-runners"], maxColorways: 2, signals: S(3, 2, 3, 3, 3) },
  { id: "on-cloud", brand: "On", model: "", match: /^on\b.*cloud(surfer|nova|monster|tilt)|on running cloud/i, strip: /^(on\s+)?(running\s+)?/i, exclude: COLLAB, styleFamily: "technical", tier: "RISING", collections: ["tech-runners"], maxColorways: 4, signals: S(4, 3, 4, 4, 3) },
  { id: "puma-cali", brand: "PUMA", model: "Cali", match: /puma cali/i, exclude: COLLAB, styleFamily: "icon", tier: "EXPERIMENTAL", collections: ["icons"], maxColorways: 2, signals: S(2, 3, 4, 3, 4) },
];

// Homepage rotation — first available colorway of each family, in this order.
export const HOME_ORDER = [
  "asics-gel-1130", "puma-speedcat", "adidas-samba-og", "adidas-handball-spezial", "nb-9060",
  "asics-gel-nyc", "nike-vomero-5", "nb-530", "saucony-progrid-omni-9", "nb-204l",
  "asics-gel-kayano-14", "adidas-gazelle-indoor",
];

// Products already on the site (never deleted automatically) — classification
// and style for those outside the target families.
export const EXISTING: Record<string, { migration: "KEEP_HERO" | "KEEP_CATALOGUE" | "DEPRIORITIZE" | "REVIEW"; styleFamily?: StyleFamily; collections?: CuratedCollection[]; reason: string }> = {
  "adidas-wales-bonner-x-samba-pony-leopard": { migration: "KEEP_CATALOGUE", styleFamily: "terrace", collections: ["low-profile"], reason: "Collab Samba, statement — catalogue, pas homepage." },
  "blazer-mid-77-vntg-white-black": { migration: "DEPRIORITIZE", styleFamily: "icon", collections: ["icons"], reason: "Evergreen générique, faible potentiel éditorial 2026." },
  "adidas-samba-leopard-core-black-1": { migration: "KEEP_CATALOGUE", styleFamily: "terrace", collections: ["low-profile"], reason: "Samba statement — profondeur de catalogue." },
  "air-jordan-x-travis-scott-1-low-og-sp-reverse-mocha": { migration: "REVIEW", styleFamily: "basketball-retro", collections: ["icons"], reason: "Collab à forte exposition juridique (marque + artiste)." },
  "new-balance-mr530sg-white-blue": { migration: "KEEP_HERO", reason: "530 : demande forte au Maroc." },
  "air-force-1-low-07-triple-white": { migration: "KEEP_CATALOGUE", styleFamily: "icon", collections: ["icons"], reason: "Icône, ventes probables mais pas éditoriale." },
  "asics-gel-nyc-cream-oyster-grey": { migration: "KEEP_HERO", reason: "Gel-NYC crème : coloris prioritaire." },
  "air-jordan-x-travis-scott-1-low-og-sp-black-phantom": { migration: "REVIEW", styleFamily: "basketball-retro", collections: ["icons"], reason: "Collab à forte exposition juridique (marque + artiste)." },
  "air-force-1-low-07-triple-black": { migration: "KEEP_CATALOGUE", styleFamily: "icon", collections: ["icons"], reason: "Icône, catalogue." },
  "vans-old-skool": { migration: "KEEP_HERO", reason: "Old Skool : icône skate." },
  "adidas-samba-vegan-white-gum": { migration: "KEEP_HERO", reason: "Samba blanc/gum : coloris cœur." },
  "converse-chuck-taylor-all-star-hi-black": { migration: "DEPRIORITIZE", styleFamily: "icon", collections: ["icons"], reason: "Evergreen, hors direction 2026." },
  "on-cloudtilt-eclipse-cinder": { migration: "REVIEW", styleFamily: "technical", reason: "Hors manifeste — à valider." },
  "on-cloudtilt-clove-sand": { migration: "REVIEW", styleFamily: "technical", reason: "Hors manifeste — à valider." },
  "adidas-handball-spezial-w-silver-violet": { migration: "KEEP_HERO", reason: "Spezial argent : coloris prioritaire." },
  "air-force-1-07-low-exoskeletal": { migration: "DEPRIORITIZE", styleFamily: "icon", collections: ["icons"], reason: "Variante AF1 secondaire." },
  "nike-vomero-5-photon-dust-pink-foam": { migration: "KEEP_HERO", reason: "Vomero 5 rose/argent : cible femme." },
  "nike-p-6000-platinum-violet": { migration: "KEEP_CATALOGUE", reason: "P-6000, coloris saisonnier." },
  "nike-p-6000-white-silver": { migration: "KEEP_HERO", reason: "P-6000 argent/blanc : coloris prioritaire." },
  "adidas-samba-og-pony-hair-pack-wonder-white": { migration: "KEEP_CATALOGUE", styleFamily: "terrace", collections: ["low-profile"], reason: "Samba texture — profondeur." },
  "adidas-samba-x-comme-des-garcons": { migration: "REVIEW", styleFamily: "terrace", collections: ["low-profile"], reason: "Collab : exposition juridique." },
  "nike-mind-002-light-khaki": { migration: "REVIEW", styleFamily: "technical", reason: "Hors manifeste — à valider." },
  "nike-mind-002-light-smoke-grey": { migration: "REVIEW", styleFamily: "technical", reason: "Hors manifeste — à valider." },
  "nike-mind-002-black-hyper-crimson": { migration: "REVIEW", styleFamily: "technical", reason: "Hors manifeste — à valider." },
};

// Colorway priority (index = rank). Pink/silver only counts for women-leaning sizing.
export const COLOR_PRIORITY = ["silver-white", "black-silver", "black-white", "cream", "grey", "brown", "burgundy", "red-white", "pink-silver", "statement"] as const;
