// One-click publish: the admin's click IS the approval. Approve → prepare →
// check → add to src/data/radar-products.json (+ search index), then the live
// site is redeployed automatically ~2 min later. Refuses anything incomplete.

import { getStore } from "../lib/store.ts";
import { markPending, scheduleDeploy } from "./deploy.ts";
import { siteHandles, writeSiteFiles } from "./siteFiles.ts";
import { decide, prepareCatalogue, updateCandidate } from "./radar.ts";

export async function liveHandles(): Promise<Set<string>> {
  return siteHandles();
}

export async function publishNow(id: string, priceMAD: number | null, actor: string) {
  const db = getStore();
  const c = await db.get("sneaker_candidates", id);
  if (!c) throw new Error("Sneaker introuvable.");
  if (priceMAD == null || priceMAD <= 0) throw new Error("Indique le prix de vente.");
  await updateCandidate(id, { selling_price_mad: priceMAD });
  if (c.status !== "APPROVED") await decide(id, "APPROVE", actor, "Publication directe");
  const { handle, issues } = await prepareCatalogue(id);
  if (issues.length) throw new Error(issues.join(" "));
  await decide(id, "MARK_READY", actor, null);

  const draft = (await db.list("catalogue_products", { eq: { candidate_id: id } }))[0];
  await db.update("catalogue_products", draft.id, { status: "IMPORTED", updated_at: new Date().toISOString() });
  await decide(id, "MARK_IMPORTED", actor, "Ajouté au site");
  await updateCandidate(id, { catalogue_handle: handle });
  if (!process.env.VERCEL) await writeSiteFiles(); // online, the next build pulls it from Supabase
  await markPending(handle);
  scheduleDeploy(); // Mac: ~2 min after the last publish · online: right away
  return handle;
}
