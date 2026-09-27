// npm run radar:import — the ONLY step that touches the live catalogue, and
// only on explicit human action. Appends drafts an admin marked READY
// (approved + publishable) to src/data/catalog.json, then marks the candidates
// IMPORTED. Never scheduled. Re-run after `npm run catalog`, which rewrites
// catalog.json from the supplier pipeline.
//
//   npm run radar:import            → dry run (prints what would change)
//   npm run radar:import -- --write → writes src/data/catalog.json

import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getStore } from "../lib/store.ts";
import { decide, updateCandidate } from "../services/radar.ts";

const write = process.argv.includes("--write");
const db = getStore();
const file = join(process.cwd(), "src/data/catalog.json");
const catalog = JSON.parse(await readFile(file, "utf8")) as { handle: string }[];
const have = new Set(catalog.map((p) => p.handle));
const ready = (await db.list("catalogue_products", { eq: { status: "READY" } })).filter((d) => d.publishable);
const todo = [];
for (const d of ready) {
  const c = await db.get("sneaker_candidates", d.candidate_id);
  if (c?.status !== "APPROVED") { console.log(`skip ${d.handle}: candidat ${c?.status ?? "introuvable"}`); continue; }
  if (have.has(d.handle)) { console.log(`skip ${d.handle}: déjà dans le catalogue`); continue; }
  todo.push(d);
}
console.log(`${todo.length} fiche(s) prête(s) :`, todo.map((d) => d.handle));
if (write && todo.length) {
  const add = todo.map((d) => { const { radar: _r, ...product } = d.product as Record<string, unknown>; return product; });
  await writeFile(file, JSON.stringify([...catalog, ...add]));
  for (const d of todo) {
    await db.update("catalogue_products", d.id, { status: "IMPORTED", updated_at: new Date().toISOString() });
    await decide(d.candidate_id, "MARK_IMPORTED", "radar:import", "Ajouté à src/data/catalog.json");
    await updateCandidate(d.candidate_id, { catalogue_handle: d.handle }); // links first-party sales data
  }
  console.log("✓ catalogue mis à jour — rebuild + deploy pour publier.");
} else if (!write) console.log("(dry run — ajouter --write pour écrire)");
