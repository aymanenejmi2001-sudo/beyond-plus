// Discovery + supplier sync, shared by seed and daily jobs. Idempotent:
// re-running never duplicates candidates, offers or editorial signals.

import { FAMILIES } from "../../catalog/manifest.ts";
import { getStore } from "../lib/store.ts";
import type { Candidate } from "../lib/types.ts";
import { addMarketSignal, addSupplierOffer, updateCandidate, upsertCandidate } from "../services/radar.ts";
import { readSupplierRows } from "../sources/supplierSignals.ts";

type Log = { level: string; msg: string }[];
const PRIORITY_BRANDS = ["ASICS", "adidas", "New Balance", "PUMA", "Nike", "Saucony", "Salomon", "Vans", "Jordan", "Mizuno"];

export async function syncBrandsAndModels() {
  const db = getStore();
  const brands = new Set((await db.list("brands")).map((b) => b.name));
  await db.insert("brands", [...new Set([...PRIORITY_BRANDS, ...FAMILIES.map((f) => f.brand)])].filter((b) => !brands.has(b))
    .map((name) => ({ name, official_site: null, priority: PRIORITY_BRANDS.includes(name), created_at: new Date().toISOString() })));
  const models = new Map((await db.list("sneaker_models")).map((m) => [`${m.brand}|${m.model}`, m]));
  const fresh = FAMILIES.filter((f) => !models.has(`${f.brand}|${f.model}`))
    .map((f) => ({ id: undefined, brand: f.brand, model: f.model, style_family: f.styleFamily, tier: f.tier, priority: f.tier === "CORE", created_at: new Date().toISOString() }));
  const created = await db.insert("sneaker_models", fresh.map(({ id: _id, ...r }) => r));
  for (const m of created) models.set(`${m.brand}|${m.model}`, m);
  return models;
}

export async function editorial(c: Candidate, fam: (typeof FAMILIES)[number], at: string) {
  const db = getStore();
  const have = await db.list("market_signals", { eq: { candidate_id: c.id, source: "Manifeste éditorial BEYOND" } });
  for (const [dimension, metric, v] of [["global", "editorial_global_demand", fam.signals.globalDemand], ["morocco", "editorial_morocco_market", fam.signals.moroccanMarket]] as const) {
    const last = have.filter((s) => s.metric === metric).sort((a, b) => b.observed_at.localeCompare(a.observed_at))[0];
    if (last && last.raw_value === v) continue;
    await addMarketSignal({ candidate_id: c.id, dimension, source: "Manifeste éditorial BEYOND", metric, value: v * 20, raw_value: v, raw_unit: "note 0–5",
      reliability: "EDITORIAL", source_url: null, observed_at: at, note: "Jugement éditorial (catalog/manifest.ts), non mesuré.", created_by: "radar:sync" });
  }
}

/** baseline = first run: products already live on the site become IMPORTED (with a logged reason). */
export async function syncSupplier(log: Log, { baseline = false } = {}) {
  const db = getStore();
  const models = await syncBrandsAndModels();
  const { rows, observedAt } = await readSupplierRows();
  if (!rows.length) { log.push({ level: "warn", msg: "catalog/data/products.json vide ou absent — lancer `npm run catalog`." }); return { created: 0, offers: 0 }; }
  const at = new Date().toISOString();
  let created = 0, offers = 0;
  const allOffers = await db.list("supplier_offers");

  for (const fam of FAMILIES) {
    const famRows = rows.filter((r) => r.silhouette === fam.id);
    const model = models.get(`${fam.brand}|${fam.model}`);
    if (!famRows.length) {
      // No supplier source yet: track the model itself so it can still be scored and watched.
      const { candidate, created: isNew } = await upsertCandidate({ brand: fam.brand, model: fam.model, colorway: null, style_family: fam.styleFamily, model_id: model?.id ?? null, source: "manifest (aucune source fournisseur)" });
      if (isNew) created++;
      await editorial(candidate, fam, at);
      continue;
    }
    for (const r of famRows) {
      const { candidate, created: isNew } = await upsertCandidate({
        brand: fam.brand, model: fam.model, colorway: r.colorway, gender: r.gender, style_family: fam.styleFamily, model_id: model?.id ?? null,
        hero_image_reference: r.imageRights === "AUTHORIZED_SUPPLIER" ? r.heroImage : null,
        image_rights: r.imageRights === "AUTHORIZED_SUPPLIER" ? "AUTHORIZED" : "NOT_PUBLISHABLE",
        source: `supplier:${r.sourceName}`, catalogue_handle: r.publishable ? r.slug : null,
      });
      if (isNew) {
        created++;
        if (baseline && r.publishable) {
          await updateCandidate(candidate.id, { status: "IMPORTED" });
          await db.insert("product_approvals", [{ candidate_id: candidate.id, action: "BASELINE", from_status: "DISCOVERED", to_status: "IMPORTED", actor: "radar:seed", note: "Déjà en ligne avant Radar (catalogue existant).", created_at: at }]);
        }
      }
      await editorial(candidate, fam, at);
      // Supplier offer: new row only when something changed since the last observation.
      const status = r.availableSizes.length ? "AVAILABLE" : "OUT_OF_STOCK";
      const prev = allOffers.filter((o) => o.candidate_id === candidate.id && o.supplier_url === r.sourceUrl).sort((a, b) => b.observed_at.localeCompare(a.observed_at))[0];
      const same = prev && prev.supplier_status === status && prev.supplier_cost_mad === r.priceMAD && JSON.stringify(prev.available_sizes) === JSON.stringify(r.availableSizes);
      if (same) continue;
      await addSupplierOffer({
        candidate_id: candidate.id, supplier_name: r.sourceName, supplier_product_reference: r.sourceProductCode, supplier_url: r.sourceUrl,
        supplier_cost_mad: r.priceMAD, cost_basis: "SUPPLIER_LISTED_PRICE", shipping_cost_mad: null, minimum_order_quantity: null,
        available_sizes: r.availableSizes, available_quantity: null, lead_time_days: null, supplier_status: status,
        images_authorized: r.imageRights === "AUTHORIZED_SUPPLIER", image_refs: r.gallery, observed_at: observedAt ?? at,
        note: "Prix affiché par le fournisseur au relevé — coût réel à confirmer.",
      });
      offers++;
    }
  }
  log.push({ level: "info", msg: `sync fournisseur : ${created} candidat(s) créé(s), ${offers} offre(s) enregistrée(s)` });
  return { created, offers };
}
