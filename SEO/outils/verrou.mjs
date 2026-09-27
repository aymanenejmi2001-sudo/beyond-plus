#!/usr/bin/env node
// Verrou de déploiement partagé entre les agents.
//   node SEO/outils/verrou.mjs prendre <agent>   attend (20 min max) puis prend le verrou, code 1 si impossible
//   node SEO/outils/verrou.mjs rendre <agent>    rend le verrou, seulement s'il appartient à <agent>
// La création est atomique (flag "wx") : deux agents ne peuvent pas prendre le verrou en même temps.
import { openSync, writeSync, closeSync, readFileSync, unlinkSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const LOCK = join(dirname(fileURLToPath(import.meta.url)), "..", ".deploy.lock");
const MAX_AGE = 20 * 60 * 1000;
const [action, agent] = process.argv.slice(2);
if (!["prendre", "rendre"].includes(action) || !agent) {
  console.error("Usage : node SEO/outils/verrou.mjs prendre|rendre <agent>");
  process.exit(2);
}
const read = () => { try { return readFileSync(LOCK, "utf8").trim(); } catch { return null; } };
const age = () => { try { return Date.now() - statSync(LOCK).mtimeMs; } catch { return null; } };

if (action === "rendre") {
  const owner = read()?.split(" ")[0];
  if (owner === null || owner === undefined) { console.log("Aucun verrou."); process.exit(0); }
  if (owner !== agent) { console.error(`Verrou détenu par « ${owner} » : non supprimé.`); process.exit(1); }
  unlinkSync(LOCK);
  console.log("Verrou rendu.");
  process.exit(0);
}

const start = Date.now();
while (true) {
  const a = age();
  if (a !== null && a >= MAX_AGE) {
    console.log(`Verrou périmé (${Math.round(a / 60000)} min) de « ${read()} » : supprimé.`);
    try { unlinkSync(LOCK); } catch {}
  }
  try {
    const fd = openSync(LOCK, "wx");
    writeSync(fd, `${agent} ${new Date().toISOString()}\n`);
    closeSync(fd);
    console.log(`Verrou pris par « ${agent} ».`);
    process.exit(0);
  } catch (e) {
    if (e.code !== "EEXIST") throw e;
  }
  if (Date.now() - start >= MAX_AGE) {
    console.error(`Verrou toujours détenu par « ${read()} » après 20 min : ne pas publier.`);
    process.exit(1);
  }
  console.log(`Verrou détenu par « ${read()} », nouvel essai dans 60 s.`);
  await new Promise((r) => setTimeout(r, 60_000));
}
