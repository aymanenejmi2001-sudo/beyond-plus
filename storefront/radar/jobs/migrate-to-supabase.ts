// One-off: copy the local JSON store (.radar/db.json) into Supabase, ids kept.
// Skips any table that already has rows. Run with the Supabase env loaded:
//   node --env-file=.env.vercel radar/jobs/migrate-to-supabase.ts
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getStore } from "../lib/store.ts";
import type { TableName } from "../lib/types.ts";

const db = getStore();
if (db.kind !== "supabase") throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY manquants.");
const local = JSON.parse(await readFile(join(process.cwd(), ".radar/db.json"), "utf8")) as Record<string, Record<string, unknown>[]>;
const ORDER: TableName[] = ["brands", "sneaker_models", "sneaker_candidates", "market_signals", "morocco_signals", "supplier_offers", "product_approvals",
  "catalogue_products", "product_marketing_briefs", "performance_events", "performance_metrics", "score_snapshots", "radar_runs", "radar_alerts", "site_photos"];
for (const t of ORDER) {
  const rows = local[t] ?? [];
  if (!rows.length) continue;
  if ((await db.list(t, { limit: 1 })).length) { console.log(`${t}: déjà rempli, ignoré`); continue; }
  for (let i = 0; i < rows.length; i += 200) await db.insert(t, rows.slice(i, i + 200) as never);
  console.log(`${t}: ${rows.length}`);
}
