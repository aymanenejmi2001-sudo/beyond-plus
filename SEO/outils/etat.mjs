#!/usr/bin/env node
// État factuel du projet SEO BEYOND PLUS, à lancer au début de chaque passage d'agent.
// Usage : node SEO/outils/etat.mjs [AAAA-MM-JJ] [--hors-ligne]
// Lecture seule : ce script n'écrit rien et ne publie rien.
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SEO = join(ROOT, "SEO");
const SITE = "https://beyondplusmaroc.com";
const args = process.argv.slice(2);
const offline = args.includes("--hors-ligne");

// Dates au fuseau du Maroc (la machine peut être en UTC).
const ymd = (d) => new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Casablanca" }).format(d);
const today = args.find((a) => /^\d{4}-\d{2}-\d{2}$/.test(a)) ?? ymd(new Date());
const shift = (s, n) => { const d = new Date(s + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const yesterday = shift(today, -1);
const tomorrow = shift(today, 1);
const dow = new Date(today + "T12:00:00Z").getUTCDay(); // 0 = dimanche
const JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const isArticleDay = (s) => Number(s.slice(8)) % 2 === 1;

const read = (p) => (existsSync(p) ? readFileSync(p, "utf8") : null);
const ageH = (p) => (Date.now() - statSync(p).mtimeMs) / 3.6e6;
const out = [];
const log = (s = "") => out.push(s);
const alerts = [];

// Modèles protégés par le SEO (REGLES.md) → clé de model-content.ts / adresse /collections/.
const PROTECTED = {
  Samba: "adidas-samba", "Handball Spezial": "handball-spezial", Gazelle: "adidas-gazelle",
  "Campus 00s": "adidas-campus-00s", "Gel-Kayano 14": "asics-gel-kayano-14", "Gel-NYC": "asics-gel-nyc",
  9060: "new-balance-9060", 530: "new-balance-530", 550: "new-balance-550", "Vomero 5": "nike-vomero-5",
  "P-6000": "nike-p-6000", "Dunk Low": "nike-dunk-low", "Air Jordan 1": "air-jordan-1", "Air Jordan 4": "air-jordan-4",
};

async function http(url) {
  if (offline) return null;
  try {
    const r = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(15000) });
    return { status: r.status, text: r.status === 200 ? await r.text() : "" };
  } catch { return { status: "ERR", text: "" }; }
}

log(`# État BEYOND PLUS au ${JOURS[dow]} ${today}`);
log(`Jour ${isArticleDay(today) ? "IMPAIR : jour d'article (rédacteur 8h)" : "PAIR : pas d'article, préparer le sujet de demain"}. Lundi : ${dow === 1 ? "oui (objectif de la semaine + consigne curateur)" : "non"}.`);
log();

// 1. Verrou
const lock = join(SEO, ".deploy.lock");
if (existsSync(lock)) {
  const m = ageH(lock) * 60;
  log(`**Verrou de déploiement** : présent depuis ${m.toFixed(0)} min (${readFileSync(lock, "utf8").trim()})${m > 20 ? " : PÉRIMÉ (> 20 min), un agent a probablement échoué en cours de publication" : " : un agent publie en ce moment"}.`);
  if (m > 20) alerts.push("Verrou de déploiement périmé : ne pas le supprimer à la main (verrou.mjs prendre le retire tout seul) ; vérifier que le travail non déployé de son agent passe tsc, tests et build.");
} else log("**Verrou de déploiement** : aucun.");
log();

