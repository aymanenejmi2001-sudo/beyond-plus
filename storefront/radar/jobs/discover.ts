// npm run radar:discover — every supplier pair with ≥ MIN_PHOTOS usable photos
// and sizes in stock becomes a Radar candidate, photos downloaded locally:
// manifest families first, then everything else (collabs, women's and kids'
// sizes, other styles). Whether it is worth publishing is decided by the score
// (Foot Locker FR presence, editorial, supplier), not by this filter.
// Reads the supplier feed through the polite, cached fetch. Idempotent.

import { FAMILIES } from "../../catalog/manifest.ts";
import { genderFromSizes } from "../../catalog/lib/colors.ts";
import { fetchSupplier, SUPPLIERS } from "../../catalog/sources/supplier-shopify.ts";
import { MIN_PHOTOS } from "../config/scoring.ts";
import { ingest } from "../lib/images.ts";
import { getStore } from "../lib/store.ts";
import { slugify } from "../normalizers/candidate.ts";
import { brandOf, guessModel, namesFromTitle } from "../normalizers/names.ts";
import { addSupplierOffer, recompute, updateCandidate, upsertCandidate } from "../services/radar.ts";
import { editorial, syncBrandsAndModels } from "./sync.ts";
import { linkLive } from "./link-live.ts";

const isKids = (sizes: string[], title: string) => sizes.every((s) => Number(s) < 35) || /\b(td|ps|gs|kids|enfant|junior)\b/i.test(title);
const COLLAB = /\bx\b|travis|off-white|comme des|wales bonner|sacai|jacquemus|union|fragment|stussy|supreme|aime leon|kiko|concepts|a ma maniere/i;

const db = getStore();
const models = await syncBrandsAndModels();
const known = new Set((await db.list("supplier_offers")).map((o) => o.supplier_url));
const at = new Date().toISOString();
let added = 0, skipped = 0;

for (const s of SUPPLIERS) {
  const feed = await fetchSupplier(s, 24 * 7);
  for (const p of feed) {
    if (known.has(p.sourceUrl) || !p.availableSizes.length) continue;
    if (p.images.filter((i) => Math.max(i.width, i.height) >= 700).length < MIN_PHOTOS) { skipped++; continue; }
    const fam = FAMILIES.find((f) => f.match.test(p.title));        // collabs included
    const brand = fam?.brand ?? brandOf(p.title);
    const { model, colorway } = namesFromTitle(p.title, fam?.model ?? guessModel(p.title, brand), brand);
    const tags = [COLLAB.test(p.title) && "Collab", isKids(p.availableSizes, p.title) && "Enfant"].filter(Boolean).join(", ");
    const images = await ingest(slugify(`${brand} ${model} ${colorway}`), p.images);
    if (images.length < MIN_PHOTOS) { skipped++; continue; }
    const { candidate, created } = await upsertCandidate({
      brand, model, colorway, gender: genderFromSizes(p.availableSizes), style_family: fam?.styleFamily ?? "icon",
      model_id: fam ? models.get(`${fam.brand}|${fam.model}`)?.id ?? null : null, hero_image_reference: images[0].url, image_rights: "AUTHORIZED",
      source: `supplier:${s.name} (découverte)`, notes: tags || null,
    });
    if (!created) { skipped++; continue; }
    await addSupplierOffer({
      candidate_id: candidate.id, supplier_name: s.name, supplier_product_reference: p.sourceProductCode, supplier_url: p.sourceUrl,
      supplier_cost_mad: p.priceMAD, cost_basis: p.priceMAD == null ? null : "SUPPLIER_LISTED_PRICE", shipping_cost_mad: null,
      minimum_order_quantity: null, available_sizes: p.availableSizes, available_quantity: null, lead_time_days: null,
      supplier_status: "AVAILABLE", images_authorized: true, image_refs: images.map((i) => i.url), image_meta: images,
      observed_at: at, note: `Titre fournisseur : ${p.title}`,
    });
    if (fam) await editorial(candidate, fam, at);
    await recompute(candidate.id);
    added++;
    console.log(`+ ${brand} ${model} ${colorway}${tags ? ` [${tags}]` : ""} (${images.length} photos)`);
  }
}
const linked = await linkLive();
console.log(`[radar:discover] ${linked} déjà en ligne reliée(s) · ${added} paire(s) ajoutée(s), ${skipped} ignorée(s) (déjà suivies ou < ${MIN_PHOTOS} photos)`);
