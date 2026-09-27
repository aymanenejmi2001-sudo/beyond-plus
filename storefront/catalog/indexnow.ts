// Notifies Bing / Yandex / Seznam (IndexNow) of every URL in the live sitemap.
// Usage: node catalog/indexnow.ts   (after a deploy)
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const host = "beyondplusmaroc.com";
const key = readFileSync(fileURLToPath(new URL("./.indexnow-key", import.meta.url)), "utf8").trim();
const xml = await (await fetch(`https://${host}/sitemap.xml`)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation: `https://${host}/${key}.txt`, urlList }),
});
console.log(`IndexNow: ${urlList.length} URL(s) → HTTP ${res.status}`);
