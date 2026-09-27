// npm run radar:weekly — deeper pass: same as daily, plus a list of the
// candidates whose evidence is stale so the team knows what to re-check by hand.
import { SCORING } from "../config/scoring.ts";
import { getStore } from "../lib/store.ts";
import { recomputeAll } from "../services/radar.ts";
import { syncSupplier } from "./sync.ts";

const log: { level: string; msg: string }[] = [];
await syncSupplier(log);
const db = getStore();
const market = await db.list("market_signals");
const morocco = await db.list("morocco_signals");
const newest = new Map<string, string>();
for (const s of [...market.filter((m) => m.reliability !== "EDITORIAL"), ...morocco]) {
  if ((newest.get(s.candidate_id) ?? "") < s.observed_at) newest.set(s.candidate_id, s.observed_at);
}
for (const c of await db.list("sneaker_candidates")) {
  if (["ARCHIVED", "REJECTED"].includes(c.status)) continue;
  const last = newest.get(c.id);
  const age = last ? (Date.now() - Date.parse(last)) / 864e5 : Infinity;
  if (age > 14) log.push({ level: "todo", msg: `${c.brand} ${c.model}${c.colorway ? " " + c.colorway : ""} : ${last ? `dernier signal mesuré il y a ${Math.round(age)} j` : "aucun signal mesuré"} (Trends / Maroc à relever)` });
}
const run = await recomputeAll("weekly", log);
console.log(`[radar:weekly] store=${db.kind}`, run.status, run.stats, `${log.filter((l) => l.level === "todo").length} candidats à re-vérifier (max ${SCORING.signalMaxAgeDays} j de validité)`);
