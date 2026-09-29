// Links Radar candidates to pairs that are ALREADY on the site (supplier
// pipeline products), so they show as "En ligne" instead of "À publier".
// Match: same supplier product URL. Safe to re-run.
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { getStore } from "../lib/store.ts";
import { updateCandidate } from "../services/radar.ts";

export async function linkLive() {
  const db = getStore();
  const read = async <T,>(f: string): Promise<T> => JSON.parse(await readFile(join(process.cwd(), f), "utf8"));
  const site = new Set([...(await read<{ handle: string }[]>("src/data/catalog.json")), ...(await read<{ handle: string }[]>("src/data/radar-products.json"))].map((p) => p.handle));
  const bySource = new Map((await read<{ slug: string; sourceUrl: string }[]>("catalog/data/products.json")).filter((p) => site.has(p.slug)).map((p) => [p.sourceUrl, p.slug]));
  const offers = await db.list("supplier_offers");
  let linked = 0;
  for (const c of await db.list("sneaker_candidates")) {
    if (c.catalogue_handle && site.has(c.catalogue_handle)) continue;
    const handle = offers.filter((o) => o.candidate_id === c.id).map((o) => bySource.get(o.supplier_url ?? "")).find(Boolean);
    if (!handle) continue;
    await updateCandidate(c.id, { catalogue_handle: handle, status: c.status === "REJECTED" || c.status === "ARCHIVED" ? c.status : "IMPORTED" });
    await db.insert("product_approvals", [{ candidate_id: c.id, action: "BASELINE", from_status: c.status, to_status: "IMPORTED", actor: "radar:link-live", note: `Déjà en ligne : /products/${handle}`, created_at: new Date().toISOString() }]);
    linked++;
  }
  return linked;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) console.log(`[radar:link-live] ${await linkLive()} paire(s) reliée(s) à leur page en ligne`);
