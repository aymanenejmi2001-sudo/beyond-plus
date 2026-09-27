// npm run radar:daily — lightweight: re-read the supplier snapshot (no new
// crawling), record changes, re-score, raise alerts.
import { recomputeAll } from "../services/radar.ts";
import { getStore } from "../lib/store.ts";
import { syncSupplier } from "./sync.ts";

const log: { level: string; msg: string }[] = [];
await syncSupplier(log);
const run = await recomputeAll("daily", log);
console.log(`[radar:daily] store=${getStore().kind}`, run.status, run.stats);
if (run.status === "FAILED") process.exit(1);
