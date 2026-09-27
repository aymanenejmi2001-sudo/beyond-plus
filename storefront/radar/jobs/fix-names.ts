// One-off (safe to re-run): clean model/colorway of discovered pairs from the
// supplier title, regenerate the product sheets of published pairs with the
// clean names, move Radar-published pairs out of catalog.json into
// radar-products.json.
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { FAMILIES } from "../../catalog/manifest.ts";
import { prepareProduct } from "../catalogue/prepare.ts";
import { getStore } from "../lib/store.ts";
import { namesFromTitle } from "../normalizers/names.ts";
import { bestOffer } from "../scoring/components.ts";
import { updateCandidate } from "../services/radar.ts";
import { writeSiteFiles } from "../services/siteFiles.ts";

const db = getStore();
const offers = await db.list("supplier_offers");
let renamed = 0;
for (const c of await db.list("sneaker_candidates")) {
  const note = offers.find((o) => o.candidate_id === c.id && o.note?.startsWith("Titre fournisseur : "))?.note;
  if (!note) continue;
  const title = note.replace("Titre fournisseur : ", "");
  const fam = FAMILIES.find((f) => f.match.test(title) && !f.exclude?.test(title));
  if (!fam) continue;
  const n = namesFromTitle(title, fam.model);
  if (n.model !== c.model || n.colorway !== c.colorway) { await updateCandidate(c.id, { model: n.model, colorway: n.colorway }); renamed++; }
}

// Radar-published pairs: rebuild their sheet with the clean names.
const oldHandles = new Set<string>();
let rebuilt = 0;
for (const d of await db.list("catalogue_products", { eq: { status: "IMPORTED" } })) {
  const c = await db.get("sneaker_candidates", d.candidate_id);
  if (!c) continue;
  oldHandles.add(d.handle);
  const { handle, product } = await prepareProduct(c, bestOffer(offers.filter((o) => o.candidate_id === c.id)));
  await db.update("catalogue_products", d.id, { handle, product, publishable: true, issues: [], updated_at: new Date().toISOString() });
  await updateCandidate(c.id, { catalogue_handle: handle });
  rebuilt++;
}

// catalog.json keeps only the supplier pipeline's own products.
const file = join(process.cwd(), "src/data/catalog.json");
const pipeline = new Set((JSON.parse(await readFile(join(process.cwd(), "catalog/data/products.json"), "utf8")) as { slug: string; publishable: boolean }[]).filter((p) => p.publishable).map((p) => p.slug));
const cat = JSON.parse(await readFile(file, "utf8")) as { handle: string }[];
const kept = cat.filter((p) => pipeline.has(p.handle) || !oldHandles.has(p.handle));
await writeFile(file, JSON.stringify(kept));
const n = await writeSiteFiles();
console.log(`[fix-names] ${renamed} renommée(s), ${rebuilt} fiche(s) refaite(s), ${cat.length - kept.length} retirée(s) de catalog.json, ${n} dans radar-products.json`);