// 2. Guides (code + sitemap)
const guidesTs = read(join(ROOT, "storefront/src/data/guides.ts")) ?? "";
const guides = [];
for (const m of guidesTs.matchAll(/slug:\s*"([^"]+)",\s*\n\s*title:\s*"([^"]+)"[\s\S]*?published:\s*"(\d{4}-\d{2}-\d{2})"/g)) guides.push({ slug: m[1], title: m[2], published: m[3] });
// Liens /collections/ de la liste `links` de chaque guide : la page collection affiche automatiquement
// un lien retour vers les guides qui la citent (storefront/src/app/collections/[handle]/page.tsx).
const blocks = guidesTs.split(/\n\s*slug:\s*"/).slice(1);
for (const b of blocks) {
  const g = guides.find((x) => b.startsWith(x.slug + '"'));
  const links = b.match(/\n\s*links:\s*\[([\s\S]*?)\]/);
  if (g) g.collections = links ? [...links[1].matchAll(/"\/collections\/([a-z0-9-]+)"/g)].map((m) => m[1]) : [];
}
log(`## Guides : ${guides.length} dans guides.ts`);
const byDay = {};
for (const g of guides) (byDay[g.published] ??= []).push(g);
for (const d of Object.keys(byDay).sort().slice(-4)) log(`- ${d} : ${byDay[d].length} (${byDay[d].map((g) => g.slug).join(", ")})`);
for (const [d, list] of Object.entries(byDay)) if (d >= shift(today, -7) && list.length > 1) alerts.push(`${list.length} guides publiés le ${d} : au-dessus du rythme (1 article par jour impair).`);
const sm = await http(`${SITE}/sitemap.xml`);
let short = []; // guides sous le seuil : pendant le rattrapage, le rédacteur est attendu chaque jour
if (sm?.status === 200) {
  const live = new Set([...sm.text.matchAll(/\/guides\/([a-z0-9-]+)</g)].map((m) => m[1]));
  // Les guides sous MIN_INDEXABLE_WORDS sont volontairement hors sitemap (noindex) : ce n'est pas un défaut de déploiement.
  let words = {}, minWords = 600;
  try {
    const m = await import(pathToFileURL(join(ROOT, "storefront/src/data/guides.ts")).href);
    minWords = m.MIN_INDEXABLE_WORDS ?? 600;
    for (const g of m.GUIDES) words[g.slug] = m.guideWords(g);
  } catch { words = {}; }
  short = guides.filter((g) => words[g.slug] !== undefined && words[g.slug] < minWords).sort((a, b) => words[a.slug] - words[b.slug]);
  const notLive = guides.filter((g) => !live.has(g.slug) && !short.includes(g)).map((g) => g.slug);
  const notCode = [...live].filter((s) => !guides.some((g) => g.slug === s));
  log(`Sitemap : ${live.size} guides en ligne, ${sm.text.split("<loc>").length - 1} URL au total.${notLive.length ? ` Dans le code, indexables, mais PAS en ligne : ${notLive.join(", ")} (non déployé ?).` : ""}${notCode.length ? ` En ligne mais absents du code : ${notCode.join(", ")}.` : ""}`);
  if (short.length) log(`Guides trop courts (< ${minWords} mots, noindex, hors sitemap), du plus court au plus long : ${short.map((g) => `${g.slug} (${words[g.slug]})`).join(", ")}.`);
  if (notLive.length) alerts.push(`Guides non déployés : ${notLive.join(", ")}.`);
  if (short.length) alerts.push(`${short.length} guides sous ${minWords} mots (noindex) : enrichir 2 guides par jour (REGLES.md « Guides trop courts »).`);
} else if (sm) { log(`Sitemap : ERREUR ${sm.status}.`); alerts.push(`sitemap.xml répond ${sm.status}.`); }
log("Slugs existants (anti-cannibalisation) :");
for (const g of guides) log(`- ${g.slug} : ${g.title}`);
log();

// 3. Pages modèle : texte écrit à la main et maillage vers les guides
const mc = read(join(ROOT, "storefront/src/data/model-content.ts")) ?? "";
const entries = {};
for (const m of mc.matchAll(/^  "([a-z0-9-]+)": \{([\s\S]*?)^  \},?$/gm)) entries[m[1]] = m[2];
const missing = Object.entries(PROTECTED).filter(([, k]) => !entries[k]).map(([n]) => n);
log(`## Pages modèle (« auto » = lien retour automatique via les liens du guide) : ${Object.keys(entries).length} textes écrits à la main ; modèles protégés sans texte : ${missing.length ? missing.join(", ") : "aucun"}.`);
if (missing.length) alerts.push(`Modèles protégés sans texte : ${missing.join(", ")}.`);
const comparatifs = guides.filter((g) => /-ou-/.test(g.slug));
for (const g of comparatifs) {
  const explicit = Object.entries(entries).filter(([, body]) => body.includes(`/guides/${g.slug}"`)).map(([k]) => k);
  const auto = (g.collections ?? []).filter((k) => entries[k] && !explicit.includes(k));
  const from = [...explicit, ...auto.map((k) => `${k} (auto)`)];
  log(`- /guides/${g.slug} relié depuis : ${from.length ? from.join(", ") : "AUCUNE page modèle"}`);
  if (!from.length) alerts.push(`Comparatif orphelin (aucune page modèle ne le relie) : ${g.slug}.`);
}
log();

// 4. Missions, comptes rendus, rapports
const AGENTS = { rédacteur: /Compte rendu r[ée]dacteur/i, technique: /Compte rendu (agent )?technique/i, backlinks: /Compte rendu backlinks/i, curateur: /Compte rendu curateur/i, designer: /Compte rendu (designer|UX)/i };
function expected(d) {
  const w = new Date(d + "T12:00:00Z").getUTCDay();
  return ["technique", "backlinks", "designer", ...(isArticleDay(d) || short.length ? ["rédacteur"] : []), ...(w === 1 ? ["curateur"] : [])];
}
for (const [label, d] of [["Hier", yesterday], ["Aujourd'hui", today]]) {
  const f = join(SEO, "missions", `${d}.md`);
  const txt = read(f);
  if (!txt) { log(`**${label} (${d})** : pas de fichier mission.`); continue; }
  // Une section « Compte rendu » vide (titre du modèle seul) ne compte pas : il faut du texte avant le titre suivant.
  const filled = (re) => txt.split(/^## /m).some((sec) => re.test(sec.split("\n")[0]) && sec.split("\n").slice(1).join("").trim().length > 0);
  const done = Object.keys(AGENTS).filter((a) => filled(AGENTS[a]));
  const journals = { designer: existsSync(join(ROOT, "UX/journal", `${d}.md`)), curateur: existsSync(join(ROOT, "CATALOGUE/journal", `${d}.md`)), backlinks: existsSync(join(SEO, "backlinks", `${d}.md`)) };
  for (const [a, ok] of Object.entries(journals)) if (ok && !done.includes(a)) done.push(a);
  const late = expected(d).filter((a) => !done.includes(a));
  log(`**${label} (${d})** : mission présente. Comptes rendus : ${done.join(", ") || "aucun"}. Manquants : ${late.join(", ") || "aucun"}.`);
  if (label === "Hier" && late.length) alerts.push(`Hier, pas de compte rendu : ${late.join(", ")}. Adapter (mission plus simple, reconduite).`);
}
const rap = join(SEO, "rapports", `${yesterday}.md`);
log(`Rapport d'hier : ${existsSync(rap) ? "présent" : "absent"}. Rapport du jour : ${existsSync(join(SEO, "rapports", `${today}.md`)) ? "présent" : "absent"}.`);
log(`Demain (${tomorrow}) : ${isArticleDay(tomorrow) ? "jour d'article" : "pas d'article"}.`);
log();

// 5. Backlinks
const bl = existsSync(join(SEO, "backlinks")) ? readdirSync(join(SEO, "backlinks")).filter((f) => f.endsWith(".md")) : [];
const envoyes = bl.filter((f) => f.startsWith("A-ENVOYER")).reduce((n, f) => n + (read(join(SEO, "backlinks", f)).match(/\[x\] envoy/gi)?.length ?? 0), 0);
log(`## Backlinks : ${bl.filter((f) => !f.startsWith("A-ENVOYER")).length} fichier(s) de pistes, ${bl.filter((f) => f.startsWith("A-ENVOYER")).length} fichier(s) à envoyer, ${envoyes} message(s) coché(s) envoyé(s). Dernier : ${bl.sort().at(-1) ?? "aucun"}.`);
log();

// 6. Search Console
const scDir = join(SEO, "search-console");
const caps = existsSync(scDir) ? readdirSync(scDir).filter((f) => /^\d{4}-\d{2}-\d{2}\.(png|jpe?g)$/i.test(f)).sort() : [];
if (caps.length) {
  const last = caps.at(-1); const days = (Date.parse(today) - Date.parse(last.slice(0, 10))) / 864e5;
  log(`## Search Console : dernière capture ${last} (${days} j). ${days > 10 ? "Trop ancienne : se rabattre sur la veille WebSearch et la redemander dans le bilan." : "À lire avec l'outil Read."}`);
  if (days > 10) alerts.push("Capture Search Console de plus de 10 jours.");
} else { log("## Search Console : aucune capture. Se rabattre sur la veille WebSearch ; la demander dans le bilan du soir."); alerts.push("Aucune capture Search Console."); }
log();

// 7. Contrôle en ligne : guides récents + pages modèle protégées (statut, title avec « prix »)
if (!offline) {
  log("## Contrôle en ligne");
  const recent = guides.filter((g) => g.published >= shift(today, -2)).map((g) => `/guides/${g.slug}`);
  const models = Object.values(PROTECTED).map((k) => `/collections/${k}`);
  const res = await Promise.all([...recent, ...models].map(async (p) => [p, await http(SITE + p)]));
  const bad = res.filter(([, r]) => r.status !== 200);
  log(`${res.length} pages testées, ${bad.length} en erreur${bad.length ? " : " + bad.map(([p, r]) => `${p} (${r.status})`).join(", ") : ""}.`);
  if (bad.length) alerts.push(`Pages en erreur : ${bad.map(([p]) => p).join(", ")}. Correction urgente autorisée au chef de projet.`);
  const noPrix = res.filter(([p, r]) => p.startsWith("/collections/") && r.status === 200 && !/<title>[^<]*prix/i.test(r.text)).map(([p]) => p.split("/").pop());
  log(`Titles de pages modèle sans « prix » : ${noPrix.length}/${models.length}${noPrix.length ? ` (${noPrix.join(", ")})` : ""}.`);
  log();
}

log("## Alertes");
log(alerts.length ? alerts.map((a) => `- ${a}`).join("\n") : "- Aucune.");
console.log(out.join("\n"));
