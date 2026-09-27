// npm run catalog            → rebuild from cache (≤ 24 h) or fresh fetch
// npm run catalog -- --refresh → force a fresh supplier fetch
//
// Outputs
//   catalog/data/products.json     every normalized product, publishable or not
//   catalog/data/targets.json      manifest families and their coverage
//   src/data/catalog.json          what the site renders (publishable only)
//   public/search-index.json       lightweight search, fetched on demand
//   ../shopify-import/produits-beyond-plus-brouillon.csv
//   catalog/reports/migration.md, catalog/reports/ingest-log.json

import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { COLLAB, COLOR_PRIORITY, EXISTING, FAMILIES, HOME_ORDER, type Family } from "./manifest.ts";
import { SUPPLIERS, fetchSupplier } from "./sources/supplier-shopify.ts";
import { fetchOfficial } from "./sources/official.ts";
import type { Candidate } from "./sources/types.ts";
import { ingestImages } from "./images.ts";
import { score } from "./score.ts";
import { COLOR_LABEL, colorFamily, genderFromSizes, slugify } from "./lib/colors.ts";
import { writeCopy } from "./lib/copy.ts";
import { log, note } from "./lib/http.ts";
import type { CuratedCollection, NormalizedProduct } from "./types.ts";

const root = fileURLToPath(new URL("./", import.meta.url));
const site = fileURLToPath(new URL("../", import.meta.url));
const refresh = process.argv.includes("--refresh");
const now = new Date().toISOString();

const BRANDS = ["New Balance", "adidas", "Nike", "Jordan", "ASICS", "PUMA", "Converse", "Vans", "On", "Salomon", "Saucony", "Mizuno", "Hoka"];
const brandOf = (title: string) =>
  /jordan/i.test(title) ? "Jordan"
  : /^(air force|blazer|dunk|p[- ]?6000|vomero|mind)/i.test(title) ? "Nike"
  : BRANDS.find((b) => new RegExp(`^${b}\\b`, "i").test(title)) ?? "Nike";
const isKids = (c: Candidate) => c.sizes.every((s) => Number(s) < 35) || /\b(td|ps|gs|kids|enfant)\b/i.test(c.title);

