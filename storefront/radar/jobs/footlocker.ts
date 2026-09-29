// npm run radar:footlocker — demand signal from Foot Locker FR's public product
// list (research/footlocker/footlocker_fr.csv, made by scripts/scrape_footlocker.py).
// A model a big European retailer carries in many versions is a model in demand.
// MARKET reliability, global dimension. Absence is NOT recorded as a zero
// (Foot Locker does not carry collabs or replicas' niche models by design).
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getStore } from "../lib/store.ts";
import { addMarketSignal, recompute } from "../services/radar.ts";

const FULL_AT = 10; // 10+ Foot Locker references for the model = 100
const file = join(process.cwd(), "../research/footlocker/footlocker_fr.csv");
const rows = (await readFile(file, "utf8")).trim().split("\n").slice(1).map((l) => {
  const [brand, name, id, url] = l.split(",");
  return { brand: brand.toLowerCase(), name: name.toLowerCase(), id, url };
});
const bare = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const words = (s: string) => bare(s).split(" ").filter((w) => w && !["air", "og", "retro", "the"].includes(w) || /^\d/.test(w));

const db = getStore();
const at = new Date().toISOString();
let signals = 0, touched = new Set<string>();
const existing = await db.list("market_signals", { eq: { source: "Foot Locker FR" } });
for (const c of await db.list("sneaker_candidates")) {
  if (["REJECTED", "ARCHIVED"].includes(c.status)) continue;
  const brand = bare(c.brand === "Jordan" ? "jordan" : c.brand);
  const need = words(c.model.replace(new RegExp(`^${c.brand}\\s+`, "i"), "").replace(/^air jordan/i, "jordan"));
  if (!need.length) continue;
  const hits = rows.filter((r) => (r.brand === brand || r.name.startsWith(brand)) && need.every((w) => words(r.name).includes(w)));
  if (!hits.length) continue;
  const value = Math.round(Math.min(hits.length / FULL_AT, 1) * 100);
  const last = existing.filter((s) => s.candidate_id === c.id).sort((a, b) => b.observed_at.localeCompare(a.observed_at))[0];
  if (last && last.raw_value === hits.length) continue;
  await addMarketSignal({ candidate_id: c.id, dimension: "global", source: "Foot Locker FR", metric: "retail_listings", value, raw_value: hits.length,
    raw_unit: "références en vente", reliability: "MARKET", source_url: hits[0].url, observed_at: at,
    note: `${hits.length} référence(s) « ${c.brand} ${c.model} » chez Foot Locker FR (sitemap public).`, created_by: "radar:footlocker" });
  signals++; touched.add(c.id);
}
for (const id of touched) await recompute(id);
console.log(`[radar:footlocker] ${rows.length} produits Foot Locker · ${signals} signal(s) ajouté(s) · ${touched.size} paire(s) recalculée(s)`);
