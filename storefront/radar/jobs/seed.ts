// npm run radar:seed — first load: brands, models, candidates, editorial
// signals, supplier offers, then a first scoring pass. Safe to re-run.
import { recomputeAll } from "../services/radar.ts";
import { getStore } from "../lib/store.ts";
import { syncSupplier } from "./sync.ts";

const log: { level: string; msg: string }[] = [];
await syncSupplier(log, { baseline: true });
const run = await recomputeAll("manual", log);
console.log(`[radar:seed] store=${getStore().kind}`, run.stats, log.filter((l) => l.level !== "info"));