function colorwayOf(title: string, brand: string, fam?: Family) {
  let t = title.replace(new RegExp(`^${brand}\\s*`, "i"), "");
  if (fam) t = t.replace(fam.strip ?? fam.match, " ");
  t = t.replace(/\b(og|retro|low|mid|high|'07|07|shoes?|gel|zoom|air|handball|w|wmns|x)\b/gi, " ").replace(/[“”"()]/g, " ").replace(/\s*[-/|]\s*/g, " / ").replace(/\s+/g, " ").replace(/^[\s/]+|[\s/]+$/g, "").trim();
  return t || "Original";
}

const colorRank = (c: ReturnType<typeof colorFamily>, gender: string) =>
  c === "pink-silver" && gender !== "women" ? COLOR_PRIORITY.length : COLOR_PRIORITY.indexOf(c);
const imgQuality = (c: Candidate) => Math.max(0, ...c.images.map((i) => Math.max(i.width, i.height)));

async function main() {
  const previous: { handle: string }[] = JSON.parse(await readFile(site + "src/data/catalog.json", "utf8").catch(() => "[]"));
  const existingHandles = new Set([...previous.map((p) => p.handle), ...Object.keys(EXISTING)]);
  // Supplier handles of products currently live: they stay selected run after run.
  const prevFull: { sourceUrl: string; publishable: boolean }[] = JSON.parse(await readFile(root + "data/products.json", "utf8").catch(() => "[]"));
  const liveSupplier = new Set(prevFull.filter((p) => p.publishable).map((p) => p.sourceUrl.split("/").pop()!));
  // Manual curation (catalog/curation.json), kept by the Curateur agent.
  type Curation = { add: { handle: string; style?: string; collections?: string[]; reason?: string; price?: number }[]; remove: { slug: string; reason?: string }[] };
  const curation: Curation = JSON.parse(await readFile(root + "curation.json", "utf8").catch(() => '{"add":[],"remove":[]}'));
  const curatedRemove = new Set(curation.remove.map((r) => r.slug));
  const MIN_NEW_IMAGES = 4;

  // 1 — source
  const candidates: Candidate[] = [];
  for (const s of SUPPLIERS) candidates.push(...(await fetchSupplier(s, refresh ? 0 : 24)));
  const byHandle = new Map(candidates.map((c) => [c.handle, c]));

  // 2 — match + curate
  const chosen: { c: Candidate; fam?: Family }[] = [];
  const coverage: Record<string, { matched: number; kept: number; status: string }> = {};
  for (const fam of FAMILIES) {
    const pool = candidates.filter((c) => fam.match.test(c.title) && !(fam.exclude?.test(c.title)) && !isKids(c) && c.availableSizes.length && (c.images.length >= MIN_NEW_IMAGES || liveSupplier.has(c.handle)) && imgQuality(c) >= 700);
    const kept = pool.filter((c) => existingHandles.has(c.handle) || liveSupplier.has(c.handle));
    const rest = pool.filter((c) => !existingHandles.has(c.handle) && !liveSupplier.has(c.handle)).sort((a, b) => {
      const ga = genderFromSizes(a.availableSizes), gb = genderFromSizes(b.availableSizes);
      return colorRank(colorFamily(a.title), ga) - colorRank(colorFamily(b.title), gb)
        || Number(b.bestSeller) - Number(a.bestSeller) || imgQuality(b) - imgQuality(a) || b.images.length - a.images.length;
    });
    const usedColors = new Set(kept.map((c) => colorFamily(c.title)));
    for (const c of rest) {                             // distinct colour families first
      if (kept.length >= fam.maxColorways) break;
      const cf = colorFamily(c.title);
      if (usedColors.has(cf)) continue;
      usedColors.add(cf); kept.push(c);
    }
    for (const c of rest) { if (kept.length >= Math.min(fam.maxColorways, 2)) break; if (!kept.includes(c)) kept.push(c); }
    kept.forEach((c) => chosen.push({ c, fam }));
    coverage[fam.id] = { matched: pool.length, kept: kept.length, status: pool.length ? "SUPPLIER_AUTHORIZED" : "NO_AUTHORIZED_SOURCE" };
    if (fam.officialUrl) await fetchOfficial(fam.brand, fam.officialUrl); // metadata attached below when available
  }
  for (const a of curation.add) {                       // curated additions
    if (chosen.some((x) => x.c.handle === a.handle)) continue;
    const c = byHandle.get(a.handle);
    if (!c) { note("warn", `curation : produit introuvable chez le fournisseur : ${a.handle}`); continue; }
    if (c.images.length < MIN_NEW_IMAGES) { note("warn", `curation : moins de ${MIN_NEW_IMAGES} photos, ignoré : ${a.handle}`); continue; }
    chosen.push({ c, fam: FAMILIES.find((f) => f.match.test(c.title) && !f.exclude?.test(c.title)) });
  }
  const curatedAdd = new Map(curation.add.map((a) => [a.handle, a]));
  for (const h of existingHandles) {                    // never drop an existing product
    if (chosen.some((x) => x.c.handle === h)) continue;
    const c = byHandle.get(h);
    if (c) chosen.push({ c });
    else note("warn", `produit existant introuvable chez le fournisseur : ${h}`);
  }

  // 3 — normalize
  const products: NormalizedProduct[] = [];
  const usedSlugs = new Set<string>();
  for (const { c, fam } of chosen) {
    if (products.some((p) => p.sourceUrl === c.sourceUrl)) continue;      // duplicate protection (same source)
    const brand = fam?.brand ?? brandOf(c.title);
    const legacy = EXISTING[c.handle];
    const colorway = colorwayOf(c.title, brand, fam);
    const cf = colorFamily(c.title);
    const gender = genderFromSizes(c.availableSizes);
    const model = fam?.model ?? (c.title.replace(new RegExp(`^${brand}\\s*`, "i"), "").replace(colorway, "").trim() || c.title);
    const fullName = fam ? `${brand} ${model} ${colorway === "Original" ? "" : colorway}`.replace(/\s+/g, " ").trim() : c.title;
    let slug = existingHandles.has(c.handle) ? c.handle : slugify(`${brand} ${model} ${colorway}`);
    while (usedSlugs.has(slug)) slug += "-b";
    usedSlugs.add(slug);
    if (!existingHandles.has(c.handle) && products.some((p) => p.fullName.toLowerCase() === fullName.toLowerCase())) { note("info", `doublon ignoré : ${fullName}`, c.sourceUrl); continue; }
    const cur = curatedAdd.get(c.handle);
    const styleFamily = (fam?.styleFamily ?? legacy?.styleFamily ?? cur?.style ?? "icon") as NormalizedProduct["styleFamily"];
    const { trendScore, breakdown } = score(fam?.signals ?? { globalDemand: 2, moroccanMarket: 2, versatility: 3, socialPotential: 2, marginPotential: 3 }, c.bestSeller, c.publishedAt);
    // Collabs and luxury houses are never published (highest legal exposure).
    const isNew = !existingHandles.has(slug) && !liveSupplier.has(c.handle);
    const publishable = c.imagesAuthorized && c.availableSizes.length > 0 && !COLLAB.test(c.title) && !curatedRemove.has(slug);
    const images = await ingestImages(slug, fullName, c.images, c.imagesAuthorized && publishable);
    const copy = writeCopy(fullName, styleFamily, cf);
    products.push({
      id: `bp-${slug}`, slug, brand, model, fullName, colorway, colorFamily: cf, gender, category: "Sneakers",
      silhouette: fam?.id ?? "legacy", styleFamily, ...copy,
      sourceUrl: c.sourceUrl, sourceType: c.sourceType, sourceName: c.sourceName, sourceProductCode: c.sourceProductCode,
      releaseYear: null, retailPrice: null, marketReferencePrice: null,
      priceMAD: cur?.price ?? c.priceMAD ?? 0, compareAtPriceMAD: c.compareAtMAD, currency: "MAD",
      sizes: c.sizes, availableSizes: c.availableSizes,
      images, heroImage: images[0]?.file ?? null, gallery: images.map((i) => i.file!).filter(Boolean),
      tags: [brand, model, COLOR_LABEL[cf], styleFamily].map((t) => t.toLowerCase()),
      collections: [...new Set([...(fam?.collections ?? []), ...(legacy?.collections ?? []), ...((cur?.collections ?? []) as CuratedCollection[])])] as CuratedCollection[],
      featured: false, newArrival: false, trending: false, label: null,
      trendTier: fam?.tier ?? "EXPERIMENTAL", trendScore, scoreBreakdown: breakdown,
      stockStatus: "ON_REQUEST", supplierStatus: c.availableSizes.length ? "AVAILABLE_AT_SUPPLIER" : "UNAVAILABLE",
      authenticityStatus: "REPLICA_DECLARED_BY_SUPPLIER",
      imageRights: c.imagesAuthorized ? "AUTHORIZED_SUPPLIER" : "NOT_PUBLISHABLE",
      publishable: publishable && images.length >= (isNew ? MIN_NEW_IMAGES : 1),
      migration: legacy?.migration ?? "NEW",
      createdAt: c.publishedAt ?? now, updatedAt: now,
    });
  }

  // 4 — merchandising
  const live = products.filter((p) => p.publishable).sort((a, b) => b.trendScore - a.trendScore);
  const heroBoost = (p: NormalizedProduct) => (p.migration === "DEPRIORITIZE" || p.migration === "REVIEW" ? -30 : p.migration === "KEEP_HERO" ? 5 : 0);
  live.sort((a, b) => b.trendScore + heroBoost(b) - (a.trendScore + heroBoost(a)));
  const trending = live.filter((p) => p.trendTier !== "EXPERIMENTAL" && p.migration !== "DEPRIORITIZE" && p.migration !== "REVIEW").slice(0, 12);
  trending.forEach((p, i) => { p.trending = true; p.collections.unshift("trending-now"); if (i < 8) p.label = "TRENDING"; });
  for (const p of live) {
    const days = (Date.now() - Date.parse(p.createdAt)) / 864e5;
    p.newArrival = days <= 45;
    if (p.newArrival && p.migration !== "REVIEW") p.label = "NEW IN";
  }
  for (const fam of FAMILIES.filter((f) => f.pick)) {
    const best = live.find((p) => p.silhouette === fam.id);
    if (best) best.label = "BEYOND PICK";
  }
  const home: NormalizedProduct[] = [];
  for (const id of HOME_ORDER) { const p = live.find((x) => x.silhouette === id); if (p) home.push(p); }
  for (const p of live) { if (home.length >= 12) break; if (p.migration === "KEEP_HERO" && !home.includes(p)) home.push(p); }
  home.slice(0, 12).forEach((p) => (p.featured = true));
  const homeOrder = home.slice(0, 12).map((p) => p.slug);

  // 5 — outputs
  await mkdir(root + "data", { recursive: true });
  await mkdir(root + "reports", { recursive: true });
  await writeFile(root + "data/products.json", JSON.stringify(products, null, 2));
  await writeFile(root + "data/targets.json", JSON.stringify(FAMILIES.map((f) => ({ id: f.id, brand: f.brand, model: f.model, tier: f.tier, styleFamily: f.styleFamily, ...coverage[f.id] })), null, 2));
  // Products that were online before and no longer are: the site redirects
  // their URLs (308) to the model or brand page instead of a 404.
  const known: { handle: string; title: string; brand: string }[] = JSON.parse(await readFile(site + "src/data/retired.json", "utf8").catch(() => "[]"));
  const retiredNow = products.filter((p) => !p.publishable && existingHandles.has(p.slug)).map((p) => ({ handle: p.slug, title: p.fullName, brand: p.brand }));
  const liveSlugs = new Set(live.map((p) => p.slug));
  const retired = [...new Map([...known, ...retiredNow].filter((r) => !liveSlugs.has(r.handle)).map((r) => [r.handle, r])).values()];
  await writeFile(site + "src/data/retired.json", JSON.stringify(retired, null, 1));
  await writeFile(site + "src/data/catalog.json", JSON.stringify(live.map((p) => toSite(p, homeOrder.indexOf(p.slug)))));
  await writeFile(site + "public/search-index.json", JSON.stringify(live.map((p) => ({ h: p.slug, t: p.fullName, b: p.brand, m: p.model, c: COLOR_LABEL[p.colorFamily], s: p.styleFamily, p: p.priceMAD, i: p.heroImage }))));
  await writeFile(site + "../shopify-import/produits-beyond-plus-brouillon.csv", toCsv(live));
  await writeFile(root + "reports/ingest-log.json", JSON.stringify(log, null, 2));
  await writeFile(root + "reports/migration.md", report(products, coverage, homeOrder));
  const referenced = new Set(products.flatMap((p) => p.images.map((i) => i.file?.split("/").pop())));
  let removed = 0;
  for (const f of await readdir(site + "public/products")) if (!referenced.has(f)) { await rm(site + "public/products/" + f); removed++; }
  if (removed) note("info", `${removed} image(s) orpheline(s) supprimée(s)`);
  const low = live.filter((p) => p.images.some((i) => i.lowRes)).length;
  console.log(`✓ ${products.length} produits normalisés · ${live.length} publiés · ${products.length - live.length} masqués · ${low} avec images < 1400 px · home ${homeOrder.length}`);
}

function toSite(p: NormalizedProduct, homeRank: number) {
  const money = (n: number) => ({ amount: n.toFixed(2), currencyCode: "MAD" });
  const imgs = p.images.filter((i) => i.file).map((i) => ({ url: i.file!, altText: i.alt, width: i.width, height: i.height }));
  const sizes = [...p.sizes].sort((a, b) => Number(a) - Number(b));
  return {
    id: p.id, handle: p.slug, title: p.fullName, description: p.shortDescription,
    descriptionHtml: `<p>${p.description}</p>`, vendor: p.brand, productType: "Sneakers", tags: p.tags,
    availableForSale: true, featuredImage: imgs[0] ?? null, images: imgs,
    options: [{ id: `${p.id}-size`, name: "Size", values: sizes }],
    variants: sizes.map((s) => ({ id: `${p.id}-${s}`, title: s, availableForSale: p.availableSizes.includes(s), quantityAvailable: null, selectedOptions: [{ name: "Size", value: s }], price: money(p.priceMAD), compareAtPrice: p.compareAtPriceMAD ? money(p.compareAtPriceMAD) : null, image: imgs[0] ?? null, sku: null })),
    priceRange: { minVariantPrice: money(p.priceMAD), maxVariantPrice: money(p.priceMAD) },
    compareAtPriceRange: p.compareAtPriceMAD ? { minVariantPrice: money(p.compareAtPriceMAD), maxVariantPrice: money(p.compareAtPriceMAD) } : null,
    metafields: { details: "Réplique qualité Master Copy Premium 1:1. Pointures confirmées à la commande." },
    merch: {
      brand: p.brand, model: p.model, silhouette: p.silhouette, colorway: p.colorway, color: COLOR_LABEL[p.colorFamily],
      gender: p.gender, style: p.styleFamily, collections: p.collections, label: p.label, rank: p.trendScore, homeRank: homeRank < 0 ? null : homeRank,
    },
  };
}

function toCsv(list: NormalizedProduct[]) {
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const head = ["Handle", "Title", "Body (HTML)", "Vendor", "Type", "Tags", "Published", "Status", "Option1 Name", "Option1 Value", "Variant Price", "Variant Inventory Qty", "Image Src", "Image Position", "Image Alt Text"];
  const rows = [head.join(",")];
  for (const p of list) {
    const n = Math.max(p.sizes.length, p.images.length);
    for (let i = 0; i < n; i++) {
      const img = p.images[i];
      rows.push([p.slug, i ? "" : `${p.fullName}, Réplique`, i ? "" : `<p>${p.description}</p>`, i ? "" : "BEYOND PLUS", i ? "" : "Sneakers", i ? "" : p.tags.join(", "), i ? "" : "FALSE", i ? "" : "draft",
        p.sizes[i] ? "Pointure" : "", p.sizes[i] ?? "", p.sizes[i] ? p.priceMAD : "", p.sizes[i] ? 0 : "",
        img ? `https://beyond-plus-gamma.vercel.app${img.file}` : "", img ? i + 1 : "", img?.alt ?? ""].map(esc).join(","));
    }
  }
  return rows.join("\n") + "\n";
}

function report(products: NormalizedProduct[], coverage: Record<string, { matched: number; kept: number; status: string }>, home: string[]) {
  const L = [`# Migration catalogue, ${now.slice(0, 10)}`, "", "Aucun produit supprimé. Les produits masqués restent dans `catalog/data/products.json`.", "",
    "## Produits existants", "", "| Produit | Classement | Visible | Raison |", "|---|---|---|---|"];
  for (const [h, e] of Object.entries(EXISTING)) {
    const p = products.find((x) => x.slug === h);
    L.push(`| ${p?.fullName ?? h} | ${e.migration} | ${p?.publishable ? "oui" : "non"} | ${e.reason} |`);
  }
  L.push("", "## Couverture du manifeste", "", "| Silhouette | Tier | Trouvés chez le fournisseur | Retenus | Statut |", "|---|---|---:|---:|---|");
  for (const f of FAMILIES) L.push(`| ${f.brand} ${f.model} | ${f.tier} | ${coverage[f.id].matched} | ${coverage[f.id].kept} | ${coverage[f.id].status} |`);
  L.push("", "## Homepage (ordre)", "", ...home.map((h, i) => `${i + 1}. ${products.find((p) => p.slug === h)?.fullName}`));
  L.push("", "## Nouveaux produits publiés", "", ...products.filter((p) => p.migration === "NEW" && p.publishable).map((p) => `- ${p.fullName}, ${p.priceMAD} DH, score ${p.trendScore}${p.images.some((i) => i.lowRes) ? ", images < 1400 px" : ""}`));
  L.push("", "## Limites", "", "- Prix = prix fournisseur. Les prix de revente BEYOND PLUS restent à fixer.",
    "- Score : demande, marché marocain, polyvalence, potentiel social et marge sont des jugements éditoriaux. Seuls best-seller fournisseur et date de mise en ligne sont des données vérifiées.",
    "- Silhouettes `NO_AUTHORIZED_SOURCE` : aucune photo autorisée → rien n'est publié tant qu'une source ou vos photos ne sont pas ajoutées.",
    "- Authenticité : répliques déclarées par le fournisseur. Rien n'est présenté comme authentique.");
  return L.join("\n") + "\n";
}

main().catch((e) => { console.error(e); process.exit(1); });
